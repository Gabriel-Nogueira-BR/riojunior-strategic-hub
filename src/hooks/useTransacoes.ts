import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transacao, TipoTransacao } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [tiposTransacao, setTiposTransacao] = useState<TipoTransacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransacoes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;

      const mapped: Transacao[] = (data || []).map((t) => ({
        id: t.id,
        descricao: t.descricao,
        valor: Number(t.valor) || 0,
        tipo: t.tipo as 'entrada' | 'saida',
        categoria: t.categoria,
        data: t.data,
        status: t.status as 'realizado' | 'projetado',
        isRecorrente: t.is_recorrente,
        recorrenciaMeses: t.recorrencia_meses || undefined,
        ejId: t.ej_id || undefined,
        parceiroNome: t.parceiro_nome || undefined,
        custoEmbutido: Number(t.custo_embutido) || 0,
        jurosAplicados: Number(t.juros_aplicados) || 0
      }));

      setTransacoes(mapped);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({ title: 'Erro ao carregar transações', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTiposTransacao = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_transacao')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      const mapped: TipoTransacao[] = (data || []).map((t) => ({
        id: t.id,
        nome: t.nome,
        tipo: t.tipo as 'entrada' | 'saida' | 'ambos'
      }));

      setTiposTransacao(mapped);
    } catch (error) {
      console.error('Erro ao carregar tipos de transação:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransacoes();
    fetchTiposTransacao();
  }, [fetchTransacoes, fetchTiposTransacao]);

  const createTransacao = async (transacao: Omit<Transacao, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .insert({
          descricao: transacao.descricao,
          valor: transacao.valor,
          tipo: transacao.tipo,
          categoria: transacao.categoria,
          data: transacao.data,
          status: transacao.status,
          is_recorrente: transacao.isRecorrente || false,
          recorrencia_meses: transacao.recorrenciaMeses,
          ej_id: transacao.ejId,
          parceiro_nome: transacao.parceiroNome,
          custo_embutido: transacao.custoEmbutido || 0,
          juros_aplicados: transacao.jurosAplicados || 0
        })
        .select()
        .single();

      if (error) throw error;

      await fetchTransacoes();
      toast({ title: 'Transação criada com sucesso!' });
      return data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      toast({ title: 'Erro ao criar transação', variant: 'destructive' });
      throw error;
    }
  };

  const updateTransacao = async (id: string, transacao: Partial<Transacao>) => {
    try {
      const { error } = await supabase
        .from('transacoes')
        .update({
          descricao: transacao.descricao,
          valor: transacao.valor,
          tipo: transacao.tipo,
          categoria: transacao.categoria,
          data: transacao.data,
          status: transacao.status,
          is_recorrente: transacao.isRecorrente,
          recorrencia_meses: transacao.recorrenciaMeses,
          ej_id: transacao.ejId,
          parceiro_nome: transacao.parceiroNome,
          custo_embutido: transacao.custoEmbutido,
          juros_aplicados: transacao.jurosAplicados
        })
        .eq('id', id);

      if (error) throw error;

      await fetchTransacoes();
      toast({ title: 'Transação atualizada!' });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({ title: 'Erro ao atualizar transação', variant: 'destructive' });
      throw error;
    }
  };

  const deleteTransacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTransacoes();
      toast({ title: 'Transação excluída!' });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({ title: 'Erro ao excluir transação', variant: 'destructive' });
      throw error;
    }
  };

  const createTipoTransacao = async (tipo: Omit<TipoTransacao, 'id'>) => {
    try {
      const { error } = await supabase
        .from('tipos_transacao')
        .insert({
          nome: tipo.nome,
          tipo: tipo.tipo
        });

      if (error) throw error;

      await fetchTiposTransacao();
      toast({ title: 'Tipo de transação criado!' });
    } catch (error) {
      console.error('Erro ao criar tipo de transação:', error);
      toast({ title: 'Erro ao criar tipo de transação', variant: 'destructive' });
      throw error;
    }
  };

  const updateTipoTransacao = async (id: string, tipo: Partial<TipoTransacao>) => {
    try {
      const { error } = await supabase
        .from('tipos_transacao')
        .update({
          nome: tipo.nome,
          tipo: tipo.tipo
        })
        .eq('id', id);

      if (error) throw error;

      await fetchTiposTransacao();
      toast({ title: 'Tipo de transação atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar tipo de transação:', error);
      toast({ title: 'Erro ao atualizar tipo de transação', variant: 'destructive' });
      throw error;
    }
  };

  const deleteTipoTransacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tipos_transacao')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTiposTransacao();
      toast({ title: 'Tipo de transação excluído!' });
    } catch (error) {
      console.error('Erro ao excluir tipo de transação:', error);
      toast({ title: 'Erro ao excluir tipo de transação', variant: 'destructive' });
      throw error;
    }
  };

  return {
    transacoes,
    tiposTransacao,
    loading,
    createTransacao,
    updateTransacao,
    deleteTransacao,
    createTipoTransacao,
    updateTipoTransacao,
    deleteTipoTransacao,
    refetch: fetchTransacoes
  };
}
