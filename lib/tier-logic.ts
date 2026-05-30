export type TierResult = {
  tier: 1 | 2 | 3;
  label: string;
  message: string;
  cta: string;
};

const TIER_1_Q1 = ['Custom software', 'Spreadsheet'];
const TIER_1_Q2 = ['200-1000', '1000+'];
const TIER_2_Q2_DIRECT = ['50-200'];
const TIER_3_Q2 = ['Under 50', 'Not yet operational'];

export function determineTier(q1: string, q2: string): TierResult {
  if (TIER_1_Q2.includes(q2) && TIER_1_Q1.includes(q1)) {
    return {
      tier: 1,
      label: 'Founding Partner',
      message:
        "You're exactly who SwapOS is built for. Your operation is complex enough to benefit from interoperability.",
      cta: 'Join as a Founding Partner',
    };
  }

  if (TIER_2_Q2_DIRECT.includes(q2) || TIER_1_Q2.includes(q2)) {
    return {
      tier: 2,
      label: 'Early Access',
      message:
        "You're at the scale where proper management software pays for itself.",
      cta: 'Join Early Access',
    };
  }

  return {
    tier: 3,
    label: 'Waitlist',
    message: "We'll notify you when SwapOS launches in your area.",
    cta: 'Join the waitlist',
  };
}
