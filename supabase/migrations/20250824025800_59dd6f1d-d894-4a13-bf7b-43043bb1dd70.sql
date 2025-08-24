-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('analyst', 'bounty_creator', 'admin');
CREATE TYPE public.subscription_type AS ENUM ('monthly', 'yearly', 'lifetime');
CREATE TYPE public.payment_type AS ENUM ('subscription', 'one_time', 'percentage_fee');
CREATE TYPE public.bounty_status AS ENUM ('draft', 'active', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.bounty_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE public.transaction_type AS ENUM ('bounty_reward', 'platform_fee', 'subscription', 'refund', 'bonus');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create user profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'analyst',
  wallet_address TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  total_earnings DECIMAL(20, 8) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_type subscription_type NOT NULL,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  price_per_month DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bounties table
CREATE TABLE public.bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  reward_amount DECIMAL(20, 8) NOT NULL,
  reward_token TEXT DEFAULT 'STRK',
  deadline TIMESTAMPTZ,
  status bounty_status DEFAULT 'draft',
  difficulty bounty_difficulty DEFAULT 'medium',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  winner_id UUID REFERENCES public.profiles(id),
  platform_fee_percentage DECIMAL(5, 2) DEFAULT 5.0,
  tags TEXT[] DEFAULT '{}',
  submission_guidelines TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bounty participants table
CREATE TABLE public.bounty_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES public.bounties(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_url TEXT,
  submission_description TEXT,
  submitted_at TIMESTAMPTZ,
  is_winner BOOLEAN DEFAULT FALSE,
  UNIQUE(bounty_id, participant_id)
);

-- Create transactions table for all payments and earnings
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bounty_id UUID REFERENCES public.bounties(id),
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  token TEXT DEFAULT 'STRK',
  status transaction_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  wallet_transaction_hash TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create wallet_connections table
CREATE TABLE public.wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT NOT NULL, -- 'argent', 'braavos', etc
  is_primary BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, wallet_address)
);

-- Create platform_settings table for fee structures
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, description) VALUES
('subscription_monthly_price', '{"amount": 29.99, "currency": "USD"}', 'Monthly subscription price'),
('subscription_yearly_price', '{"amount": 299.99, "currency": "USD"}', 'Yearly subscription price'),
('default_platform_fee_percentage', '{"percentage": 5.0}', 'Default platform fee percentage for bounties'),
('minimum_bounty_amount', '{"amount": 10, "token": "STRK"}', 'Minimum bounty reward amount'),
('maximum_bounty_amount', '{"amount": 10000, "token": "STRK"}', 'Maximum bounty reward amount');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounty_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for bounties
CREATE POLICY "Anyone can view active bounties" ON public.bounties
  FOR SELECT USING (status = 'active' OR creator_id = auth.uid());

CREATE POLICY "Users can create bounties" ON public.bounties
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their bounties" ON public.bounties
  FOR UPDATE USING (auth.uid() = creator_id);

-- Create RLS policies for bounty participants
CREATE POLICY "Participants can view their participations" ON public.bounty_participants
  FOR SELECT USING (auth.uid() = participant_id OR EXISTS (
    SELECT 1 FROM public.bounties WHERE id = bounty_id AND creator_id = auth.uid()
  ));

CREATE POLICY "Users can join bounties" ON public.bounty_participants
  FOR INSERT WITH CHECK (auth.uid() = participant_id);

CREATE POLICY "Participants can update their submissions" ON public.bounty_participants
  FOR UPDATE USING (auth.uid() = participant_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for wallet connections
CREATE POLICY "Users can manage their wallet connections" ON public.wallet_connections
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for platform settings
CREATE POLICY "Anyone can read platform settings" ON public.platform_settings
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_wallet_address ON public.profiles(wallet_address);
CREATE INDEX idx_bounties_status ON public.bounties(status);
CREATE INDEX idx_bounties_creator_id ON public.bounties(creator_id);
CREATE INDEX idx_bounties_deadline ON public.bounties(deadline);
CREATE INDEX idx_bounty_participants_bounty_id ON public.bounty_participants(bounty_id);
CREATE INDEX idx_bounty_participants_participant_id ON public.bounty_participants(participant_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_wallet_connections_user_id ON public.wallet_connections(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bounties_updated_at BEFORE UPDATE ON public.bounties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();