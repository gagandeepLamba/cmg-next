/**
 * Sync jobs for Google Tag Manager data. Shared by the /api/cron/gtm-sync
 * route and the admin "Sync now" button — mirrors src/lib/meta/campaign-sync.ts.
 */

import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { fetchLiveVersion, fetchVersionHeaders, fetchVersionDetail } from './tag-manager-api';

export type SyncResult =
  | { skipped: true; reason: string }
  | { skipped: false; synced: number };

async function getActiveContainer(): Promise<{ accountId: string; containerId: string } | null> {
  const [settings] = await sequelize.query<{
    is_enabled: number; gtm_account_id: string | null; gtm_container_id: string | null;
  }>(
    `SELECT is_enabled, gtm_account_id, gtm_container_id FROM dm_google_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );
  if (!settings?.is_enabled || !settings?.gtm_account_id || !settings?.gtm_container_id) return null;
  return { accountId: settings.gtm_account_id, containerId: settings.gtm_container_id };
}

/** Syncs the currently live (published) tags + triggers. */
export async function syncGtmTagsAndTriggers(): Promise<SyncResult> {
  const container = await getActiveContainer();
  if (!container) return { skipped: true, reason: 'Integration disabled or GTM account/container not configured' };

  const version = await fetchLiveVersion(container.accountId, container.containerId);
  const tags = version.tag ?? [];
  const triggers = version.trigger ?? [];

  for (const tag of tags) {
    await sequelize.query(
      `INSERT INTO dm_gtm_tags_cache (tag_id, name, type, status, firing_trigger_ids, last_synced_at)
       VALUES (:tagId, :name, :type, :status, :triggerIds, NOW())
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), type = VALUES(type), status = VALUES(status),
         firing_trigger_ids = VALUES(firing_trigger_ids), last_synced_at = NOW()`,
      {
        replacements: {
          tagId: tag.tagId,
          name: tag.name ?? null,
          type: tag.type ?? null,
          status: tag.paused ? 'paused' : 'live',
          triggerIds: JSON.stringify(tag.firingTriggerId ?? []),
        },
        type: QueryTypes.INSERT,
      }
    );
  }

  for (const trigger of triggers) {
    await sequelize.query(
      `INSERT INTO dm_gtm_triggers_cache (trigger_id, name, type, last_synced_at)
       VALUES (:triggerId, :name, :type, NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), type = VALUES(type), last_synced_at = NOW()`,
      {
        replacements: { triggerId: trigger.triggerId, name: trigger.name ?? null, type: trigger.type ?? null },
        type: QueryTypes.INSERT,
      }
    );
  }

  await sequelize.query(`UPDATE dm_google_settings SET last_gtm_sync_at = NOW() WHERE id = 1`, { type: QueryTypes.UPDATE });

  return { skipped: false, synced: tags.length + triggers.length };
}

/** Syncs the container's publish/version history. */
export async function syncGtmVersionHistory(): Promise<SyncResult> {
  const container = await getActiveContainer();
  if (!container) return { skipped: true, reason: 'Integration disabled or GTM account/container not configured' };

  const headers = await fetchVersionHeaders(container.accountId, container.containerId);
  const recent = headers.slice(0, 25);

  let synced = 0;
  for (const header of recent) {
    try {
      const detail = await fetchVersionDetail(container.accountId, container.containerId, header.containerVersionId);
      await sequelize.query(
        `INSERT INTO dm_gtm_version_history (version_id, version_name, notes, raw_data, last_synced_at)
         VALUES (:versionId, :name, :notes, :raw, NOW())
         ON DUPLICATE KEY UPDATE
           version_name = VALUES(version_name), notes = VALUES(notes), raw_data = VALUES(raw_data), last_synced_at = NOW()`,
        {
          replacements: {
            versionId: header.containerVersionId,
            name: detail.name ?? header.name ?? null,
            notes: detail.notes ?? null,
            raw: JSON.stringify(header),
          },
          type: QueryTypes.INSERT,
        }
      );
      synced++;
    } catch (err) {
      console.error(`[GTM Sync] Failed to fetch version ${header.containerVersionId}:`, err instanceof Error ? err.message : err);
    }
  }

  return { skipped: false, synced };
}
