import { NextRequest, NextResponse } from 'next/server';
import { appendPartnerLead, PartnerLeadEntry } from '@/lib/s3-partner-leads';

const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 3600_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimit.set(ip, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

function recordRequest(ip: string): void {
  const timestamps = rateLimit.get(ip) || [];
  timestamps.push(Date.now());
  rateLimit.set(ip, timestamps);
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, company, role, email, challenge } = body as Record<string, unknown>;

  if (!name || !company || !role || !email) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const entry: PartnerLeadEntry = {
    timestamp: new Date().toISOString(),
    name: String(name),
    company: String(company),
    role: String(role),
    email: String(email),
    challenge: String(challenge || ''),
  };

  try {
    await appendPartnerLead(entry);
    recordRequest(ip);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partner lead submission error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
