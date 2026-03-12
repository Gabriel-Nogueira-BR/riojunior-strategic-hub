import { useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MarcoTimeline, CronogramaCalculado, GanttBar } from '@/utils/backwardsScheduling';

interface CronogramaPreviewProps {
  timeline: MarcoTimeline[];
  cronograma: CronogramaCalculado;
  dataEvento: string;
  ganttBars?: GanttBar[];
}

const CronogramaPreview = ({ timeline, cronograma, dataEvento, ganttBars }: CronogramaPreviewProps) => {
  const eventoDate = new Date(dataEvento + 'T12:00:00');

  // Calculate Gantt range
  const ganttRange = useMemo(() => {
    if (!ganttBars || ganttBars.length === 0) return null;
    const allDates = ganttBars.flatMap(b => [new Date(b.inicio + 'T12:00:00'), new Date(b.fim + 'T12:00:00')]);
    allDates.push(eventoDate);
    const min = Math.min(...allDates.map(d => d.getTime()));
    const max = Math.max(...allDates.map(d => d.getTime()));
    return { min, max, totalDays: differenceInDays(new Date(max), new Date(min)) || 1 };
  }, [ganttBars, eventoDate]);

  const getPosition = (dateStr: string) => {
    if (!ganttRange) return 0;
    const d = new Date(dateStr + 'T12:00:00').getTime();
    return ((d - ganttRange.min) / (ganttRange.max - ganttRange.min)) * 100;
  };

  const getWidth = (inicio: string, fim: string) => {
    return getPosition(fim) - getPosition(inicio);
  };

  const marcoZeroPosition = ganttRange ? getPosition(cronograma.dataMarcoZero) : 0;

  return (
    <div className="space-y-4">
      {/* Gantt Chart — parallel flows */}
      {ganttBars && ganttBars.length > 0 && ganttRange && (
        <div className="space-y-1">
          {/* Marco Zero indicator line */}
          <div className="relative h-6 mb-1">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
              style={{ left: `${marcoZeroPosition}%` }}
            />
            <span
              className="absolute -top-0.5 text-[9px] font-bold text-destructive whitespace-nowrap"
              style={{ left: `${marcoZeroPosition}%`, transform: 'translateX(-50%)' }}
            >
              Marco Zero ({format(new Date(cronograma.dataMarcoZero + 'T12:00:00'), 'dd/MM', { locale: ptBR })})
            </span>
          </div>

          {ganttBars.map((bar) => (
            <div key={bar.fluxo} className="relative h-10 rounded bg-muted/30 border border-border overflow-hidden">
              {/* Marco Zero line through each bar */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-destructive/40 z-10"
                style={{ left: `${marcoZeroPosition}%` }}
              />

              {/* Etapas */}
              {bar.etapas.map((etapa, j) => {
                const left = getPosition(etapa.inicio);
                const width = getWidth(etapa.inicio, etapa.fim);
                return (
                  <div
                    key={j}
                    className="absolute top-1 bottom-1 rounded flex items-center justify-center overflow-hidden"
                    style={{
                      left: `${left}%`,
                      width: `${Math.max(width, 2)}%`,
                      backgroundColor: bar.cor,
                      opacity: j === 0 ? 0.7 : 1,
                    }}
                    title={`${etapa.label}: ${format(new Date(etapa.inicio + 'T12:00:00'), 'dd/MM')} → ${format(new Date(etapa.fim + 'T12:00:00'), 'dd/MM')}`}
                  >
                    <span className="text-[9px] font-medium text-white truncate px-1">{etapa.label}</span>
                  </div>
                );
              })}

              {/* Flow label */}
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-medium text-muted-foreground">
                {bar.label}
              </span>
            </div>
          ))}

          {/* Evento marker */}
          <div className="relative h-6 mt-1">
            <div
              className="absolute top-0 bottom-0 w-0.5 z-10"
              style={{ left: `${getPosition(dataEvento)}%`, backgroundColor: '#3b82f6' }}
            />
            <span
              className="absolute -top-0.5 text-[9px] font-bold whitespace-nowrap"
              style={{ left: `${getPosition(dataEvento)}%`, transform: 'translateX(-50%)', color: '#3b82f6' }}
            >
              Evento ({format(eventoDate, 'dd/MM', { locale: ptBR })})
            </span>
          </div>
        </div>
      )}

      {/* Timeline list */}
      <div className="space-y-2">
        {timeline.map((marco, i) => {
          const marcoDate = new Date(marco.data + 'T12:00:00');
          const diasAteEvento = differenceInDays(eventoDate, marcoDate);

          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: marco.cor }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{marco.label}</p>
                <p className="text-xs text-muted-foreground">
                  {format(marcoDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: marco.cor + '20', color: marco.cor }}>
                  {diasAteEvento === 0 ? 'D-Day' : `D-${diasAteEvento}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs font-medium text-primary">
          Marco Zero (SEBRAE): {format(new Date(cronograma.dataMarcoZero + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })} — 
          mínimo {differenceInDays(eventoDate, new Date(cronograma.dataMarcoZero + 'T12:00:00'))} dias antes do evento
        </p>
      </div>
    </div>
  );
};

export default CronogramaPreview;
