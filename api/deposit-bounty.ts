// /api/deposit-bounty.ts
// Backend API handler for AutoSwappr bounty deposit
// Place this file in your backend/api directory (e.g., Next.js, Express, or Vercel serverless)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { depositBounty } from '../src/integrations/autoswappr';

// These should be securely stored in environment variables
const BACKEND_ACCOUNT_ADDRESS = process.env.AUTOSWAPPR_ACCOUNT_ADDRESS!;
const BACKEND_PRIVATE_KEY = process.env.AUTOSWAPPR_PRIVATE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { bountyId, amount, token, creatorWallet } = req.body;
    if (!bountyId || !amount || !token || !creatorWallet) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Call AutoSwappr SDK to deposit bounty funds
    const tx = await depositBounty(
      BACKEND_ACCOUNT_ADDRESS,
      BACKEND_PRIVATE_KEY,
      String(amount),
      token,
      'STRK' // Always deposit as STRK for bounties
    );
    // You may want to update the bounty record in your DB here
    return res.status(200).json({ success: true, tx });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
