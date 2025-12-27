import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Evento, DIRETORIAS } from '@/types';
import { formatDateString } from '@/utils/formatters';
import { getDiretoriaSolidColor, DIRETORIA_COLORS } from '@/utils/diretoriaColors';

interface YearlyCalendarViewProps {
  events: Evento[];
  onEventClick?: (evento: Evento) => void;
}

const YearlyCalendarView = ({ events, onEventClick }: YearlyCalendarViewProps) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<{ month: number; day: number } | null>(null);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthNamesFull = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const getEventsForDay = (y: number, m: number, d: number) => {
    const currentDayStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return events.filter(e => currentDayStr >= e.dataInicio && currentDayStr <= e.dataFim);
  };

  const hasEventForDay = (y: number, m: number, d: number) => {
    return getEventsForDay(y, m, d).length > 0;
  };

  const getDayColor = (y: number, m: number, d: number) => {
    const dayEvents = getEventsForDay(y, m, d);
    if (dayEvents.length === 0) return null;
    const allDiretorias = dayEvents.flatMap(e => e.diretorias);
    return getDiretoriaSolidColor(allDiretorias.length > 0 ? [allDiretorias[0]] : []);
  };

  // Day detail modal
  const DayModal = () => {
    if (selectedDate === null) return null;
    const dayEvents = getEventsForDay(currentYear, selectedDate.month, selectedDate.day);
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDate(null)}>
        <div className="bg-card rounded-xl border border-border shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">
              {selectedDate.day} de {monthNamesFull[selectedDate.month]} de {currentYear}
            </h3>
            <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-secondary rounded">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {dayEvents.map(ev => {
              const bgColor = getDiretoriaSolidColor(ev.diretorias);
              return (
                <div 
                  key={ev.id} 
                  className="p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedDate(null);
                    onEventClick?.(ev);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-2 h-full min-h-[40px] rounded-full shrink-0"
                      style={{ backgroundColor: bgColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground">{ev.nome}</h4>
                      <p className="text-xs text-muted-foreground">
                        {ev.tipo} • {formatDateString(ev.dataInicio)}
                        {ev.dataInicio !== ev.dataFim && ` - ${formatDateString(ev.dataFim)}`}
                      </p>
                      {ev.diretorias.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ev.diretorias.map(dir => (
                            <span 
                              key={dir} 
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                              style={{ backgroundColor: DIRETORIA_COLORS[dir] || '#6b7280' }}
                            >
                              {dir}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DayModal />
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4 px-4">
          <button 
            onClick={() => setCurrentYear(prev => prev - 1)} 
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-center text-xl font-bold text-foreground">{currentYear}</h3>
          <button 
            onClick={() => setCurrentYear(prev => prev + 1)} 
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Diretoria Legend */}
        <div className="px-4 py-2 mb-4 flex flex-wrap gap-3 justify-center">
          {DIRETORIAS.map(dir => (
            <div key={dir} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: DIRETORIA_COLORS[dir] }}
              />
              <span className="text-[10px] text-muted-foreground">{dir}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map(month => {
            const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
            const firstDay = new Date(currentYear, month, 1).getDay();
            
            return (
              <div key={month} className="border border-border rounded-lg p-3 bg-secondary/30">
                <h4 className="text-center text-sm font-bold text-foreground mb-2 uppercase">{monthNames[month]}</h4>
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center">
                  {['D','S','T','Q','Q','S','S'].map((d,i) => (
                    <span key={i} className="text-muted-foreground font-bold">{d}</span>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <span key={`e-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const hasEvent = hasEventForDay(currentYear, month, day);
                    const dayColor = getDayColor(currentYear, month, day);
                    return (
                      <div 
                        key={day} 
                        className={`h-5 w-5 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                          hasEvent 
                            ? 'text-white font-bold' 
                            : 'text-muted-foreground hover:bg-secondary'
                        }`}
                        style={hasEvent ? { backgroundColor: dayColor || undefined } : undefined}
                        onClick={() => hasEvent && setSelectedDate({ month, day })}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default YearlyCalendarView;
