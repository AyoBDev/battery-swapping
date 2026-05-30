import { NextRequest, NextResponse } from 'next/server';
import { appendRow, getRowCount } from '@/lib/s3-store';
import { determineTier } from '@/lib/tier-logic';

let cachedCount = 0;
let lastFetched = 0;
const CACHE_TTL = 60_000;

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

async function refreshCache(): Promise<number> {
  const now = Date.now();
  if (now - lastFetched > CACHE_TTL) {
    try {
      cachedCount = await getRowCount();
      lastFetched = now;
    } catch {
      // return stale cache on failure
    }
  }
  return cachedCount;
}

export async function GET() {
  const count = await refreshCache();
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { q1, q2, q3, name, email, phone, company } = body;

  if (!q1 || !q2 || !name || !email || !phone) {
    return NextResponse.json(
      { error: 'Missing required fields: q1, q2, name, email, phone' },
      { status: 400 }
    );
  }

  const tier = determineTier(q1, q2);

  const row = [
    new Date().toISOString(),
    q1,
    q2,
    q3 || '',
    String(tier.tier),
    name,
    email,
    phone,
    company || '',
  ];

  console.log('S3 env check:', {
    hasKey: !!process.env.S3_ACCESS_KEY_ID,
    hasSecret: !!process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.WAITLIST_S3_BUCKET,
  });

  try {
    await appendRow(row);
    recordRequest(ip);
    cachedCount += 1;
    lastFetched = Date.now();

    return NextResponse.json({
      tier: tier.tier,
      label: tier.label,
      message: tier.message,
      cta: tier.cta,
      count: cachedCount,
    });
  } catch (err) {
    console.error('Waitlist POST error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
