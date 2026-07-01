import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type User } from '@/lib/auth';
import { HRJoiningExitService } from '@/services/hr-joining-exit-service';

type Context = { params: Promise<{ path: string[] }> };
const bodyOf = async (request: NextRequest) => request.json().catch(() => ({})) as Promise<Record<string, unknown>>;
const currentUser = (request: NextRequest): User | null => {
  const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return token ? verifyToken(token) : null;
};
const role = (user: User | null) => String(user?.type || '').toLowerCase().replace(/[_-]/g, ' ').trim();
const isHr = (user: User | null) => role(user).includes('hr') || user?.permissions?.some((p) => p.startsWith('hr.'));
const isDos = (user: User | null) => ['director of sales', 'director', 'dos'].includes(role(user));
const isDosOrManager = (user: User | null) => ['director of sales', 'director', 'dos', 'branch manager', 'manager', 'admin', 'administrator'].includes(role(user));
const forbidden = () => NextResponse.json({ error: 'You are not authorized for this HR workflow action' }, { status: 403 });
const missing = () => NextResponse.json({ error: 'Record not found' }, { status: 404 });

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const user = currentUser(request); if (!user) return forbidden();
    const path = (await params).path;
    const url = new URL(request.url);
    if (path.join('/') === 'recruitment/candidates') {
      const status = url.searchParams.get('status') || undefined;
      const applied_position = url.searchParams.get('applied_position') || undefined;
      return NextResponse.json({ candidates: await HRJoiningExitService.listCandidates({ status, applied_position }) });
    }
    if (path[0] === 'recruitment' && path[1] === 'candidates' && path[2]) { const candidate = await HRJoiningExitService.getCandidate(path[2]); return candidate ? NextResponse.json({ candidate }) : missing(); }
    if (path.join('/') === 'recruitment/pipeline') return NextResponse.json(await HRJoiningExitService.pipeline());
    if (path.join('/') === 'exit/requests') {
      const status = url.searchParams.get('status') || undefined;
      const exit_type = url.searchParams.get('exit_type') || undefined;
      return NextResponse.json({ requests: await HRJoiningExitService.listExits({ status, exit_type }) });
    }
    if (path[0] === 'exit' && path[1] === 'requests' && path[2]) { const exitRequest = await HRJoiningExitService.getExit(path[2]); return exitRequest ? NextResponse.json({ request: exitRequest }) : missing(); }
    if (path[0] === 'exit' && path[1] === 'fnf' && path[2]) { const fnf = await HRJoiningExitService.getFnfSummary(path[2]); return fnf ? NextResponse.json({ fnf }) : missing(); }
    return NextResponse.json({ error: 'Unknown HR workflow endpoint' }, { status: 404 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load HR workflow' }, { status: 500 }); }
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const path = (await params).path; const body = await bodyOf(request); const user = currentUser(request);
    const joined = path.join('/');
    if (joined === 'recruitment/candidates') { if (!user || !isHr(user)) return forbidden(); const full_name = String(body.full_name || '').trim(), email = String(body.email || '').trim(), applied_position = String(body.applied_position || '').trim(); if (!full_name || !email || !applied_position) return NextResponse.json({ error: 'full_name, email and applied_position are required' }, { status: 400 }); return NextResponse.json({ candidate: await HRJoiningExitService.createCandidate({ full_name, email, applied_position, phone: body.phone ? String(body.phone) : undefined, source: body.source ? String(body.source) : undefined, applied_date: body.applied_date ? String(body.applied_date) : undefined, created_by: String(user.id) }) }, { status: 201 }); }
    if (path[0] === 'recruitment' && path[1] === 'candidates' && path[2] && path[3] === 'offer') { if (!user || !isHr(user)) return forbidden(); const candidate = await HRJoiningExitService.submitOffer(path[2], body); return candidate ? NextResponse.json({ candidate, message: 'Offer submitted to Director of Sales for approval' }) : missing(); }
    if (path[0] === 'recruitment' && path[1] === 'candidates' && path[2] && path[3] === 'accept') { const candidate = await HRJoiningExitService.acceptOffer(path[2], String(body.token || '')); return candidate ? NextResponse.json({ candidate, message: 'Offer accepted' }) : NextResponse.json({ error: 'Invalid offer acceptance link' }, { status: 400 }); }
    if (path[0] === 'recruitment' && path[1] === 'onboard' && path[2]) { if (!user || !isHr(user)) return forbidden(); const candidate = await HRJoiningExitService.onboardCandidate(path[2], body); return candidate ? NextResponse.json({ candidate, message: 'Candidate onboarded and welcome notification queued' }) : missing(); }
    if (joined === 'exit/resign') { if (!user) return forbidden(); const employee_id = String(body.employee_id || user.id); const reason = String(body.reason || '').trim(); if (!reason) return NextResponse.json({ error: 'reason is required' }, { status: 400 }); return NextResponse.json({ request: await HRJoiningExitService.createExit({ employee_id, submitted_by: String(user.id), reason, requested_lwd: body.requested_lwd ? String(body.requested_lwd) : undefined, notes: body.notes ? String(body.notes) : undefined }, 'Resignation') }, { status: 201 }); }
    if (path[0] === 'exit' && path[1] === 'terminate' && path[2]) { if (!user || !isDosOrManager(user)) return forbidden(); const reason = String(body.reason || '').trim(); if (!reason) return NextResponse.json({ error: 'reason is required' }, { status: 400 }); return NextResponse.json({ request: await HRJoiningExitService.createExit({ employee_id: path[2], submitted_by: String(user.id), reason, requested_lwd: body.requested_lwd ? String(body.requested_lwd) : undefined, notes: body.notes ? String(body.notes) : undefined }, 'Termination') }, { status: 201 }); }
    if (path[0] === 'exit' && path[1] === 'interview' && path[2]) { if (!user || !isHr(user)) return forbidden(); const exitRequestId = String(body.exit_request_id || ''); if (!exitRequestId) return NextResponse.json({ error: 'exit_request_id is required' }, { status: 400 }); const result = await HRJoiningExitService.completeExit(exitRequestId, body.exit_interview_id ? String(body.exit_interview_id) : undefined); return result ? NextResponse.json({ request: result, message: 'Exit completed and F&F notification queued' }) : missing(); }
    return NextResponse.json({ error: 'Unknown HR workflow endpoint' }, { status: 404 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to process HR workflow' }, { status: 400 }); }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const user = currentUser(request); const path = (await params).path; const body = await bodyOf(request); if (!user) return forbidden();
    if (path[0] === 'recruitment' && path[1] === 'candidates' && path[2] && path[3] === 'status') { if (!isHr(user)) return forbidden(); const candidate = await HRJoiningExitService.updateCandidateStatus(path[2], body); return candidate ? NextResponse.json({ candidate }) : missing(); }
    if (path[0] === 'recruitment' && path[1] === 'candidates' && path[2] && path[3] === 'offer' && path[4] === 'approve') { if (!isDos(user)) return forbidden(); const result = await HRJoiningExitService.approveOffer(path[2], String(user.id)); return result ? NextResponse.json({ ...result, message: 'Offer approved and candidate notification queued' }) : missing(); }
    if (path[0] === 'exit' && path[1] && (path[2] === 'approve' || path[2] === 'reject')) { if (!isDosOrManager(user)) return forbidden(); const exitRequest = await HRJoiningExitService.reviewExit(path[1], path[2] === 'approve', String(user.id), body.approved_lwd ? String(body.approved_lwd) : undefined, body.notes ? String(body.notes) : undefined); return exitRequest ? NextResponse.json({ request: exitRequest }) : missing(); }
    return NextResponse.json({ error: 'Unknown HR workflow endpoint' }, { status: 404 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update HR workflow' }, { status: 400 }); }
}
