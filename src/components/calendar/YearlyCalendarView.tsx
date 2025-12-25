import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Evento } from '@/types';

interface YearlyCalendarViewProps {
  events: Evento[];
}

const YearlyCalendarView = ({ events }: YearlyCalendarViewProps) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const getEventsForDay = (y: number, m: number, d: number) => {
    const currentDayStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return events.some(e => currentDayStr >= e.dataInicio && currentDayStr <= e.dataFim);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6 px-4">
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
                  const hasEvent = getEventsForDay(currentYear, month, day);
                  return (
                    <div 
                      key={day} 
                      className={`h-5 w-5 flex items-center justify-center rounded-full transition-colors ${
                        hasEvent 
                          ? 'bg-primary text-primary-foreground font-bold' 
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}
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
  );
};

export default YearlyCalendarView;
