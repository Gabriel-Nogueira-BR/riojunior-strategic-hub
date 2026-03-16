import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';

export type KanbanStatus = 'a_fazer' | 'em_andamento' | 'aprovacao' | 'concluido';

export interface DemandaFormacao {
  id: string;
  eventoId: string;
  nomeEvento: string;
  etapa: string;
  etapaLabel: string;
  status: KanbanStatus;
  prazo: string | null;
}

const ETAPA_LABELS: Record<string, string> = {
  brainstorm_idv: 'Brainstorm IDV',
  terceirizada_idv: 'Terceirizada IDV',
  elaboracao_pf: 'Elaboração PF',
  aprovacao_pf: 'Aprovação CA',
};

export function useDemandasFormacao(eventos: PresidenciaEvento[]) {
  const [demandas, setDemandas] = useState<DemandaFormacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDemandas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('demandas_formacao' as any)
        .select('*');

      if (error) throw error;

      const mapped: DemandaFormacao[] = (data || []).map((d: any) => {
        const evento = eventos.find(e => e.id === d.evento_id);
        return {
          id: d.id,
          eventoId: d.evento_id,
          nomeEvento: evento?.nomeEvento || 'Evento desconhecido',
          etapa: d.etapa,
          etapaLabel: ETAPA_LABELS[d.etapa] || d.etapa,
          status: d.status as KanbanStatus,
          prazo: d.prazo,
        };
      });

      setDemandas(mapped);
    } catch (error) {
      console.error('Erro ao carregar demandas:', error);
    } finally {
      setLoading(false);
    }
  }, [eventos]);

  useEffect(() => {
    if (eventos.length > 0) {
      fetchDemandas();
    } else {
      setLoading(false);
    }
  }, [eventos, fetchDemandas]);

  // Sync demandas from presidência eventos - create missing, remove orphaned
  const syncDemandas = useCallback(async () => {
    const expectedDemandas: { evento_id: string; etapa: string; prazo: string | null }[] = [];

    for (const ev of eventos) {
      if (ev.dataIdvInicioBrainstorm) {
        expectedDemandas.push({ evento_id: ev.id, etapa: 'brainstorm_idv', prazo: ev.dataIdvInicioBrainstorm });
      }
      if (ev.dataIdvInicioTerceirizada) {
        expectedDemandas.push({ evento_id: ev.id, etapa: 'terceirizada_idv', prazo: ev.dataIdvInicioTerceirizada });
      }
      if (ev.dataPfInicioElaboracao) {
        expectedDemandas.push({ evento_id: ev.id, etapa: 'elaboracao_pf', prazo: ev.dataPfInicioElaboracao });
      }
      if (ev.dataPfAprovacaoCa) {
        expectedDemandas.push({ evento_id: ev.id, etapa: 'aprovacao_pf', prazo: ev.dataPfAprovacaoCa });
      }
    }

    try {
      for (const expected of expectedDemandas) {
        const exists = demandas.find(d => d.eventoId === expected.evento_id && d.etapa === expected.etapa);
        if (!exists) {
          await supabase
            .from('demandas_formacao' as any)
            .insert({
              evento_id: expected.evento_id,
              etapa: expected.etapa,
              prazo: expected.prazo,
              status: 'a_fazer',
            } as any);
        } else if (exists.prazo !== expected.prazo) {
          // Update prazo if changed
          await supabase
            .from('demandas_formacao' as any)
            .update({ prazo: expected.prazo } as any)
            .eq('id', exists.id);
        }
      }

      // Remove orphaned demandas
      for (const d of demandas) {
        const stillExists = expectedDemandas.find(e => e.evento_id === d.eventoId && e.etapa === d.etapa);
        if (!stillExists) {
          await supabase
            .from('demandas_formacao' as any)
            .delete()
            .eq('id', d.id);
        }
      }

      await fetchDemandas();
    } catch (error) {
      console.error('Erro ao sincronizar demandas:', error);
    }
  }, [eventos, demandas, fetchDemandas]);

  // Auto-sync when eventos change
  useEffect(() => {
    if (!loading && eventos.length > 0) {
      syncDemandas();
    }
  }, [eventos.length]); // Only on evento count change to avoid infinite loops

  const updateStatus = async (id: string, status: KanbanStatus) => {
    try {
      const { error } = await supabase
        .from('demandas_formacao' as any)
        .update({ status } as any)
        .eq('id', id);

      if (error) throw error;
      setDemandas(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      toast({ title: 'Status atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    }
  };

  return { demandas, loading, updateStatus, syncDemandas };
}
