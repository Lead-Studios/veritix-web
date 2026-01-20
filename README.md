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
