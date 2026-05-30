import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.WAITLIST_S3_BUCKET || 'swapos-waitlist-data';
const JSON_KEY = 'waitlist/responses.json';
const CSV_KEY = 'waitlist/responses.csv';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

const CSV_HEADER = 'timestamp,q1_inventory,q2_swaps,q3_headache,tier,name,email,phone,company';

type WaitlistEntry = {
  timestamp: string;
  q1: string;
  q2: string;
  q3: string;
  tier: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function getJsonData(): Promise<WaitlistEntry[]> {
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

function entriesToCsv(entries: WaitlistEntry[]): string {
  const rows = entries.map((e) =>
    [e.timestamp, e.q1, e.q2, e.q3, e.tier, e.name, e.email, e.phone, e.company]
      .map(escapeCsv)
      .join(',')
  );
  return CSV_HEADER + '\n' + rows.join('\n') + '\n';
}

export async function appendRow(data: string[]): Promise<void> {
  const entry: WaitlistEntry = {
    timestamp: data[0],
    q1: data[1],
    q2: data[2],
    q3: data[3],
    tier: data[4],
    name: data[5],
    email: data[6],
    phone: data[7],
    company: data[8],
  };

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

export async function getRowCount(): Promise<number> {
  const entries = await getJsonData();
  return entries.length;
}
