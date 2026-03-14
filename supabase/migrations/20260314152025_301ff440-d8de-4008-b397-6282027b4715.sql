
-- Create global config table for presidencia
CREATE TABLE public.configuracoes_presidencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_referencia_status date NOT NULL DEFAULT '2026-01-07',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.configuracoes_presidencia (data_referencia_status) VALUES ('2026-01-07');

-- Enable RLS
ALTER TABLE public.configuracoes_presidencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Config viewable by everyone" ON public.configuracoes_presidencia FOR SELECT TO public USING (true);
CREATE POLICY "Config can be updated by anyone" ON public.configuracoes_presidencia FOR UPDATE TO public USING (true);
CREATE POLICY "Config can be inserted by anyone" ON public.configuracoes_presidencia FOR INSERT TO public WITH CHECK (true);

-- Make prazo fields nullable in presidencia_eventos
ALTER TABLE public.presidencia_eventos
  ALTER COLUMN prazo_idv_brainstorm DROP NOT NULL,
  ALTER COLUMN prazo_idv_brainstorm SET DEFAULT NULL,
  ALTER COLUMN prazo_idv_terceirizada DROP NOT NULL,
  ALTER COLUMN prazo_idv_terceirizada SET DEFAULT NULL,
  ALTER COLUMN prazo_pf_elaboracao DROP NOT NULL,
  ALTER COLUMN prazo_pf_elaboracao SET DEFAULT NULL,
  ALTER COLUMN prazo_pf_aprovacao_ca DROP NOT NULL,
  ALTER COLUMN prazo_pf_aprovacao_ca SET DEFAULT NULL,
  ALTER COLUMN prazo_abertura_coordenadoria DROP NOT NULL,
  ALTER COLUMN prazo_abertura_coordenadoria SET DEFAULT NULL,
  ALTER COLUMN prazo_articulacao_local DROP NOT NULL,
  ALTER COLUMN prazo_articulacao_local SET DEFAULT NULL;

-- Remove data_referencia_status from eventos (now global)
ALTER TABLE public.presidencia_eventos DROP COLUMN IF EXISTS data_referencia_status;
