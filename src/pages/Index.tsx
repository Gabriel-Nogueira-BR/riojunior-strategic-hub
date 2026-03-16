import { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { TabType } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import CalendarView from '@/views/CalendarView';
import DDRView from '@/views/DDRView';
import OperationsView from '@/views/OperationsView';
import StrategicPanelView from '@/views/StrategicPanelView';
import PlaceholderView from '@/views/PlaceholderView';
import PresidencyView from '@/views/PresidencyView';
import FormacaoEmpreendedoraView from '@/views/FormacaoEmpreendedoraView';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView selectedYear={selectedYear} />;
      case 'ddr':
        return <DDRView selectedYear={selectedYear} />;
      case 'operations':
        return <OperationsView selectedYear={selectedYear} />;
      case 'strategic':
        return <StrategicPanelView selectedYear={selectedYear} />;
      case 'presidency':
        return <PresidencyView selectedYear={selectedYear} />;
      case 'council':
        return (
          <PlaceholderView 
            title="Presidência do Conselho" 
            description="Esta seção será desenvolvida em breve. Aqui você encontrará informações e atividades relacionadas ao Conselho da Federação." 
          />
        );
      case 'business':
        return (
          <PlaceholderView 
            title="VP de Negócios" 
            description="Esta seção será desenvolvida em breve. Aqui você encontrará gestão de parcerias, pipeline comercial e indicadores de negócios." 
          />
        );
      case 'formation':
        return (
          <PlaceholderView 
            title="Formação Empreendedora" 
            description="Esta seção será desenvolvida em breve. Aqui você encontrará trilhas de formação, capacitações e programas educacionais." 
          />
        );
      default:
        return <CalendarView selectedYear={selectedYear} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Header with Year Selector */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs">
                RJ
              </div>
              <span className="font-bold text-lg text-foreground">RioJunior</span>
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Ano de vigência:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none bg-primary text-primary-foreground px-4 py-2 pr-8 rounded-lg font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity border-0 focus:ring-2 focus:ring-primary/50 focus:outline-none"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 RioJunior - Federação de Empresas Juniores do Estado do Rio de Janeiro</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
