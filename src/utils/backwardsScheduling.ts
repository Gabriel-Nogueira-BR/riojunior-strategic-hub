import { addDays, subDays, getDay, isBefore, isEqual, format } from 'date-fns';

const DIAS_SEMANA_MAP: Record<string, number> = {
  'Domingo': 0,
  'Segunda': 1,
  'Terça': 2,
  'Quarta': 3,
  'Quinta': 4,
  'Sexta': 5,
  'Sábado': 6,
};

export interface PresidenciaEventoInput {
  nomeEvento: string;
  dataEvento: string; // YYYY-MM-DD
  diaStatusSebrae: string;
  prazoIdvBrainstorm: number;
  prazoIdvTerceirizada: number;
  prazoPfElaboracao: number;
  prazoPfAprovacaoCa: number;
  prazoPesquisaConselheiros: number;
}

export interface CronogramaCalculado {
  dataMarcoZero: string;
  dataIdvInicioBrainstorm: string;
  dataIdvInicioTerceirizada: string;
  dataPfInicioElaboracao: string;
  dataPfAprovacaoCa: string;
  dataPesquisaLancamento: string;
  dataPesquisaAvisoPrevio: string;
  dataPesquisaLimiteColeta: string;
}

/**
 * Calcula o Marco Zero: a reunião quinzenal de Status SEBRAE
 * que ocorra pelo menos 45 dias antes da data do evento.
 * A recorrência quinzenal é baseada no dia da semana configurado.
 */
function calcularMarcoZero(dataEvento: Date, diaStatusSebrae: string): Date {
  const diaSemanaAlvo = DIAS_SEMANA_MAP[diaStatusSebrae] ?? 3; // default Quarta
  const limite = subDays(dataEvento, 45);

  // Encontrar a data do dia da semana alvo que cai em ou antes do limite
  let candidata = new Date(limite);
  const diaCandidata = getDay(candidata);
  
  // Ajustar para o dia da semana alvo mais próximo (para trás)
  let diff = diaCandidata - diaSemanaAlvo;
  if (diff < 0) diff += 7;
  candidata = subDays(candidata, diff);

  // Garantir quinzenalidade - voltar de 14 em 14 dias se necessário para alinhar
  // O marco zero é a reunião quinzenal mais próxima que ainda respeite os 45 dias
  if (isBefore(dataEvento, addDays(candidata, 45)) && !isEqual(addDays(candidata, 45), dataEvento)) {
    candidata = subDays(candidata, 14);
  }

  return candidata;
}

export function calcularCronograma(input: PresidenciaEventoInput): CronogramaCalculado {
  const dataEvento = new Date(input.dataEvento + 'T12:00:00');
  
  // Marco Zero
  const marcoZero = calcularMarcoZero(dataEvento, input.diaStatusSebrae);

  // Fluxo IDV (backwards from Marco Zero)
  const dataIdvInicioTerceirizada = subDays(marcoZero, input.prazoIdvTerceirizada);
  const dataIdvInicioBrainstorm = subDays(dataIdvInicioTerceirizada, input.prazoIdvBrainstorm);

  // Fluxo Financeiro (backwards from Marco Zero)
  const dataPfAprovacaoCa = marcoZero; // deadline = Marco Zero
  const dataPfInicioElaboracao = subDays(marcoZero, input.prazoPfAprovacaoCa + input.prazoPfElaboracao);

  // Articulação com Conselheiros (backwards from Marco Zero)
  const dataPesquisaLimiteColeta = marcoZero;
  const dataPesquisaLancamento = subDays(marcoZero, input.prazoPesquisaConselheiros);
  const dataPesquisaAvisoPrevio = subDays(dataPesquisaLancamento, 7);

  const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

  return {
    dataMarcoZero: fmt(marcoZero),
    dataIdvInicioBrainstorm: fmt(dataIdvInicioBrainstorm),
    dataIdvInicioTerceirizada: fmt(dataIdvInicioTerceirizada),
    dataPfInicioElaboracao: fmt(dataPfInicioElaboracao),
    dataPfAprovacaoCa: fmt(dataPfAprovacaoCa),
    dataPesquisaLancamento: fmt(dataPesquisaLancamento),
    dataPesquisaAvisoPrevio: fmt(dataPesquisaAvisoPrevio),
    dataPesquisaLimiteColeta: fmt(dataPesquisaLimiteColeta),
  };
}

export interface MarcoTimeline {
  label: string;
  data: string;
  cor: string;
  fluxo: 'marco' | 'idv' | 'financeiro' | 'articulacao' | 'evento';
}

export function gerarTimeline(input: PresidenciaEventoInput, cronograma: CronogramaCalculado): MarcoTimeline[] {
  const marcos: MarcoTimeline[] = [
    { label: 'Aviso Prévio Conselheiros', data: cronograma.dataPesquisaAvisoPrevio, cor: '#a855f7', fluxo: 'articulacao' },
    { label: 'Início Brainstorm IDV', data: cronograma.dataIdvInicioBrainstorm, cor: '#f59e0b', fluxo: 'idv' },
    { label: 'Início Elaboração PF', data: cronograma.dataPfInicioElaboracao, cor: '#10b981', fluxo: 'financeiro' },
    { label: 'Lançamento Pesquisa', data: cronograma.dataPesquisaLancamento, cor: '#a855f7', fluxo: 'articulacao' },
    { label: 'Início Terceirizada IDV', data: cronograma.dataIdvInicioTerceirizada, cor: '#f59e0b', fluxo: 'idv' },
    { label: 'Marco Zero (Status SEBRAE)', data: cronograma.dataMarcoZero, cor: '#ef4444', fluxo: 'marco' },
    { label: 'Evento', data: input.dataEvento, cor: '#3b82f6', fluxo: 'evento' },
  ];

  return marcos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
}
