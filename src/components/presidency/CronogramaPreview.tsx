import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MarcoTimeline, CronogramaCalculado } from '@/utils/backwardsScheduling';

interface CronogramaPreviewProps {
  timeline: MarcoTimeline[];
  cronograma: CronogramaCalculado;
  dataEvento: string;
}

const fluxoLabels: Record<string, string> = {
  marco: 'Marco',
  idv: 'Identidade Visual',
  financeiro: 'Financeiro',
  articulacao: 'Articulação',
  evento: 'Evento',
};

const CronogramaPreview = ({ timeline, cronograma, dataEvento }: CronogramaPreviewProps) => {
  const eventoDate = new Date(dataEvento + 'T12:00:00');

  return (
    <div className="space-y-2">
      {timeline.map((marco, i) => {
        const marcoDate = new Date(marco.data + 'T12:00:00');
        const diasAteEvento = differenceInDays(eventoDate, marcoDate);

        return (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            {/* Color indicator */}
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: marco.cor }} />
            
            {/* Timeline connector */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{marco.label}</p>
              <p className="text-xs text-muted-foreground">
                {format(marcoDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
              </p>
            </div>

            {/* Days badge */}
            <div className="flex-shrink-0">
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: marco.cor + '20', color: marco.cor }}>
                {diasAteEvento === 0 ? 'D-Day' : `D-${diasAteEvento}`}
              </span>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs font-medium text-primary">
          Marco Zero (SEBRAE): {format(new Date(cronograma.dataMarcoZero + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })} — 
          mínimo {differenceInDays(eventoDate, new Date(cronograma.dataMarcoZero + 'T12:00:00'))} dias antes do evento
        </p>
      </div>
    </div>
  );
};

export default CronogramaPreview;
