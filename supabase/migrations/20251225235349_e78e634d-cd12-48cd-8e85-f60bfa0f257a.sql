
-- =============================================
-- EVENTOS (Calendarização)
-- =============================================
CREATE TABLE public.eventos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  tipo TEXT NOT NULL,
  pauta TEXT,
  diretorias TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos are viewable by everyone" ON public.eventos FOR SELECT USING (true);
CREATE POLICY "Eventos can be created by anyone" ON public.eventos FOR INSERT WITH CHECK (true);
CREATE POLICY "Eventos can be updated by anyone" ON public.eventos FOR UPDATE USING (true);
CREATE POLICY "Eventos can be deleted by anyone" ON public.eventos FOR DELETE USING (true);

-- =============================================
-- EJs (Empresas Juniores)
-- =============================================
CREATE TABLE public.ejs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  cluster INTEGER NOT NULL CHECK (cluster >= 1 AND cluster <= 5),
  regiao TEXT NOT NULL CHECK (regiao IN ('Norte', 'Centro Norte', 'Centro Sul 1', 'Centro Sul 2', 'Sul')),
  localizacao TEXT NOT NULL,
  faturamento_meta NUMERIC(15,2) NOT NULL DEFAULT 0,
  faturamento_atual NUMERIC(15,2) NOT NULL DEFAULT 0,
  faturamento_q1 NUMERIC(15,2) DEFAULT 0,
  faturamento_q2 NUMERIC(15,2) DEFAULT 0,
  faturamento_q3 NUMERIC(15,2) DEFAULT 0,
  faturamento_q4 NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ejs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "EJs are viewable by everyone" ON public.ejs FOR SELECT USING (true);
CREATE POLICY "EJs can be created by anyone" ON public.ejs FOR INSERT WITH CHECK (true);
CREATE POLICY "EJs can be updated by anyone" ON public.ejs FOR UPDATE USING (true);
CREATE POLICY "EJs can be deleted by anyone" ON public.ejs FOR DELETE USING (true);

-- =============================================
-- TIPOS DE TRANSAÇÃO (Categorias customizáveis)
-- =============================================
CREATE TABLE public.tipos_transacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ambos')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tipos_transacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tipos are viewable by everyone" ON public.tipos_transacao FOR SELECT USING (true);
CREATE POLICY "Tipos can be created by anyone" ON public.tipos_transacao FOR INSERT WITH CHECK (true);
CREATE POLICY "Tipos can be updated by anyone" ON public.tipos_transacao FOR UPDATE USING (true);
CREATE POLICY "Tipos can be deleted by anyone" ON public.tipos_transacao FOR DELETE USING (true);

-- Insert default categories
INSERT INTO public.tipos_transacao (nome, tipo) VALUES 
  ('Patrocínio', 'entrada'),
  ('Anuidade', 'entrada'),
  ('Parceria VP Negócios', 'entrada'),
  ('Contribuição', 'entrada'),
  ('Eventos', 'ambos'),
  ('Marketing', 'saida'),
  ('Administrativo', 'saida'),
  ('Tecnologia', 'saida'),
  ('Capacitação', 'saida'),
  ('Outros', 'ambos');

-- =============================================
-- TRANSAÇÕES (Financeiro)
-- =============================================
CREATE TABLE public.transacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  categoria TEXT NOT NULL,
  data DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('realizado', 'projetado')),
  is_recorrente BOOLEAN NOT NULL DEFAULT false,
  recorrencia_meses INTEGER, -- null if not recurring
  ej_id UUID REFERENCES public.ejs(id) ON DELETE SET NULL, -- for anuidade linked to EJ
  parceiro_nome TEXT, -- for VP Negócios partnerships
  custo_embutido NUMERIC(15,2) DEFAULT 0, -- embedded costs in partnership
  juros_aplicados NUMERIC(15,2) DEFAULT 0, -- interest for late payments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transacoes are viewable by everyone" ON public.transacoes FOR SELECT USING (true);
CREATE POLICY "Transacoes can be created by anyone" ON public.transacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Transacoes can be updated by anyone" ON public.transacoes FOR UPDATE USING (true);
CREATE POLICY "Transacoes can be deleted by anyone" ON public.transacoes FOR DELETE USING (true);

-- =============================================
-- ANUIDADES (Controle de inadimplência)
-- =============================================
CREATE TABLE public.anuidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ej_id UUID NOT NULL REFERENCES public.ejs(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'atrasado')),
  juros_percentual NUMERIC(5,2) DEFAULT 0,
  valor_juros NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ej_id, ano)
);

ALTER TABLE public.anuidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anuidades are viewable by everyone" ON public.anuidades FOR SELECT USING (true);
CREATE POLICY "Anuidades can be created by anyone" ON public.anuidades FOR INSERT WITH CHECK (true);
CREATE POLICY "Anuidades can be updated by anyone" ON public.anuidades FOR UPDATE USING (true);
CREATE POLICY "Anuidades can be deleted by anyone" ON public.anuidades FOR DELETE USING (true);

