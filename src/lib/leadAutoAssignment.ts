import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from './sequelize';

export interface LeadAutoAssignmentInput {
  branchId: number;
  preferredEmployeeId?: number | null;
  forceAutoAssign?: boolean;
  roundRobin?: boolean;
}

export interface LeadAutoAssignmentResult {
  assignedEmployeeId: number;
  counselorId: number;
  branchId: number;
  strategy: 'branch_allocation_round_robin' | 'branch_active_employee_round_robin' | 'manual_preferred' | 'fallback_employee';
  candidateCount: number;
  currentLeadCount: number;
}

interface AssignmentCandidate {
  id: number;
  name: string;
  branch: number | null;
  openLeadCount: number;
  sourceRank: number;
}

const parseIdList = (value: unknown): number[] => {
  if (!value || typeof value !== 'string') return [];

  return value
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);
};

const getAllocatedEmployeeIds = async (branchId: number, transaction?: Transaction): Promise<number[]> => {
  const rows = await sequelize.query<{ counsilors: string }>(
    `SELECT counsilors
     FROM dm_counsilor_allocations
     WHERE branch_id = :branchId AND status = 1
     ORDER BY created DESC, id DESC
     LIMIT 1`,
    {
      replacements: { branchId },
      type: QueryTypes.SELECT,
      transaction,
    }
  );

  return parseIdList(rows[0]?.counsilors);
};

const loadCandidates = async (branchId: number, allocatedEmployeeIds: number[], transaction?: Transaction): Promise<AssignmentCandidate[]> => {
  const hasAllocations = allocatedEmployeeIds.length > 0;
  const orderClause = hasAllocations
    ? `sourceRank ASC, FIELD(e.id, ${allocatedEmployeeIds.join(',')}) ASC`
    : 'sourceRank ASC, e.id ASC';

  return sequelize.query<AssignmentCandidate>(
    `SELECT
        e.id,
        e.name,
        e.branch,
        COUNT(l.id) AS openLeadCount,
        CASE
          WHEN :hasAllocations = 1 AND e.id IN (:allocatedEmployeeIds) THEN 0
          ELSE 1
        END AS sourceRank
      FROM dm_employee e
      LEFT JOIN dmc_forum_leads l
        ON l.assignTo = e.id
        AND COALESCE(l.status, '') NOT IN ('Converted', 'Closed', 'Lost', 'client', 'retained')
      WHERE e.status = 1
        AND (
          (:hasAllocations = 1 AND e.id IN (:allocatedEmployeeIds))
          OR (:hasAllocations = 0 AND e.branch = :branchId)
        )
      GROUP BY e.id, e.name, e.branch
      ORDER BY ${orderClause}`,
    {
      replacements: {
        branchId,
        hasAllocations: hasAllocations ? 1 : 0,
        allocatedEmployeeIds: hasAllocations ? allocatedEmployeeIds : [0],
      },
      type: QueryTypes.SELECT,
      transaction,
    }
  );
};

const loadFallbackCandidate = async (transaction?: Transaction): Promise<AssignmentCandidate | null> => {
  const rows = await sequelize.query<AssignmentCandidate>(
    `SELECT
        e.id,
        e.name,
        e.branch,
        COUNT(l.id) AS openLeadCount,
        2 AS sourceRank
      FROM dm_employee e
      LEFT JOIN dmc_forum_leads l
        ON l.assignTo = e.id
        AND COALESCE(l.status, '') NOT IN ('Converted', 'Closed', 'Lost', 'client', 'retained')
      WHERE e.status = 1
      GROUP BY e.id, e.name, e.branch
      ORDER BY e.id ASC
      LIMIT 1`,
    { type: QueryTypes.SELECT, transaction }
  );

  return rows[0] || null;
};

const getNextRoundRobinCandidate = async (
  branchId: number,
  candidates: AssignmentCandidate[],
  transaction: Transaction
): Promise<AssignmentCandidate> => {
  await sequelize.query(
    `INSERT INTO dm_lead_round_robin_state (branch_id, last_employee_id, created_at, updated_at)
     VALUES (:branchId, NULL, NOW(), NOW())
     ON DUPLICATE KEY UPDATE branch_id = branch_id`,
    {
      replacements: { branchId },
      transaction,
    }
  );

  const stateRows = await sequelize.query<{ last_employee_id: number | null }>(
    `SELECT last_employee_id
     FROM dm_lead_round_robin_state
     WHERE branch_id = :branchId
     FOR UPDATE`,
    {
      replacements: { branchId },
      type: QueryTypes.SELECT,
      transaction,
    }
  );

  const lastEmployeeId = stateRows[0]?.last_employee_id || null;
  const lastIndex = lastEmployeeId ? candidates.findIndex((candidate) => candidate.id === lastEmployeeId) : -1;
  const nextIndex = (lastIndex + 1) % candidates.length;
  const selected = candidates[nextIndex];

  await sequelize.query(
    `UPDATE dm_lead_round_robin_state
     SET last_employee_id = :employeeId,
         updated_at = NOW()
     WHERE branch_id = :branchId`,
    {
      replacements: {
        branchId,
        employeeId: selected.id,
      },
      transaction,
    }
  );

  return selected;
};

export const resolveLeadAutoAssignment = async ({
  branchId,
  preferredEmployeeId,
  forceAutoAssign = false,
  roundRobin = true,
}: LeadAutoAssignmentInput): Promise<LeadAutoAssignmentResult> => {
  const normalizedBranchId = Number.isFinite(branchId) && branchId > 0 ? branchId : 1;

  if (preferredEmployeeId && !forceAutoAssign) {
    return {
      assignedEmployeeId: preferredEmployeeId,
      counselorId: preferredEmployeeId,
      branchId: normalizedBranchId,
      strategy: 'manual_preferred',
      candidateCount: 1,
      currentLeadCount: 0,
    };
  }

  return sequelize.transaction(async (transaction) => {
    const allocatedEmployeeIds = await getAllocatedEmployeeIds(normalizedBranchId, transaction);
    const candidates = await loadCandidates(normalizedBranchId, allocatedEmployeeIds, transaction);
    const selected = candidates.length > 0 && roundRobin
      ? await getNextRoundRobinCandidate(normalizedBranchId, candidates, transaction)
      : candidates[0] || await loadFallbackCandidate(transaction);

    if (!selected) {
      throw new Error(`No active employees are available for branch ${normalizedBranchId}`);
    }

    return {
      assignedEmployeeId: selected.id,
      counselorId: selected.id,
      branchId: selected.branch || normalizedBranchId,
      strategy: candidates.length > 0
        ? (allocatedEmployeeIds.length > 0 ? 'branch_allocation_round_robin' : 'branch_active_employee_round_robin')
        : 'fallback_employee',
      candidateCount: candidates.length || 1,
      currentLeadCount: Number(selected.openLeadCount || 0),
    };
  });
};
