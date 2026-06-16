export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startRenewalReminderCron } = await import('@/lib/renewal-reminder-cron');
    await startRenewalReminderCron();
  }
}
