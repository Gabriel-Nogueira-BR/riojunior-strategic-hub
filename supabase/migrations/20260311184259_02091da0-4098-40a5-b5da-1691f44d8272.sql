
CREATE TABLE public.presidencia_eventos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_evento TEXT NOT NULL,
  data_evento DATE NOT NULL,
  dia_status_sebrae TEXT NOT NULL DEFAULT 'Quarta',
  periodicidade TEXT NOT NULL DEFAULT 'quinzenal',
  prazo_idv_brainstorm INTEGER NOT NULL DEFAULT 14,
  prazo_idv_terceirizada INTEGER NOT NULL DEFAULT 21,
  prazo_pf_elaboracao INTEGER NOT NULL DEFAULT 14,
  prazo_pf_aprovacao_ca INTEGER NOT NULL DEFAULT 7,
  prazo_pesquisa_conselheiros INTEGER NOT NULL DEFAULT 14,
  data_marco_zero DATE,
  data_idv_inicio_brainstorm DATE,
  data_idv_inicio_terceirizada DATE,
  data_pf_inicio_elaboracao DATE,
  data_pf_aprovacao_ca DATE,
  data_pesquisa_lancamento DATE,
  data_pesquisa_aviso_previo DATE,
  data_pesquisa_limite_coleta DATE,
  status TEXT NOT NULL DEFAULT 'planejado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.presidencia_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Presidencia eventos viewable by everyone" ON public.presidencia_eventos FOR SELECT TO public USING (true);
CREATE POLICY "Presidencia eventos can be created by anyone" ON public.presidencia_eventos FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Presidencia eventos can be updated by anyone" ON public.presidencia_eventos FOR UPDATE TO public USING (true);
CREATE POLICY "Presidencia eventos can be deleted by anyone" ON public.presidencia_eventos FOR DELETE TO public USING (true);
