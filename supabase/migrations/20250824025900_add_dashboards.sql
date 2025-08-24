-- Create dashboards table
CREATE TABLE public.dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  layouts JSONB,
  widgets JSONB,
  rpc_endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX dashboards_user_id_idx ON public.dashboards(user_id);
CREATE INDEX dashboards_name_idx ON public.dashboards(name);

-- Add RLS policies
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own dashboards" 
  ON public.dashboards FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own dashboards" 
  ON public.dashboards FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboards" 
  ON public.dashboards FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboards" 
  ON public.dashboards FOR DELETE 
  USING (auth.uid() = user_id);
