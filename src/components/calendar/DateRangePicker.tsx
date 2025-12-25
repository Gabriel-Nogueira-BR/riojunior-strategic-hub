import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const DateRangePicker = ({ startDate, endDate, onChange }: DateRangePickerProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    if (startDate) {
      const [y, m, d] = startDate.split('-').map(Number);
      setCurrentDate(new Date(y, m - 1, d));
    }
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const handleDayClick = (day: number) => {
    const clickedStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!startDate || (startDate && endDate) || (startDate && clickedStr < startDate)) {
      onChange(clickedStr, '');
    } else {
      onChange(startDate, clickedStr);
    }
  };

  const isSelected = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dStr === startDate || dStr === endDate;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dStr > startDate && dStr < endDate;
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const selected = isSelected(day);
    const inRange = isInRange(day);
    
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDayClick(day)}
        className={`
          h-8 w-full text-sm rounded-md flex items-center justify-center transition-all relative
          ${selected ? 'bg-primary text-primary-foreground font-bold z-10' : 'hover:bg-secondary text-foreground'}
          ${inRange ? 'bg-primary/20 text-primary rounded-none' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-lg select-none">
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button" 
          onClick={() => setCurrentDate(new Date(year, month - 1))} 
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <ChevronLeft size={16} className="text-muted-foreground" />
        </button>
        <span className="font-bold text-foreground">{monthNames[month]} {year}</span>
        <button 
          type="button" 
          onClick={() => setCurrentDate(new Date(year, month + 1))} 
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['D','S','T','Q','Q','S','S'].map((d, i) => (
          <span key={i} className="text-xs font-bold text-muted-foreground">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days}
      </div>
      <div className="mt-3 pt-3 border-t border-border text-xs text-center text-muted-foreground">
        {startDate && !endDate ? 'Selecione a data final' : !startDate ? 'Selecione a data de início' : 'Período selecionado'}
      </div>
    </div>
  );
};

export default DateRangePicker;
