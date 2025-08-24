export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      queries: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          query_text: string
          creator_id: string
          metadata: Json | null
          is_public: boolean
          last_run_at: string | null
          favorite: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          query_text: string
          creator_id: string
          metadata?: Json | null
          is_public?: boolean
          last_run_at?: string | null
          favorite?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          query_text?: string
          creator_id?: string
          metadata?: Json | null
          is_public?: boolean
          last_run_at?: string | null
          favorite?: boolean
        }
      }
      query_results: {
        Row: {
          id: string
          created_at: string
          query_id: string
          results: Json
          execution_time: string | null
          row_count: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          query_id: string
          results: Json
          execution_time?: string | null
          row_count?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          query_id?: string
          results?: Json
          execution_time?: string | null
          row_count?: number | null
        }
      }
      bounties: {
        Row: {
          id: string
          created_at: string
          creator_id: string
          title: string
          description: string
          amount: number
          deadline: string
          difficulty: string
          current_participants: number
          max_participants: number
          rpc_endpoint: string
          metadata: Json
          winner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          creator_id: string
          title: string
          description: string
          amount: number
          deadline?: string
          difficulty?: string
          current_participants?: number
          max_participants?: number
          rpc_endpoint: string
          metadata?: Json
          winner_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          creator_id?: string
          title?: string
          description?: string
          amount?: number
          deadline?: string
          difficulty?: string
          current_participants?: number
          max_participants?: number
          rpc_endpoint?: string
          metadata?: Json
          winner_id?: string
        }
      }
      bounty_participants: {
        Row: {
          id: string
          created_at: string
          bounty_id: string
          participant_id: string
          status: string
          submission_url: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          bounty_id: string
          participant_id: string
          status?: string
          submission_url?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          bounty_id?: string
          participant_id?: string
          status?: string
          submission_url?: string
          metadata?: Json
        }
      }
      dashboards: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          layouts: Json
          widgets: Json
          rpc_endpoint: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          layouts?: Json
          widgets?: Json
          rpc_endpoint: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          layouts?: Json
          widgets?: Json
          rpc_endpoint?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          avatar_url: string
          bio: string
          role: string
          wallet_address: string
          email_verified: boolean
          onboarding_completed: boolean
          total_earnings: number
          reputation_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          role?: string
          wallet_address?: string
          email_verified?: boolean
          onboarding_completed?: boolean
          total_earnings?: number
          reputation_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          role?: string
          wallet_address?: string
          email_verified?: boolean
          onboarding_completed?: boolean
          total_earnings?: number
          reputation_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_type: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: string
          current_period_start: string
          current_period_end: string
          price_per_month: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_type: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          price_per_month?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_type?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          price_per_month?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          bounty_id: string
          transaction_type: string
          amount: number
          token: string
          status: string
          wallet_transaction_hash: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          bounty_id?: string
          transaction_type: string
          amount: number
          token?: string
          status?: string
          wallet_transaction_hash?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          bounty_id?: string
          transaction_type?: string
          amount?: number
          token?: string
          status?: string
          wallet_transaction_hash?: string
          metadata?: Json
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
