# Cost Calculator Lead Magnet — Design Spec

**Date:** 2026-06-02
**Status:** Draft
**Route:** `/embed/calculator`

## Purpose

A standalone, embeddable ICE vs EV cost calculator designed as a lead magnet for ads targeting fleet operators and individual riders considering the EV transition. The pitch: "See how much you'd save before making the decision." Hosted in this repo, embedded via iframe on the event website.

## Audience

1. **Fleet operators** — manage multiple vehicles, think in km/day, care about fleet-wide savings
2. **Individual riders** — ride one okada/keke, think in hours/day, care about personal monthly savings

## Flow (5 Steps)

### Step 1 — Audience Selection

- Headline: "Are you a..."
- Two tap-to-select cards:
  - **Fleet Operator** — "I manage multiple vehicles"
  - **Individual Rider** — "I ride one vehicle"
- Auto-advances on tap

### Step 2 — Vehicle Type

- Headline: "What do you ride?"
- Three tap-to-select cards:
  - Okada (Motorcycle)
  - Keke (Tricycle)
  - Last-Mile Van
- Auto-advances on tap

### Step 3 — Your Numbers

**Individual rider:**
- "How many hours do you ride daily?" — slider, 2–14 hours, default 8
- "Petrol price (₦/liter)" — number input, hardcoded default ₦1,533, editable
- Note below petrol input: "Nigeria avg, May 2026 — NBS"

**Fleet operator:**
- "How many vehicles?" — number input, min 2, max 500
- "Daily distance per vehicle (km)" — slider, 20–200 km, default from vehicle preset
- "Petrol price (₦/liter)" — number input, hardcoded default ₦1,533, editable

Button: "See my savings →"

### Step 4 — Results

**Headline:** Big animated number — "You'd save ₦X every month"

**Below headline:**
- Side-by-side cost cards:
  - Left (red accent): Petrol monthly cost breakdown
  - Right (green accent): EV swap monthly cost breakdown
- Additional benefits row:
  - Extra uptime gained (hours/month)
  - Price stability: "Fixed ₦200/swap — no surprises"

**Fleet operators additionally see:** Fleet-wide yearly savings figure.

Button: "Want to go electric? →"

### Step 5 — Lead Capture + Event Invite

**Fields:**
- Name (required)
- Email (required)
- Phone (required, pre-filled +234)

**Button:** "Submit"

**On submit → confirmation state (same screen, form replaced):**
- Their savings number restated
- "We'll be in touch. In the meantime:"
- Event pitch: "Come meet OEM manufacturers, investors, and fleet stakeholders building Africa's EV future."
- [Register for the event →] button (links to event URL)

## Calculation Logic

### Hours → km conversion (individual riders)

| Vehicle | Average speed (Lagos traffic) |
|---------|-------------------------------|
| Okada | 17 km/h |
| Keke | 13 km/h |
| Last-Mile Van | 22 km/h |

`dailyKm = hours × averageSpeed`

### Cost formulas

**Constants:**
- EV swap cost: ₦200 per swap
- EV range per swap: 55 km
- EV monthly maintenance: ₦3,000
- Working days: 26/month
- CO2 per liter petrol: 2.3 kg

**ICE monthly maintenance (from vehicle preset):**
- Okada: ₦15,000
- Keke: ₦25,000
- Last-Mile Van: ₦45,000

**Fuel efficiency defaults (from vehicle preset):**
- Okada: 45 km/L
- Keke: 25 km/L
- Last-Mile Van: 10 km/L

**ICE calculation:**
```
dailyFuelLiters = dailyKm / kmPerLiter
dailyFuelCost = dailyFuelLiters × petrolPrice
monthlyFuelCost = dailyFuelCost × 26
monthlyTotalICE = monthlyFuelCost + monthlyMaintenanceICE
```

**EV calculation:**
```
dailySwaps = ceil(dailyKm / 55)
dailySwapCost = dailySwaps × 200
monthlySwapCost = dailySwapCost × 26
monthlyTotalEV = monthlySwapCost + 3000
```

