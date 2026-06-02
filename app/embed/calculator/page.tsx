'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Truck, Bike, Check } from 'lucide-react';
import { VEHICLE_PRESETS, VehicleType, DEFAULT_PETROL_PRICE, EV_SWAP_COST, calculate, hoursToKm } from '@/lib/calculator-logic';

const EVENT_URL = 'https://taverncentral.com/e/arthurite-integrtaed-njyvgc/one-with-ai-powering-mobility-and-ev-ecosystems-with-aws-72nfff';
const EVENT_NAME = 'One With AI 2026';
const EVENT_DATE = 'June 11, 2026';
const EVENT_VENUE = 'Federal Palace Hotel, Victoria Island, Lagos';

const TOTAL_STEPS = 5;

function formatNaira(amount: number): string {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₦${Math.round(amount / 1000)}K`;
  return `₦${amount.toLocaleString()}`;
}

function vibrate() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10);
  }
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
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [audience, setAudience] = useState<'fleet' | 'individual' | ''>('');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
  const [dailyHours, setDailyHours] = useState(8);
  const [dailyKm, setDailyKm] = useState(80);
  const [fleetSize, setFleetSize] = useState(10);
  const [petrolPrice, setPetrolPrice] = useState(DEFAULT_PETROL_PRICE);

  // Lead capture
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (animating) {
      const timeout = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [animating]);

  // iframe resize postMessage
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.parent.postMessage({ type: 'swapos-resize', height: document.body.scrollHeight }, '*');
    }, 50);
    return () => clearTimeout(timeout);
  }, [step, submitted]);

  function goTo(nextStep: number) {
    setDirection(nextStep > step ? 'forward' : 'back');
    setAnimating(true);
    setStep(nextStep);
  }

  // Calculations for step 4
  const computedDailyKm = audience === 'individual' && vehicleType
    ? hoursToKm(dailyHours, vehicleType as VehicleType)
    : dailyKm;

  const results = vehicleType
    ? calculate({
        vehicleType: vehicleType as VehicleType,
        dailyKm: computedDailyKm,
        petrolPrice,
        fleetSize: audience === 'fleet' ? fleetSize : 1,
      })
    : null;

  const monthlySavings = results
    ? audience === 'fleet'
      ? results.monthlySavingsFleet
      : results.monthlySavingsPerVehicle
    : 0;

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    const payload = {
      audience_type: audience,
      vehicle_type: vehicleType,
      fleet_size: audience === 'fleet' ? fleetSize : 1,
      daily_hours: dailyHours,
      daily_km: computedDailyKm,
      petrol_price: petrolPrice,
      monthly_savings: monthlySavings,
      name,
      email,
      phone,
    };

    try {
      const res = await fetch('/api/embed/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
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
        {step >= 0 && step < 5 && !submitted && (
          <ProgressDots current={step} total={TOTAL_STEPS} />
        )}
        <div className={transitionClass}>
          {step === 0 && !submitted && (
            <StepAudience
              value={audience}
              onSelect={(v) => {
                vibrate();
                setAudience(v);
                goTo(1);
              }}
            />
          )}
          {step === 1 && !submitted && (
            <StepVehicle
              value={vehicleType}
              onSelect={(v) => {
                vibrate();
                setVehicleType(v);
                goTo(2);
              }}
              onBack={() => goTo(0)}
            />
          )}
          {step === 2 && !submitted && (
            <StepNumbers
              audience={audience}
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
          {step === 3 && !submitted && results && (
            <StepResults
              audience={audience}
              results={results}
              onNext={() => goTo(4)}
              onBack={() => goTo(2)}
            />
          )}
          {step === 4 && !submitted && (
            <StepLeadCapture
              name={name}
              email={email}
              phone={phone}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onSubmit={handleSubmit}
              onBack={() => goTo(3)}
              submitting={submitting}
              error={error}
            />
          )}
          {submitted && (
            <StepConfirmation monthlySavings={monthlySavings} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Step 1: Audience ---

function StepAudience({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: 'fleet' | 'individual') => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Are you a...</h2>
      <div className="space-y-3">
        <button
          onClick={() => onSelect('fleet')}
          className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-colors flex items-center gap-3 ${
            value === 'fleet'
              ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
              : 'border-gray-200'
          }`}
        >
          <Truck size={20} className="text-gray-600 flex-shrink-0" />
          <span>Fleet Operator</span>
        </button>
        <button
          onClick={() => onSelect('individual')}
          className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-colors flex items-center gap-3 ${
            value === 'individual'
              ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
              : 'border-gray-200'
          }`}
        >
          <Bike size={20} className="text-gray-600 flex-shrink-0" />
          <span>Individual Rider</span>
        </button>
      </div>
    </div>
  );
}

// --- Step 2: Vehicle ---

function StepVehicle({
  value,
  onSelect,
  onBack,
}: {
  value: string;
  onSelect: (v: VehicleType) => void;
  onBack: () => void;
}) {
  const vehicles: { key: VehicleType; label: string }[] = [
    { key: 'okada', label: 'Okada (Motorcycle)' },
    { key: 'keke', label: 'Keke (Tricycle)' },
    { key: 'lastMile', label: 'Last-Mile Van' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">What do you ride?</h2>
      <div className="space-y-3">
        {vehicles.map((v) => (
          <button
            key={v.key}
            onClick={() => onSelect(v.key)}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-colors ${
              value === v.key
                ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
                : 'border-gray-200'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-4 px-4 rounded-xl border-2 border-gray-200 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1" />
      </div>
    </div>
  );
}

// --- Step 3: Numbers ---

function StepNumbers({
  audience,
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
  audience: 'fleet' | 'individual' | '';
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
      <h2 className="text-xl font-bold text-gray-900">Tell us about your usage</h2>

      {audience === 'individual' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Hours riding per day: <span className="font-bold text-[#1C3D2D]">{dailyHours}h</span>
          </label>
          <input
            type="range"
            min={2}
            max={14}
            value={dailyHours}
            onChange={(e) => onDailyHoursChange(Number(e.target.value))}
            className="w-full accent-[#1C3D2D]"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>2h</span>
            <span>14h</span>
          </div>
        </div>
      )}

      {audience === 'fleet' && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fleet size</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={fleetSize}
              onChange={(e) => onFleetSizeChange(Number(e.target.value) || 1)}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Avg km per vehicle per day: <span className="font-bold text-[#1C3D2D]">{dailyKm} km</span>
            </label>
            <input
              type="range"
              min={20}
              max={200}
              step={5}
              value={dailyKm}
              onChange={(e) => onDailyKmChange(Number(e.target.value))}
              className="w-full accent-[#1C3D2D]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>20 km</span>
              <span>200 km</span>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Current petrol price (per liter)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{'₦'}</span>
          <input
            type="number"
            min={500}
            max={5000}
            value={petrolPrice}
            onChange={(e) => onPetrolPriceChange(Number(e.target.value) || DEFAULT_PETROL_PRICE)}
            className="w-full py-3 pl-8 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
          />
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
          Calculate savings
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

// --- Step 4: Results ---

function StepResults({
  audience,
  results,
  onNext,
  onBack,
}: {
  audience: 'fleet' | 'individual' | '';
  results: ReturnType<typeof calculate>;
  onNext: () => void;
  onBack: () => void;
}) {
  const savings = audience === 'fleet'
    ? results.monthlySavingsFleet
    : results.monthlySavingsPerVehicle;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">Your estimated monthly savings</p>
        <h2 className="text-3xl font-bold text-[#1C3D2D]">{formatNaira(savings)}/mo</h2>
        {audience === 'fleet' && (
          <p className="text-sm text-gray-500">
            {formatNaira(results.yearlySavingsFleet)}/year for your fleet
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center">
          <p className="text-xs text-red-600 font-medium mb-1">Petrol (ICE)</p>
          <p className="text-lg font-bold text-red-700">{formatNaira(results.monthlyTotalICE)}</p>
          <p className="text-xs text-red-500">/month per vehicle</p>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-center">
          <p className="text-xs text-green-600 font-medium mb-1">EV Swap</p>
          <p className="text-lg font-bold text-green-700">{formatNaira(results.monthlyTotalEV)}</p>
          <p className="text-xs text-green-500">/month per vehicle</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-[#1C3D2D]/10 flex items-center justify-center flex-shrink-0">
            <ArrowRight size={14} className="text-[#1C3D2D]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">+{results.uptimeGainHoursMonthly}h uptime/month</p>
            <p className="text-xs text-gray-500">Less time fueling, more time earning</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-[#1C3D2D]/10 flex items-center justify-center flex-shrink-0">
            <Check size={14} className="text-[#1C3D2D]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Fixed swap cost: {'₦'}{EV_SWAP_COST}/swap</p>
            <p className="text-xs text-gray-500">No more fuel price surprises</p>
          </div>
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
          Get my full report
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

// --- Step 5: Lead Capture ---

function StepLeadCapture({
  name,
  email,
  phone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onSubmit,
  onBack,
  submitting,
  error,
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
  error: string;
}) {
  const canSubmit = name.trim() && email.trim() && phone.trim().length > 5 && !submitting;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Get your personalised report</h2>
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll send a detailed breakdown and next steps.
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
        />
        <input
          type="tel"
          placeholder="+234 Phone / WhatsApp"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
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
          className="flex-1 bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-40"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

// --- Confirmation ---

function StepConfirmation({ monthlySavings }: { monthlySavings: number }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-[#1C3D2D]/10 rounded-full flex items-center justify-center mx-auto">
        <Check size={32} className="text-[#1C3D2D]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          You&apos;re saving {formatNaira(monthlySavings)}/month
        </h2>
        <p className="text-gray-500">We&apos;ll be in touch.</p>
      </div>

      <div className="rounded-xl border-2 border-[#1C3D2D]/20 bg-[#1C3D2D]/5 p-5 text-left space-y-3">
        <p className="text-sm font-bold text-gray-900">{EVENT_NAME}</p>
        <p className="text-sm text-gray-600">
          {EVENT_DATE} &middot; {EVENT_VENUE}
        </p>
        <p className="text-sm text-gray-600">
          See live demos of SwapOS battery-swap infrastructure and meet the team.
        </p>
        <a
          href={EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#1C3D2D] text-white py-3 px-6 rounded-xl font-semibold text-center text-sm"
        >
          Register for the event
        </a>
      </div>
    </div>
  );
}
