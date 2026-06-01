# SwapOS Platform Module Expansion

## Context

SwapOS is an open-platform coordination layer for battery swapping operations in Lagos, Nigeria. A competitor's vertically-integrated architecture (covering Data Dashboard, Scenario Services, Business Operations, Business Applications, and Infrastructure layers) revealed gaps in SwapOS's dashboard coverage. An industry article on integrated battery swapping in SEA/Africa reinforced three themes: thermal/SOH management at hardware level, energy buffering, and BaaS economics.

## Problem

SwapOS had strong monitoring (fleet, stations, batteries, energy) but lacked:
- Hardware-level cabinet visibility (slot temperatures, charge rates, firmware)
- Revenue/billing economics (BaaS model proof, operator payouts)
- Multi-tenant operator management (franchise/fleet partner views)

These gaps matter for demos to investors, hardware OEMs, and potential franchise operators.

## Design Decisions

### What we built

1. **Cabinet Control (`/cabinets`)** — Slot-level real-time view showing cell temperature, charge rate, voltage, and battery ID per slot. Thermal throttling alerts when Lagos ambient heat (34-37°C) triggers active cooling. OTA firmware status per cabinet. This maps to the article's "hardware-level climate control" + "SaaS-driven charging algorithms" differentiator.

2. **Revenue & Billing (`/revenue`)** — BaaS economics: pay-per-swap vs subscription breakdown, weekly revenue vs energy cost visualization, operator revenue splits with configurable percentages, subscription tier performance (Daily/Weekly/Monthly BaaS), ARPU and churn metrics. Proves the business model the article advocates.

3. **Operator Management (`/operators`)** — Multi-tenant view: fleet operators, franchises, and independents. Per-operator metrics (stations, riders, batteries, SLA compliance, growth). Onboarding progress for new operators. Comparison table. This is SwapOS's open-platform moat vs vertically-integrated lock-in.

### What we excluded

- Vehicle management (not differentiated for demo)
- Insurance configuration (back-office feature)
- Coupons/Promotions/Referrals (growth feature, not platform story)
- OTA update execution flow (shown as status only)
- Cabinet config wizards (admin feature, not demo-worthy)

### Navigation change

Replaced Maintenance nav item with Cabinets, Revenue, and Operators (all marked NEW). Maintenance page still accessible at `/maintenance` but removed from primary nav to prevent overflow.

## Architecture

All three pages follow existing patterns:
- `'use client'` pages with MainLayout wrapper
- KPICard grid at top for key metrics
- DemoTip component for presenter guidance
- Mock data inline (consistent with existing pages)
- Lucide icons, Tailwind styling, brand color `#1C3D2D`

No new dependencies, no API routes, no shared state changes.

## Demo Script Integration

| Page | Demo Audience | Key Talking Point |
|------|--------------|-------------------|
| Cabinets | Hardware OEMs, battery manufacturers | "We monitor every cell. When Lagos heat hits 37°C, we throttle charge rates automatically to extend lifespan 20-30%." |
| Revenue | Investors, fleet operators | "83% gross margin per swap. ₦85 energy cost, ₦500 revenue. Subscriptions convert capex to predictable opex." |
| Operators | Franchise prospects, enterprise customers | "Multi-tenant from day one. Each operator sees their own data. The platform grows without us deploying engineers." |
