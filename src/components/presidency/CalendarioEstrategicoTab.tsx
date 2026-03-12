import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';
import { calcularCronograma, gerarTimeline, PresidenciaEventoInput } from '@/utils/backwardsScheduling';

interface CalendarioEstrategicoTabProps {
  eventos: PresidenciaEvento[];
  loading: boolean;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarioEstrategicoTab = ({ eventos, loading }: CalendarioEstrategicoTabProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const allMarcos = useMemo(() => {
    const marcos: { data: string; label: string; cor: string; eventoNome: string }[] = [];

    eventos.forEach(ev => {
      const input: PresidenciaEventoInput = {
        nomeEvento: ev.nomeEvento,
        dataEvento: ev.dataEvento,
        dataReferenciaStatus: ev.dataReferenciaStatus,
        prazoIdvBrainstorm: ev.prazoIdvBrainstorm,
        prazoIdvTerceirizada: ev.prazoIdvTerceirizada,
        prazoPfElaboracao: ev.prazoPfElaboracao,
        prazoPfAprovacaoCa: ev.prazoPfAprovacaoCa,
        prazoAvisoPrevio: ev.prazoAvisoPrevio,
        prazoColetaPesquisa: ev.prazoColetaPesquisa,
      };
      const cronograma = calcularCronograma(input);
      const timeline = gerarTimeline(input, cronograma);

      timeline.forEach(m => {
        marcos.push({ ...m, eventoNome: ev.nomeEvento });
      });
    });

    return marcos;
  }, [eventos]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-lg font-semibold text-foreground capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { cor: '#ef4444', label: 'Marco Zero' },
          { cor: '#f59e0b', label: 'IDV' },
          { cor: '#10b981', label: 'Financeiro' },
          { cor: '#a855f7', label: 'Articulação' },
          { cor: '#3b82f6', label: 'Evento' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.cor }} />
            <span className="text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-7 gap-px">
            {WEEKDAYS.map(d => (
              <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}

            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 min-h-[80px]" />
            ))}

            {days.map(day => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayMarcos = allMarcos.filter(m => m.data === dayStr);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dayStr}
                  className={`p-1.5 min-h-[80px] border border-border/50 rounded-md ${isToday ? 'bg-primary/5 border-primary/30' : ''}`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayMarcos.map((m, i) => (
                      <div
                        key={i}
                        className="text-[10px] px-1 py-0.5 rounded truncate font-medium"
                        style={{ backgroundColor: m.cor, color: '#fff' }}
                        title={`${m.label} - ${m.eventoNome}`}
                      >
                        {m.label.length > 12 ? m.label.substring(0, 12) + '…' : m.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarioEstrategicoTab;
