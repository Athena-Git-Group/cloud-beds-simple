# Cloudbeds PMS — UI Simulation

A **front-end simulation of the Cloudbeds PMS** (the hotel/hostel *myfrontdesk*
product), built as a **competitive / design-analysis reference**. The interface,
terminology, colour system, and interaction patterns were reconstructed from
Cloudbeds' **public** material — their help center, product pages, and two
open-source repositories. There is **no decompilation, no scraped assets, no
account access, and no affiliation** with Cloudbeds. It is a study of how the
product is designed, not a product.

Ships in **Traditional Chinese (繁體中文, default)** and **English**, toggled from
the top bar.

---

## Quick start

**Prerequisites:** [Node.js](https://nodejs.org) **18 or newer** (ships with `npm`).
Check with `node -v`.

```bash
# 1. install dependencies (first time only)
npm install

# 2. start the dev server
npm run dev
```

Then open **http://localhost:5174** in your browser. The dev server hot-reloads
as you edit files.

> Prefer `pnpm` or `yarn`? `pnpm install && pnpm dev` or `yarn && yarn dev` work too.

### Other commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server at http://localhost:5174 (hot reload) |
| `npm run build` | Type-check and build a production bundle into `dist/` |
| `npm run preview` | Serve the built `dist/` locally to preview the production build |
| `npm run typecheck` | Run the TypeScript compiler with no output (CI-friendly) |

### First look

- The app opens on the **Dashboard**. Use the **left sidebar** to move between
  modules, and the **繁中 / EN** switch in the top-right to change language.
- **Calendar** and **Housekeeping**: click a **room** to open its drawer, or a
  **reservation** block for its panel.
- **Mobile Housekeeping** (`行動版房務`): a phone-framed rebuild of the official
  Cloudbeds App — tap through the bottom tabs, open a room, take a payment.

---

## Tech stack

**Vite · React 18 · TypeScript · Tailwind CSS · React Router.**

All data is in-memory mock state (`src/domain/mock.ts`), mutated through a small
React context store (`src/domain/store.tsx`) — so check-in/out, housekeeping
updates, assignments, and payments are **live** and shared across every screen.
No backend, no network calls.

---

## What's built

Ten modules are fully implemented; the information architecture mirrors the real
Cloudbeds Main Menu.

### Desktop

| Module | What it reproduces |
|--------|--------------------|
| **Dashboard** | Dual-number KPI cards (total + blue "remaining"), Booked overview, an Activity feed where each item opens the reservation drawer |
| **Calendar (NEW)** | Accommodation-grouped grid, reservation blocks, today/weekend shading, spotlight search that **dims non-matches instead of hiding them**, range selector, red `*` on dirty rooms |
| **Reservations** | Tabbed list (All / Arrivals / Departures / In-house) opening the reservation panel |
| **Housekeeping** | Inspection table with the three-state condition colour language, Front desk status incl. **Turnover / Stayover**, assigned-to, Do-Not-Disturb, editable comments, a **filter drawer**, and **bulk assign / bulk condition** |
| **Rates & Availability** | Rate grid (room type × date): availability row (sold-out shows **Closed**) + nightly rate row with weekend uplift — fields from the v2 API (`rate_plans` · `detailed_rates` · stop-sell) |
| **Payments** | Transactions table (deposit/balance) with the v2 API status enum (successful / pending / scheduled / failed) and methods (card / cash), plus collected / pending / failed summary tiles |
| **Reporting** | KPI tiles (Occupancy / ADR / RevPAR / room nights / revenue / outstanding), a 14-day occupancy trend chart, and reservations-by-source bars |
| **Groups** | Group-booking list (`market_segmentation`/`events` fields): name, code, status, stay dates, room block, and pickup progress |
| **Settings** | Section sub-nav; Property / Policies / Amenities show real `organization`/`property` fields (code, currency, time zone, check-in/out times, late-checkout fee, amenities) |

### Signature drawers / panels

- **Reservation panel** — right-side drawer with a **context-sensitive primary
  action** (Check-in / Check-out / Add note) + scope selector, folio balance, and
  a guest message thread.
- **Unit detail panel** — click a room to edit condition / room status /
  assigned-to / comments in place while the grid stays visible.

### Mobile app (phone frame)

A rebuild of the official Cloudbeds App with bottom-tab navigation and a push
stack: **Dashboard** (date + occupancy ring, Arrivals/Departures/In-house
drill-downs) · **Reservation list** (check-in/out + take-payment) · **Search** ·
**Take payment** · **Housekeeping** (filter card, list, room detail, action
sheets) · **More**.

> **Not implemented** (shown as placeholders): **Profiles** and **Tickets** — the
> public v2 API does not cover them.

---

## Design tokens (from Cloudbeds' own public code)

Palette and font come from Cloudbeds' public React Native example
([cloudbeds/mobile-example](https://github.com/cloudbeds/mobile-example),
`src/Theme/`), not guessed from screenshots:

- **lightning** `#3366FF` (primary / blue) · **mint** `#32C0A0` (success / teal) ·
  **solar** `#FBC02D` (warning) · **dusk** `#F3565D` (danger / coral) ·
  **fog** (neutral)
- Font: **Poppins**
- Colour language: 🟢 Inspected (mint) · 🔵 Clean (lightning) · 🔴 Dirty (dusk) ·
  🟠 Out of service (solar) — consistent across the table, calendar, and panels.

Tokens live in `tailwind.config.js`; the semantic map (status → colour) is in
`src/domain/semantics.ts`, kept separate from labels so colours never couple to
text.

## Languages (i18n)

A lightweight provider in `src/i18n/index.tsx` localizes all UI strings, enum
labels, room-type names, and dates. The chosen language is remembered in
`localStorage`. Colour tokens and labels are decoupled, so adding a third language
is just another dictionary.

---

## Project structure

```
src/
  domain/        # types, mock data, the context store, colour semantics
  components/
    shell/       # sidebar, top bar, app shell, nav config
    ui/          # icons, drawer, primitives (buttons, cards, chips)
    panels/      # reservation panel, unit detail panel
  pages/         # one file per module (Dashboard, Calendar, Rates, …) + MobilePage
  i18n/          # zh-TW / en dictionaries + t() + date formatting
  lib/           # cn(), money/date helpers
```

---

## Sources

Reconstructed entirely from public material:

- **Cloudbeds Help Center** (`myfrontdesk.cloudbeds.com`) — layouts and screenshots
  for the New Calendar, Housekeeping / Inspection table, Unit detail panel,
  Dashboard, Reservation panel, and the PMS site map.
- **[cloudbeds/mobile-example](https://github.com/cloudbeds/mobile-example)**
  (official React Native app) — exact palette, Poppins font, and the real
  data-model enums (`RoomConditions`, `FrontdeskStatus`, `ReservationStatus`).
- **[cloudbeds/cloudbeds-api-python](https://github.com/cloudbeds/cloudbeds-api-python)**
  (official v2 API client) — API surface and field names for Rates
  (`rate_plans`/`detailed_rates`), Payments, Groups/Segments, Events, and Property.

## Disclaimer

This project is an independent, non-commercial **design study for competitive
analysis**. It is **not affiliated with, endorsed by, or connected to Cloudbeds,
Inc.** "Cloudbeds" and related marks belong to their owner. All data shown is
fictional mock data.
