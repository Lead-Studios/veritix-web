# VeriTix Web (Frontend)

**VeriTix Web** is the **frontend application** for **VeriTix**, a blockchain-powered ticketing platform built on the **Stellar ecosystem**.

[![CI](https://github.com/Lead-Studios/veritix-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Lead-Studios/veritix-web/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLead-Studios%2Fveritix-web)

---

## What Is VeriTix?

VeriTix is a **decentralized ticketing system** that eliminates fraud, prevents scalping, and gives organizers full control over ticket issuance, transfer, and verification. Ticket ownership and verification data are anchored on the **Stellar blockchain** for transparency and tamper-resistance.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Git | any recent |

You will also need a running instance of the **VeriTix backend API** (NestJS). Set `NEXT_PUBLIC_API_BASE_URL` to point at it.

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Lead-Studios/veritix-web.git
cd veritix-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values. See the [Environment Variables](#environment-variables) table below.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | Base URL of the VeriTix backend REST API (e.g. `http://localhost:4000/api`) |
| `NEXT_PUBLIC_WS_URL` | No | WebSocket server URL for real-time features (e.g. `ws://localhost:4000`) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | **Yes** | Stellar network to use: `testnet` or `mainnet` |
| `NEXT_PUBLIC_HORIZON_URL` | No | Custom Horizon server URL; leave blank to use the SDK default |
| `STELLAR_PLATFORM_PUBLIC_KEY` | No | Platform escrow account public key (server-only) |
| `STELLAR_PLATFORM_SECRET_KEY` | No | Platform escrow account secret key — **never** prefix with `NEXT_PUBLIC_` |
| `AUTH_SECRET` | **Yes** | Long random string used to sign server-side session tokens |
| `NEXTAUTH_URL` | **Yes** | Canonical URL of this app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | **Yes** | Long random string for NextAuth (can equal `AUTH_SECRET`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NEXT_PUBLIC_ENABLE_WALLET_CONNECT` | No | Set `true` to enable the wallet-connect UI flow |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | No | Set `true` to show Google sign-in button |
| `NEXT_PUBLIC_WALLET_AUTH_ENABLED` | No | Set `true` to show wallet sign-in button |
| `NEXT_PUBLIC_ANALYTICS_TOKEN` | No | Vercel Analytics / PostHog / Mixpanel token |
| `ANALYZE` | No | Set `true` and run `npm run build` to open the bundle analyser |

> **Next.js convention:** variables prefixed `NEXT_PUBLIC_` are embedded in the browser bundle. Variables without that prefix are server-only and never sent to the client.

---

## Running Tests

### Unit & integration tests (Vitest + React Testing Library)

```bash
npm test
```

Tests live in `src/__tests__/` and follow the `*.test.tsx` / `*.test.ts` naming convention.

### End-to-end tests (Playwright)

```bash
npm run test:e2e
```

E2E specs live in `e2e/`.

---

## Project Structure

```
src/
├── app/             # Next.js App Router pages and layouts
│   ├── (public)/    # Unauthenticated routes (events, login, register…)
│   └── (protected)/ # Authenticated routes (dashboard, tickets, verify…)
├── components/      # Shared UI components
├── features/        # Feature-scoped components (events, tickets, orders…)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API helpers
└── __tests__/       # Test files
```

---

## Contributing

### Branch naming

```
feat/FE-<issue>-short-description   # new feature
fix/FE-<issue>-short-description    # bug fix
chore/FE-<issue>-short-description  # maintenance / tooling
```

### Pull request checklist

- [ ] Branch is up-to-date with `main`
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] PR description references the issue (`Closes #<issue>`)

### Label meanings

| Label | Meaning |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Tooling, docs, refactor |
| `wip` | Work in progress — do not merge |
| `needs-review` | Ready for review |

---

## Tech Stack

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
| Tests (unit) | Vitest + React Testing Library |
| Tests (e2e) | Playwright |
