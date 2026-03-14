import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { format, differenceInDays, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EventoFormModal from './EventoFormModal';
import CronogramaPreview from './CronogramaPreview';
import { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';
import { PresidenciaEventoInput, calcularCronograma, gerarTimeline, gerarGanttBars } from '@/utils/backwardsScheduling';

interface AbatimentosTabProps {
  eventos: PresidenciaEvento[];
  loading: boolean;
  createEvento: (input: PresidenciaEventoInput) => Promise<void>;
  updateEvento: (id: string, input: PresidenciaEventoInput) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  dataReferenciaStatus: string;
}

const AbatimentosTab = ({ eventos, loading, createEvento, updateEvento, deleteEvento, dataReferenciaStatus }: AbatimentosTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editEvento, setEditEvento] = useState<PresidenciaEvento | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSave = async (input: PresidenciaEventoInput) => {
    if (editEvento) {
      await updateEvento(editEvento.id, input);
    } else {
      await createEvento(input);
    }
  };

  const today = new Date();

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando eventos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Eventos com Cronograma Reverso</h2>
        <Button onClick={() => { setEditEvento(null); setShowForm(true); }} size="sm">
          <Plus size={16} className="mr-1" /> Novo Evento
        </Button>
      </div>

      {eventos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p>Nenhum evento cadastrado.</p>
            <p className="text-sm">Crie um evento para gerar automaticamente o cronograma reverso.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {eventos.map((ev) => {
            const eventoDate = new Date(ev.dataEvento + 'T12:00:00');
            const diasRestantes = differenceInDays(eventoDate, today);
            const isExpanded = expandedId === ev.id;

            const input: PresidenciaEventoInput = {
              nomeEvento: ev.nomeEvento,
              dataEvento: ev.dataEvento,
              dataReferenciaStatus,
              prazoIdvBrainstorm: ev.prazoIdvBrainstorm,
              prazoIdvTerceirizada: ev.prazoIdvTerceirizada,
              prazoPfElaboracao: ev.prazoPfElaboracao,
              prazoPfAprovacaoCa: ev.prazoPfAprovacaoCa,
              prazoAvisoPrevio: ev.prazoAvisoPrevio,
              prazoColetaPesquisa: ev.prazoColetaPesquisa,
              prazoAberturaCoordenadoria: ev.prazoAberturaCoordenadoria,
              prazoArticulacaoLocal: ev.prazoArticulacaoLocal,
            };
            const cronograma = calcularCronograma(input);
            const timeline = gerarTimeline(input, cronograma);
            const ganttBars = gerarGanttBars(input, cronograma);

            const nextDeadline = timeline.find(m => isBefore(today, new Date(m.data + 'T12:00:00')));

            return (
              <Card key={ev.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{ev.nomeEvento}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        📅 {format(eventoDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={diasRestantes < 0 ? 'destructive' : diasRestantes < 30 ? 'secondary' : 'default'}>
                        {diasRestantes < 0 ? `Passou ${Math.abs(diasRestantes)}d` : `${diasRestantes}d restantes`}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => { setEditEvento(ev); setShowForm(true); }}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(ev.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {nextDeadline && (
                    <div className="mt-2 p-2 rounded-md bg-accent/10 border border-accent/20">
                      <p className="text-xs font-medium text-accent">
                        ⏳ Próximo marco: {nextDeadline.label} — {format(new Date(nextDeadline.data + 'T12:00:00'), "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                  >
                    {isExpanded ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
                    {isExpanded ? 'Ocultar cronograma' : 'Ver cronograma completo'}
                  </Button>

                  {isExpanded && (
                    <div className="mt-3">
                      <CronogramaPreview timeline={timeline} cronograma={cronograma} dataEvento={ev.dataEvento} ganttBars={ganttBars} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <EventoFormModal
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditEvento(null); }}
          onSave={handleSave}
          eventoEdit={editEvento}
          dataReferenciaStatus={dataReferenciaStatus}
        />
      )}

      {deleteId && (
        <ConfirmModal
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => { if (deleteId) await deleteEvento(deleteId); setDeleteId(null); }}
          title="Excluir Evento"
          message="Tem certeza que deseja excluir este evento e todo o seu cronograma?"
        />
      )}
    </div>
  );
};

export default AbatimentosTab;
