import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Evento } from '@/types';

interface MonthlyCalendarViewProps {
  events: Evento[];
}

const MonthlyCalendarView = ({ events }: MonthlyCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
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
      <div key={`empty-${i}`} className="h-24 bg-secondary/30 border border-border/50" />
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
        className={`h-24 bg-card border border-border p-2 flex flex-col items-start gap-1 hover:bg-secondary/50 transition-colors overflow-hidden ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}
      >
        <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-foreground' : 'text-muted-foreground'} ${isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
          {day}
        </span>
        <div className="flex flex-col gap-1 w-full">
          {dayEvents.slice(0, 2).map(ev => (
            <div 
              key={ev.id} 
              className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded truncate w-full font-medium border border-accent/30" 
              title={ev.nome}
            >
              {ev.nome}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} mais</span>
          )}
        </div>
      </div>
    );
  }

  return (
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
      <div className="grid grid-cols-7 text-center bg-secondary border-b border-border">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
          <div key={d} className="py-2 text-xs font-bold text-muted-foreground">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  );
};

export default MonthlyCalendarView;
