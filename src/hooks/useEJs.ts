import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EJ } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useEJs() {
  const [ejs, setEjs] = useState<EJ[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEJs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ejs')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      const mapped: EJ[] = (data || []).map((e) => ({
        id: e.id,
        nome: e.nome,
        cnpj: e.cnpj,
        cluster: e.cluster as 1 | 2 | 3 | 4 | 5,
        regiao: e.regiao as EJ['regiao'],
        localizacao: e.localizacao,
        faturamentoMeta: Number(e.faturamento_meta) || 0,
        faturamentoAtual: Number(e.faturamento_atual) || 0,
        faturamentoQ1: Number(e.faturamento_q1) || 0,
        faturamentoQ2: Number(e.faturamento_q2) || 0,
        faturamentoQ3: Number(e.faturamento_q3) || 0,
        faturamentoQ4: Number(e.faturamento_q4) || 0
      }));

      setEjs(mapped);
    } catch (error) {
      console.error('Erro ao carregar EJs:', error);
      toast({ title: 'Erro ao carregar EJs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEJs();
  }, [fetchEJs]);

  const createEJ = async (ej: Omit<EJ, 'id'>) => {
    try {
      const faturamentoAtual = (ej.faturamentoQ1 || 0) + (ej.faturamentoQ2 || 0) + (ej.faturamentoQ3 || 0) + (ej.faturamentoQ4 || 0);
      
      const { data, error } = await supabase
        .from('ejs')
        .insert({
          nome: ej.nome,
          cnpj: ej.cnpj,
          cluster: ej.cluster,
          regiao: ej.regiao,
          localizacao: ej.localizacao,
          faturamento_meta: ej.faturamentoMeta,
          faturamento_atual: faturamentoAtual,
          faturamento_q1: ej.faturamentoQ1 || 0,
          faturamento_q2: ej.faturamentoQ2 || 0,
          faturamento_q3: ej.faturamentoQ3 || 0,
          faturamento_q4: ej.faturamentoQ4 || 0
        })
        .select()
        .single();

      if (error) throw error;

      await fetchEJs();
      toast({ title: 'EJ cadastrada com sucesso!' });
      return data;
    } catch (error) {
      console.error('Erro ao criar EJ:', error);
      toast({ title: 'Erro ao cadastrar EJ', variant: 'destructive' });
      throw error;
    }
  };

  const updateEJ = async (id: string, ej: Partial<EJ>) => {
    try {
      const faturamentoAtual = (ej.faturamentoQ1 || 0) + (ej.faturamentoQ2 || 0) + (ej.faturamentoQ3 || 0) + (ej.faturamentoQ4 || 0);
      
      const { error } = await supabase
        .from('ejs')
        .update({
          nome: ej.nome,
          cnpj: ej.cnpj,
          cluster: ej.cluster,
          regiao: ej.regiao,
          localizacao: ej.localizacao,
          faturamento_meta: ej.faturamentoMeta,
          faturamento_atual: faturamentoAtual,
          faturamento_q1: ej.faturamentoQ1 || 0,
          faturamento_q2: ej.faturamentoQ2 || 0,
          faturamento_q3: ej.faturamentoQ3 || 0,
          faturamento_q4: ej.faturamentoQ4 || 0
        })
        .eq('id', id);

      if (error) throw error;

      await fetchEJs();
      toast({ title: 'EJ atualizada!' });
    } catch (error) {
      console.error('Erro ao atualizar EJ:', error);
      toast({ title: 'Erro ao atualizar EJ', variant: 'destructive' });
      throw error;
    }
  };

  const deleteEJ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ejs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchEJs();
      toast({ title: 'EJ excluída!' });
    } catch (error) {
      console.error('Erro ao excluir EJ:', error);
      toast({ title: 'Erro ao excluir EJ', variant: 'destructive' });
      throw error;
    }
  };

  return {
    ejs,
    loading,
    createEJ,
    updateEJ,
    deleteEJ,
    refetch: fetchEJs
  };
}
