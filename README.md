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


---

## 🚀 Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values. The table below describes each variable:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of the VeriTix backend API (e.g. `http://localhost:4000/api`) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Yes | Stellar network: `testnet` or `mainnet` |
| `NEXT_PUBLIC_HORIZON_URL` | No | Custom Horizon server URL; leave blank to use the SDK default |
| `AUTH_SECRET` | Yes | Long random string used to sign server-side session tokens |
| `NEXT_PUBLIC_ENABLE_WALLET_CONNECT` | No | Set to `true` to enable the wallet-connect UI flow |

> **Next.js convention:** variables prefixed with `NEXT_PUBLIC_` are embedded in the browser bundle and visible to end users. Variables without that prefix are server-side only and never sent to the client.

### 3. Run the dev server

```bash
npm run dev
```

### 4. Run tests

```bash
npm test
```

---

## 🧪 Testing

Tests live in `src/__tests__/` and follow the `*.test.tsx` naming convention. The project uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

Place new test files alongside the code they test or inside `src/__tests__/`. Run the full suite with:

```bash
npm test
```
