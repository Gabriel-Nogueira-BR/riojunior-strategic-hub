import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import AbatimentosTab from '@/components/presidency/AbatimentosTab';
import ArticulacoesTab from '@/components/presidency/ArticulacoesTab';
import CalendarioEstrategicoTab from '@/components/presidency/CalendarioEstrategicoTab';
import { usePresidenciaEventos } from '@/hooks/usePresidenciaEventos';
import { useConfiguracaoPresidencia } from '@/hooks/useConfiguracaoPresidencia';

interface PresidencyViewProps {
  selectedYear: number;
}

const PresidencyView = ({ selectedYear }: PresidencyViewProps) => {
  const { eventos, loading, createEvento, updateEvento, deleteEvento } = usePresidenciaEventos();
  const { config, loading: configLoading, updateConfig } = useConfiguracaoPresidencia();

  const dataReferenciaStatus = config?.dataReferenciaStatus || '2026-01-07';
  const anchorDate = new Date(dataReferenciaStatus + 'T12:00:00');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Crown className="text-primary" size={22} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Presidência Executiva</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento de eventos com cronograma reverso</p>
        </div>
      </div>

      {/* Global SEBRAE anchor date */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
        <span className="text-sm font-medium text-foreground">📅 Data Âncora Status SEBRAE (global):</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(anchorDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={anchorDate}
              onSelect={(date) => {
                if (date) updateConfig(format(date, 'yyyy-MM-dd'));
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground">Recorrência quinzenal a partir desta data</span>
      </div>

      <Tabs defaultValue="abatimentos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="abatimentos">Abatimentos em Andamento</TabsTrigger>
          <TabsTrigger value="articulacoes">Articulações</TabsTrigger>
          <TabsTrigger value="calendario">Calendário Estratégico</TabsTrigger>
        </TabsList>

        <TabsContent value="abatimentos">
          <AbatimentosTab
            eventos={eventos}
            loading={loading || configLoading}
            createEvento={createEvento}
            updateEvento={updateEvento}
            deleteEvento={deleteEvento}
            dataReferenciaStatus={dataReferenciaStatus}
          />
        </TabsContent>

        <TabsContent value="articulacoes">
          <ArticulacoesTab eventos={eventos} loading={loading} />
        </TabsContent>

        <TabsContent value="calendario">
          <CalendarioEstrategicoTab eventos={eventos} loading={loading || configLoading} dataReferenciaStatus={dataReferenciaStatus} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresidencyView;
