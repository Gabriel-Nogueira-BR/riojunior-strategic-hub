import { format, isBefore, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PresidenciaEvento } from '@/hooks/usePresidenciaEventos';

interface ArticulacoesTabProps {
  eventos: PresidenciaEvento[];
  loading: boolean;
}

const ArticulacoesTab = ({ eventos, loading }: ArticulacoesTabProps) => {
  const today = new Date();

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando...</div>;
  }

  // Filter events that have articulacao dates
  const articulacoes = eventos
    .filter(ev => ev.dataPesquisaAvisoPrevio || ev.dataPesquisaLancamento || ev.dataPesquisaLimiteColeta)
    .map(ev => {
      const marcos = [
        { label: 'Aviso Prévio', data: ev.dataPesquisaAvisoPrevio, emoji: '📢' },
        { label: 'Lançamento Pesquisa', data: ev.dataPesquisaLancamento, emoji: '📊' },
        { label: 'Limite Coleta', data: ev.dataPesquisaLimiteColeta, emoji: '⏰' },
      ].filter(m => m.data);

      return { evento: ev, marcos };
    });

  if (articulacoes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Nenhuma articulação programada.</p>
          <p className="text-sm">Crie eventos na aba "Abatimentos em Andamento" para gerar articulações automaticamente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Articulações com Conselheiros</h2>
      
      {articulacoes.map(({ evento, marcos }) => (
        <Card key={evento.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{evento.nomeEvento}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Evento: {format(new Date(evento.dataEvento + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {marcos.map((marco, i) => {
                const marcoDate = new Date(marco.data! + 'T12:00:00');
                const passou = isBefore(marcoDate, today);
                const dias = differenceInDays(marcoDate, today);

                return (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${passou ? 'bg-muted/30 border-border' : 'bg-accent/5 border-accent/20'}`}>
                    <div className="flex items-center gap-2">
                      <span>{marco.emoji}</span>
                      <div>
                        <p className={`text-sm font-medium ${passou ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {marco.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(marcoDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={passou ? 'secondary' : dias <= 7 ? 'destructive' : 'default'}>
                      {passou ? 'Concluído' : `em ${dias}d`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticulacoesTab;
