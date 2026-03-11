import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown } from 'lucide-react';
import AbatimentosTab from '@/components/presidency/AbatimentosTab';
import ArticulacoesTab from '@/components/presidency/ArticulacoesTab';
import CalendarioEstrategicoTab from '@/components/presidency/CalendarioEstrategicoTab';
import { usePresidenciaEventos } from '@/hooks/usePresidenciaEventos';

interface PresidencyViewProps {
  selectedYear: number;
}

const PresidencyView = ({ selectedYear }: PresidencyViewProps) => {
  const { eventos, loading, createEvento, updateEvento, deleteEvento } = usePresidenciaEventos();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Crown className="text-primary" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Presidência Executiva</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento de eventos com cronograma reverso</p>
        </div>
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
            loading={loading}
            createEvento={createEvento}
            updateEvento={updateEvento}
            deleteEvento={deleteEvento}
          />
        </TabsContent>

        <TabsContent value="articulacoes">
          <ArticulacoesTab eventos={eventos} loading={loading} />
        </TabsContent>

        <TabsContent value="calendario">
          <CalendarioEstrategicoTab eventos={eventos} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresidencyView;
