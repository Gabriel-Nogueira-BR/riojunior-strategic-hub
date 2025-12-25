import { useState } from 'react';
import { Menu } from 'lucide-react';
import { TabType } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import CalendarView from '@/views/CalendarView';
import DDRView from '@/views/DDRView';
import OperationsView from '@/views/OperationsView';
import PlaceholderView from '@/views/PlaceholderView';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView />;
      case 'ddr':
        return <DDRView />;
      case 'operations':
        return <OperationsView />;
      case 'strategic':
        return (
          <PlaceholderView 
            title="Painel Estratégico" 
            description="Esta seção está em desenvolvimento. Aqui você encontrará as OKRs Estratégicas, Táticas e Operacionais com acompanhamento de Key Results." 
          />
        );
      case 'presidency':
        return (
          <PlaceholderView 
            title="Presidência Executiva" 
            description="Esta seção será desenvolvida em breve. Aqui você encontrará informações estratégicas da presidência, acompanhamento de metas institucionais e dashboards executivos." 
          />
        );
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
        return <CalendarView />;
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
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-card border-b border-border sticky top-0 z-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs">
                RJ
              </div>
              <span className="font-bold text-lg text-foreground">RioJunior</span>
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