-- =============================================
-- DOCUMENTOS (Lista de documentos requeridos)
-- =============================================
CREATE TABLE public.documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  etapa INTEGER NOT NULL CHECK (etapa >= 1 AND etapa <= 4),
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documentos are viewable by everyone" ON public.documentos FOR SELECT USING (true);
CREATE POLICY "Documentos can be created by anyone" ON public.documentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Documentos can be updated by anyone" ON public.documentos FOR UPDATE USING (true);
CREATE POLICY "Documentos can be deleted by anyone" ON public.documentos FOR DELETE USING (true);

-- =============================================
-- ENTREGAS DE DOCUMENTOS (Checklist por EJ)
-- =============================================
CREATE TABLE public.entregas_documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ej_id UUID NOT NULL REFERENCES public.ejs(id) ON DELETE CASCADE,
  documento_id UUID NOT NULL REFERENCES public.documentos(id) ON DELETE CASCADE,
  data_entrega DATE,
  entregue BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ej_id, documento_id)
);

ALTER TABLE public.entregas_documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Entregas are viewable by everyone" ON public.entregas_documentos FOR SELECT USING (true);
CREATE POLICY "Entregas can be created by anyone" ON public.entregas_documentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Entregas can be updated by anyone" ON public.entregas_documentos FOR UPDATE USING (true);
CREATE POLICY "Entregas can be deleted by anyone" ON public.entregas_documentos FOR DELETE USING (true);

-- =============================================
-- OKRs ESTRATÉGICAS
-- =============================================
CREATE TABLE public.okrs_estrategicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ano INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.okrs_estrategicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OKRs estrategicas viewable by everyone" ON public.okrs_estrategicas FOR SELECT USING (true);
CREATE POLICY "OKRs estrategicas can be created by anyone" ON public.okrs_estrategicas FOR INSERT WITH CHECK (true);
CREATE POLICY "OKRs estrategicas can be updated by anyone" ON public.okrs_estrategicas FOR UPDATE USING (true);
CREATE POLICY "OKRs estrategicas can be deleted by anyone" ON public.okrs_estrategicas FOR DELETE USING (true);

-- =============================================
-- OBJETIVOS (para qualquer nível de OKR)
-- =============================================
CREATE TABLE public.objetivos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  nivel TEXT NOT NULL CHECK (nivel IN ('estrategico', 'tatico', 'operacional')),
  okr_estrategica_id UUID REFERENCES public.okrs_estrategicas(id) ON DELETE CASCADE,
  diretoria TEXT, -- for tactical level
  objetivo_pai_id UUID REFERENCES public.objetivos(id) ON DELETE CASCADE, -- for operational level linking to tactical
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.objetivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Objetivos viewable by everyone" ON public.objetivos FOR SELECT USING (true);
CREATE POLICY "Objetivos can be created by anyone" ON public.objetivos FOR INSERT WITH CHECK (true);
CREATE POLICY "Objetivos can be updated by anyone" ON public.objetivos FOR UPDATE USING (true);
CREATE POLICY "Objetivos can be deleted by anyone" ON public.objetivos FOR DELETE USING (true);

-- =============================================
-- KEY RESULTS
-- =============================================
CREATE TABLE public.key_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  objetivo_id UUID NOT NULL REFERENCES public.objetivos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo_metrica TEXT NOT NULL CHECK (tipo_metrica IN ('valor', 'quantidade', 'porcentagem')),
  meta NUMERIC(15,2) NOT NULL,
  atual NUMERIC(15,2) NOT NULL DEFAULT 0,
  unidade TEXT, -- e.g., 'R$', '%', 'un'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Key results viewable by everyone" ON public.key_results FOR SELECT USING (true);
CREATE POLICY "Key results can be created by anyone" ON public.key_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Key results can be updated by anyone" ON public.key_results FOR UPDATE USING (true);
CREATE POLICY "Key results can be deleted by anyone" ON public.key_results FOR DELETE USING (true);

-- =============================================
-- FATURAMENTO MENSAL (para faróis)
-- =============================================
CREATE TABLE public.faturamento_mensal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ej_id UUID NOT NULL REFERENCES public.ejs(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  valor NUMERIC(15,2) NOT NULL DEFAULT 0,
  meta_mes NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ej_id, ano, mes)
);

ALTER TABLE public.faturamento_mensal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faturamento mensal viewable by everyone" ON public.faturamento_mensal FOR SELECT USING (true);
CREATE POLICY "Faturamento mensal can be created by anyone" ON public.faturamento_mensal FOR INSERT WITH CHECK (true);
CREATE POLICY "Faturamento mensal can be updated by anyone" ON public.faturamento_mensal FOR UPDATE USING (true);
CREATE POLICY "Faturamento mensal can be deleted by anyone" ON public.faturamento_mensal FOR DELETE USING (true);

-- =============================================
-- FUNCTION: Update timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON public.eventos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ejs_updated_at BEFORE UPDATE ON public.ejs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transacoes_updated_at BEFORE UPDATE ON public.transacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_entregas_documentos_updated_at BEFORE UPDATE ON public.entregas_documentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_okrs_estrategicas_updated_at BEFORE UPDATE ON public.okrs_estrategicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_objetivos_updated_at BEFORE UPDATE ON public.objetivos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_key_results_updated_at BEFORE UPDATE ON public.key_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faturamento_mensal_updated_at BEFORE UPDATE ON public.faturamento_mensal FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