**Savings:**
```
monthlySavings = monthlyTotalICE - monthlyTotalEV
yearlySavings = monthlySavings × 12
savingsPercent = round((monthlySavings / monthlyTotalICE) × 100)
```

**Uptime:**
```
iceFuelingMinutesDaily = 25
evSwapMinutesDaily = dailySwaps × 3
uptimeGainHoursMonthly = round(((25 - evSwapMinutesDaily) × 26) / 60)
```

For fleet operators: multiply savings by fleetSize.

## Design System

Match the waitlist form (`/waitlist`) exactly:

- **Layout:** White background, `max-w-md` centered, `p-6`
- **Progress:** `ProgressDots` component — elongated active dot (`w-6 bg-[#1C3D2D]`), small completed (`w-2 bg-[#1C3D2D]`), small future (`w-2 bg-gray-200`)
- **Brand color:** `#1C3D2D` for buttons, selected states, accents
- **Option cards:** `w-full text-left py-3 px-4 rounded-xl border-2`, selected: `border-[#1C3D2D] bg-[#1C3D2D]/5`
- **Navigation:** Back arrow button (left, `rounded-xl border-2 border-gray-200`) + full-width primary button (right, `bg-[#1C3D2D] text-white rounded-xl font-semibold`)
- **Transitions:** Slide animations — `slideInRight` / `slideInLeft` (0.3s ease-out, 30px offset)
- **Haptics:** `navigator.vibrate(10)` on selection
- **Inputs:** `rounded-xl border-2 border-gray-200 focus:border-[#1C3D2D] outline-none`
- **Step label:** `text-sm text-gray-500 mb-1` above heading
- **Headings:** `text-xl font-bold text-gray-900`
- **No external layout** — no Header, no MainLayout, no nav

## Lead Storage

**Endpoint:** `POST /api/embed/leads`

**Saves to S3** (same pattern as existing waitlist):
- JSON file (append)
- CSV file (append)

**Fields stored:**

| Field | Source |
|-------|--------|
| timestamp | Server-generated |
| audience_type | "fleet" or "individual" |
| vehicle_type | "okada", "keke", or "lastMile" |
| fleet_size | Number (1 for individual) |
| daily_hours | Number (individual only, null for fleet) |
| daily_km | Number (fleet only, or computed for individual) |
| petrol_price | Number |
| monthly_savings | Computed ₦ savings |
| name | User input |
| email | User input |
| phone | User input |

## Iframe Integration

### Embed code for event website

```html
<iframe
  id="swapos-calculator"
  src="https://app.swapos.com/embed/calculator"
  style="width:100%;border:none;min-height:600px;"
></iframe>
<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'swapos-resize') {
      document.getElementById('swapos-calculator').style.height = e.data.height + 'px';
    }
  });
</script>
```

### postMessage from embed page

On every step transition and after DOM renders:
```js
window.parent.postMessage({ type: 'swapos-resize', height: document.body.scrollHeight }, '*');
```

## Configuration

**Environment variable or constant:**
- `EVENT_URL` — the event registration page URL (used in the final CTA button)
- `LEADS_S3_BUCKET` — S3 bucket for lead storage (reuse existing config if available)

## Not in Scope

- Email/SMS automation after submission
- PDF report generation
- Admin dashboard for leads (view CSV directly)
- Analytics beyond stored lead record
- Offline/PWA support
- Deduplication (manual at this scale)
- A/B testing different copy

## Files to Create

1. `app/embed/calculator/page.tsx` — Multi-step form UI
2. `app/api/embed/leads/route.ts` — POST endpoint for lead storage
3. `lib/calculator-logic.ts` — Pure calculation functions (extracted, shared with `/compare`)

## Files to Modify

1. `app/compare/page.tsx` — Import calculation logic from `lib/calculator-logic.ts` instead of inline constants

## Ad Copy Angle (Reference)

For the ads driving traffic to the event site where this is embedded:

- **Fleet operators:** "Running a fleet of okadas? See exactly how much you'd save switching to battery swap — in 30 seconds. Free calculator."
- **Individual riders:** "Spending ₦X,000 on fuel every month? Find out what you'd pay with battery swapping instead."

Both link to the event page where the iframe is embedded.
