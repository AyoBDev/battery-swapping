import { describe, it, expect } from 'vitest';
import { determineTier } from './tier-logic';

describe('determineTier', () => {
  it('returns Tier 1 for large operators with custom software', () => {
    const result = determineTier('Custom software', '1000+');
    expect(result.tier).toBe(1);
    expect(result.label).toBe('Founding Partner');
  });

  it('returns Tier 1 for large operators with spreadsheets', () => {
    const result = determineTier('Spreadsheet', '200-1000');
    expect(result.tier).toBe(1);
    expect(result.label).toBe('Founding Partner');
  });

  it('returns Tier 2 for large operators with informal tools', () => {
    const result = determineTier('WhatsApp', '1000+');
    expect(result.tier).toBe(2);
    expect(result.label).toBe('Early Access');
  });

  it('returns Tier 2 for mid-size operators regardless of Q1', () => {
    const result = determineTier('Paper-based', '50-200');
    expect(result.tier).toBe(2);
    expect(result.label).toBe('Early Access');
  });

  it('returns Tier 3 for small operators', () => {
    const result = determineTier('Spreadsheet', 'Under 50');
    expect(result.tier).toBe(3);
    expect(result.label).toBe('Waitlist');
  });

  it('returns Tier 3 for not yet operational', () => {
    const result = determineTier('We don\'t track', 'Not yet operational');
    expect(result.tier).toBe(3);
    expect(result.label).toBe('Waitlist');
  });

  it('returns correct CTA and message for each tier', () => {
    const t1 = determineTier('Custom software', '200-1000');
    expect(t1.cta).toBe('Join as a Founding Partner');

    const t2 = determineTier('WhatsApp', '50-200');
    expect(t2.cta).toBe('Join Early Access');

    const t3 = determineTier('Paper-based', 'Under 50');
    expect(t3.cta).toBe('Join the waitlist');
  });
});
