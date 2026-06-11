import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.LEADS_S3_BUCKET || process.env.WAITLIST_S3_BUCKET || 'swapos-waitlist-data';
const JSON_KEY = 'partner-leads/leads.json';
const CSV_KEY = 'partner-leads/leads.csv';

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

const CSV_HEADER = 'timestamp,name,company,role,email,challenge';

export type PartnerLeadEntry = {
  timestamp: string;
  name: string;
  company: string;
  role: string;
  email: string;
  challenge: string;
};

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function getJsonData(): Promise<PartnerLeadEntry[]> {
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

function entriesToCsv(entries: PartnerLeadEntry[]): string {
  const rows = entries.map((e) =>
    [
      e.timestamp,
      e.name,
      e.company,
      e.role,
      e.email,
      e.challenge,
    ]
      .map(escapeCsv)
      .join(',')
  );
  return CSV_HEADER + '\n' + rows.join('\n') + '\n';
}

export async function appendPartnerLead(entry: PartnerLeadEntry): Promise<void> {
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
