import { connectDB } from '@/lib/sequelize';
import { retryFailedDeliveries } from './processor';

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
  var __dmMetaLeadsRetryCronStarted: boolean | undefined;
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
    console.warn('node-cron is not available; Meta lead retry scheduler was not started.', error);
    return null;
  }
};

/**
 * Retries failed Meta → CRM lead deliveries every 5 minutes, in-process.
 * Runs on any host (Vercel cron / VPS crontab is not required for this to work).
 */
export async function startMetaLeadsRetryCron() {
  if (globalThis.__dmMetaLeadsRetryCronStarted) {
    return { started: false, reason: 'already_started' };
  }

  if (process.env.META_LEADS_RETRY_CRON_ENABLED === 'false') {
    return { started: false, reason: 'disabled_by_env' };
  }

  const cron = await loadNodeCron();
  if (!cron) return { started: false, reason: 'node_cron_unavailable' };

  const expression = '*/5 * * * *';
  const timezone = 'Asia/Dubai';

  const task = cron.schedule(
    expression,
    async () => {
      try {
        await ensureDB();
        const result = await retryFailedDeliveries();
        if (result.processed > 0 || result.errors > 0) {
          console.log(`[Cron] meta-leads-retry: processed=${result.processed} errors=${result.errors}`);
        }
      } catch (error) {
        console.error('Meta lead retry scan failed:', error);
      }
    },
    { timezone, scheduled: true }
  );

  task.start();
  globalThis.__dmMetaLeadsRetryCronStarted = true;
  console.log(`Meta lead retry cron scheduled: ${expression} ${timezone}`);
  return { started: true, schedule: { expression, timezone } };
}
