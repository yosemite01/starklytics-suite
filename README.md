
# 🚀 Starklytics Suite MVP

[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
![Status](https://img.shields.io/badge/status-MVP-blue)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Supabase%20%7C%20Cairo-purple)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
![Starknet](https://img.shields.io/badge/built%20for-Starknet-black?logo=starknet)

Next-gen **analytics & bounty platform** built for **Starknet** ⚡  

---

## 🏗️ Project Overview

Starklytics Suite empowers the Starknet ecosystem with analytics dashboards and a seamless bounty system. Core features include:

- 📊 Viewing rich **analytics dashboards**
- 🏆 **Creating and joining bounties**
- 👛 Managing your Starknet wallet (Ready, Argent)
- 🪙 **Receiving token rewards**
- 👤 Profile management & **role switching**

---

## 👥 Roles

- **Analyst**: Join bounties, submit solutions, and earn rewards  
- **Bounty Creator**: Create and fund bounties, select winners  
- **Admin**: Manage everything (users + bounties)  

👉 Switch your role in your **Profile** to unlock **Creator** features!

---

## 🏆 Bounty Creation Workflow (with AutoSwappr)

1. **Role Check** → Only *Bounty Creators* or *Admins* can create bounties  
2. **Form Fill** → Enter details: title, description, requirements, reward, deadline, etc.  
3. **DB Insert** → Bounty stored with status `pending_deposit`  
4. **Deposit Funds** → Backend calls **AutoSwappr** to securely deposit/stake tokens  
5. **Activation** → On success, bounty status = `active` (visible to all)  
6. **Payout** → Winners get paid via AutoSwappr swap + payout flow  

🔒 **Security Note**: All token ops run server-side. No private keys in frontend!

---

## 🏛️ Architecture

- **Frontend**: React + Vite + shadcn-ui + Tailwind CSS  
- **Backend**: Supabase (Postgres, Auth, API) + custom AutoSwappr endpoints  
- **Smart Contracts**: Cairo-based bounty logic  
- **Analytics**: Dune Analytics + Starknet RPC  

---

## 🔄 Typical Workflow

1. **Sign Up / Login**  
2. **Set Role** → Switch to "Bounty Creator" if needed  
3. **Create Bounty** → Fill form, deposit handled by backend  
4. **Join Bounty** → Analysts submit solutions  
5. **Select Winner** → Creator/Admin finalizes + payout auto-handled  
6. **View Analytics** → Check the Contract Events EDA page  

---

## ✅ Work Done

- [x] Removed Stripe, simplified wallet logic  
- [x] Role switching + profile editing  
- [x] Full create/join bounty flows  
- [x] AutoSwappr integration for deposits & payouts (backend API)  
- [x] Contract Events EDA (Dune + RPC)  
- [x] Responsive mobile UI  
- [x] Full documentation  

---

## 🛠️ Work Left

- [ ] Backend API completion for AutoSwappr (`/api/deposit-bounty`)  
- [ ] Cairo contract deployment + frontend integration  
- [ ] Advanced analytics dashboards  
- [ ] Email notifications  
- [ ] Production-grade security review  

---

## 📦 Tech Stack

- ⚡ Vite  
- 🟦 TypeScript  
- ⚛️ React  
- 🎨 shadcn-ui + Tailwind CSS  
- 🛠️ Supabase  
- 🔄 AutoSwappr SDK  

---

## 🧑‍💻 Cairo Smart Contract Integration (MVP)

Functions to be exposed:

- `create_bounty(title: felt, description: felt, reward_amount: felt, deadline: felt)`  
- `join_bounty(bounty_id: felt, participant: felt)`  
- `submit_solution(bounty_id: felt, participant: felt, solution_hash: felt)`  
- `distribute_reward(bounty_id: felt, winner: felt)`  
- `get_bounty_details(bounty_id: felt) -> (details: BountyStruct)`  
- `get_participant_status(bounty_id: felt, participant: felt) -> (status: felt)`  

---

## 📈 Contract Events EDA

Analyze any **Starknet mainnet contract** on the `/contract-events-eda` page.  

- Fetches last **100 events** from past **2 weeks**  
- Uses **public Starknet RPC** or **Dune Analytics**  

---

## 🛠️ Local Development

Clone, install, and run locally:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
pnpm i
pnpm run dev
```

---

## 🌐 Deployment & Domains

Deploy via [Vercel]([https://lovable.dev/projects/6bdb15f6-ff1e-4786-97d1-5d200f134246](https://starklytics-suite.vercel.app/)) or any preferred platform.  
✅ Supports **custom domains** out-of-the-box.  

---

## 🤝 Contributing

We welcome contributions! 🚀  
- Fork & clone  
- Create a feature branch  
- Submit a PR  

---

## 📜 License

MIT License © 2025 — Built with ❤️ for the Starknet community.
