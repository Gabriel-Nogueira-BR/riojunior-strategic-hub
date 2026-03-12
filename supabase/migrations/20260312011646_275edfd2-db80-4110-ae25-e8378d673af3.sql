
ALTER TABLE public.presidencia_eventos 
  ADD COLUMN prazo_aviso_previo integer NOT NULL DEFAULT 7,
  ADD COLUMN prazo_coleta_pesquisa integer NOT NULL DEFAULT 14;
