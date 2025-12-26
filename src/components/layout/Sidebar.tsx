import { 
  Calendar, 
  Building2, 
  Settings, 
  Briefcase, 
  GraduationCap, 
  Crown,
  TrendingUp,
  User,
  Target,
  Users
} from 'lucide-react';
import { TabType } from '@/types';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 group ${
      active 
        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' 
        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
    }`}
  >
    <Icon size={20} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-bold">
        {badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <aside className="hidden lg:flex w-72 flex-col fixed h-full z-20 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-12 w-12 bg-gradient-to-br from-sidebar-primary to-accent rounded-xl flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg shadow-lg">
          RJ
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-sidebar-foreground leading-tight">RioJunior</span>
          <span className="text-[10px] font-bold text-sidebar-primary uppercase tracking-wider">Sistema de Gestão</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-wider px-4 mb-3">Principal</p>
        <SidebarItem 
          icon={Calendar} 
          label="Calendarização" 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
        />
        <SidebarItem 
          icon={Target} 
          label="Painel Estratégico" 
          active={activeTab === 'strategic'} 
          onClick={() => setActiveTab('strategic')}
        />
        
        <p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-wider px-4 mb-3 mt-6">Diretorias</p>
        <SidebarItem 
          icon={Crown} 
          label="Presidência Executiva" 
          active={activeTab === 'presidency'} 
          onClick={() => setActiveTab('presidency')}
          badge="Em breve"
        />
        <SidebarItem 
          icon={Users} 
          label="Presidência do Conselho" 
          active={activeTab === 'council'} 
          onClick={() => setActiveTab('council')}
          badge="Em breve"
        />
        <SidebarItem 
          icon={TrendingUp} 
          label="VP Negócios" 
          active={activeTab === 'business'} 
          onClick={() => setActiveTab('business')}
          badge="Em breve"
        />
        <SidebarItem 
          icon={Settings} 
          label="Operações" 
          active={activeTab === 'operations'} 
          onClick={() => setActiveTab('operations')} 
        />
        <SidebarItem 
          icon={Building2} 
          label="DDR (EJs)" 
          active={activeTab === 'ddr'} 
          onClick={() => setActiveTab('ddr')} 
        />
        <SidebarItem 
          icon={GraduationCap} 
          label="Formação Empreendedora" 
          active={activeTab === 'formation'} 
          onClick={() => setActiveTab('formation')}
          badge="Em breve"
        />
      </nav>

      {/* User Section */}
      <div className="p-4 m-4 bg-sidebar-accent rounded-xl border border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <User size={18} className="text-sidebar-primary" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-sidebar-foreground truncate">Admin Federação</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@riojunior.com.br</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
