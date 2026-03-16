
-- Table to track kanban status for each task derived from presidência eventos
CREATE TABLE public.demandas_formacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.presidencia_eventos(id) ON DELETE CASCADE,
  etapa text NOT NULL, -- 'brainstorm_idv', 'terceirizada_idv', 'elaboracao_pf', 'aprovacao_pf'
  status text NOT NULL DEFAULT 'a_fazer', -- 'a_fazer', 'em_andamento', 'aprovacao', 'concluido'
  prazo date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (evento_id, etapa)
);

ALTER TABLE public.demandas_formacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demandas viewable by everyone" ON public.demandas_formacao FOR SELECT TO public USING (true);
CREATE POLICY "Demandas can be created by anyone" ON public.demandas_formacao FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Demandas can be updated by anyone" ON public.demandas_formacao FOR UPDATE TO public USING (true);
CREATE POLICY "Demandas can be deleted by anyone" ON public.demandas_formacao FOR DELETE TO public USING (true);
