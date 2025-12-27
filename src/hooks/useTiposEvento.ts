import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TipoEvento {
  id: string;
  nome: string;
  cor: string;
}

export function useTiposEvento() {
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTiposEvento = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_evento')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      setTiposEvento(data || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de evento:', error);
      toast({ title: 'Erro ao carregar tipos de evento', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposEvento();
  }, [fetchTiposEvento]);

  const createTipoEvento = async (tipo: Omit<TipoEvento, 'id'>) => {
    try {
      const { error } = await supabase
        .from('tipos_evento')
        .insert({ nome: tipo.nome, cor: tipo.cor });

      if (error) throw error;

      await fetchTiposEvento();
      toast({ title: 'Tipo de evento criado!' });
    } catch (error) {
      console.error('Erro ao criar tipo de evento:', error);
      toast({ title: 'Erro ao criar tipo de evento', variant: 'destructive' });
      throw error;
    }
  };

  const updateTipoEvento = async (id: string, tipo: Partial<TipoEvento>) => {
    try {
      const { error } = await supabase
        .from('tipos_evento')
        .update({ nome: tipo.nome, cor: tipo.cor })
        .eq('id', id);

      if (error) throw error;

      await fetchTiposEvento();
      toast({ title: 'Tipo de evento atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar tipo de evento:', error);
      toast({ title: 'Erro ao atualizar tipo de evento', variant: 'destructive' });
      throw error;
    }
  };

  const deleteTipoEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tipos_evento')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTiposEvento();
      toast({ title: 'Tipo de evento excluído!' });
    } catch (error) {
      console.error('Erro ao excluir tipo de evento:', error);
      toast({ title: 'Erro ao excluir tipo de evento', variant: 'destructive' });
      throw error;
    }
  };

  return {
    tiposEvento,
    loading,
    createTipoEvento,
    updateTipoEvento,
    deleteTipoEvento,
    refetch: fetchTiposEvento
  };
}
