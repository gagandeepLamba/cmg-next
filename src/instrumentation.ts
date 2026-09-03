export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startRenewalReminderCron } = await import('@/lib/renewal-reminder-cron');
    await startRenewalReminderCron();

    const { startMonthlyReportCron } = await import('@/lib/monthly-report-cron');
    await startMonthlyReportCron();

    const { startMetaLeadsRetryCron } = await import('@/lib/meta/retry-cron');
    await startMetaLeadsRetryCron();

    const { startMetaCampaignSyncCron } = await import('@/lib/meta/campaign-sync-cron');
    await startMetaCampaignSyncCron();
  }
}
