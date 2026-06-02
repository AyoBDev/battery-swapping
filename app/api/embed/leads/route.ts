import { NextRequest, NextResponse } from 'next/server';
import { appendLead, LeadEntry } from '@/lib/s3-leads';

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

  const { audience_type, vehicle_type, fleet_size, daily_hours, daily_km, petrol_price, monthly_savings, name, email, phone } = body as Record<string, unknown>;

  if (!audience_type || !vehicle_type || !name || !email || !phone) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const entry: LeadEntry = {
    timestamp: new Date().toISOString(),
    audience_type: String(audience_type),
    vehicle_type: String(vehicle_type),
    fleet_size: Number(fleet_size) || 1,
    daily_hours: daily_hours !== null && daily_hours !== undefined ? Number(daily_hours) : null,
    daily_km: Number(daily_km) || 0,
    petrol_price: Number(petrol_price) || 0,
    monthly_savings: Number(monthly_savings) || 0,
    name: String(name),
    email: String(email),
    phone: String(phone),
  };

  try {
    await appendLead(entry);
    recordRequest(ip);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead submission error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
