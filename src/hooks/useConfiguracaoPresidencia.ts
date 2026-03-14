import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ConfiguracaoPresidencia {
  id: string;
  dataReferenciaStatus: string;
}

export function useConfiguracaoPresidencia() {
  const [config, setConfig] = useState<ConfiguracaoPresidencia | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_presidencia' as any)
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      setConfig({
        id: (data as any).id,
        dataReferenciaStatus: (data as any).data_referencia_status,
      });
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = async (dataReferenciaStatus: string) => {
    if (!config) return;
    try {
      const { error } = await supabase
        .from('configuracoes_presidencia' as any)
        .update({ data_referencia_status: dataReferenciaStatus } as any)
        .eq('id', config.id);

      if (error) throw error;
      setConfig({ ...config, dataReferenciaStatus });
      toast({ title: 'Data de referência SEBRAE atualizada!' });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast({ title: 'Erro ao atualizar configuração', variant: 'destructive' });
    }
  };

  return { config, loading: loading, updateConfig };
}
