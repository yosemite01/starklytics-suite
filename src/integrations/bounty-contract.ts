// This file provides integration helpers for the BountyContract Cairo smart contract.
// It is intended for use with Starknet.js or similar libraries in the frontend/backend.
// Update the contract address after deployment.

export const BOUNTY_CONTRACT_ADDRESS = "<REPLACE_WITH_DEPLOYED_ADDRESS>";

export const BOUNTY_CONTRACT_ABI = [
  // Add the ABI JSON here after compiling the contract with Scarb or Starknet Foundry
  // Example:
  // {
  //   "name": "create_bounty",
  //   "type": "function",
  //   ...
  // },
];

// Example usage with starknet.js (pseudo-code):
// import { Contract, Provider } from "starknet";
// const provider = new Provider({ ... });
// const contract = new Contract(BOUNTY_CONTRACT_ABI, BOUNTY_CONTRACT_ADDRESS, provider);
// await contract.create_bounty(...);

// After deployment, update the address and ABI for full integration.
