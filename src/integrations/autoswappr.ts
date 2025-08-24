// AutoSwappr integration for bounty deposits and payouts
// NOTE: Never expose private keys in frontend code. This is for backend/server-side use only.

import { AutoSwappr, TOKEN_ADDRESSES } from 'autoswappr-sdk';

const AUTOSWAPPR_CONTRACT_ADDRESS = '0x05582ad635c43b4c14dbfa53cbde0df32266164a0d1b36e5b510e5b34aeb364b';
const RPC_URL = 'https://starknet-mainnet.public.blastapi.io';

// Example: Initialize with environment variables (for backend use)
export function getAutoSwappr(accountAddress: string, privateKey: string) {
  return new AutoSwappr({
    contractAddress: AUTOSWAPPR_CONTRACT_ADDRESS,
    rpcUrl: RPC_URL,
    accountAddress,
    privateKey,
  });
}

// Example: Deposit (stake) tokens when creating a bounty
export async function depositBounty(
  accountAddress: string,
  privateKey: string,
  amount: string,
  fromToken: keyof typeof TOKEN_ADDRESSES = 'USDC',
  toToken: keyof typeof TOKEN_ADDRESSES = 'STRK'
) {
  const autoswappr = getAutoSwappr(accountAddress, privateKey);
  return autoswappr.executeSwap(
    TOKEN_ADDRESSES[fromToken],
    TOKEN_ADDRESSES[toToken],
    { amount }
  );
}

// Example: Payout winner using AutoSwappr
export async function payoutWinner(
  accountAddress: string,
  privateKey: string,
  amount: string,
  fromToken: keyof typeof TOKEN_ADDRESSES = 'STRK',
  toToken: keyof typeof TOKEN_ADDRESSES = 'USDC'
) {
  const autoswappr = getAutoSwappr(accountAddress, privateKey);
  return autoswappr.executeSwap(
    TOKEN_ADDRESSES[fromToken],
    TOKEN_ADDRESSES[toToken],
    { amount }
  );
}
