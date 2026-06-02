# Cost Calculator Lead Magnet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an embeddable multi-step ICE vs EV cost calculator at `/embed/calculator` that captures leads and invites users to the One With AI event.

**Architecture:** Client-side multi-step form (5 steps) with iframe postMessage resize. Leads submit to `/api/embed/leads` which stores to S3 (JSON + CSV) using the same pattern as the existing waitlist. Calculator logic extracted into a shared `lib/calculator-logic.ts` module.

**Tech Stack:** Next.js App Router, React (client component), TypeScript, Tailwind CSS, AWS S3 (@aws-sdk/client-s3)

---

## File Structure

| File | Responsibility |
|------|---------------|
| `lib/calculator-logic.ts` | Pure calculation functions + constants (shared by `/compare` and `/embed/calculator`) |
| `app/embed/calculator/page.tsx` | Multi-step form UI — 5 screens, postMessage resize, no layout wrapper |
| `app/api/embed/leads/route.ts` | POST endpoint — validates, stores to S3 |
| `lib/s3-leads.ts` | S3 read/write for calculator leads (separate file/keys from waitlist) |
| `app/compare/page.tsx` | Modified — imports from `lib/calculator-logic.ts` instead of inline constants |

---

### Task 1: Extract Calculator Logic into Shared Module

**Files:**
- Create: `lib/calculator-logic.ts`
- Modify: `app/compare/page.tsx`

- [ ] **Step 1: Create `lib/calculator-logic.ts` with constants and calculation functions**

```typescript
// lib/calculator-logic.ts

export const VEHICLE_PRESETS = {
  okada: { label: 'Okada (Motorcycle)', kmPerLiter: 45, dailyKm: 80, maintenanceMonthly: 15000, avgSpeedKmh: 17 },
  keke: { label: 'Keke (Tricycle)', kmPerLiter: 25, dailyKm: 60, maintenanceMonthly: 25000, avgSpeedKmh: 13 },
  lastMile: { label: 'Last-Mile Van', kmPerLiter: 10, dailyKm: 100, maintenanceMonthly: 45000, avgSpeedKmh: 22 },
} as const;

export type VehicleType = keyof typeof VEHICLE_PRESETS;

export const EV_SWAP_COST = 200;
export const EV_RANGE_PER_SWAP = 55;
export const EV_MAINTENANCE_MONTHLY = 3000;
export const DEFAULT_PETROL_PRICE = 1533;
export const WORKING_DAYS = 26;
export const ICE_FUELING_MINUTES_DAILY = 25;
export const CO2_PER_LITER = 2.3;

export type CalculationInput = {
  vehicleType: VehicleType;
  dailyKm: number;
  petrolPrice: number;
  fleetSize: number;
};

export type CalculationResult = {
  monthlyFuelCost: number;
  monthlyMaintenanceICE: number;
  monthlyTotalICE: number;
  dailySwaps: number;
  monthlySwapCost: number;
  monthlyTotalEV: number;
  monthlySavingsPerVehicle: number;
  monthlySavingsFleet: number;
  yearlySavingsFleet: number;
  savingsPercent: number;
  uptimeGainHoursMonthly: number;
  monthlyCO2Saved: number;
};

export function calculate(input: CalculationInput): CalculationResult {
  const { vehicleType, dailyKm, petrolPrice, fleetSize } = input;
  const preset = VEHICLE_PRESETS[vehicleType];

  const dailyFuelLiters = dailyKm / preset.kmPerLiter;
  const dailyFuelCost = dailyFuelLiters * petrolPrice;
  const monthlyFuelCost = dailyFuelCost * WORKING_DAYS;
  const monthlyMaintenanceICE = preset.maintenanceMonthly;
  const monthlyTotalICE = monthlyFuelCost + monthlyMaintenanceICE;

  const dailySwaps = Math.ceil(dailyKm / EV_RANGE_PER_SWAP);
  const dailySwapCost = dailySwaps * EV_SWAP_COST;
  const monthlySwapCost = dailySwapCost * WORKING_DAYS;
  const monthlyTotalEV = monthlySwapCost + EV_MAINTENANCE_MONTHLY;

  const monthlySavingsPerVehicle = monthlyTotalICE - monthlyTotalEV;
  const monthlySavingsFleet = monthlySavingsPerVehicle * fleetSize;
  const yearlySavingsFleet = monthlySavingsFleet * 12;
  const savingsPercent = Math.round((monthlySavingsPerVehicle / monthlyTotalICE) * 100);

  const evSwapMinutesDaily = dailySwaps * 3;
  const uptimeGainHoursMonthly = Math.round(((ICE_FUELING_MINUTES_DAILY - evSwapMinutesDaily) * WORKING_DAYS) / 60);

  const monthlyCO2Saved = Math.round(dailyFuelLiters * WORKING_DAYS * CO2_PER_LITER * fleetSize);

  return {
    monthlyFuelCost,
    monthlyMaintenanceICE,
    monthlyTotalICE,
    dailySwaps,
    monthlySwapCost,
    monthlyTotalEV,
    monthlySavingsPerVehicle,
    monthlySavingsFleet,
    yearlySavingsFleet,
    savingsPercent,
    uptimeGainHoursMonthly,
    monthlyCO2Saved,
  };
}

export function hoursToKm(hours: number, vehicleType: VehicleType): number {
  return hours * VEHICLE_PRESETS[vehicleType].avgSpeedKmh;
}
```

