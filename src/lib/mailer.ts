// Thin wrapper over Resend's REST API via plain `fetch` - no email library
// exists anywhere else in this project, and a single POST doesn't warrant
// adding one. RESEND_API_KEY / RESEND_FROM_EMAIL are demo placeholders in
// .env until real credentials are supplied; until then this throws a
// descriptive error per-send that callers are expected to catch and log
// rather than let crash a batch job.
export async function sendEmail({ to, subject, html, attachments }: {
  to: string;
  subject: string;
  html: string;
  // Resend expects base64-encoded content per attachment - no encoding/mime handling here.
  attachments?: { filename: string; content: string }[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY / RESEND_FROM_EMAIL are not configured');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html, ...(attachments?.length ? { attachments } : {}) }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend API error: ${res.status} ${body}`);
  }

  return res.json();
}
