'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';

const Q1_OPTIONS = [
  'Spreadsheet',
  'WhatsApp',
  'Custom software',
  'Paper-based',
  "We don't track",
  'Other',
];

const Q2_OPTIONS = [
  'Under 50',
  '50-200',
  '200-1000',
  '1000+',
  'Not yet operational',
];

const Q3_PROMPTS = [
  'Battery theft/loss',
  'Rider no-shows',
  'Station downtime',
  'Cash reconciliation',
];

type TierResult = {
  tier: number;
  label: string;
  message: string;
  cta: string;
  count: number;
};

export default function WaitlistPage() {
  const [step, setStep] = useState(0);
  const [q1, setQ1] = useState('');
  const [q1Other, setQ1Other] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [counter, setCounter] = useState<number | null>(null);
  const [tierResult, setTierResult] = useState<TierResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCounter();
    const interval = setInterval(fetchCounter, 30_000);
    return () => clearInterval(interval);
  }, []);

  async function fetchCounter() {
    try {
      const res = await fetch('/api/waitlist');
      if (res.ok) {
        const data = await res.json();
        setCounter(data.count);
      }
    } catch {
      // keep last-known value
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    const payload = {
      q1: q1 === 'Other' ? q1Other : q1,
      q2,
      q3,
      name,
      email,
      phone,
      company,
    };

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setError('Too many submissions. Please try again later.');
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      const data: TierResult = await res.json();
      setTierResult(data);
      setCounter(data.count);
      setStep(5);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {step === 0 && <Landing counter={counter} onStart={() => setStep(1)} />}
        {step === 1 && (
          <Q1Screen
            value={q1}
            otherValue={q1Other}
            onChange={setQ1}
            onOtherChange={setQ1Other}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Q2Screen value={q2} onChange={setQ2} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <Q3Screen value={q3} onChange={setQ3} onNext={() => setStep(4)} />
        )}
        {step === 4 && (
          <ContactScreen
            name={name}
            email={email}
            phone={phone}
            company={company}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onCompanyChange={setCompany}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
            tierResult={tierResult}
          />
        )}
        {step === 5 && tierResult && <Confirmation tierResult={tierResult} />}
      </div>
    </div>
  );
}

function Landing({
  counter,
  onStart,
}: {
  counter: number | null;
  onStart: () => void;
}) {
  return (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-[#1C3D2D] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">SwapOS</span>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">
          Shape the future of battery swapping
        </h1>
        {counter !== null && counter > 0 && (
          <p className="text-sm text-gray-500">
            {counter} operator{counter !== 1 ? 's' : ''} evaluating SwapOS
          </p>
        )}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
      >
        Take the 60-second assessment
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

function Q1Screen({
  value,
  otherValue,
  onChange,
  onOtherChange,
  onNext,
}: {
  value: string;
  otherValue: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
  onNext: () => void;
}) {
  const canProceed = value && (value !== 'Other' || otherValue.trim());

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Question 1 of 3</p>
        <h2 className="text-xl font-bold text-gray-900">
          How do you manage battery inventory today?
        </h2>
      </div>

      <div className="space-y-3">
        {Q1_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-colors ${
              value === option
                ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
                : 'border-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {value === 'Other' && (
        <input
          type="text"
          placeholder="Please specify..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
        />
      )}

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

function Q2Screen({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Question 2 of 3</p>
        <h2 className="text-xl font-bold text-gray-900">
          How many battery swaps does your operation handle per week?
        </h2>
      </div>

      <div className="space-y-3">
        {Q2_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-colors ${
              value === option
                ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
                : 'border-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        className="w-full bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

function Q3Screen({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Question 3 of 3</p>
        <h2 className="text-xl font-bold text-gray-900">
          What&apos;s your biggest operational headache right now?
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {Q3_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onChange(prompt)}
            className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
              value === prompt
                ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
                : 'border-gray-200'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Or type your own..."
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= 140) onChange(e.target.value);
        }}
        rows={3}
        className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none resize-none"
      />
      <p className="text-xs text-gray-400 text-right">{value.length}/140</p>

      <button
        onClick={onNext}
        className="w-full bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

function ContactScreen({
  name,
  email,
  phone,
  company,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onCompanyChange,
  onSubmit,
  submitting,
  error,
  tierResult,
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onCompanyChange: (v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
  tierResult: TierResult | null;
}) {
  const canSubmit = name.trim() && email.trim() && phone.trim() && !submitting;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Almost there — tell us about you
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll use this to follow up with next steps.
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
          placeholder="Phone / WhatsApp number"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
        />
        <input
          type="text"
          placeholder="Company name (optional)"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full bg-[#1C3D2D] text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-40"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}

function Confirmation({ tierResult }: { tierResult: TierResult }) {
  const nextSteps: Record<number, string> = {
    1: "We'll reach out within 48 hours to schedule your co-design session.",
    2: "We'll share updates via WhatsApp as we build. You'll be first to try it.",
    3: "We'll notify you when SwapOS launches. Follow along on WhatsApp.",
  };

  const whatsappLink =
    'https://wa.me/YOURNUMBER?text=Hi%20SwapOS%2C%20I%20signed%20up%20at%20the%20event';

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-[#1C3D2D]/10 rounded-full flex items-center justify-center mx-auto">
        <Check size={32} className="text-[#1C3D2D]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">You&apos;re in!</h2>
        <p className="text-sm text-gray-500">{tierResult.label}</p>
      </div>

      <p className="text-gray-700">{tierResult.message}</p>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">
          What happens next:
        </p>
        <p className="text-sm text-gray-600">
          {nextSteps[tierResult.tier]}
        </p>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 inline-flex"
      >
        <MessageCircle size={20} />
        Join us on WhatsApp
      </a>
    </div>
  );
}