- [ ] **Step 2: Update `app/compare/page.tsx` to import from shared module**

Replace the inline constants block (lines 74–86) and use the shared module. Change the top of the file:

```typescript
// Replace the inline constants:
// const VEHICLE_PRESETS = { ... };
// const EV_SWAP_COST = 200;
// const EV_RANGE_PER_SWAP = 55;
// const EV_MAINTENANCE_MONTHLY = 3000;
// const DEFAULT_PETROL_PRICE = 700;

// With:
import {
  VEHICLE_PRESETS,
  EV_SWAP_COST,
  EV_RANGE_PER_SWAP,
  EV_MAINTENANCE_MONTHLY,
  DEFAULT_PETROL_PRICE,
  VehicleType,
} from '@/lib/calculator-logic';
```

Remove the old `VEHICLE_PRESETS`, `EV_SWAP_COST`, `EV_RANGE_PER_SWAP`, `EV_MAINTENANCE_MONTHLY`, and `DEFAULT_PETROL_PRICE` declarations from `compare/page.tsx`.

Note: The compare page still uses `DEFAULT_PETROL_PRICE` (now ₦1,533 instead of ₦700) — update the helper text from "Current Lagos average: ~₦700/L" to "Nigeria avg, May 2026 — NBS".

Also update the type cast for `vehicleType` from `keyof typeof VEHICLE_PRESETS` to the imported `VehicleType`.

- [ ] **Step 3: Verify the build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/calculator-logic.ts app/compare/page.tsx
git commit -m "Extract calculator logic into shared module"
```

---

### Task 2: Create S3 Leads Storage Module

**Files:**
- Create: `lib/s3-leads.ts`

- [ ] **Step 1: Create `lib/s3-leads.ts`**

```typescript
// lib/s3-leads.ts

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
```

- [ ] **Step 2: Verify the build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/s3-leads.ts
git commit -m "Add S3 storage module for calculator leads"
```

---

### Task 3: Create API Route for Lead Submission

**Files:**
- Create: `app/api/embed/leads/route.ts`

- [ ] **Step 1: Create `app/api/embed/leads/route.ts`**

```typescript
// app/api/embed/leads/route.ts

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
```

- [ ] **Step 2: Verify the build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/api/embed/leads/route.ts
git commit -m "Add API route for calculator lead submissions"
```

---

### Task 4: Build the Embed Calculator Page

**Files:**
- Create: `app/embed/calculator/page.tsx`

- [ ] **Step 1: Create the full multi-step form page**

```typescript
// app/embed/calculator/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Truck, Bike, Check } from 'lucide-react';
import {
  VEHICLE_PRESETS,
  VehicleType,
  DEFAULT_PETROL_PRICE,
  EV_SWAP_COST,
  calculate,
  hoursToKm,
} from '@/lib/calculator-logic';

const EVENT_URL = 'https://taverncentral.com/e/arthurite-integrtaed-njyvgc/one-with-ai-powering-mobility-and-ev-ecosystems-with-aws-72nfff';
const EVENT_NAME = 'One With AI 2026';
const EVENT_DATE = 'June 11, 2026';
const EVENT_VENUE = 'Federal Palace Hotel, Victoria Island, Lagos';

type AudienceType = 'fleet' | 'individual';

const TOTAL_STEPS = 5;

function vibrate() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10);
  }
}

