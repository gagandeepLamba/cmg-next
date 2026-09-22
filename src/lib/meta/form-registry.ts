/**
 * Dynamic form auto-discovery.
 *
 * Solves the "schema drift" problem: marketing launches a new lead form or
 * adds a custom question, and until now the only signal was a silent JSON
 * fallback nobody looked at. This module keeps a registry of every form
 * that's actually sent a lead (dm_meta_forms). On first sight of a form_id,
 * it fetches the form's question schema from the Graph API, diffs the
 * question keys against currently active GLOBAL/CAMPAIGN mappings — the
 * only ones that could possibly already cover a form we've never seen — and
 * flags the form PENDING_REVIEW when any question has nothing mapping to
 * it. The flag is advisory only: delivery never blocks on it, and unmapped
 * answers are always preserved by the caller (see processor.ts).
 */
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { fetchFormDetails } from './graph-api';
import { normalizeFieldKey } from './mapping-engine';
import type { MetaLeadMapping } from './types';

export interface FormRegistryResult {
  formId: string;
  mappingStatus: 'ACTIVE' | 'PENDING_REVIEW' | 'ARCHIVED';
  unmappedKeys: string[];
  formName: string | null;
}

interface FormRow {
  form_id: string;
  mapping_status: 'ACTIVE' | 'PENDING_REVIEW' | 'ARCHIVED';
  unmapped_field_keys: string | string[] | null;
  form_name: string | null;
}

/**
 * Meta field keys covered by any enabled GLOBAL mapping, or a CAMPAIGN
 * mapping scoped to this campaign. FORM-scoped mappings are deliberately
 * excluded — a form that's genuinely new can't have one yet, and if a
 * FORM mapping already exists for it, it's not new (dm_meta_forms already
 * has a row and this function is never reached; see ensureFormRegistered).
 */
function knownKeysFor(mappings: MetaLeadMapping[], campaignId: string | null): Set<string> {
  const known = new Set<string>();
  for (const m of mappings) {
    if (m.is_enabled !== 1) continue;
    if (m.scope_type === 'GLOBAL' || (m.scope_type === 'CAMPAIGN' && m.campaign_id === campaignId)) {
      known.add(normalizeFieldKey(m.meta_field_key));
    }
  }
  return known;
}

// MySQL2 auto-parses JSON columns into JS values, but callers of this
// module (and the column's loose typing elsewhere in the codebase) can't
// rely on that — handle both the parsed and still-stringified shape.
function toKeyArray(value: string | string[] | null): string[] {
  if (!value) return [];
  return typeof value === 'string' ? (JSON.parse(value) as string[]) : value;
}

/**
 * Ensures `formId` is registered, returning its current mapping status and
 * unmapped question keys.
 *
 * - Already registered: returns the cached result with no Graph API call —
 *   each webhook processing run is time-boxed on Vercel, so repeat leads
 *   from a known form cost nothing extra.
 * - Never seen before: fetches the form's question schema, diffs it against
 *   `mappings`, and inserts a row (PENDING_REVIEW if anything is unmapped,
 *   ACTIVE otherwise).
 *
 * Best-effort by design: a Graph API failure here (rate limit, transient
 * error, revoked form) throws, and the caller is expected to catch it and
 * fall back to raw_lead_data alone — auto-discovery must never block lead
 * delivery.
 */
export async function ensureFormRegistered(params: {
  formId: string;
  pageId: string | null;
  campaignId: string | null;
  mappings: MetaLeadMapping[];
}): Promise<FormRegistryResult> {
  const { formId, pageId, campaignId, mappings } = params;

  const [existing] = await sequelize.query<FormRow>(
    `SELECT form_id, mapping_status, unmapped_field_keys, form_name
     FROM dm_meta_forms WHERE form_id = :formId LIMIT 1`,
    { replacements: { formId }, type: QueryTypes.SELECT }
  );

  if (existing) {
    // Best-effort freshness marker — never let this fail the caller.
    await sequelize.query(
      `UPDATE dm_meta_forms SET last_seen_at = NOW() WHERE form_id = :formId`,
      { replacements: { formId }, type: QueryTypes.UPDATE }
    ).catch(() => {});

    return {
      formId,
      mappingStatus: existing.mapping_status,
      unmappedKeys: toKeyArray(existing.unmapped_field_keys),
      formName: existing.form_name,
    };
  }

  // First time this form has ever sent a lead — discover its schema.
  const details = await fetchFormDetails(formId);
  const knownKeys = knownKeysFor(mappings, campaignId);
  const questionKeys = [...new Set(details.questions.map(q => normalizeFieldKey(q.key)))];
  const unmappedKeys = questionKeys.filter(k => !knownKeys.has(k));
  const mappingStatus: 'ACTIVE' | 'PENDING_REVIEW' = unmappedKeys.length > 0 ? 'PENDING_REVIEW' : 'ACTIVE';

  // INSERT IGNORE + re-select: two leads for the same brand-new form can
  // race here (both see "not found" above); the unique key on form_id lets
  // only one insert win, and the loser just reads back the winner's row.
  await sequelize.query(
    `INSERT IGNORE INTO dm_meta_forms
       (form_id, page_id, campaign_id, form_name, locale, meta_status,
        questions, known_field_keys, unmapped_field_keys, mapping_status, last_checked_at)
     VALUES
       (:formId, :pageId, :campaignId, :formName, :locale, :metaStatus,
        :questions, :knownFieldKeys, :unmappedFieldKeys, :mappingStatus, NOW())`,
    {
      replacements: {
        formId,
        pageId,
        campaignId,
        formName: details.name,
        locale: details.locale,
        metaStatus: details.status,
        questions: JSON.stringify(details.questions),
        knownFieldKeys: JSON.stringify(questionKeys),
        unmappedFieldKeys: JSON.stringify(unmappedKeys),
        mappingStatus,
      },
      type: QueryTypes.INSERT,
    }
  );

  const [row] = await sequelize.query<FormRow>(
    `SELECT form_id, mapping_status, unmapped_field_keys, form_name
     FROM dm_meta_forms WHERE form_id = :formId LIMIT 1`,
    { replacements: { formId }, type: QueryTypes.SELECT }
  );

  return {
    formId,
    mappingStatus: row?.mapping_status ?? mappingStatus,
    unmappedKeys: row ? toKeyArray(row.unmapped_field_keys) : unmappedKeys,
    formName: row?.form_name ?? details.name,
  };
}
