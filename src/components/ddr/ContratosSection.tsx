import { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Users, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useContratos, Contrato } from '@/hooks/useContratos';
import { useEJs } from '@/hooks/useEJs';

interface ContratosSectionProps {
  selectedYear: number;
  ejId?: string;
}

const ContratosSection = ({ selectedYear, ejId }: ContratosSectionProps) => {
  const { contratos, loading, createContrato, updateContrato, deleteContrato } = useContratos(selectedYear);
  const { ejs } = useEJs();
  const [contratoToDelete, setContratoToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Contrato, 'id' | 'ejNome' | 'ejColaboradoraNome'> & { id?: string }>({
    ejId: ejId || '',
    nome: '',
    valor: 0,
    valorEj: 0,
    temColaboracao: false,
    ejColaboradoraId: null,
    ano: selectedYear
  });
  const [isEditing, setIsEditing] = useState(false);

  const filteredContratos = ejId 
    ? contratos.filter(c => c.ejId === ejId)
    : contratos;

  const openForm = (contrato?: Contrato) => {
    if (contrato) {
      setFormData({
        id: contrato.id,
        ejId: contrato.ejId,
        nome: contrato.nome,
        valor: contrato.valor,
        valorEj: contrato.valorEj,
        temColaboracao: contrato.temColaboracao,
        ejColaboradoraId: contrato.ejColaboradoraId,
        ano: contrato.ano
      });
      setIsEditing(true);
    } else {
      setFormData({
        ejId: ejId || '',
        nome: '',
        valor: 0,
        valorEj: 0,
        temColaboracao: false,
        ejColaboradoraId: null,
        ano: selectedYear
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await updateContrato(formData.id, formData);
      } else {
        await createContrato(formData);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const confirmDelete = async () => {
    if (contratoToDelete) {
      await deleteContrato(contratoToDelete);
      setContratoToDelete(null);
    }
  };

  // Stats
  const totalValor = filteredContratos.reduce((acc, c) => acc + c.valor, 0);
  const totalValorEjs = filteredContratos.reduce((acc, c) => acc + c.valorEj, 0);
  const contratosColaboracao = filteredContratos.filter(c => c.temColaboracao).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Delete Confirmation Modal */}
      {contratoToDelete && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Essa ação excluirá o contrato permanentemente."
          onConfirm={confirmDelete}
          onCancel={() => setContratoToDelete(null)}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <Modal 
          title={isEditing ? "Editar Contrato" : "Novo Contrato"} 
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-5">
            {!ejId && (
              <div>
                <label className="label-sm">EJ Responsável</label>
                <select 
                  value={formData.ejId} 
                  onChange={e => setFormData({...formData, ejId: e.target.value})} 
                  className="input-field"
                  required
                >
                  <option value="">Selecione uma EJ</option>
                  {ejs.map(ej => (
                    <option key={ej.id} value={ej.id}>{ej.nome}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="label-sm">Nome do Contrato</label>
              <input 
                type="text" 
                value={formData.nome} 
                onChange={e => setFormData({...formData, nome: e.target.value})} 
                className="input-field" 
                placeholder="Ex: Projeto XYZ" 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm">Valor Total do Contrato (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.valor} 
                  onChange={e => setFormData({...formData, valor: Number(e.target.value)})} 
                  className="input-field" 
                  placeholder="0,00" 
                  required
                />
              </div>
              <div>
                <label className="label-sm">Valor para a EJ (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.valorEj} 
                  onChange={e => setFormData({...formData, valorEj: Number(e.target.value)})} 
                  className="input-field" 
                  placeholder="0,00" 
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.temColaboracao}
                  onChange={e => setFormData({
                    ...formData, 
                    temColaboracao: e.target.checked,
                    ejColaboradoraId: e.target.checked ? formData.ejColaboradoraId : null
                  })} 
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Tem colaboração com outra EJ?</span>
              </label>

              {formData.temColaboracao && (
                <div>
                  <label className="label-sm">EJ Colaboradora</label>
                  <select 
                    value={formData.ejColaboradoraId || ''} 
                    onChange={e => setFormData({...formData, ejColaboradoraId: e.target.value || null})} 
                    className="input-field"
                  >
                    <option value="">Selecione a EJ colaboradora</option>
                    {ejs.filter(ej => ej.id !== formData.ejId).map(ej => (
                      <option key={ej.id} value={ej.id}>{ej.nome}</option>
                    ))}
                  </select>
                </div>
              )}
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
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          Contratos das EJs
        </h3>
        <button 
          onClick={() => openForm()} 
          className="btn-primary text-sm flex items-center gap-1.5 py-1.5 px-3"
        >
          <Plus size={14} /> Novo Contrato
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Total Contratos</p>
          <p className="text-lg font-bold text-foreground">{filteredContratos.length}</p>
        </div>
        <div className="bg-secondary/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Valor Total</p>
          <p className="text-lg font-bold text-accent">{formatCurrency(totalValor)}</p>
        </div>
        <div className="bg-secondary/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Com Colaboração</p>
          <p className="text-lg font-bold text-rio-purple">{contratosColaboracao}</p>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredContratos.map((contrato) => (
          <div 
            key={contrato.id} 
            className="bg-secondary/30 p-3 rounded-lg flex items-center justify-between gap-3 group hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={14} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground text-sm truncate">{contrato.nome}</h4>
                  {contrato.temColaboracao && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rio-purple/10 text-rio-purple flex items-center gap-1">
                      <Users size={10} /> Colab
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {contrato.ejNome}
                  {contrato.ejColaboradoraNome && (
                    <span className="text-rio-purple"> + {contrato.ejColaboradoraNome}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-accent">{formatCurrency(contrato.valorEj)}</p>
                <p className="text-[10px] text-muted-foreground">de {formatCurrency(contrato.valor)}</p>
              </div>
              
              <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openForm(contrato)} 
                  className="p-1 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => setContratoToDelete(contrato.id)} 
                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredContratos.length === 0 && (
          <div className="text-center py-8 bg-secondary/30 rounded-lg">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum contrato cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContratosSection;
