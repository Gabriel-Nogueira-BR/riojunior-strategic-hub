import { GraduationCap, RefreshCw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePresidenciaEventos } from '@/hooks/usePresidenciaEventos';
import { useDemandasFormacao, KanbanStatus, DemandaFormacao } from '@/hooks/useDemandasFormacao';
import { differenceInHours, isBefore } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLUMNS: { status: KanbanStatus; label: string; color: string }[] = [
  { status: 'a_fazer', label: 'A Fazer', color: 'bg-muted' },
  { status: 'em_andamento', label: 'Em Andamento', color: 'bg-blue-500/10' },
  { status: 'aprovacao', label: 'Aprovação', color: 'bg-amber-500/10' },
  { status: 'concluido', label: 'Concluído', color: 'bg-emerald-500/10' },
];

const ETAPA_COLORS: Record<string, string> = {
  brainstorm_idv: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  terceirizada_idv: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  elaboracao_pf: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  aprovacao_pf: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

function KanbanCard({ demanda, onMove }: { demanda: DemandaFormacao; onMove: (id: string, status: KanbanStatus) => void }) {
  const now = new Date();
  const prazoDate = demanda.prazo ? new Date(demanda.prazo + 'T12:00:00') : null;
  const horasRestantes = prazoDate ? differenceInHours(prazoDate, now) : null;
  const isUrgent = horasRestantes !== null && horasRestantes <= 48 && horasRestantes > 0 && demanda.status !== 'concluido';
  const isOverdue = prazoDate && isBefore(prazoDate, now) && demanda.status !== 'concluido';

  const nextStatus: Record<KanbanStatus, KanbanStatus | null> = {
    a_fazer: 'em_andamento',
    em_andamento: 'aprovacao',
    aprovacao: 'concluido',
    concluido: null,
  };
  const prevStatus: Record<KanbanStatus, KanbanStatus | null> = {
    a_fazer: null,
    em_andamento: 'a_fazer',
    aprovacao: 'em_andamento',
    concluido: 'aprovacao',
  };

  return (
    <Card className={`mb-2 transition-all hover:shadow-md ${isOverdue ? 'border-destructive/50 bg-destructive/5' : isUrgent ? 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground leading-tight">{demanda.nomeEvento}</p>
          {(isUrgent || isOverdue) && (
            <AlertTriangle size={14} className={isOverdue ? 'text-destructive shrink-0' : 'text-amber-500 shrink-0'} />
          )}
        </div>

        <Badge variant="outline" className={`text-[10px] ${ETAPA_COLORS[demanda.etapa] || ''}`}>
          {demanda.etapaLabel}
        </Badge>

        {prazoDate && (
          <p className={`text-xs ${isOverdue ? 'text-destructive font-semibold' : isUrgent ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-muted-foreground'}`}>
            📅 {format(prazoDate, "dd/MM/yyyy", { locale: ptBR })}
            {isOverdue && ' — Atrasado!'}
            {isUrgent && !isOverdue && ` — ${Math.round(horasRestantes!)}h restantes`}
          </p>
        )}

        <div className="flex gap-1 pt-1">
          {prevStatus[demanda.status] && (
            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => onMove(demanda.id, prevStatus[demanda.status]!)}>
              ← Voltar
            </Button>
          )}
          {nextStatus[demanda.status] && (
            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 ml-auto" onClick={() => onMove(demanda.id, nextStatus[demanda.status]!)}>
              Avançar →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface FormacaoEmpreendedoraViewProps {
  selectedYear: number;
}

const FormacaoEmpreendedoraView = ({ selectedYear }: FormacaoEmpreendedoraViewProps) => {
  const { eventos, loading: eventosLoading } = usePresidenciaEventos();
  const { demandas, loading: demandasLoading, updateStatus, syncDemandas } = useDemandasFormacao(eventos);

  const loading = eventosLoading || demandasLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="text-primary" size={22} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Formação Empreendedora</h1>
          <p className="text-sm text-muted-foreground">Demandas de IDV e PF geradas pela Presidência</p>
        </div>
        <Button variant="outline" size="sm" onClick={syncDemandas}>
          <RefreshCw size={14} className="mr-1" /> Sincronizar
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando demandas...</div>
      ) : demandas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GraduationCap size={40} className="mx-auto mb-3 opacity-40" />
            <p>Nenhuma demanda gerada.</p>
            <p className="text-sm">Crie eventos com fluxos de IDV ou PF na aba de Presidência para gerar demandas aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colDemandas = demandas.filter(d => d.status === col.status);
            return (
              <div key={col.status} className="space-y-2">
                <div className={`rounded-lg p-3 ${col.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">{col.label}</h3>
                    <Badge variant="secondary" className="text-[10px]">{colDemandas.length}</Badge>
                  </div>
                </div>
                <div className="min-h-[200px]">
                  {colDemandas.map(d => (
                    <KanbanCard key={d.id} demanda={d} onMove={updateStatus} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormacaoEmpreendedoraView;
