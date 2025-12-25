import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Evento } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: true });

      if (error) throw error;

      const mapped: Evento[] = (data || []).map((e) => ({
        id: e.id,
        nome: e.nome,
        dataInicio: e.data_inicio,
        dataFim: e.data_fim,
        tipo: e.tipo,
        pauta: e.pauta || '',
        diretorias: e.diretorias || []
      }));

      setEventos(mapped);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({ title: 'Erro ao carregar eventos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const createEvento = async (evento: Omit<Evento, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .insert({
          nome: evento.nome,
          data_inicio: evento.dataInicio,
          data_fim: evento.dataFim || evento.dataInicio,
          tipo: evento.tipo,
          pauta: evento.pauta,
          diretorias: evento.diretorias
        })
        .select()
        .single();

      if (error) throw error;

      await fetchEventos();
      toast({ title: 'Evento criado com sucesso!' });
      return data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({ title: 'Erro ao criar evento', variant: 'destructive' });
      throw error;
    }
  };

  const updateEvento = async (id: string, evento: Partial<Evento>) => {
    try {
      const { error } = await supabase
        .from('eventos')
        .update({
          nome: evento.nome,
          data_inicio: evento.dataInicio,
          data_fim: evento.dataFim,
          tipo: evento.tipo,
          pauta: evento.pauta,
          diretorias: evento.diretorias
        })
        .eq('id', id);

      if (error) throw error;

      await fetchEventos();
      toast({ title: 'Evento atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast({ title: 'Erro ao atualizar evento', variant: 'destructive' });
      throw error;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchEventos();
      toast({ title: 'Evento excluído!' });
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast({ title: 'Erro ao excluir evento', variant: 'destructive' });
      throw error;
    }
  };

  return {
    eventos,
    loading,
    createEvento,
    updateEvento,
    deleteEvento,
    refetch: fetchEventos
  };
}
