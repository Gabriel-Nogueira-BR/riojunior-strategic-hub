import { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, CalendarDays, List, Grid3X3, Loader2 } from 'lucide-react';
import { Evento, ViewMode } from '@/types';
import { TIPOS_EVENTO, DIRETORIAS } from '@/data/mockData';
import { formatDateString } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DateRangePicker from '@/components/calendar/DateRangePicker';
import MonthlyCalendarView from '@/components/calendar/MonthlyCalendarView';
import YearlyCalendarView from '@/components/calendar/YearlyCalendarView';
import { useEventos } from '@/hooks/useEventos';

const CalendarView = () => {
  const { eventos, loading, createEvento, updateEvento, deleteEvento } = useEventos();
  const [formData, setFormData] = useState<Omit<Evento, 'id'> & { id?: string }>({ 
    nome: '', dataInicio: '', dataFim: '', tipo: '', pauta: '', diretorias: [] 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ nome: '', dataInicio: '', dataFim: '', tipo: '', pauta: '', diretorias: [] });
    setIsEditing(false);
    setShowCalendar(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.dataInicio || !formData.tipo) return;

    try {
      if (isEditing && formData.id) {
        await updateEvento(formData.id, { ...formData, dataFim: formData.dataFim || formData.dataInicio });
      } else {
        await createEvento({ ...formData, dataFim: formData.dataFim || formData.dataInicio });
      }
      resetForm();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEdit = (evento: Evento) => {
    setFormData(evento);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = async () => {
    if (eventToDelete !== null) {
      await deleteEvento(eventToDelete);
      setEventToDelete(null);
    }
  };

  const toggleDiretoria = (diretoria: string) => {
    setFormData(prev => ({
      ...prev,
      diretorias: prev.diretorias.includes(diretoria)
        ? prev.diretorias.filter(d => d !== diretoria)
        : [...prev.diretorias, diretoria]
    }));
  };

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
      {eventToDelete !== null && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Essa ação excluirá o evento permanentemente. Não é possível desfazer."
          onConfirm={confirmDelete}
          onCancel={() => setEventToDelete(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calendarização</h2>
          <p className="text-muted-foreground">Gerencie o cronograma de eventos da Federação.</p>
        </div>
        
        {/* View Switcher */}
        <div className="flex bg-card rounded-lg p-1 border border-border shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${
              viewMode === 'list' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <List size={16} /> Lista
          </button>
          <button 
            onClick={() => setViewMode('month')}
            className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${
              viewMode === 'month' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Calendar size={16} /> Mês
          </button>
          <button 
            onClick={() => setViewMode('year')}
            className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${
              viewMode === 'year' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Grid3X3 size={16} /> Ano
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="card-elevated p-6 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              {isEditing ? <Edit2 size={18} className="text-rio-gold" /> : <Plus size={18} className="text-accent" />}
              {isEditing ? 'Editar Evento' : 'Novo Evento'}
            </h3>
            {isEditing && (
              <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-destructive">
                Cancelar
              </button>
            )}
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label-sm">Nome do Evento</label>
              <input 
                type="text" 
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="input-field"
                placeholder="Ex: Encontro de Líderes"
              />
            </div>

            <div>
              <label className="label-sm">Tipo do Evento</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="input-field"
              >
                <option value="">Selecione o tipo...</option>
                {TIPOS_EVENTO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="label-sm">Período do Evento</label>
              <button 
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`input-field text-left flex items-center justify-between ${showCalendar ? 'ring-2 ring-primary/20 border-primary' : ''}`}
              >
                <span className={!formData.dataInicio ? 'text-muted-foreground' : 'text-foreground font-medium'}>
                  {formData.dataInicio 
                    ? `${formatDateString(formData.dataInicio)} ${formData.dataFim && formData.dataFim !== formData.dataInicio ? ` - ${formatDateString(formData.dataFim)}` : ''}`
                    : 'Selecione as datas...'}
                </span>
                <Calendar size={18} className="text-muted-foreground" />
              </button>
              
              {showCalendar && (
                <div className="absolute z-20 top-full left-0 w-full mt-2 animate-scale-in">
                  <DateRangePicker 
                    startDate={formData.dataInicio} 
                    endDate={formData.dataFim} 
                    onChange={(start, end) => setFormData({...formData, dataInicio: start, dataFim: end})}
                  />
                  <div className="text-right mt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowCalendar(false)} 
                      className="text-xs font-bold text-primary hover:text-primary/80"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="label-sm">Diretorias Responsáveis</label>
              <div className="flex flex-wrap gap-2">
                {DIRETORIAS.map(diretoria => (
                  <button
                    key={diretoria}
                    type="button"
                    onClick={() => toggleDiretoria(diretoria)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      formData.diretorias.includes(diretoria)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {diretoria}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-sm">Pauta / Descrição</label>
              <textarea 
                value={formData.pauta}
                onChange={(e) => setFormData({...formData, pauta: e.target.value})}
                rows={3}
                className="input-field resize-none"
                placeholder="Descreva a pauta..."
              />
            </div>

            <button 
              type="submit" 
              className={`w-full font-bold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] ${
                isEditing 
                  ? 'bg-rio-gold text-foreground hover:opacity-90' 
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar ao Calendário'}
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {viewMode === 'list' && (
            <>
              {eventos.map((evento) => (
                <div 
                  key={evento.id} 
                  className="card-elevated p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-accent/10 rounded-xl flex flex-col items-center justify-center text-accent border border-accent/20 shrink-0">
                      <span className="text-xs font-bold uppercase">
                        {new Date(evento.dataInicio + 'T12:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                      </span>
                      <span className="text-xl font-bold leading-none">
                        {new Date(evento.dataInicio + 'T12:00:00').getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground text-lg">{evento.nome}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium text-secondary-foreground border border-border">
                          {evento.tipo}
                        </span>
                        <span className="text-border">•</span>
                        <span>
                          {formatDateString(evento.dataInicio)} 
                          {evento.dataInicio !== evento.dataFim && ` até ${formatDateString(evento.dataFim)}`}
                        </span>
                      </div>
                      {evento.diretorias.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {evento.diretorias.map(dir => (
                            <span key={dir} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                              {dir}
                            </span>
                          ))}
                        </div>
                      )}
                      {evento.pauta && (
                        <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg border border-border italic">
                          {evento.pauta.length > 150 ? evento.pauta.substring(0, 150) + "..." : evento.pauta}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end md:self-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleEdit(evento)}
                      className="p-2 text-muted-foreground hover:text-rio-gold hover:bg-rio-gold/10 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(evento.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              {eventos.length === 0 && (
                <div className="text-center py-12 bg-secondary/50 rounded-xl border border-dashed border-border">
                  <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">Nenhum evento calendarizado.</p>
                </div>
              )}
            </>
          )}

          {viewMode === 'month' && <MonthlyCalendarView events={eventos} />}
          {viewMode === 'year' && <YearlyCalendarView events={eventos} />}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
