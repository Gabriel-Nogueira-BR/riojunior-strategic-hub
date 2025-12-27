-- Create table for event types (tipos_evento) to allow CRUD
CREATE TABLE public.tipos_evento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tipos_evento ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Tipos evento are viewable by everyone" ON public.tipos_evento FOR SELECT USING (true);
CREATE POLICY "Tipos evento can be created by anyone" ON public.tipos_evento FOR INSERT WITH CHECK (true);
CREATE POLICY "Tipos evento can be updated by anyone" ON public.tipos_evento FOR UPDATE USING (true);
CREATE POLICY "Tipos evento can be deleted by anyone" ON public.tipos_evento FOR DELETE USING (true);

-- Insert default event types with colors
INSERT INTO public.tipos_evento (nome, cor) VALUES
  ('Deliberativo', '#ef4444'),
  ('Capacitação', '#3b82f6'),
  ('Premiação', '#f59e0b'),
  ('Integração', '#10b981'),
  ('Imersão', '#8b5cf6'),
  ('Produto de conexão (online)', '#06b6d4'),
  ('Produto de conexão (presencial)', '#14b8a6'),
  ('Consultivo', '#6366f1'),
  ('Aniversário da RioJunior', '#ec4899'),
  ('Agenda Institucional', '#84cc16'),
  ('Articulação', '#f97316'),
  ('Outro', '#6b7280');

-- Create table for EJ contracts (contratos)
CREATE TABLE public.contratos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ej_id UUID NOT NULL REFERENCES public.ejs(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  valor_ej NUMERIC NOT NULL DEFAULT 0,
  tem_colaboracao BOOLEAN NOT NULL DEFAULT false,
  ej_colaboradora_id UUID REFERENCES public.ejs(id) ON DELETE SET NULL,
  ano INTEGER NOT NULL DEFAULT EXTRACT(year FROM now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Contratos are viewable by everyone" ON public.contratos FOR SELECT USING (true);
CREATE POLICY "Contratos can be created by anyone" ON public.contratos FOR INSERT WITH CHECK (true);
CREATE POLICY "Contratos can be updated by anyone" ON public.contratos FOR UPDATE USING (true);
CREATE POLICY "Contratos can be deleted by anyone" ON public.contratos FOR DELETE USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_contratos_updated_at
  BEFORE UPDATE ON public.contratos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();