import { X, Calendar, Building2, Settings, Briefcase, GraduationCap, Crown, TrendingUp } from 'lucide-react';
import { TabType } from '@/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const MobileMenu = ({ isOpen, onClose, activeTab, setActiveTab }: MobileMenuProps) => {
  if (!isOpen) return null;

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onClose();
  };

  const MenuItem = ({ icon: Icon, label, tab, badge }: { icon: React.ElementType; label: string; tab: TabType; badge?: string }) => (
    <button
      onClick={() => handleTabClick(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        activeTab === tab 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground/70 hover:bg-secondary'
      }`}
    >
      <Icon size={20} />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute top-0 left-0 h-full w-72 bg-card shadow-2xl p-4 flex flex-col animate-slide-up">
        <div className="flex justify-between items-center mb-8 p-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold">
              RJ
            </div>
            <span className="font-bold text-xl text-foreground">RioJunior</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        
        <nav className="space-y-1 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 mb-3">Principal</p>
          <MenuItem icon={Calendar} label="Calendarização" tab="calendar" />
          
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 mb-3 mt-6">Diretorias</p>
          <MenuItem icon={Crown} label="Presidência Executiva" tab="presidency" badge="Em breve" />
          <MenuItem icon={TrendingUp} label="VP Negócios" tab="business" badge="Em breve" />
          <MenuItem icon={Settings} label="Operações" tab="operations" />
          <MenuItem icon={Building2} label="DDR (EJs)" tab="ddr" />
          <MenuItem icon={GraduationCap} label="Formação Empreendedora" tab="formation" badge="Em breve" />
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
