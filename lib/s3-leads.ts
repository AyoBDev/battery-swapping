import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.LEADS_S3_BUCKET || process.env.WAITLIST_S3_BUCKET || 'swapos-waitlist-data';
const JSON_KEY = 'calculator-leads/leads.json';
const CSV_KEY = 'calculator-leads/leads.csv';

const s3 = new S3Client({
  region: process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1',
  ...(process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      }
    : {}),
});

const CSV_HEADER = 'timestamp,audience_type,vehicle_type,fleet_size,daily_hours,daily_km,petrol_price,monthly_savings,name,email,phone';

export type LeadEntry = {
  timestamp: string;
  audience_type: string;
  vehicle_type: string;
  fleet_size: number;
  daily_hours: number | null;
  daily_km: number;
  petrol_price: number;
  monthly_savings: number;
  name: string;
  email: string;
  phone: string;
};

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function getJsonData(): Promise<LeadEntry[]> {
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: JSON_KEY })
    );
    const body = await res.Body?.transformToString();
    if (!body) return [];
    return JSON.parse(body);
  } catch {
    return [];
  }
}

function entriesToCsv(entries: LeadEntry[]): string {
  const rows = entries.map((e) =>
    [
      e.timestamp,
      e.audience_type,
      e.vehicle_type,
      String(e.fleet_size),
      e.daily_hours !== null ? String(e.daily_hours) : '',
      String(e.daily_km),
      String(e.petrol_price),
      String(e.monthly_savings),
      e.name,
      e.email,
      e.phone,
    ]
      .map(escapeCsv)
      .join(',')
  );
  return CSV_HEADER + '\n' + rows.join('\n') + '\n';
}

export async function appendLead(entry: LeadEntry): Promise<void> {
  const entries = await getJsonData();
  entries.push(entry);

  await Promise.all([
    s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: JSON_KEY,
        Body: JSON.stringify(entries, null, 2),
        ContentType: 'application/json',
      })
    ),
    s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: CSV_KEY,
        Body: entriesToCsv(entries),
        ContentType: 'text/csv',
      })
    ),
  ]);
}
