import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { calcularCronograma, PresidenciaEventoInput } from '@/utils/backwardsScheduling';

export interface PresidenciaEvento {
  id: string;
  nomeEvento: string;
  dataEvento: string;
  dataReferenciaStatus: string;
  periodicidade: string;
  prazoIdvBrainstorm: number;
  prazoIdvTerceirizada: number;
  prazoPfElaboracao: number;
  prazoPfAprovacaoCa: number;
  prazoAvisoPrevio: number;
  prazoColetaPesquisa: number;
  dataMarcoZero: string | null;
  dataIdvInicioBrainstorm: string | null;
  dataIdvInicioTerceirizada: string | null;
  dataPfInicioElaboracao: string | null;
  dataPfAprovacaoCa: string | null;
  dataPesquisaLancamento: string | null;
  dataPesquisaAvisoPrevio: string | null;
  dataPesquisaLimiteColeta: string | null;
  status: string;
}

export function usePresidenciaEventos() {
  const [eventos, setEventos] = useState<PresidenciaEvento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('presidencia_eventos')
        .select('*')
        .order('data_evento', { ascending: true });

      if (error) throw error;

      const mapped: PresidenciaEvento[] = (data || []).map((e: any) => ({
        id: e.id,
        nomeEvento: e.nome_evento,
        dataEvento: e.data_evento,
        dataReferenciaStatus: e.data_referencia_status,
        periodicidade: e.periodicidade,
        prazoIdvBrainstorm: e.prazo_idv_brainstorm,
        prazoIdvTerceirizada: e.prazo_idv_terceirizada,
        prazoPfElaboracao: e.prazo_pf_elaboracao,
        prazoPfAprovacaoCa: e.prazo_pf_aprovacao_ca,
        prazoPesquisaConselheiros: e.prazo_pesquisa_conselheiros,
        dataMarcoZero: e.data_marco_zero,
        dataIdvInicioBrainstorm: e.data_idv_inicio_brainstorm,
        dataIdvInicioTerceirizada: e.data_idv_inicio_terceirizada,
        dataPfInicioElaboracao: e.data_pf_inicio_elaboracao,
        dataPfAprovacaoCa: e.data_pf_aprovacao_ca,
        dataPesquisaLancamento: e.data_pesquisa_lancamento,
        dataPesquisaAvisoPrevio: e.data_pesquisa_aviso_previo,
        dataPesquisaLimiteColeta: e.data_pesquisa_limite_coleta,
        status: e.status,
      }));

      setEventos(mapped);
    } catch (error) {
      console.error('Erro ao carregar eventos de presidência:', error);
      toast({ title: 'Erro ao carregar eventos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const createEvento = async (input: PresidenciaEventoInput) => {
    try {
      const cronograma = calcularCronograma(input);

      const { error } = await supabase
        .from('presidencia_eventos')
        .insert({
          nome_evento: input.nomeEvento,
          data_evento: input.dataEvento,
          data_referencia_status: input.dataReferenciaStatus,
          prazo_idv_brainstorm: input.prazoIdvBrainstorm,
          prazo_idv_terceirizada: input.prazoIdvTerceirizada,
          prazo_pf_elaboracao: input.prazoPfElaboracao,
          prazo_pf_aprovacao_ca: input.prazoPfAprovacaoCa,
          prazo_pesquisa_conselheiros: input.prazoPesquisaConselheiros,
          data_marco_zero: cronograma.dataMarcoZero,
          data_idv_inicio_brainstorm: cronograma.dataIdvInicioBrainstorm,
          data_idv_inicio_terceirizada: cronograma.dataIdvInicioTerceirizada,
          data_pf_inicio_elaboracao: cronograma.dataPfInicioElaboracao,
          data_pf_aprovacao_ca: cronograma.dataPfAprovacaoCa,
          data_pesquisa_lancamento: cronograma.dataPesquisaLancamento,
          data_pesquisa_aviso_previo: cronograma.dataPesquisaAvisoPrevio,
          data_pesquisa_limite_coleta: cronograma.dataPesquisaLimiteColeta,
        } as any);

      if (error) throw error;
      await fetchEventos();
      toast({ title: 'Evento criado com cronograma calculado!' });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({ title: 'Erro ao criar evento', variant: 'destructive' });
      throw error;
    }
  };

  const updateEvento = async (id: string, input: PresidenciaEventoInput) => {
    try {
      const cronograma = calcularCronograma(input);

      const { error } = await supabase
        .from('presidencia_eventos')
        .update({
          nome_evento: input.nomeEvento,
          data_evento: input.dataEvento,
          data_referencia_status: input.dataReferenciaStatus,
          prazo_idv_brainstorm: input.prazoIdvBrainstorm,
          prazo_idv_terceirizada: input.prazoIdvTerceirizada,
          prazo_pf_elaboracao: input.prazoPfElaboracao,
          prazo_pf_aprovacao_ca: input.prazoPfAprovacaoCa,
          prazo_pesquisa_conselheiros: input.prazoPesquisaConselheiros,
          data_marco_zero: cronograma.dataMarcoZero,
          data_idv_inicio_brainstorm: cronograma.dataIdvInicioBrainstorm,
          data_idv_inicio_terceirizada: cronograma.dataIdvInicioTerceirizada,
          data_pf_inicio_elaboracao: cronograma.dataPfInicioElaboracao,
          data_pf_aprovacao_ca: cronograma.dataPfAprovacaoCa,
          data_pesquisa_lancamento: cronograma.dataPesquisaLancamento,
          data_pesquisa_aviso_previo: cronograma.dataPesquisaAvisoPrevio,
          data_pesquisa_limite_coleta: cronograma.dataPesquisaLimiteColeta,
        } as any)
        .eq('id', id);

      if (error) throw error;
      await fetchEventos();
      toast({ title: 'Evento atualizado e cronograma recalculado!' });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast({ title: 'Erro ao atualizar evento', variant: 'destructive' });
      throw error;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('presidencia_eventos')
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

  return { eventos, loading, createEvento, updateEvento, deleteEvento, refetch: fetchEventos };
}
