import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Building2, TrendingUp, Search, Loader2 } from 'lucide-react';
import { EJ } from '@/types';
import { REGIOES } from '@/data/mockData';
import { formatCurrency, formatPercentage, formatCNPJ } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useEJs } from '@/hooks/useEJs';

interface DDRViewProps {
  selectedYear: number;
}

const DDRView = ({ selectedYear }: DDRViewProps) => {
  const { ejs, loading, createEJ, updateEJ, deleteEJ } = useEJs();
  const [ejToDelete, setEjToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegiao, setFilterRegiao] = useState<string>('');
  const [filterCluster, setFilterCluster] = useState<string>('');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<EJ, 'id'> & { id?: string }>({
    nome: '',
    cluster: 1,
    cnpj: '',
    regiao: 'Centro Sul 1',
    localizacao: '',
    faturamentoMeta: 0,
    faturamentoAtual: 0,
    faturamentoQ1: 0,
    faturamentoQ2: 0,
    faturamentoQ3: 0,
    faturamentoQ4: 0
  });
  const [isEditing, setIsEditing] = useState(false);

  const openForm = (ej?: EJ) => {
    if (ej) {
      setFormData(ej);
      setIsEditing(true);
    } else {
      setFormData({
        nome: '',
        cluster: 1,
        cnpj: '',
        regiao: 'Centro Sul 1',
        localizacao: '',
        faturamentoMeta: 0,
        faturamentoAtual: 0,
        faturamentoQ1: 0,
        faturamentoQ2: 0,
        faturamentoQ3: 0,
        faturamentoQ4: 0
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const faturamentoAtual = (formData.faturamentoQ1 || 0) + (formData.faturamentoQ2 || 0) + (formData.faturamentoQ3 || 0) + (formData.faturamentoQ4 || 0);
    
    try {
      if (isEditing && formData.id) {
        await updateEJ(formData.id, { ...formData, faturamentoAtual });
      } else {
        await createEJ({ ...formData, faturamentoAtual });
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setEjToDelete(id);
  };

  const confirmDelete = async () => {
    if (ejToDelete !== null) {
      await deleteEJ(ejToDelete);
      setEjToDelete(null);
    }
  };

  const getClusterBadgeClass = (cluster: number) => {
    const classes: Record<number, string> = {
      1: 'badge-cluster-1',
      2: 'badge-cluster-2',
      3: 'badge-cluster-3',
      4: 'badge-cluster-4',
      5: 'badge-cluster-5'
    };
    return classes[cluster] || 'bg-secondary';
  };

  const getRegiaoBadgeClass = (regiao: string) => {
    const classes: Record<string, string> = {
      'Norte': 'region-norte',
      'Centro Norte': 'region-centro-norte',
      'Centro Sul 1': 'region-centro-sul-1',
      'Centro Sul 2': 'region-centro-sul-2',
      'Sul': 'region-sul'
    };
    return classes[regiao] || 'bg-secondary';
  };

  const filteredEjs = ejs.filter(ej => {
    const matchesSearch = ej.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ej.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegiao = !filterRegiao || ej.regiao === filterRegiao;
    const matchesCluster = !filterCluster || ej.cluster === Number(filterCluster);
    return matchesSearch && matchesRegiao && matchesCluster;
  });

  // Stats
  const totalEjs = ejs.length;
  const totalFaturamento = ejs.reduce((acc, ej) => acc + ej.faturamentoAtual, 0);
  const totalMeta = ejs.reduce((acc, ej) => acc + ej.faturamentoMeta, 0);
  const avgProgress = formatPercentage(totalFaturamento, totalMeta);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Delete Confirmation Modal */}
      {ejToDelete !== null && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Essa ação excluirá a EJ permanentemente."
          onConfirm={confirmDelete}
          onCancel={() => setEjToDelete(null)}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <Modal 
          title={isEditing ? `Editar ${formData.nome}` : "Nova Empresa Júnior"} 
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label-sm">Nome da EJ</label>
                <input 
                  type="text" 
                  value={formData.nome} 
                  onChange={e => setFormData({...formData, nome: e.target.value})} 
                  className="input-field" 
                  placeholder="Nome da EJ" 
                />
              </div>
              <div>
                <label className="label-sm">CNPJ</label>
                <input 
                  type="text" 
                  value={formData.cnpj} 
                  onChange={e => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} 
                  className="input-field" 
                  placeholder="00.000.000/0000-00" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label-sm">Região</label>
                <select 
                  value={formData.regiao} 
                  onChange={e => setFormData({...formData, regiao: e.target.value as EJ['regiao']})} 
                  className="input-field"
                >
                  {REGIOES.map(regiao => (
                    <option key={regiao} value={regiao}>{regiao}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-sm">Cluster (Maturidade)</label>
                <select 
                  value={formData.cluster} 
                  onChange={e => setFormData({...formData, cluster: Number(e.target.value) as EJ['cluster']})} 
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5].map(c => (
                    <option key={c} value={c}>Cluster {c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label-sm">Localização</label>
              <input 
                type="text" 
                value={formData.localizacao} 
                onChange={e => setFormData({...formData, localizacao: e.target.value})} 
                className="input-field" 
                placeholder="IES - Cidade" 
              />
            </div>

            <div className="border-t border-border pt-5 mt-5">
              <p className="label-sm mb-4">Faturamento</p>
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Meta Anual</label>
                  <input 
                    type="number" 
                    value={formData.faturamentoMeta} 
                    onChange={e => setFormData({...formData, faturamentoMeta: Number(e.target.value)})} 
                    className="input-field" 
                    placeholder="R$ 0,00" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Q1</label>
                  <input 
                    type="number" 
                    value={formData.faturamentoQ1 || ''} 
                    onChange={e => setFormData({...formData, faturamentoQ1: Number(e.target.value)})} 
                    className="input-field text-sm" 
                    placeholder="0" 
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Q2</label>
                  <input 
                    type="number" 
                    value={formData.faturamentoQ2 || ''} 
                    onChange={e => setFormData({...formData, faturamentoQ2: Number(e.target.value)})} 
                    className="input-field text-sm" 
                    placeholder="0" 
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Q3</label>
                  <input 
                    type="number" 
                    value={formData.faturamentoQ3 || ''} 
                    onChange={e => setFormData({...formData, faturamentoQ3: Number(e.target.value)})} 
                    className="input-field text-sm" 
                    placeholder="0" 
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Q4</label>
                  <input 
                    type="number" 
                    value={formData.faturamentoQ4 || ''} 
                    onChange={e => setFormData({...formData, faturamentoQ4: Number(e.target.value)})} 
                    className="input-field text-sm" 
                    placeholder="0" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">DDR - Empresas Juniores</h2>
          <p className="text-muted-foreground">Gestão das EJs da rede RioJunior.</p>
        </div>
        <button 
          onClick={() => openForm()} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Nova EJ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalEjs}</p>
              <p className="text-xs text-muted-foreground">EJs Federadas</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalFaturamento)}</p>
              <p className="text-xs text-muted-foreground">Faturamento Total</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rio-gold/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-rio-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalMeta)}</p>
              <p className="text-xs text-muted-foreground">Meta Total</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rio-purple/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-rio-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
              <p className="text-xs text-muted-foreground">Progresso Médio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar EJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select 
            value={filterRegiao} 
            onChange={(e) => setFilterRegiao(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">Todas as Regiões</option>
            {REGIOES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select 
            value={filterCluster} 
            onChange={(e) => setFilterCluster(e.target.value)}
            className="input-field sm:w-40"
          >
            <option value="">Todos os Clusters</option>
            {[1, 2, 3, 4, 5].map(c => (
              <option key={c} value={c}>Cluster {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* EJ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEjs.map((ej) => {
          const progress = formatPercentage(ej.faturamentoAtual, ej.faturamentoMeta);
          
          return (
            <div 
              key={ej.id} 
              className="card-elevated p-5 group relative hover:border-primary/30"
            >
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openForm(ej)} 
                  className="p-1.5 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(ej.id)} 
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {ej.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground text-lg truncate">{ej.nome}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    <span className="truncate">{ej.localizacao}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${getClusterBadgeClass(ej.cluster)}`}>
                  Cluster {ej.cluster}
                </span>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${getRegiaoBadgeClass(ej.regiao)}`}>
                  {ej.regiao}
                </span>
              </div>

              {/* CNPJ */}
              <div className="text-xs text-muted-foreground mb-4">
                <span className="font-medium">CNPJ:</span> {ej.cnpj}
              </div>

              {/* Faturamento Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Faturamento</span>
                  <span className="font-bold text-foreground">{progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-accent-glow rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Number(progress), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(ej.faturamentoAtual)}</span>
                  <span>Meta: {formatCurrency(ej.faturamentoMeta)}</span>
                </div>
              </div>

              {/* Quarters breakdown */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border">
                {[
                  { label: 'Q1', value: ej.faturamentoQ1 },
                  { label: 'Q2', value: ej.faturamentoQ2 },
                  { label: 'Q3', value: ej.faturamentoQ3 },
                  { label: 'Q4', value: ej.faturamentoQ4 }
                ].map(q => (
                  <div key={q.label} className="text-center">
                    <p className="text-[10px] text-muted-foreground font-medium">{q.label}</p>
                    <p className="text-xs font-bold text-foreground">
                      {formatCurrency(q.value || 0).replace('R$', '').trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEjs.length === 0 && (
        <div className="text-center py-12 bg-secondary/50 rounded-xl border border-dashed border-border">
          <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">Nenhuma EJ encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default DDRView;
