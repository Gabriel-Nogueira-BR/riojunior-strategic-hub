
ALTER TABLE public.presidencia_eventos 
  ADD COLUMN prazo_abertura_coordenadoria integer NOT NULL DEFAULT 7,
  ADD COLUMN prazo_articulacao_local integer NOT NULL DEFAULT 7,
  ADD COLUMN data_abertura_coordenadoria date NULL,
  ADD COLUMN data_articulacao_local date NULL;
