import { connectDB } from '@/lib/sequelize';
import { syncCampaigns } from './campaign-sync';

type CronTask = {
  start: () => void;
};
type CronModule = {
  schedule: (
    expression: string,
    task: () => void | Promise<void>,
    options: { timezone: string; scheduled?: boolean }
  ) => CronTask;
};

declare global {
  var __dmMetaCampaignSyncCronStarted: boolean | undefined;
}

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

const loadNodeCron = async (): Promise<CronModule | null> => {
  try {
    const cronPackage = await import('node-cron');
    return (cronPackage.default || cronPackage) as CronModule;
  } catch (error) {
    console.warn('node-cron is not available; Meta campaign sync scheduler was not started.', error);
    return null;
  }
};

/**
 * Syncs Meta Ad campaign stats into dm_meta_campaign_cache every 6 hours, in-process.
 * No-ops until the integration is enabled and an ad account id is configured.
 */
export async function startMetaCampaignSyncCron() {
  if (globalThis.__dmMetaCampaignSyncCronStarted) {
    return { started: false, reason: 'already_started' };
  }

  if (process.env.META_CAMPAIGN_SYNC_CRON_ENABLED === 'false') {
    return { started: false, reason: 'disabled_by_env' };
  }

  const cron = await loadNodeCron();
  if (!cron) return { started: false, reason: 'node_cron_unavailable' };

  const expression = '0 */6 * * *';
  const timezone = 'Asia/Dubai';

  const task = cron.schedule(
    expression,
    async () => {
      try {
        await ensureDB();
        const result = await syncCampaigns();
        if (result.skipped) {
          console.log(`[Cron] meta-campaign-sync skipped: ${result.reason}`);
        } else {
          console.log(`[Cron] meta-campaign-sync: synced ${result.synced} campaigns`);
        }
      } catch (error) {
        console.error('Meta campaign sync failed:', error);
      }
    },
    { timezone, scheduled: true }
  );

  task.start();
  globalThis.__dmMetaCampaignSyncCronStarted = true;
  console.log(`Meta campaign sync cron scheduled: ${expression} ${timezone}`);
  return { started: true, schedule: { expression, timezone } };
}
