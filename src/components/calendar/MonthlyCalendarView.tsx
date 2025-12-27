import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Evento, DIRETORIAS } from '@/types';
import { formatDateString } from '@/utils/formatters';
import { getDiretoriaSolidColor, getDiretoriasAbbrev, DIRETORIA_COLORS } from '@/utils/diretoriaColors';

interface MonthlyCalendarViewProps {
  events: Evento[];
  onEventClick?: (evento: Evento) => void;
}

const MonthlyCalendarView = ({ events, onEventClick }: MonthlyCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const getEventsForDay = (day: number) => {
    const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
       const start = e.dataInicio;
       const end = e.dataFim;
       return currentDayStr >= start && currentDayStr <= end;
    });
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div key={`empty-${i}`} className="min-h-[120px] bg-secondary/30 border border-border/50" />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year;
    
    days.push(
      <div 
        key={day} 
        className={`min-h-[120px] bg-card border border-border p-1 flex flex-col gap-0.5 hover:bg-secondary/50 transition-colors overflow-hidden cursor-pointer ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}
        onClick={() => dayEvents.length > 0 && setSelectedDay(day)}
      >
        <span className={`text-sm font-bold mb-1 ${dayEvents.length > 0 ? 'text-foreground' : 'text-muted-foreground'} ${isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
          {day}
        </span>
        <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
          {dayEvents.map(ev => {
            const bgColor = getDiretoriaSolidColor(ev.diretorias);
            return (
              <div 
                key={ev.id} 
                className="text-[9px] px-1 py-0.5 rounded truncate font-medium text-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
                style={{ backgroundColor: bgColor }}
                title={`${ev.nome} - ${ev.diretorias.join(', ')}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(ev);
                }}
              >
                {ev.diretorias.length > 0 && (
                  <span className="text-[8px] font-bold opacity-80">
                    {getDiretoriasAbbrev(ev.diretorias)}
                  </span>
                )}
                <span className="truncate flex-1">{ev.nome}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Day detail modal
  const DayModal = () => {
    if (selectedDay === null) return null;
    const dayEvents = getEventsForDay(selectedDay);
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
        <div className="bg-card rounded-xl border border-border shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">
              {selectedDay} de {monthNames[month]} de {year}
            </h3>
            <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-secondary rounded">
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
                    setSelectedDay(null);
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
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <button 
            onClick={() => setCurrentDate(new Date(year, month - 1))} 
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">{monthNames[month]} {year}</h3>
          <button 
            onClick={() => setCurrentDate(new Date(year, month + 1))} 
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Diretoria Legend */}
        <div className="px-4 py-2 border-b border-border flex flex-wrap gap-2">
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
        
        <div className="grid grid-cols-7 text-center bg-secondary border-b border-border">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
            <div key={d} className="py-2 text-xs font-bold text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    </>
  );
};

export default MonthlyCalendarView;
