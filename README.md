# VeriTix Web (Frontend)

**VeriTix Web** is the **frontend application** for **VeriTix**, a blockchain-powered ticketing platform built on the **Stellar ecosystem**.

This repository contains the **user-facing web application** used by:
- Event attendees (ticket purchase, ownership, verification)
- Event organizers (event setup, ticket rules, analytics)
- Gate operators (ticket validation at entry)

> ⚠️ **Important:**  
> This repo is **frontend-only**. Blockchain logic, smart contracts, and backend services live in separate repositories.

---

## 🔍 What Is VeriTix?

VeriTix is a **decentralized ticketing system** designed to eliminate fraud, prevent scalping, and give organizers full control over how tickets are issued, transferred, and verified.

Unlike traditional ticketing platforms, VeriTix anchors ticket ownership and verification data on the **Stellar blockchain**, ensuring transparency and tamper resistance while keeping fees low.

---

## 🧭 What This Repo Contains (Scope)

### ✅ Frontend Responsibilities
- Event discovery & ticket purchase UI
- Wallet connection and user authentication flows
- Ticket display (QR / on-chain reference)
- Ticket verification interface (for event entry)
- Organizer dashboards (events, tickets, rules)
- Communication with the backend APIs
- UX states for blockchain-related actions (pending, confirmed, failed)

### ❌ What This Repo Does NOT Contain
- Stellar smart contracts
- Backend APIs or database logic
- Indexers or off-chain workers
- Payment rails or custodial logic

These live in **separate backend / protocol repositories**.

---

## 🏗️ Architecture Overview

```text
User Browser
     ↓
VeriTix Web (Next.js / TypeScript)
     ↓
Backend API (Auth, Tickets, Events)
     ↓
Stellar Network (Anchoring & Verification)
```

---

## 🗺️ Route Map

### Public Routes (`src/app/(public)/`)

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, CTA |
| `/login` | User login form |
| `/sign-up` | New account registration |
| `/forgot-password` | Request a password-reset link |
| `/reset-password` | Set a new password via reset link |
| `/events` | Public event discovery with search & filters |
| `/events/[eventId]` | Individual event detail & ticket purchase |
| `/verify` | Public ticket verification (gate operators) |
| `/contact` | Contact / support form |

### Protected Routes (`src/app/(protected)/`)

> Require an authenticated session.

| Route | Description |
|---|---|
| `/dashboard` | Organizer overview — stats, charts, recent activity |
| `/events/create` | Multi-step event creation wizard |
| `/events/create/my-event` | Draft / saved event editor |
| `/events/manage` | List and manage all organizer events |
| `/events/manage/[eventId]` | Edit or delete a specific event |
| `/tickets` | Attendee ticket wallet |
| `/verify` | Authenticated ticket verification scanner |

---

## 🧩 Frontend Module Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (public)/               # Unauthenticated routes
│   └── (protected)/            # Authenticated routes
│
├── components/
│   ├── auth/                   # Auth forms & layout
│   │   ├── login-form.tsx      # Login — calls /api/auth/login
│   │   ├── signup-form.tsx     # Registration with password strength guide
│   │   ├── reset-password-form.tsx  # Password reset with strength guide
│   │   ├── forgot-password-form.tsx # Forgot-password email request
│   │   ├── PasswordStrengthGuide.tsx # Reusable password requirement checklist
│   │   ├── auth-layout.tsx     # Shared auth page wrapper
│   │   └── back-button.tsx     # Navigation helper
│   │
│   ├── events/                 # Event-related UI
│   │   ├── EventCard.tsx       # Card shown in event listings
│   │   ├── CategoryFilter.tsx  # Active-filter chips
│   │   ├── FilterInput.tsx     # Search / location / date inputs
│   │   ├── SearchFilters.tsx   # Combined filter bar
│   │   ├── WalletConnectModal.tsx  # Wallet connection dialog
│   │   ├── create/             # Multi-step event creation sub-forms
│   │   │   ├── BasicInformation.tsx
│   │   │   ├── DateAndTime.tsx
│   │   │   ├── Location.tsx
│   │   │   ├── TicketInformation.tsx
│   │   │   ├── BlockchainSetting.tsx
│   │   │   └── EventSummary.tsx
│   │   └── ui/                 # Shared event-form primitives
│   │       ├── ImageUpload.tsx
│   │       ├── RadioButton.tsx
│   │       └── Toggle.tsx
│   │
│   ├── dashboard/              # Organizer dashboard widgets
│   │   ├── Card.tsx
│   │   ├── CTAButton.tsx
│   │   ├── HeroContent.tsx
│   │   ├── ScrollColumn.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── EventImage.tsx
│   │   └── charts/
│   │       ├── PerformanceChart.tsx
│   │       └── RevenueChart.tsx
│   │
│   └── ui/                     # Generic design-system primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── Badge.tsx
│       ├── Loader.tsx
│       └── Modal.tsx
│
├── features/                   # Feature-level page shells (dashboard tabs)
│   ├── auth/
│   ├── events/
│   ├── tickets/
│   ├── verification/
│   ├── analyics/
│   └── profile/
│
├── lib/                        # Utilities & API helpers
│   ├── auth.ts                 # loginUser() — calls real auth endpoint
│   ├── utils.ts / cn.ts        # Tailwind class helpers
│   ├── ticketValidation.ts     # Client-side ticket rule helpers
│   ├── ticketVerification.ts   # Verification flow helpers
│   └── ...                     # Other domain helpers
│
├── hooks/
│   └── usePasswordToggle.ts    # Show/hide password toggle hook
│
├── mocks/
│   ├── events.ts               # Mock event data for development
│   └── landing.ts              # Mock landing-page data
│
└── types/
    ├── event.ts                # Event-related TypeScript types
    └── landing.ts              # Landing-page types
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.example.com
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend REST API |

---

## 🧪 Testing

Integration and E2E tests live in `src/__tests__/` and cover:

- **Event discovery** — search, category filters, tab switching
- **Event creation** — organizer multi-step form submission
- **Ticket verification** — valid, invalid, and already-used ticket flows

Run tests with:

```bash
npm test
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Forms | react-hook-form + Zod |
| Animations | Framer Motion |
| Notifications | react-toastify |
| Charts | Recharts |
| Icons | lucide-react, react-icons |
