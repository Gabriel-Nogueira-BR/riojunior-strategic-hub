import { useState } from 'react';
import { Plus, Edit2, Trash2, Target, ChevronDown, ChevronRight, Calendar, Loader2, Settings } from 'lucide-react';
import { OKREstrategica, Objetivo, KeyResult, Ciclo, DIRETORIAS, DIRETORIAS_SIGLAS } from '@/types';
import { formatCurrency, formatDateString } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useOKRs } from '@/hooks/useOKRs';

type TabView = 'estrategico' | 'tatico';

const StrategicPanelView = () => {
  const {
    okrsEstrategicas,
    objetivos,
    keyResults,
    ciclos,
    loading,
    createOKREstrategica,
    updateOKREstrategica,
    deleteOKREstrategica,
    createObjetivo,
    updateObjetivo,
    deleteObjetivo,
    createKeyResult,
    updateKeyResult,
    deleteKeyResult,
    createCiclo,
    updateCiclo,
    deleteCiclo,
    getObjetivosByOKR,
    getObjetivosByDiretoriaAndCiclo,
    getKeyResultsByObjetivo,
    calculateProgress,
    countCompletedKRs
  } = useOKRs();

  const [activeTab, setActiveTab] = useState<TabView>('estrategico');
  const [selectedCicloId, setSelectedCicloId] = useState<string | null>(null);
  const [expandedObjetivos, setExpandedObjetivos] = useState<Set<string>>(new Set());
  
  // Modal states
  const [showOKRModal, setShowOKRModal] = useState(false);
  const [showObjetivoModal, setShowObjetivoModal] = useState(false);
  const [showKRModal, setShowKRModal] = useState(false);
  const [showCicloModal, setShowCicloModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  
  // Form states
  const [okrForm, setOkrForm] = useState<Partial<OKREstrategica>>({ ano: new Date().getFullYear() });
  const [objetivoForm, setObjetivoForm] = useState<Partial<Objetivo>>({});
  const [krForm, setKrForm] = useState<Partial<KeyResult>>({ tipoMetrica: 'quantidade', meta: 0, atual: 0 });
  const [cicloForm, setCicloForm] = useState<Partial<Ciclo>>({ tipo: 'tatico', numero: 1, ano: new Date().getFullYear() });
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const ciclosTaticos = ciclos.filter(c => c.tipo === 'tatico' && c.ano === currentYear);

  const toggleObjetivo = (id: string) => {
    setExpandedObjetivos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Format monetary value from cents
  const formatMoneyInput = (value: number, tipoMetrica: string) => {
    if (tipoMetrica === 'valor') {
      return (value / 100).toFixed(2);
    }
    return value.toString();
  };

  const parseMoneyInput = (value: string, tipoMetrica: string) => {
    if (tipoMetrica === 'valor') {
      return Math.round(parseFloat(value || '0') * 100);
    }
    return parseFloat(value || '0');
  };

  // Handlers
  const handleSaveOKR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateOKREstrategica(editingId, okrForm);
    } else {
      await createOKREstrategica(okrForm as Omit<OKREstrategica, 'id'>);
    }
    setShowOKRModal(false);
    setOkrForm({ ano: currentYear });
    setEditingId(null);
  };

  const handleSaveObjetivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateObjetivo(editingId, objetivoForm);
    } else {
      await createObjetivo(objetivoForm as Omit<Objetivo, 'id'>);
    }
    setShowObjetivoModal(false);
    setObjetivoForm({});
    setEditingId(null);
  };

  const handleSaveKR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateKeyResult(editingId, krForm);
    } else {
      await createKeyResult(krForm as Omit<KeyResult, 'id'>);
    }
    setShowKRModal(false);
    setKrForm({ tipoMetrica: 'quantidade', meta: 0, atual: 0 });
    setEditingId(null);
  };

  const handleSaveCiclo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCiclo(editingId, cicloForm);
    } else {
      await createCiclo(cicloForm as Omit<Ciclo, 'id'>);
    }
    setShowCicloModal(false);
    setCicloForm({ tipo: 'tatico', numero: 1, ano: currentYear });
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    switch (deleteConfirm.type) {
      case 'okr':
        await deleteOKREstrategica(deleteConfirm.id);
        break;
      case 'objetivo':
        await deleteObjetivo(deleteConfirm.id);
        break;
      case 'kr':
        await deleteKeyResult(deleteConfirm.id);
        break;
      case 'ciclo':
        await deleteCiclo(deleteConfirm.id);
        break;
    }
    setDeleteConfirm(null);
  };

  const openEditOKR = (okr: OKREstrategica) => {
    setOkrForm(okr);
    setEditingId(okr.id);
    setShowOKRModal(true);
  };

  const openEditObjetivo = (obj: Objetivo) => {
    setObjetivoForm(obj);
    setEditingId(obj.id);
    setShowObjetivoModal(true);
  };

  const openEditKR = (kr: KeyResult) => {
    setKrForm(kr);
    setEditingId(kr.id);
    setShowKRModal(true);
  };

  const openEditCiclo = (ciclo: Ciclo) => {
    setCicloForm(ciclo);
    setEditingId(ciclo.id);
    setShowCicloModal(true);
  };

  const openAddObjetivo = (nivel: 'estrategico' | 'tatico', okrId?: string, diretoria?: string) => {
    setObjetivoForm({
      nivel,
      okrEstrategicaId: okrId,
      diretoria,
      cicloId: nivel === 'tatico' ? selectedCicloId || undefined : undefined
    });
    setEditingId(null);
    setShowObjetivoModal(true);
  };

  const openAddKR = (objetivoId: string) => {
    setKrForm({ objetivoId, tipoMetrica: 'quantidade', meta: 0, atual: 0 });
    setEditingId(null);
    setShowKRModal(true);
  };

  const formatKRValue = (kr: KeyResult) => {
    if (kr.tipoMetrica === 'valor') {
      return formatCurrency(kr.atual / 100);
    }
    if (kr.tipoMetrica === 'porcentagem') {
      return `${kr.atual}%`;
    }
    return kr.atual.toString();
  };

  const formatKRMeta = (kr: KeyResult) => {
    if (kr.tipoMetrica === 'valor') {
      return formatCurrency(kr.meta / 100);
    }
    if (kr.tipoMetrica === 'porcentagem') {
      return `${kr.meta}%`;
    }
    return kr.meta.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderKRRow = (kr: KeyResult, index: number) => {
    const progress = kr.meta > 0 ? Math.round((kr.atual / kr.meta) * 100) : 0;
    
    return (
      <div key={kr.id} className="grid grid-cols-12 gap-2 py-2 px-3 bg-card/50 hover:bg-card group items-center">
        <div className="col-span-1 text-xs font-bold text-muted-foreground">KR {index + 1}</div>
        <div className="col-span-5 text-sm text-foreground truncate">{kr.titulo}</div>
        <div className="col-span-2 text-center">
          <input
            type="text"
            value={kr.tipoMetrica === 'valor' ? (kr.atual / 100).toFixed(2) : kr.atual}
            onChange={(e) => {
              const newValue = kr.tipoMetrica === 'valor' 
                ? Math.round(parseFloat(e.target.value || '0') * 100)
                : parseFloat(e.target.value || '0');
              updateKeyResult(kr.id, { atual: newValue });
            }}
            className="w-full bg-transparent border border-border rounded px-2 py-1 text-xs text-center text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="col-span-1 text-xs text-center text-muted-foreground">{formatKRMeta(kr)}</div>
        <div className="col-span-1 text-xs text-center">
          <span className={`font-bold ${progress >= 100 ? 'text-accent' : progress >= 50 ? 'text-rio-gold' : 'text-destructive'}`}>
            {progress}%
          </span>
        </div>
        <div className="col-span-2 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openEditKR(kr)}
            className="p-1 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded transition-colors"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => setDeleteConfirm({ type: 'kr', id: kr.id })}
            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  const renderObjetivoCard = (obj: Objetivo, index: number, showActions = true) => {
    const krs = getKeyResultsByObjetivo(obj.id);
    const progress = calculateProgress(krs);
    const completedKRs = countCompletedKRs(krs);
    const isExpanded = expandedObjetivos.has(obj.id);

    return (
      <div key={obj.id} className="border border-border rounded-lg overflow-hidden bg-card/30">
        {/* Objetivo Header */}
        <div 
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => toggleObjetivo(obj.id)}
        >
          <button className="text-muted-foreground">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">Objetivo {obj.nivel === 'estrategico' ? 'Estratégico' : 'Tático'}:</p>
            <p className="font-medium text-foreground">{obj.titulo || '-'}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">KRs Concluídos</p>
              <p className="font-bold text-foreground">{completedKRs}/{krs.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Porcentagem</p>
              <p className={`font-bold ${progress >= 100 ? 'text-accent' : progress >= 50 ? 'text-rio-gold' : 'text-destructive'}`}>
                {progress}%
              </p>
            </div>
            {showActions && (
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => openEditObjetivo(obj)}
                  className="p-1.5 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'objetivo', id: obj.id })}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* KRs Table */}
        {isExpanded && (
          <div className="border-t border-border">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 py-2 px-3 bg-secondary/50 text-xs font-bold text-muted-foreground">
              <div className="col-span-1"></div>
              <div className="col-span-5">Key Result</div>
              <div className="col-span-2 text-center">Alcançado</div>
              <div className="col-span-1 text-center">Meta</div>
              <div className="col-span-1 text-center">%</div>
              <div className="col-span-2"></div>
            </div>
            
            {/* KR Rows */}
            {krs.map((kr, i) => renderKRRow(kr, i))}
            
            {/* Add KR Button */}
            <div className="p-2 border-t border-border">
              <button
                onClick={() => openAddKR(obj.id)}
                className="w-full py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Adicionar KR
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEstrategicoTab = () => {
    const currentYearOKRs = okrsEstrategicas.filter(o => o.ano === currentYear);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-foreground">OKRs Estratégicas {currentYear}</h3>
            <p className="text-sm text-muted-foreground">Objetivos estratégicos da federação</p>
          </div>
          <button
            onClick={() => {
              setOkrForm({ ano: currentYear });
              setEditingId(null);
              setShowOKRModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Nova OKR
          </button>
        </div>

        {/* OKRs List */}
        {currentYearOKRs.length === 0 ? (
          <div className="text-center py-12 bg-secondary/50 rounded-xl border border-dashed border-border">
            <Target className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Nenhuma OKR estratégica cadastrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentYearOKRs.map(okr => {
              const objs = getObjetivosByOKR(okr.id);
              const allKRs = objs.flatMap(o => getKeyResultsByObjetivo(o.id));
              const totalProgress = calculateProgress(allKRs);

              return (
                <div key={okr.id} className="card-elevated overflow-hidden">
                  {/* OKR Header */}
                  <div className="bg-rio-gold/20 border-b border-rio-gold/30 p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-rio-gold font-bold mb-1">OBJETIVO ESTRATÉGICO:</p>
                      <p className="text-foreground font-medium">{okr.titulo}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl font-bold ${totalProgress > 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                        {totalProgress > 0 ? `${totalProgress}%` : '#DIV/0!'}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditOKR(okr)}
                          className="p-1.5 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'okr', id: okr.id })}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div className="p-4 space-y-4">
                    {objs.map((obj, i) => renderObjetivoCard(obj, i))}
                    
                    {/* Add Objetivo Button */}
                    <button
                      onClick={() => openAddObjetivo('estrategico', okr.id)}
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Adicionar Objetivo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderTaticoTab = () => {
    const selectedCiclo = ciclos.find(c => c.id === selectedCicloId);

    return (
      <div className="space-y-6">
        {/* Ciclo Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground">Ciclo:</span>
            <select
              value={selectedCicloId || ''}
              onChange={e => setSelectedCicloId(e.target.value || null)}
              className="input-field flex-1 max-w-xs"
            >
              <option value="">Selecione um ciclo</option>
              {ciclosTaticos.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome} {c.dataInicio && c.dataFim ? `(${formatDateString(c.dataInicio)} - ${formatDateString(c.dataFim)})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            {selectedCiclo && (
              <button
                onClick={() => openEditCiclo(selectedCiclo)}
                className="btn-secondary flex items-center gap-2"
              >
                <Calendar size={16} /> Editar Período
              </button>
            )}
            <button
              onClick={() => {
                setCicloForm({ tipo: 'tatico', numero: ciclosTaticos.length + 1, ano: currentYear, nome: `${ciclosTaticos.length + 1}° Ciclo ${currentYear}` });
                setEditingId(null);
                setShowCicloModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Novo Ciclo
            </button>
          </div>
        </div>

        {!selectedCicloId ? (
          <div className="text-center py-12 bg-secondary/50 rounded-xl border border-dashed border-border">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Selecione um ciclo para visualizar as OKRs Táticas.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {DIRETORIAS.map(diretoria => {
              const sigla = DIRETORIAS_SIGLAS[diretoria] || diretoria;
              const objs = getObjetivosByDiretoriaAndCiclo(diretoria, selectedCicloId);
              const allKRs = objs.flatMap(o => getKeyResultsByObjetivo(o.id));
              const totalProgress = calculateProgress(allKRs);

              return (
                <div key={diretoria} className="card-elevated overflow-hidden">
                  {/* Diretoria Header */}
                  <div className="bg-primary/20 border-b border-primary/30 p-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{sigla}</span>
                    <span className={`text-2xl font-bold ${totalProgress > 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                      {totalProgress > 0 ? `${totalProgress}%` : '#DIV/0!'}
                    </span>
                  </div>

                  {/* Objetivos */}
                  <div className="p-4 space-y-4">
                    {objs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Nenhum objetivo cadastrado</p>
                    ) : (
                      objs.map((obj, i) => renderObjetivoCard(obj, i))
                    )}
                    
                    <button
                      onClick={() => openAddObjetivo('tatico', undefined, diretoria)}
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Adicionar Objetivo Tático
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Essa ação é irreversível. Deseja continuar?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* OKR Modal */}
      {showOKRModal && (
        <Modal title={editingId ? 'Editar OKR Estratégica' : 'Nova OKR Estratégica'} onClose={() => setShowOKRModal(false)}>
          <form onSubmit={handleSaveOKR} className="space-y-4">
            <div>
              <label className="label-sm">Título</label>
              <input
                type="text"
                value={okrForm.titulo || ''}
                onChange={e => setOkrForm({ ...okrForm, titulo: e.target.value })}
                className="input-field"
                placeholder="Ex: Captação que gera previsibilidade..."
              />
            </div>
            <div>
              <label className="label-sm">Descrição (opcional)</label>
              <textarea
                value={okrForm.descricao || ''}
                onChange={e => setOkrForm({ ...okrForm, descricao: e.target.value })}
                className="input-field resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="label-sm">Ano</label>
              <input
                type="number"
                value={okrForm.ano || currentYear}
                onChange={e => setOkrForm({ ...okrForm, ano: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button type="button" onClick={() => setShowOKRModal(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">{editingId ? 'Salvar' : 'Criar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Objetivo Modal */}
      {showObjetivoModal && (
        <Modal title={editingId ? 'Editar Objetivo' : 'Novo Objetivo'} onClose={() => setShowObjetivoModal(false)}>
          <form onSubmit={handleSaveObjetivo} className="space-y-4">
            <div>
              <label className="label-sm">Título do Objetivo</label>
              <input
                type="text"
                value={objetivoForm.titulo || ''}
                onChange={e => setObjetivoForm({ ...objetivoForm, titulo: e.target.value })}
                className="input-field"
                placeholder="Ex: Estruturar bases operacionais..."
              />
            </div>
            <div>
              <label className="label-sm">Descrição (opcional)</label>
              <textarea
                value={objetivoForm.descricao || ''}
                onChange={e => setObjetivoForm({ ...objetivoForm, descricao: e.target.value })}
                className="input-field resize-none"
                rows={2}
              />
            </div>
            {objetivoForm.nivel === 'tatico' && (
              <div>
                <label className="label-sm">Diretoria</label>
                <select
                  value={objetivoForm.diretoria || ''}
                  onChange={e => setObjetivoForm({ ...objetivoForm, diretoria: e.target.value })}
                  className="input-field"
                >
                  <option value="">Selecione...</option>
                  {DIRETORIAS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button type="button" onClick={() => setShowObjetivoModal(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">{editingId ? 'Salvar' : 'Criar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* KR Modal */}
      {showKRModal && (
        <Modal title={editingId ? 'Editar Key Result' : 'Novo Key Result'} onClose={() => setShowKRModal(false)}>
          <form onSubmit={handleSaveKR} className="space-y-4">
            <div>
              <label className="label-sm">Título do KR</label>
              <input
                type="text"
                value={krForm.titulo || ''}
                onChange={e => setKrForm({ ...krForm, titulo: e.target.value })}
                className="input-field"
                placeholder="Ex: Ter pelo menos 200k de captação"
              />
            </div>
            <div>
              <label className="label-sm">Tipo de Métrica</label>
              <select
                value={krForm.tipoMetrica || 'quantidade'}
                onChange={e => setKrForm({ ...krForm, tipoMetrica: e.target.value as KeyResult['tipoMetrica'] })}
                className="input-field"
              >
                <option value="valor">Valor Monetário (R$)</option>
                <option value="quantidade">Quantidade</option>
                <option value="porcentagem">Porcentagem (%)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Meta (Noção de Sucesso)</label>
                <input
                  type="number"
                  step={krForm.tipoMetrica === 'valor' ? '0.01' : '1'}
                  value={krForm.tipoMetrica === 'valor' ? ((krForm.meta || 0) / 100).toFixed(2) : krForm.meta || 0}
                  onChange={e => setKrForm({ 
                    ...krForm, 
                    meta: krForm.tipoMetrica === 'valor' 
                      ? Math.round(parseFloat(e.target.value || '0') * 100)
                      : parseFloat(e.target.value || '0')
                  })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="label-sm">Valor Atual</label>
                <input
                  type="number"
                  step={krForm.tipoMetrica === 'valor' ? '0.01' : '1'}
                  value={krForm.tipoMetrica === 'valor' ? ((krForm.atual || 0) / 100).toFixed(2) : krForm.atual || 0}
                  onChange={e => setKrForm({ 
                    ...krForm, 
                    atual: krForm.tipoMetrica === 'valor' 
                      ? Math.round(parseFloat(e.target.value || '0') * 100)
                      : parseFloat(e.target.value || '0')
                  })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="label-sm">Unidade (opcional)</label>
              <input
                type="text"
                value={krForm.unidade || ''}
                onChange={e => setKrForm({ ...krForm, unidade: e.target.value })}
                className="input-field"
                placeholder="Ex: projetos, EJs, etc."
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button type="button" onClick={() => setShowKRModal(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">{editingId ? 'Salvar' : 'Criar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ciclo Modal */}
      {showCicloModal && (
        <Modal title={editingId ? 'Editar Ciclo' : 'Novo Ciclo'} onClose={() => setShowCicloModal(false)}>
          <form onSubmit={handleSaveCiclo} className="space-y-4">
            <div>
              <label className="label-sm">Nome do Ciclo</label>
              <input
                type="text"
                value={cicloForm.nome || ''}
                onChange={e => setCicloForm({ ...cicloForm, nome: e.target.value })}
                className="input-field"
                placeholder="Ex: 1° Ciclo 2026"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Número do Ciclo</label>
                <input
                  type="number"
                  value={cicloForm.numero || 1}
                  onChange={e => setCicloForm({ ...cicloForm, numero: parseInt(e.target.value) })}
                  className="input-field"
                  min={1}
                />
              </div>
              <div>
                <label className="label-sm">Ano</label>
                <input
                  type="number"
                  value={cicloForm.ano || currentYear}
                  onChange={e => setCicloForm({ ...cicloForm, ano: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Data de Início</label>
                <input
                  type="date"
                  value={cicloForm.dataInicio || ''}
                  onChange={e => setCicloForm({ ...cicloForm, dataInicio: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-sm">Data de Término</label>
                <input
                  type="date"
                  value={cicloForm.dataFim || ''}
                  onChange={e => setCicloForm({ ...cicloForm, dataFim: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button type="button" onClick={() => setShowCicloModal(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">{editingId ? 'Salvar' : 'Criar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Painel Estratégico</h2>
        <p className="text-muted-foreground">Acompanhamento de OKRs Estratégicas e Táticas da RioJunior</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-card rounded-lg p-1 border border-border shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('estrategico')}
          className={`px-4 py-2 rounded-md transition-all text-sm font-bold ${
            activeTab === 'estrategico'
              ? 'bg-rio-gold text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          OKRs Estratégicas {currentYear}
        </button>
        <button
          onClick={() => setActiveTab('tatico')}
          className={`px-4 py-2 rounded-md transition-all text-sm font-bold ${
            activeTab === 'tatico'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          OKRs Táticas
        </button>
      </div>

      {/* Content */}
      {activeTab === 'estrategico' ? renderEstrategicoTab() : renderTaticoTab()}
    </div>
  );
};

export default StrategicPanelView;
