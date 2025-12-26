import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OKREstrategica, Objetivo, KeyResult, Ciclo } from '@/types';
import { toast } from 'sonner';

export const useOKRs = () => {
  const [okrsEstrategicas, setOkrsEstrategicas] = useState<OKREstrategica[]>([]);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch OKRs Estratégicas
      const { data: okrsData, error: okrsError } = await supabase
        .from('okrs_estrategicas')
        .select('*')
        .order('ano', { ascending: false });
      
      if (okrsError) throw okrsError;

      // Fetch Objetivos
      const { data: objetivosData, error: objetivosError } = await supabase
        .from('objetivos')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (objetivosError) throw objetivosError;

      // Fetch Key Results
      const { data: krsData, error: krsError } = await supabase
        .from('key_results')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (krsError) throw krsError;

      // Fetch Ciclos
      const { data: ciclosData, error: ciclosError } = await supabase
        .from('ciclos')
        .select('*')
        .order('ano', { ascending: false })
        .order('numero', { ascending: true });
      
      if (ciclosError) throw ciclosError;

      setOkrsEstrategicas(okrsData?.map(okr => ({
        id: okr.id,
        titulo: okr.titulo,
        descricao: okr.descricao || undefined,
        ano: okr.ano
      })) || []);

      setObjetivos(objetivosData?.map(obj => ({
        id: obj.id,
        titulo: obj.titulo,
        descricao: obj.descricao || undefined,
        nivel: obj.nivel as Objetivo['nivel'],
        okrEstrategicaId: obj.okr_estrategica_id || undefined,
        diretoria: obj.diretoria || undefined,
        objetivoPaiId: obj.objetivo_pai_id || undefined,
        cicloId: obj.ciclo_id || undefined
      })) || []);

      setKeyResults(krsData?.map(kr => ({
        id: kr.id,
        objetivoId: kr.objetivo_id,
        titulo: kr.titulo,
        descricao: kr.descricao || undefined,
        tipoMetrica: kr.tipo_metrica as KeyResult['tipoMetrica'],
        meta: Number(kr.meta),
        atual: Number(kr.atual),
        unidade: kr.unidade || undefined
      })) || []);

      setCiclos(ciclosData?.map(c => ({
        id: c.id,
        nome: c.nome,
        tipo: c.tipo as Ciclo['tipo'],
        numero: c.numero,
        ano: c.ano,
        dataInicio: c.data_inicio || undefined,
        dataFim: c.data_fim || undefined
      })) || []);

    } catch (error: any) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Ciclos
  const createCiclo = async (data: Omit<Ciclo, 'id'>) => {
    try {
      const { data: newCiclo, error } = await supabase
        .from('ciclos')
        .insert({
          nome: data.nome,
          tipo: data.tipo,
          numero: data.numero,
          ano: data.ano,
          data_inicio: data.dataInicio || null,
          data_fim: data.dataFim || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setCiclos(prev => [...prev, {
        id: newCiclo.id,
        nome: newCiclo.nome,
        tipo: newCiclo.tipo as Ciclo['tipo'],
        numero: newCiclo.numero,
        ano: newCiclo.ano,
        dataInicio: newCiclo.data_inicio || undefined,
        dataFim: newCiclo.data_fim || undefined
      }]);
      
      toast.success('Ciclo criado com sucesso!');
      return newCiclo;
    } catch (error: any) {
      toast.error('Erro ao criar ciclo: ' + error.message);
      throw error;
    }
  };

  const updateCiclo = async (id: string, data: Partial<Ciclo>) => {
    try {
      const { error } = await supabase
        .from('ciclos')
        .update({
          nome: data.nome,
          tipo: data.tipo,
          numero: data.numero,
          ano: data.ano,
          data_inicio: data.dataInicio || null,
          data_fim: data.dataFim || null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setCiclos(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      toast.success('Ciclo atualizado!');
    } catch (error: any) {
      toast.error('Erro ao atualizar ciclo: ' + error.message);
      throw error;
    }
  };

  const deleteCiclo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ciclos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCiclos(prev => prev.filter(c => c.id !== id));
      toast.success('Ciclo excluído!');
    } catch (error: any) {
      toast.error('Erro ao excluir ciclo: ' + error.message);
      throw error;
    }
  };

  // CRUD OKRs Estratégicas
  const createOKREstrategica = async (data: Omit<OKREstrategica, 'id'>) => {
    try {
      const { data: newOkr, error } = await supabase
        .from('okrs_estrategicas')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao || null,
          ano: data.ano
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setOkrsEstrategicas(prev => [...prev, {
        id: newOkr.id,
        titulo: newOkr.titulo,
        descricao: newOkr.descricao || undefined,
        ano: newOkr.ano
      }]);
      
      toast.success('OKR Estratégica criada!');
      return newOkr;
    } catch (error: any) {
      toast.error('Erro ao criar OKR: ' + error.message);
      throw error;
    }
  };

  const updateOKREstrategica = async (id: string, data: Partial<OKREstrategica>) => {
    try {
      const { error } = await supabase
        .from('okrs_estrategicas')
        .update({
          titulo: data.titulo,
          descricao: data.descricao || null,
          ano: data.ano
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setOkrsEstrategicas(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
      toast.success('OKR atualizada!');
    } catch (error: any) {
      toast.error('Erro ao atualizar OKR: ' + error.message);
      throw error;
    }
  };

  const deleteOKREstrategica = async (id: string) => {
    try {
      const { error } = await supabase
        .from('okrs_estrategicas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setOkrsEstrategicas(prev => prev.filter(o => o.id !== id));
      toast.success('OKR excluída!');
    } catch (error: any) {
      toast.error('Erro ao excluir OKR: ' + error.message);
      throw error;
    }
  };

  // CRUD Objetivos
  const createObjetivo = async (data: Omit<Objetivo, 'id'>) => {
    try {
      const { data: newObj, error } = await supabase
        .from('objetivos')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao || null,
          nivel: data.nivel,
          okr_estrategica_id: data.okrEstrategicaId || null,
          diretoria: data.diretoria || null,
          objetivo_pai_id: data.objetivoPaiId || null,
          ciclo_id: data.cicloId || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setObjetivos(prev => [...prev, {
        id: newObj.id,
        titulo: newObj.titulo,
        descricao: newObj.descricao || undefined,
        nivel: newObj.nivel as Objetivo['nivel'],
        okrEstrategicaId: newObj.okr_estrategica_id || undefined,
        diretoria: newObj.diretoria || undefined,
        objetivoPaiId: newObj.objetivo_pai_id || undefined,
        cicloId: newObj.ciclo_id || undefined
      }]);
      
      toast.success('Objetivo criado!');
      return newObj;
    } catch (error: any) {
      toast.error('Erro ao criar objetivo: ' + error.message);
      throw error;
    }
  };

  const updateObjetivo = async (id: string, data: Partial<Objetivo>) => {
    try {
      const updateData: any = {};
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.descricao !== undefined) updateData.descricao = data.descricao || null;
      if (data.nivel !== undefined) updateData.nivel = data.nivel;
      if (data.okrEstrategicaId !== undefined) updateData.okr_estrategica_id = data.okrEstrategicaId || null;
      if (data.diretoria !== undefined) updateData.diretoria = data.diretoria || null;
      if (data.objetivoPaiId !== undefined) updateData.objetivo_pai_id = data.objetivoPaiId || null;
      if (data.cicloId !== undefined) updateData.ciclo_id = data.cicloId || null;

      const { error } = await supabase
        .from('objetivos')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setObjetivos(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
      toast.success('Objetivo atualizado!');
    } catch (error: any) {
      toast.error('Erro ao atualizar objetivo: ' + error.message);
      throw error;
    }
  };

  const deleteObjetivo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('objetivos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setObjetivos(prev => prev.filter(o => o.id !== id));
      toast.success('Objetivo excluído!');
    } catch (error: any) {
      toast.error('Erro ao excluir objetivo: ' + error.message);
      throw error;
    }
  };

  // CRUD Key Results
  const createKeyResult = async (data: Omit<KeyResult, 'id'>) => {
    try {
      const { data: newKr, error } = await supabase
        .from('key_results')
        .insert({
          objetivo_id: data.objetivoId,
          titulo: data.titulo,
          descricao: data.descricao || null,
          tipo_metrica: data.tipoMetrica,
          meta: data.meta,
          atual: data.atual || 0,
          unidade: data.unidade || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setKeyResults(prev => [...prev, {
        id: newKr.id,
        objetivoId: newKr.objetivo_id,
        titulo: newKr.titulo,
        descricao: newKr.descricao || undefined,
        tipoMetrica: newKr.tipo_metrica as KeyResult['tipoMetrica'],
        meta: Number(newKr.meta),
        atual: Number(newKr.atual),
        unidade: newKr.unidade || undefined
      }]);
      
      toast.success('Key Result criado!');
      return newKr;
    } catch (error: any) {
      toast.error('Erro ao criar KR: ' + error.message);
      throw error;
    }
  };

  const updateKeyResult = async (id: string, data: Partial<KeyResult>) => {
    try {
      const updateData: any = {};
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.descricao !== undefined) updateData.descricao = data.descricao || null;
      if (data.tipoMetrica !== undefined) updateData.tipo_metrica = data.tipoMetrica;
      if (data.meta !== undefined) updateData.meta = data.meta;
      if (data.atual !== undefined) updateData.atual = data.atual;
      if (data.unidade !== undefined) updateData.unidade = data.unidade || null;

      const { error } = await supabase
        .from('key_results')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setKeyResults(prev => prev.map(kr => kr.id === id ? { ...kr, ...data } : kr));
      toast.success('Key Result atualizado!');
    } catch (error: any) {
      toast.error('Erro ao atualizar KR: ' + error.message);
      throw error;
    }
  };

  const deleteKeyResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('key_results')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setKeyResults(prev => prev.filter(kr => kr.id !== id));
      toast.success('Key Result excluído!');
    } catch (error: any) {
      toast.error('Erro ao excluir KR: ' + error.message);
      throw error;
    }
  };

  // Helper functions
  const getObjetivosByOKR = (okrId: string) => {
    return objetivos.filter(obj => obj.okrEstrategicaId === okrId && obj.nivel === 'estrategico');
  };

  const getObjetivosByDiretoriaAndCiclo = (diretoria: string, cicloId?: string) => {
    return objetivos.filter(obj => 
      obj.diretoria === diretoria && 
      obj.nivel === 'tatico' &&
      (!cicloId || obj.cicloId === cicloId)
    );
  };

  const getKeyResultsByObjetivo = (objetivoId: string) => {
    return keyResults.filter(kr => kr.objetivoId === objetivoId);
  };

  const calculateProgress = (krs: KeyResult[]) => {
    if (krs.length === 0) return 0;
    const totalProgress = krs.reduce((acc, kr) => {
      const progress = kr.meta > 0 ? (kr.atual / kr.meta) * 100 : 0;
      return acc + Math.min(progress, 100);
    }, 0);
    return Math.round(totalProgress / krs.length);
  };

  const countCompletedKRs = (krs: KeyResult[]) => {
    return krs.filter(kr => kr.atual >= kr.meta).length;
  };

  return {
    okrsEstrategicas,
    objetivos,
    keyResults,
    ciclos,
    loading,
    refetch: fetchData,
    // Ciclos
    createCiclo,
    updateCiclo,
    deleteCiclo,
    // OKRs
    createOKREstrategica,
    updateOKREstrategica,
    deleteOKREstrategica,
    // Objetivos
    createObjetivo,
    updateObjetivo,
    deleteObjetivo,
    // Key Results
    createKeyResult,
    updateKeyResult,
    deleteKeyResult,
    // Helpers
    getObjetivosByOKR,
    getObjetivosByDiretoriaAndCiclo,
    getKeyResultsByObjetivo,
    calculateProgress,
    countCompletedKRs
  };
};
