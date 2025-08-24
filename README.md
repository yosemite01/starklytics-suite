# 🚀 Starklytics Suite MVP

## 🏗️ Project Overview

**Starklytics Suite** is a next-generation analytics and bounty platform built for the **Starknet ecosystem**.  
It provides a unified space for analysts, builders, and creators to collaborate through **on-chain bounties** while offering **analytics dashboards** to track performance and activity.  

Key Features:
- 📊 **Analytics Dashboards**: Visualize Starknet contract events and activity.
- 🏆 **Bounty System**: Create, join, and participate in bounties with tokenized rewards.
- 👛 **Wallet Management**: Connect and use Starknet wallets (Argent, Braavos, Ready).
- 🪙 **Token Rewards**: Secure deposits and payouts via **AutoSwappr backend integration**.
- 👤 **User Roles & Profiles**: Switch between Analyst, Bounty Creator, and Admin.

---

## 👥 Roles

- **Analyst** → Join bounties, submit solutions, and earn rewards.  
- **Bounty Creator** → Launch bounties, fund them, and select winners.  
- **Admin** → Manage users, oversee bounties, and ensure smooth operations.  

Role switching is handled in the **Profile** page, unlocking creator/admin features.  

---

## 🏆 Bounty Lifecycle (MVP Flow)

1. **Role Validation** → Only Creators/Admins can start bounties.  
2. **Bounty Form** → Provide title, description, requirements, reward, and deadline.  
3. **Database Insert** → Bounty saved with status `pending_deposit`.  
4. **Deposit Funds** → Backend calls **AutoSwappr** to deposit/stake tokens securely.  
5. **Activation** → On successful deposit, bounty becomes `active` and visible.  
6. **Submissions** → Analysts join and submit solutions.  
7. **Winner Selection** → Creator/Admin selects a winner.  
8. **Payout** → Backend triggers AutoSwappr to swap and transfer tokens.  

🔒 **Security Note**: All token operations are strictly backend-handled.  
Frontend **never** touches private keys.  

---

## 🏛️ System Architecture

The architecture is modular, ensuring clear separation of concerns:  

### 1. **Frontend (User Interaction Layer)**
- Built with **React + Vite + TypeScript**  
- Styled using **Tailwind CSS + shadcn/ui**  
- Features:
  - Wallet connection (ArgentX, Braavos, Ready)  
  - Bounty dashboard (create/join/manage)  
  - Analytics dashboard (contract events + charts)  
  - Profile & role management  

### 2. **Backend (Application & Business Logic Layer)**
- Powered by **Supabase**:
  - Postgres (DB layer for users, bounties, submissions)  
  - Auth (role-based access control)  
  - API (edge functions for interaction)  
- **Custom API Endpoints**:
  - `/api/deposit-bounty` → Handles token deposits via AutoSwappr  
  - `/api/payout` → Automates reward distribution  

### 3. **Smart Contracts (On-Chain State Layer)**
- Written in **Cairo (Starknet 2.x)**  
- Emits events for:
  - Bounty creation  
  - Participant join  
  - Solution submission  
  - Reward distribution  
- Core functions (see below).  

### 4. **Analytics Layer**
- **Dune Analytics** integration for Starknet event tracking.  
- **Custom RPC** endpoint support for fetching recent contract events.  

---

## 🔄 Platform Workflow

1. **Sign Up / Login** via Supabase.  
2. **Set Role** → Profile page (Analyst / Creator / Admin).  
3. **Create Bounty** → Form submission triggers DB insert + AutoSwappr deposit.  
4. **Join Bounty** → Analysts can submit solutions.  
5. **Winner Selection** → Trigger payout workflow.  
6. **Analyze Events** → Use `/contract-events-eda` for contract-level analytics.  

---

## 🧑‍💻 Cairo Smart Contract Functions

MVP contracts should expose:

```cairo
create_bounty(title: felt, description: felt, reward_amount: felt, deadline: felt)
join_bounty(bounty_id: felt, participant: felt)
submit_solution(bounty_id: felt, participant: felt, solution_hash: felt)
distribute_reward(bounty_id: felt, winner: felt)
get_bounty_details(bounty_id: felt) -> (details: BountyStruct)
get_participant_status(bounty_id: felt, participant: felt) -> (status: felt)


---

## 📈 Analytics (Contract Events EDA)

* Accessible via `/contract-events-eda`.
* Enter any **Starknet contract address** to fetch and explore the **latest 100 events** from the past 14 days.
* Data sources:

  * Public Starknet RPC
  * Dune Analytics (query + visualization)

---

## ✅ Progress Status

### ✔️ Completed

* Role-based profiles + switching
* Bounty create/join flows
* AutoSwappr integration (backend-managed)
* Contract Events Explorer (EDA)
* Mobile-friendly UI
* Initial Cairo contract scaffolding

### 🔧 To-Do

* API for AutoSwappr deposit/payout (production-ready)
* Full Cairo contract deployment & frontend integration
* Advanced analytics dashboards (multi-contract, filterable)
* Email/notification system
* Security audit & production hardening

---

## 📦 Tech Stack

* **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn-ui
* **Backend**: Supabase (Postgres, Auth, API) + Custom APIs
* **Smart Contracts**: Cairo (Starknet)
* **Integrations**: AutoSwappr SDK, Dune Analytics

---

## 🛠️ Local Development

```sh
# Clone repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
pnpm i

# Run dev server
pnpm run dev
```


## 🌐 Deployment

* Deployable via **Lovable**, Vercel, or Netlify.
* Supabase project required for backend services.
* Custom domain supported.

---

## 📚 Documentation Roadmap

Planned additions:

* **User Onboarding Guide** → Step-by-step role switching & bounty creation.
* **Data Flow Documentation** → How Supabase + AutoSwappr interact with Starknet.
* **Query Examples** → Ready-to-run Dune SQL templates for analysts.
* **Architecture Diagram** → Visual system overview (frontend ↔ backend ↔ contracts).

```
