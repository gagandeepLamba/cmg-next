import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

export type BranchCurrency = {
  branchId: number;
  branchName: string;
  branchAddress: string;
  currencyCode: string;
};

/**
 * Resolves a branch's active currency from dm_currency.country. The legacy
 * dm_branch table identifies the branch country/location in `branch`.
 */
export async function resolveBranchCurrency(branchId: number | null | undefined): Promise<BranchCurrency | null> {
  if (!branchId) return null;

  const rows = await sequelize.query<BranchCurrency>(
    `SELECT
       b.id AS branchId,
       b.name AS branchName,
       b.address AS branchAddress,
       c.currency_code AS currencyCode
     FROM dm_branch b
     INNER JOIN dm_currency c
       ON c.status = 1
      AND LOWER(TRIM(c.country)) IN (
        LOWER(TRIM(b.branch)),
        LOWER(TRIM(b.name)),
        LOWER(TRIM(b.abbrv)),
        CASE
          WHEN LOWER(CONCAT_WS(' ', b.name, b.branch, b.abbrv, b.address)) REGEXP 'dubai|abu dhabi|sharjah|ajman|fujairah|ras al khaimah|umm al quwain'
            THEN 'united arab emirates'
          ELSE ''
        END
      )
     WHERE b.id = ? AND b.status = 1
     ORDER BY CASE
       WHEN LOWER(TRIM(c.country)) = LOWER(TRIM(b.branch)) THEN 1
       WHEN LOWER(TRIM(c.country)) = LOWER(TRIM(b.name)) THEN 2
       ELSE 3
     END
     LIMIT 1`,
    { replacements: [branchId], type: QueryTypes.SELECT },
  );

  return rows[0] || null;
}

export function branchCurrencyError(branchId: number | null | undefined) {
  return `No active currency is configured for branch ${branchId || 'unknown'}. Match dm_branch.branch, name, or abbreviation to dm_currency.country.`;
}