function formatNaira(amount: number): string {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₦${Math.round(amount / 1000)}K`;
  return `₦${amount.toLocaleString()}`;
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i < current
              ? 'w-2 bg-[#1C3D2D]'
              : i === current
              ? 'w-6 bg-[#1C3D2D]'
              : 'w-2 bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function EmbedCalculatorPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);

  const [audience, setAudience] = useState<AudienceType | ''>('');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
  const [dailyHours, setDailyHours] = useState(8);
  const [dailyKm, setDailyKm] = useState(80);
  const [fleetSize, setFleetSize] = useState(10);
  const [petrolPrice, setPetrolPrice] = useState(DEFAULT_PETROL_PRICE);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animating) {
      const timeout = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [animating]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.parent.postMessage(
        { type: 'swapos-resize', height: document.body.scrollHeight },
        '*'
      );
    }, 50);
    return () => clearTimeout(timeout);
  }, [step, submitted]);

  function goTo(nextStep: number) {
    setDirection(nextStep > step ? 'forward' : 'back');
    setAnimating(true);
    setStep(nextStep);
  }

  const computedDailyKm =
    audience === 'individual' && vehicleType
      ? hoursToKm(dailyHours, vehicleType as VehicleType)
      : dailyKm;

  const results =
    vehicleType
      ? calculate({
          vehicleType: vehicleType as VehicleType,
          dailyKm: computedDailyKm,
          petrolPrice,
          fleetSize: audience === 'fleet' ? fleetSize : 1,
        })
      : null;

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/embed/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience_type: audience,
          vehicle_type: vehicleType,
          fleet_size: audience === 'fleet' ? fleetSize : 1,
          daily_hours: audience === 'individual' ? dailyHours : null,
          daily_km: computedDailyKm,
          petrol_price: petrolPrice,
          monthly_savings: results?.monthlySavingsFleet || 0,
          name,
          email,
          phone,
        }),
      });

      if (res.status === 429) {
        setError('Too many submissions. Please try again later.');
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  const transitionClass = animating
    ? direction === 'forward'
      ? 'animate-slide-in-right'
      : 'animate-slide-in-left'
    : '';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.3s ease-out; }
      `}</style>
      <div className="w-full max-w-md">
        {step > 0 && step < 5 && <ProgressDots current={step} total={TOTAL_STEPS} />}
        <div ref={contentRef} className={transitionClass}>
          {step === 0 && (
            <Step1Audience
              onSelect={(a) => { vibrate(); setAudience(a); goTo(1); }}
            />
          )}
          {step === 1 && (
            <Step2Vehicle
              onSelect={(v) => {
                vibrate();
                setVehicleType(v);
                setDailyKm(VEHICLE_PRESETS[v].dailyKm);
                goTo(2);
              }}
              onBack={() => goTo(0)}
            />
          )}
          {step === 2 && (
            <Step3Numbers
              audience={audience as AudienceType}
              vehicleType={vehicleType as VehicleType}
              dailyHours={dailyHours}
              dailyKm={dailyKm}
              fleetSize={fleetSize}
              petrolPrice={petrolPrice}
              onDailyHoursChange={setDailyHours}
              onDailyKmChange={setDailyKm}
              onFleetSizeChange={setFleetSize}
              onPetrolPriceChange={setPetrolPrice}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
            />
          )}
          {step === 3 && results && (
            <Step4Results
              audience={audience as AudienceType}
              results={results}
              onNext={() => goTo(4)}
              onBack={() => goTo(2)}
            />
          )}
          {step === 4 && results && (
            <Step5Contact
              name={name}
              email={email}
              phone={phone}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onSubmit={handleSubmit}
              onBack={() => goTo(3)}
              submitting={submitting}
              submitted={submitted}
              error={error}
              monthlySavings={results.monthlySavingsFleet}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Step1Audience({ onSelect }: { onSelect: (a: AudienceType) => void }) {
  return (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-[#1C3D2D] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">SwapOS</span>
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-bold text-gray-900">
          How much could you save switching to EV?
        </h1>
        <p className="text-sm text-gray-500">Find out in 30 seconds</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSelect('fleet')}
          className="w-full text-left py-4 px-4 rounded-xl border-2 border-gray-200 hover:border-[#1C3D2D] transition-colors flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-[#1C3D2D]/10 rounded-lg flex items-center justify-center">
            <Truck size={20} className="text-[#1C3D2D]" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Fleet Operator</p>
            <p className="text-xs text-gray-500">I manage multiple vehicles</p>
          </div>
        </button>
        <button
          onClick={() => onSelect('individual')}
          className="w-full text-left py-4 px-4 rounded-xl border-2 border-gray-200 hover:border-[#1C3D2D] transition-colors flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-[#1C3D2D]/10 rounded-lg flex items-center justify-center">
            <Bike size={20} className="text-[#1C3D2D]" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Individual Rider</p>
            <p className="text-xs text-gray-500">I ride one vehicle</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function Step2Vehicle({ onSelect, onBack }: { onSelect: (v: VehicleType) => void; onBack: () => void }) {
  const vehicles: { key: VehicleType; label: string }[] = [
    { key: 'okada', label: 'Okada (Motorcycle)' },
    { key: 'keke', label: 'Keke (Tricycle)' },
    { key: 'lastMile', label: 'Last-Mile Van' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Step 2 of 5</p>
        <h2 className="text-xl font-bold text-gray-900">What do you ride?</h2>
      </div>

      <div className="space-y-3">
        {vehicles.map((v) => (
          <button
            key={v.key}
            onClick={() => onSelect(v.key)}
            className="w-full text-left py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#1C3D2D] transition-colors"
          >
            {v.label}
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="py-4 px-4 rounded-xl border-2 border-gray-200 text-gray-600"
      >
        <ArrowLeft size={20} />
      </button>
    </div>
  );
}

function Step3Numbers({
  audience,
  vehicleType,
  dailyHours,
  dailyKm,
  fleetSize,
  petrolPrice,
  onDailyHoursChange,
  onDailyKmChange,
  onFleetSizeChange,
  onPetrolPriceChange,
  onNext,
  onBack,
}: {
  audience: AudienceType;
  vehicleType: VehicleType;
  dailyHours: number;
  dailyKm: number;
  fleetSize: number;
  petrolPrice: number;
  onDailyHoursChange: (v: number) => void;
  onDailyKmChange: (v: number) => void;
  onFleetSizeChange: (v: number) => void;
  onPetrolPriceChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Step 3 of 5</p>
        <h2 className="text-xl font-bold text-gray-900">Your numbers</h2>
      </div>

      <div className="space-y-5">
        {audience === 'fleet' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              How many vehicles?
            </label>
            <input
              type="number"
              min={2}
              max={500}
              value={fleetSize}
              onChange={(e) => onFleetSizeChange(Math.max(2, parseInt(e.target.value) || 2))}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
            />
          </div>
        )}

        {audience === 'individual' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              How many hours do you ride daily?
            </label>
            <input
              type="range"
              min={2}
              max={14}
              step={1}
              value={dailyHours}
              onChange={(e) => onDailyHoursChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2 hrs</span>
              <span className="font-medium text-gray-900">{dailyHours} hours</span>
              <span>14 hrs</span>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Daily distance per vehicle (km)
            </label>
            <input
              type="range"
              min={20}
              max={200}
              step={5}
              value={dailyKm}
              onChange={(e) => onDailyKmChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20 km</span>
              <span className="font-medium text-gray-900">{dailyKm} km</span>
              <span>200 km</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Petrol price (₦/liter)
          </label>
          <input
            type="number"
            min={100}
            max={3000}
            value={petrolPrice}
            onChange={(e) => onPetrolPriceChange(Math.max(100, parseInt(e.target.value) || 100))}
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Nigeria avg, May 2026 — NBS</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-4 px-4 rounded-xl border-2 border-gray-200 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          See my savings
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Step4Results({
  audience,
  results,
  onNext,
  onBack,
}: {
  audience: AudienceType;
  results: ReturnType<typeof calculate>;
  onNext: () => void;
  onBack: () => void;
}) {
  const savingsDisplay = audience === 'fleet' ? results.monthlySavingsFleet : results.monthlySavingsPerVehicle;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">You&apos;d save</p>
        <p className="text-4xl font-bold text-[#1C3D2D]">
          {formatNaira(savingsDisplay)}
        </p>
        <p className="text-sm text-gray-500">every month</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border-2 border-red-100 rounded-xl p-4">
          <p className="text-xs text-red-600 font-medium mb-2">Petrol</p>
          <p className="text-lg font-bold text-gray-900">
            {formatNaira(results.monthlyTotalICE)}
          </p>
          <p className="text-xs text-gray-500 mt-1">/month per vehicle</p>
        </div>
        <div className="border-2 border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium mb-2">Battery Swap</p>
          <p className="text-lg font-bold text-gray-900">
            {formatNaira(results.monthlyTotalEV)}
          </p>
          <p className="text-xs text-gray-500 mt-1">/month per vehicle</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Extra uptime</p>
          <p className="text-sm font-bold text-blue-700">+{results.uptimeGainHoursMonthly} hrs/mo</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Price stability</p>
          <p className="text-sm font-bold text-amber-700">Fixed ₦{EV_SWAP_COST}/swap</p>
        </div>
      </div>

      {audience === 'fleet' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Fleet yearly savings</p>
          <p className="text-2xl font-bold text-green-700">{formatNaira(results.yearlySavingsFleet)}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-4 px-4 rounded-xl border-2 border-gray-200 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          Want to go electric?
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Step5Contact({
  name,
  email,
  phone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onSubmit,
  onBack,
  submitting,
  submitted,
  error,
  monthlySavings,
}: {
  name: string;
  email: string;
  phone: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitted: boolean;
  error: string;
  monthlySavings: number;
}) {
  const canSubmit = name.trim() && email.trim() && phone.trim().length > 5 && !submitting;

  if (submitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-[#1C3D2D]/10 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-[#1C3D2D]" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">You&apos;re saving</p>
          <p className="text-2xl font-bold text-[#1C3D2D]">{formatNaira(monthlySavings)}/month</p>
          <p className="text-sm text-gray-500">We&apos;ll be in touch.</p>
        </div>

        <div className="bg-[#1C3D2D]/5 border border-[#1C3D2D]/20 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-gray-900">In the meantime:</p>
          <p className="text-sm text-gray-600">
            Come meet OEM manufacturers, investors, and fleet stakeholders at <strong>{EVENT_NAME}</strong> — {EVENT_DATE}, {EVENT_VENUE}.
          </p>
          <a
            href={EVENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1C3D2D] text-white py-3 px-6 rounded-xl font-semibold text-sm"
          >
            Register for the event
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Step 5 of 5</p>
        <h2 className="text-xl font-bold text-gray-900">
          Leave your details
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll show you how to make the switch.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@company.com"
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+234 800 000 0000"
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-4 px-4 rounded-xl border-2 border-gray-200 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {submitting ? 'Submitting...' : 'Submit'}
          {!submitting && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/embed/calculator/page.tsx
git commit -m "Add embeddable cost calculator lead magnet page"
```

---

### Task 5: Update `/compare` Page to Use Shared Module and New Default

**Files:**
- Modify: `app/compare/page.tsx`

- [ ] **Step 1: Replace inline constants with imports**

At the top of `app/compare/page.tsx`, replace the `VEHICLE_PRESETS` and calculator constants (lines 74–86):

Remove:
```typescript
const VEHICLE_PRESETS = {
    okada: { label: 'Okada (Motorcycle)', kmPerLiter: 45, dailyKm: 80, maintenanceMonthly: 15000 },
    keke: { label: 'Keke (Tricycle)', kmPerLiter: 25, dailyKm: 60, maintenanceMonthly: 25000 },
    lastMile: { label: 'Last-Mile Van', kmPerLiter: 10, dailyKm: 100, maintenanceMonthly: 45000 },
};

const EV_SWAP_COST = 200; // ₦ per swap
const EV_RANGE_PER_SWAP = 55; // km per full battery
const EV_MAINTENANCE_MONTHLY = 3000; // ₦ (minimal — brake pads, tires only)
const DEFAULT_PETROL_PRICE = 700; // ₦ per liter
```

Add import after the existing lucide import:
```typescript
import {
  VEHICLE_PRESETS,
  EV_SWAP_COST,
  EV_RANGE_PER_SWAP,
  EV_MAINTENANCE_MONTHLY,
  DEFAULT_PETROL_PRICE,
  WORKING_DAYS,
  VehicleType,
} from '@/lib/calculator-logic';
```

Update type usage: change `keyof typeof VEHICLE_PRESETS` to `VehicleType` throughout the CalculatorTab.

Update helper text: change "Current Lagos average: ~₦700/L" to "Nigeria avg, May 2026 — NBS".

The `WORKING_DAYS` constant (26) replaces the hardcoded `26` multiplier used inline.

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test the `/compare` page still works**

Run: `npx next build`
Expected: Build succeeds, `/compare` route listed in output

- [ ] **Step 4: Commit**

```bash
git add app/compare/page.tsx
git commit -m "Update compare page to use shared calculator module"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Full build check**

Run: `npx next build`
Expected: All routes compile including `/embed/calculator` and `/api/embed/leads`

- [ ] **Step 2: Verify the embed page is layout-free**

Check that `/embed/calculator` does NOT wrap in MainLayout — it should render as a standalone white page with no header/nav.

- [ ] **Step 3: Test the API endpoint locally**

Run: `curl -X POST http://localhost:3000/api/embed/leads -H 'Content-Type: application/json' -d '{"audience_type":"individual","vehicle_type":"okada","fleet_size":1,"daily_hours":8,"daily_km":136,"petrol_price":1533,"monthly_savings":45000,"name":"Test User","email":"test@test.com","phone":"+234 800 000 0000"}'`

Expected: `{"success":true}`

- [ ] **Step 4: Final commit and push**

```bash
git push
```
