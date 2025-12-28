import { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpCircle, ArrowDownCircle, Loader2, BarChart3 } from 'lucide-react';
import { Transacao } from '@/types';
import { formatCurrency, formatDateString } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useTransacoes } from '@/hooks/useTransacoes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialProjectionChart from '@/components/operations/FinancialProjectionChart';

interface OperationsViewProps {
  selectedYear: number;
}

const OperationsView = ({ selectedYear }: OperationsViewProps) => {
  const { transacoes, tiposTransacao, loading, createTransacao, updateTransacao, deleteTransacao } = useTransacoes();
  const [transacaoToDelete, setTransacaoToDelete] = useState<string | null>(null);
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Transacao, 'id'> & { id?: string }>({
    descricao: '',
    valor: 0,
    tipo: 'entrada',
    categoria: 'Outros',
    data: new Date().toISOString().split('T')[0],
    status: 'realizado'
  });
  const [isEditing, setIsEditing] = useState(false);

  const openForm = (transacao?: Transacao) => {
    if (transacao) {
      setFormData(transacao);
      setIsEditing(true);
    } else {
      setFormData({
        descricao: '',
        valor: 0,
        tipo: 'entrada',
        categoria: 'Outros',
        data: new Date().toISOString().split('T')[0],
        status: 'realizado'
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await updateTransacao(formData.id, formData);
      } else {
        await createTransacao(formData);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setTransacaoToDelete(id);
  };

  const confirmDelete = async () => {
    if (transacaoToDelete !== null) {
      await deleteTransacao(transacaoToDelete);
      setTransacaoToDelete(null);
    }
  };

  // Get categories from tipos_transacao
  const categorias = tiposTransacao.map(t => t.nome);

  // Filtered transactions
  const filteredTransacoes = transacoes.filter(t => {
    const matchesTipo = !filterTipo || t.tipo === filterTipo;
    const matchesStatus = !filterStatus || t.status === filterStatus;
    return matchesTipo && matchesStatus;
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Calculations
  const realizadas = transacoes.filter(t => t.status === 'realizado');
  const projetadas = transacoes.filter(t => t.status === 'projetado');

  const entradasRealizadas = realizadas.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const saidasRealizadas = realizadas.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const saldoAtual = entradasRealizadas - saidasRealizadas;

  const entradasProjetadas = projetadas.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const saidasProjetadas = projetadas.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const saldoProjetado = saldoAtual + entradasProjetadas - saidasProjetadas;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Operações - Financeiro</h2>
          <p className="text-muted-foreground">Controle de caixa e planejamento financeiro da RioJunior.</p>
        </div>
      </div>

      <Tabs defaultValue="transacoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="transacoes" className="flex items-center gap-2">
            <DollarSign size={16} /> Transações
          </TabsTrigger>
          <TabsTrigger value="projecao" className="flex items-center gap-2">
            <BarChart3 size={16} /> Projeção Financeira
          </TabsTrigger>
        </TabsList>

        {/* Transações Tab */}
        <TabsContent value="transacoes" className="space-y-6">
          {/* Delete Confirmation Modal */}
          {transacaoToDelete !== null && (
            <ConfirmModal
              title="Confirmar Exclusão"
              message="Essa ação excluirá a transação permanentemente."
              onConfirm={confirmDelete}
              onCancel={() => setTransacaoToDelete(null)}
            />
          )}

      {/* Form Modal */}
      {isFormOpen && (
        <Modal 
          title={isEditing ? "Editar Transação" : "Nova Transação"} 
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="label-sm">Descrição</label>
              <input 
                type="text" 
                value={formData.descricao} 
                onChange={e => setFormData({...formData, descricao: e.target.value})} 
                className="input-field" 
                placeholder="Descrição da transação" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label-sm">Valor</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.valor} 
                  onChange={e => setFormData({...formData, valor: Number(e.target.value)})} 
                  className="input-field" 
                  placeholder="0,00" 
                />
              </div>
              <div>
                <label className="label-sm">Data</label>
                <input 
                  type="date" 
                  value={formData.data} 
                  onChange={e => setFormData({...formData, data: e.target.value})} 
                  className="input-field" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label-sm">Tipo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, tipo: 'entrada'})}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      formData.tipo === 'entrada' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-secondary text-secondary-foreground border border-border'
                    }`}
                  >
                    <ArrowUpCircle size={16} /> Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, tipo: 'saida'})}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      formData.tipo === 'saida' 
                        ? 'bg-destructive text-destructive-foreground' 
                        : 'bg-secondary text-secondary-foreground border border-border'
                    }`}
                  >
                    <ArrowDownCircle size={16} /> Saída
                  </button>
                </div>
              </div>
              <div>
                <label className="label-sm">Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'realizado'})}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      formData.status === 'realizado' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground border border-border'
                    }`}
                  >
                    Realizado
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'projetado'})}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      formData.status === 'projetado' 
                        ? 'bg-rio-purple text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground border border-border'
                    }`}
                  >
                    Projetado
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="label-sm">Categoria</label>
              <select 
                value={formData.categoria} 
                onChange={e => setFormData({...formData, categoria: e.target.value})} 
                className="input-field"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Header with button */}
      <div className="flex justify-end">
        <button 
          onClick={() => openForm()} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Nova Transação
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <PiggyBank size={20} className="text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {formatCurrency(saldoAtual)}
              </p>
              <p className="text-xs text-muted-foreground">Saldo Atual</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{formatCurrency(entradasRealizadas)}</p>
              <p className="text-xs text-muted-foreground">Entradas Realizadas</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown size={20} className="text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(saidasRealizadas)}</p>
              <p className="text-xs text-muted-foreground">Saídas Realizadas</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rio-purple/10 flex items-center justify-center">
              <DollarSign size={20} className="text-rio-purple" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${saldoProjetado >= 0 ? 'text-rio-purple' : 'text-destructive'}`}>
                {formatCurrency(saldoProjetado)}
              </p>
              <p className="text-xs text-muted-foreground">Saldo Projetado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Summary */}
      <div className="card-elevated p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-rio-purple" />
          Projeção Financeira
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Entradas Projetadas</p>
            <p className="text-lg font-bold text-accent">{formatCurrency(entradasProjetadas)}</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Saídas Projetadas</p>
            <p className="text-lg font-bold text-destructive">{formatCurrency(saidasProjetadas)}</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Variação Projetada</p>
            <p className={`text-lg font-bold ${entradasProjetadas - saidasProjetadas >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {formatCurrency(entradasProjetadas - saidasProjetadas)}
            </p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <p className="text-xs text-primary mb-1">Saldo Final Estimado</p>
            <p className={`text-lg font-bold ${saldoProjetado >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(saldoProjetado)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            value={filterTipo} 
            onChange={(e) => setFilterTipo(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">Todos os Tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">Todos os Status</option>
            <option value="realizado">Realizados</option>
            <option value="projetado">Projetados</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransacoes.map((transacao) => (
          <div 
            key={transacao.id} 
            className="card-elevated p-4 flex items-center justify-between gap-4 group hover:border-primary/30"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                transacao.tipo === 'entrada' 
                  ? 'bg-accent/10' 
                  : 'bg-destructive/10'
              }`}>
                {transacao.tipo === 'entrada' 
                  ? <ArrowUpCircle size={20} className="text-accent" />
                  : <ArrowDownCircle size={20} className="text-destructive" />
                }
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-foreground truncate">{transacao.descricao}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    transacao.status === 'projetado' 
                      ? 'bg-rio-purple/10 text-rio-purple border border-rio-purple/20' 
                      : 'bg-accent/10 text-accent border border-accent/20'
                  }`}>
                    {transacao.status === 'projetado' ? 'Projetado' : 'Realizado'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-secondary px-2 py-0.5 rounded font-medium">{transacao.categoria}</span>
                  <span>•</span>
                  <span>{formatDateString(transacao.data)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <p className={`text-lg font-bold whitespace-nowrap ${
                transacao.tipo === 'entrada' ? 'text-accent' : 'text-destructive'
              }`}>
                {transacao.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transacao.valor)}
              </p>
              
              <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openForm(transacao)} 
                  className="p-1.5 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(transacao.id)} 
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransacoes.length === 0 && (
        <div className="text-center py-12 bg-secondary/50 rounded-xl border border-dashed border-border">
          <DollarSign className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        </div>
      )}
        </TabsContent>

        {/* Projeção Tab */}
        <TabsContent value="projecao">
          <FinancialProjectionChart selectedYear={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperationsView;
