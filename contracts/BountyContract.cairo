
// BountyContract.cairo
// A simple bounty system smart contract in Cairo for Starknet.
// Updated for MVP: Renamed struct to BountyStruct, added events for analytics (e.g., Dune integration),
// and refined status handling. Assumes Cairo 2.x syntax with Starknet integrations.
// Note: Token operations (deposits/payouts) are handled off-chain by the backend using AutoSwappr
// for swaps/staking. The contract manages state and emits events for the backend to listen and act.
// In distribute_reward, it marks the winner and emits an event; backend can then trigger payout via AutoSwappr.
// For production, integrate ERC20 directly if needed (e.g., add token_address param, but sticking to spec).

use starknet::ContractAddress;
use starknet::get_caller_address;
use starknet::get_block_timestamp;

// Define the BountyStruct as per spec
#[derive(Copy, Drop, Serde, starknet::Store)]
struct BountyStruct {
    title: felt252,
    description: felt252,
    reward_amount: felt252,  // Using felt252 as per spec; in practice, use u256 for amounts
    deadline: felt252,       // Timestamp; use u64 in practice
    creator: ContractAddress,
    is_active: bool,
    winner: ContractAddress, // Zero address initially
}

// Events for analytics (Dune can query these on-chain events)
#[event]
#[derive(Drop, starknet::Event)]
enum Event {
    BountyCreated: BountyCreated,
    BountyJoined: BountyJoined,
    SolutionSubmitted: SolutionSubmitted,
    RewardDistributed: RewardDistributed,
}

#[derive(Drop, starknet::Event)]
struct BountyCreated {
    #[key]
    bounty_id: felt252,
    creator: ContractAddress,
    title: felt252,
    reward_amount: felt252,
    deadline: felt252,
}

#[derive(Drop, starknet::Event)]
struct BountyJoined {
    #[key]
    bounty_id: felt252,
    participant: ContractAddress,
}

#[derive(Drop, starknet::Event)]
struct SolutionSubmitted {
    #[key]
    bounty_id: felt252,
    participant: ContractAddress,
    solution_hash: felt252,
}

#[derive(Drop, starknet::Event)]
struct RewardDistributed {
    #[key]
    bounty_id: felt252,
    winner: ContractAddress,
    reward_amount: felt252,
}

// Contract module
#[starknet::contract]
mod BountyContract {
    use super::{BountyStruct, Event, BountyCreated, BountyJoined, SolutionSubmitted, RewardDistributed};
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        bounties: Map,  // bounty_id: felt252 -> BountyStruct
        next_bounty_id: felt252,               // Incremental ID starting from 1
        participants: Map<(felt252, ContractAddress), felt252>,  // (bounty_id, participant) -> status (0: none, 1: joined, 2: submitted)
        solutions: Map<(felt252, ContractAddress), felt252>,     // (bounty_id, participant) -> solution_hash
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_bounty_id.write(1);
    }

    #[abi(embed_v0)]
    impl BountyImpl of super::IBounty {
        // Create a new bounty (assumes deposit handled by backend prior; sets active)
        fn create_bounty(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            reward_amount: felt252,
            deadline: felt252
        ) {
            let caller = get_caller_address();
            let current_time = get_block_timestamp();  // Enforce deadline > current_time in production

            let bounty_id = self.next_bounty_id.read();
            let bounty = BountyStruct {
                title: title,
                description: description,
                reward_amount: reward_amount,
                deadline: deadline,
                creator: caller,
                is_active: true,
                winner: ContractAddress::zero(),
            };

            self.bounties.write(bounty_id, bounty);
            self.next_bounty_id.write(bounty_id + 1);

            // Emit event for analytics
            self.emit(BountyCreated {
                bounty_id,
                creator: caller,
                title,
                reward_amount,
                deadline,
            });

            // Backend would have handled AutoSwappr deposit/stake before calling this
        }

        // Join a bounty
        fn join_bounty(ref self: ContractState, bounty_id: felt252, participant: felt252) {
            let participant_addr: ContractAddress = participant.try_into().unwrap();
            let mut bounty = self.bounties.read(bounty_id);
            assert(bounty.is_active, 'Bounty not active');

            self.participants.write((bounty_id, participant_addr), 1);  // Status: joined

            // Emit event
            self.emit(BountyJoined {
                bounty_id,
                participant: participant_addr,
            });
        }

        // Submit a solution
        fn submit_solution(
            ref self: ContractState,
            bounty_id: felt252,
            participant: felt252,
            solution_hash: felt252
        ) {
            let participant_addr: ContractAddress = participant.try_into().unwrap();
            let mut bounty = self.bounties.read(bounty_id);
            assert(bounty.is_active, 'Bounty not active');
            let status = self.participants.read((bounty_id, participant_addr));
            assert(status == 1, 'Not joined');

            self.solutions.write((bounty_id, participant_addr), solution_hash);
            self.participants.write((bounty_id, participant_addr), 2);  // Status: submitted

            // Emit event
            self.emit(SolutionSubmitted {
                bounty_id,
                participant: participant_addr,
                solution_hash,
            });
        }

        // Distribute reward (marks winner, sets inactive, emits event; backend handles actual payout via AutoSwappr)
        fn distribute_reward(ref self: ContractState, bounty_id: felt252, winner: felt252) {
            let winner_addr: ContractAddress = winner.try_into().unwrap();
            let mut bounty = self.bounties.read(bounty_id);
            assert(bounty.is_active, 'Bounty not active');
            assert(bounty.creator == get_caller_address(), 'Only creator');
            let status = self.participants.read((bounty_id, winner_addr));
            assert(status == 2, 'Winner not submitted');

            bounty.winner = winner_addr;
            bounty.is_active = false;
            self.bounties.write(bounty_id, bounty);

            // Emit event for backend to trigger payout
            self.emit(RewardDistributed {
                bounty_id,
                winner: winner_addr,
                reward_amount: bounty.reward_amount,
            });
        }

        // Get bounty details
        fn get_bounty_details(self: @ContractState, bounty_id: felt252) -> BountyStruct {
            self.bounties.read(bounty_id)
        }

        // Get participant status
        fn get_participant_status(self: @ContractState, bounty_id: felt252, participant: felt252) -> felt252 {
            let participant_addr: ContractAddress = participant.try_into().unwrap();
            self.participants.read((bounty_id, participant_addr))
        }
    }
}

// Interface for the contract (for external calls)
#[starknet::interface]
trait IBounty {
    fn create_bounty(ref self: TContractState, title: felt252, description: felt252, reward_amount: felt252, deadline: felt252);
    fn join_bounty(ref self: TContractState, bounty_id: felt252, participant: felt252);
    fn submit_solution(ref self: TContractState, bounty_id: felt252, participant: felt252, solution_hash: felt252);
    fn distribute_reward(ref self: TContractState, bounty_id: felt252, winner: felt252);
    fn get_bounty_details(self: @TContractState, bounty_id: felt252) -> BountyStruct;
    fn get_participant_status(self: @TContractState, bounty_id: felt252, participant: felt252) -> felt252;
}
