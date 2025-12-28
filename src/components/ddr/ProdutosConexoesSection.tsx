import { useMemo } from 'react';
import { Calendar, Users, Award, MapPin, Loader2 } from 'lucide-react';
import { useEventos } from '@/hooks/useEventos';
import { formatDateString } from '@/utils/formatters';

interface ProdutosConexoesSectionProps {
  selectedYear: number;
}

const ProdutosConexoesSection = ({ selectedYear }: ProdutosConexoesSectionProps) => {
  const { eventos, loading } = useEventos();

  // Filter "Produto de Conexão" events for the selected year
  const produtosConexoes = useMemo(() => {
    return eventos.filter(evento => {
      const eventYear = new Date(evento.dataInicio).getFullYear();
      const isProdutoConexao = evento.tipo.toLowerCase().includes('produto de conexão') || 
                               evento.tipo.toLowerCase().includes('produto de conexao') ||
                               evento.tipo.toLowerCase().includes('conexão') ||
                               evento.tipo.toLowerCase().includes('conexao');
      return eventYear === selectedYear && isProdutoConexao;
    }).sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
  }, [eventos, selectedYear]);

  // Determine if event is presencial or online based on name/pauta
  const getEventType = (evento: { nome: string; pauta?: string }) => {
    const text = `${evento.nome} ${evento.pauta || ''}`.toLowerCase();
    if (text.includes('online') || text.includes('virtual') || text.includes('remoto')) {
      return 'online';
    }
    return 'presencial';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Award size={18} className="text-rio-gold" />
        <h3 className="font-bold text-foreground">Produtos de Conexões</h3>
        <span className="text-xs text-muted-foreground">({produtosConexoes.length} eventos)</span>
      </div>

      {produtosConexoes.length > 0 ? (
        <div className="space-y-3">
          {produtosConexoes.map((evento) => {
            const eventType = getEventType(evento);
            const isOnline = eventType === 'online';
            
            return (
              <div 
                key={evento.id} 
                className="bg-secondary/30 p-4 rounded-lg border-l-4 border-rio-gold hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{evento.nome}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isOnline 
                          ? 'bg-rio-purple/10 text-rio-purple border border-rio-purple/20' 
                          : 'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        {isOnline ? 'Online' : 'Presencial'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDateString(evento.dataInicio)}
                        {evento.dataFim && evento.dataFim !== evento.dataInicio && (
                          <> - {formatDateString(evento.dataFim)}</>
                        )}
                      </span>
                      {!isOnline && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          Presencial
                        </span>
                      )}
                    </div>

                    {evento.pauta && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {evento.pauta}
                      </p>
                    )}

                    {evento.diretorias && evento.diretorias.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Users size={12} className="text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {evento.diretorias.map((dir, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {dir}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="h-10 w-10 rounded-lg bg-rio-gold/10 flex items-center justify-center">
                      <Award size={18} className="text-rio-gold" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Reconhecimento</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary/30 rounded-lg border border-dashed border-border">
          <Award className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">
            Nenhum Produto de Conexão encontrado para {selectedYear}.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Adicione eventos do tipo "Produto de Conexão" no Calendário.
          </p>
        </div>
      )}

      <div className="bg-rio-gold/10 p-3 rounded-lg border border-rio-gold/20">
        <p className="text-xs text-rio-gold">
          <strong>Dica:</strong> Os Produtos de Conexões são eventos onde acontecem os momentos de reconhecimento das EJs. 
          Adicione-os no Calendário com o tipo "Produto de Conexão" para que apareçam aqui automaticamente.
        </p>
      </div>
    </div>
  );
};

export default ProdutosConexoesSection;
