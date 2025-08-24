
# 🚀 Starklytics Suite MVP

## 🏗️ Project Overview

Starklytics Suite is a next-gen analytics and bounty platform for Starknet. It enables:
- 📊 Viewing analytics dashboards
- 🏆 Creating and joining bounties
- 👛 Managing your Starknet wallet (Ready, Argent)
- 🪙 Receiving tokens as rewards
- 👤 Editing your profile and switching roles

---

## 👥 Roles

- **Analyst**: Can join bounties, submit solutions, and earn rewards.
- **Bounty Creator**: Can create bounties, fund them, and select winners.
- **Admin**: Full access, can manage users and bounties.

Switch your role in your profile to unlock creator features!

---

## 🏆 Bounty Creation Workflow (with AutoSwappr)

1. **Role Check**: Only users with the "Bounty Creator" or "Admin" role can create bounties.
2. **Form Fill**: Enter bounty details (title, description, requirements, reward, deadline, etc).
3. **DB Insert**: Bounty is created in the database with status `pending_deposit`.
4. **Deposit Funds**: The backend calls AutoSwappr to deposit/stake the reward tokens securely.
5. **Activation**: On successful deposit, the bounty status is set to `active` and is visible to all.
6. **Payout**: When a winner is selected, AutoSwappr is used to swap and payout tokens to the winner.

**Security**: 🔒 All token operations are handled by a backend API. Never expose private keys in frontend code!

---

## 🏛️ Architecture

- **Frontend**: React + Vite + shadcn-ui + Tailwind CSS
- **Backend**: Supabase (Postgres, Auth, API), custom API endpoints for AutoSwappr
- **Smart Contracts**: Cairo contracts for bounties (see below)
- **Analytics**: Dune Analytics integration for contract event data

---

## 🔄 Work Flow

1. **Sign Up / Login**
2. **Set Role**: Go to Profile, switch to "Bounty Creator" if you want to create bounties
3. **Create Bounty**: Fill out the form, submit, and deposit funds (handled by backend)
4. **Join Bounty**: Analysts can join and submit solutions
5. **Select Winner**: Creator/admin selects winner, payout is handled automatically
6. **View Analytics**: Use the Contract Events EDA page for on-chain event analysis

---

## ✅ Work Done

- [x] Remove Stripe and simplify wallet logic
- [x] Add role switching and profile editing
- [x] Create/Join Bounty flows
- [x] Integrate AutoSwappr for deposits/payouts (backend API)
- [x] Contract Events EDA (Dune + RPC)
- [x] Mobile responsive UI
- [x] Full documentation

## 🛠️ Work Left

- [ ] Backend API for AutoSwappr (see `/api/deposit-bounty`)
- [ ] Cairo contract deployment and frontend integration
- [ ] Advanced analytics and dashboards
- [ ] Email notifications
- [ ] Production security review

---

## 📦 Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- AutoSwappr SDK

---

## 🧑‍💻 Cairo Smart Contract Integration (MVP)

The following functions should be implemented in the Cairo smart contract and callable from the frontend:

- `create_bounty(title: felt, description: felt, reward_amount: felt, deadline: felt)`
- `join_bounty(bounty_id: felt, participant: felt)`
- `submit_solution(bounty_id: felt, participant: felt, solution_hash: felt)`
- `distribute_reward(bounty_id: felt, winner: felt)`
- `get_bounty_details(bounty_id: felt) -> (details: BountyStruct)`
- `get_participant_status(bounty_id: felt, participant: felt) -> (status: felt)`

---

## 📈 Contract Events EDA Feature

Analyze any Starknet mainnet contract by entering its address on the `/contract-events-eda` page. The app fetches and displays the latest 100 events from the last two weeks for that contract, using a public Starknet RPC endpoint or Dune Analytics.

---

## 🛠️ Local Development

Clone, install, and run:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
pnpm i
pnpm run dev
```

---

## 🌐 Deployment & Domains

Deploy via [Lovable](https://lovable.dev/projects/6bdb15f6-ff1e-4786-97d1-5d200f134246) or your preferred platform. Custom domains supported!
