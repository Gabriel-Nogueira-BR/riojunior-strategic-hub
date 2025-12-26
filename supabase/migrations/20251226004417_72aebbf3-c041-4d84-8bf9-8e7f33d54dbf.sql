-- Create ciclos table for strategic cycles with date ranges
CREATE TABLE public.ciclos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'estrategico', 'tatico', 'operacional'
  numero INTEGER NOT NULL DEFAULT 1,
  ano INTEGER NOT NULL DEFAULT EXTRACT(year FROM now()),
  data_inicio DATE,
  data_fim DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add ciclo_id to objetivos table
ALTER TABLE public.objetivos ADD COLUMN ciclo_id UUID REFERENCES public.ciclos(id);

-- Enable RLS
ALTER TABLE public.ciclos ENABLE ROW LEVEL SECURITY;

-- Create policies for ciclos
CREATE POLICY "Ciclos are viewable by everyone" ON public.ciclos FOR SELECT USING (true);
CREATE POLICY "Ciclos can be created by anyone" ON public.ciclos FOR INSERT WITH CHECK (true);
CREATE POLICY "Ciclos can be updated by anyone" ON public.ciclos FOR UPDATE USING (true);
CREATE POLICY "Ciclos can be deleted by anyone" ON public.ciclos FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_ciclos_updated_at
BEFORE UPDATE ON public.ciclos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();