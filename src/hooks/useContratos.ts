import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Contrato {
  id: string;
  ejId: string;
  nome: string;
  valor: number;
  valorEj: number;
  temColaboracao: boolean;
  ejColaboradoraId?: string | null;
  ano: number;
  ejNome?: string;
  ejColaboradoraNome?: string;
}

export function useContratos(ano?: number) {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContratos = useCallback(async () => {
    try {
      let query = supabase
        .from('contratos')
        .select(`
          *,
          ejs!contratos_ej_id_fkey(nome),
          ej_colaboradora:ejs!contratos_ej_colaboradora_id_fkey(nome)
        `)
        .order('created_at', { ascending: false });

      if (ano) {
        query = query.eq('ano', ano);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mapped: Contrato[] = (data || []).map((c: any) => ({
        id: c.id,
        ejId: c.ej_id,
        nome: c.nome,
        valor: c.valor,
        valorEj: c.valor_ej,
        temColaboracao: c.tem_colaboracao,
        ejColaboradoraId: c.ej_colaboradora_id,
        ano: c.ano,
        ejNome: c.ejs?.nome,
        ejColaboradoraNome: c.ej_colaboradora?.nome
      }));

      setContratos(mapped);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast({ title: 'Erro ao carregar contratos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [ano]);

  useEffect(() => {
    fetchContratos();
  }, [fetchContratos]);

  const createContrato = async (contrato: Omit<Contrato, 'id' | 'ejNome' | 'ejColaboradoraNome'>) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .insert({
          ej_id: contrato.ejId,
          nome: contrato.nome,
          valor: contrato.valor,
          valor_ej: contrato.valorEj,
          tem_colaboracao: contrato.temColaboracao,
          ej_colaboradora_id: contrato.ejColaboradoraId,
          ano: contrato.ano
        });

      if (error) throw error;

      await fetchContratos();
      toast({ title: 'Contrato criado!' });
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      toast({ title: 'Erro ao criar contrato', variant: 'destructive' });
      throw error;
    }
  };

  const updateContrato = async (id: string, contrato: Partial<Contrato>) => {
    try {
      const updateData: any = {};
      if (contrato.ejId !== undefined) updateData.ej_id = contrato.ejId;
      if (contrato.nome !== undefined) updateData.nome = contrato.nome;
      if (contrato.valor !== undefined) updateData.valor = contrato.valor;
      if (contrato.valorEj !== undefined) updateData.valor_ej = contrato.valorEj;
      if (contrato.temColaboracao !== undefined) updateData.tem_colaboracao = contrato.temColaboracao;
      if (contrato.ejColaboradoraId !== undefined) updateData.ej_colaboradora_id = contrato.ejColaboradoraId;
      if (contrato.ano !== undefined) updateData.ano = contrato.ano;

      const { error } = await supabase
        .from('contratos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchContratos();
      toast({ title: 'Contrato atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error);
      toast({ title: 'Erro ao atualizar contrato', variant: 'destructive' });
      throw error;
    }
  };

  const deleteContrato = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContratos();
      toast({ title: 'Contrato excluído!' });
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      toast({ title: 'Erro ao excluir contrato', variant: 'destructive' });
      throw error;
    }
  };

  return {
    contratos,
    loading,
    createContrato,
    updateContrato,
    deleteContrato,
    refetch: fetchContratos
  };
}
