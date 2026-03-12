import { addDays, subDays, isBefore, isEqual, format, differenceInDays } from 'date-fns';

export interface PresidenciaEventoInput {
  nomeEvento: string;
  dataEvento: string; // YYYY-MM-DD
  dataReferenciaStatus: string; // YYYY-MM-DD — anchor date for biweekly recurrence
  prazoIdvBrainstorm: number;
  prazoIdvTerceirizada: number;
  prazoPfElaboracao: number;
  prazoPfAprovacaoCa: number;
  prazoAvisoPrevio: number;
  prazoColetaPesquisa: number;
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
 * Calcula o Marco Zero usando data âncora + recorrência quinzenal.
 * Encontra a data da recorrência que cai exatamente ou imediatamente
 * antes do limite de 45 dias de antecedência do evento.
 */
function calcularMarcoZero(dataEvento: Date, dataReferenciaStatus: Date): Date {
  const limite = subDays(dataEvento, 45);

  // Generate biweekly occurrences from anchor, going forward far enough
  // then pick the one on or immediately before `limite`
  const anchorTime = dataReferenciaStatus.getTime();
  const limiteTime = limite.getTime();
  const intervaloMs = 14 * 24 * 60 * 60 * 1000;

  // Calculate how many intervals from anchor to get near limite
  const diffMs = limiteTime - anchorTime;
  let n = Math.floor(diffMs / intervaloMs);

  // Candidate = anchor + n * 14 days
  let candidata = addDays(dataReferenciaStatus, n * 14);

  // Adjust: ensure candidata <= limite
  while (candidata.getTime() > limiteTime) {
    n--;
    candidata = addDays(dataReferenciaStatus, n * 14);
  }
  // Also try n+1 in case it's exactly on limite
  const next = addDays(dataReferenciaStatus, (n + 1) * 14);
  if (next.getTime() <= limiteTime) {
    candidata = next;
  }

  return candidata;
}

export function calcularCronograma(input: PresidenciaEventoInput): CronogramaCalculado {
  const dataEvento = new Date(input.dataEvento + 'T12:00:00');
  const dataRef = new Date(input.dataReferenciaStatus + 'T12:00:00');

  // Marco Zero
  const marcoZero = calcularMarcoZero(dataEvento, dataRef);

  // Fluxo IDV — independente, prazo final = Marco Zero
  const dataIdvInicioTerceirizada = subDays(marcoZero, input.prazoIdvTerceirizada);
  const dataIdvInicioBrainstorm = subDays(dataIdvInicioTerceirizada, input.prazoIdvBrainstorm);

  // Fluxo Financeiro — independente, prazo final = Marco Zero
  const dataPfAprovacaoCa = subDays(marcoZero, 0); // deadline = Marco Zero
  const dataPfInicioElaboracao = subDays(marcoZero, input.prazoPfAprovacaoCa + input.prazoPfElaboracao);

  // Fluxo Articulação — independente, prazo final = Marco Zero
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

/** Gantt bar data for parallel flow visualization */
export interface GanttBar {
  fluxo: string;
  label: string;
  cor: string;
  inicio: string;
  fim: string;
  etapas: { label: string; inicio: string; fim: string }[];
}

export function gerarGanttBars(input: PresidenciaEventoInput, cronograma: CronogramaCalculado): GanttBar[] {
  return [
    {
      fluxo: 'idv',
      label: '🎨 Identidade Visual',
      cor: '#f59e0b',
      inicio: cronograma.dataIdvInicioBrainstorm,
      fim: cronograma.dataMarcoZero,
      etapas: [
        { label: 'Brainstorm', inicio: cronograma.dataIdvInicioBrainstorm, fim: cronograma.dataIdvInicioTerceirizada },
        { label: 'Terceirizada', inicio: cronograma.dataIdvInicioTerceirizada, fim: cronograma.dataMarcoZero },
      ],
    },
    {
      fluxo: 'financeiro',
      label: '💰 Financeiro (PF)',
      cor: '#10b981',
      inicio: cronograma.dataPfInicioElaboracao,
      fim: cronograma.dataMarcoZero,
      etapas: [
        { label: 'Elaboração', inicio: cronograma.dataPfInicioElaboracao, fim: cronograma.dataPfAprovacaoCa },
        { label: 'Aprovação CA', inicio: cronograma.dataPfAprovacaoCa, fim: cronograma.dataMarcoZero },
      ],
    },
    {
      fluxo: 'articulacao',
      label: '🤝 Articulação',
      cor: '#a855f7',
      inicio: cronograma.dataPesquisaAvisoPrevio,
      fim: cronograma.dataMarcoZero,
      etapas: [
        { label: 'Aviso Prévio', inicio: cronograma.dataPesquisaAvisoPrevio, fim: cronograma.dataPesquisaLancamento },
        { label: 'Pesquisa Conselheiros', inicio: cronograma.dataPesquisaLancamento, fim: cronograma.dataPesquisaLimiteColeta },
      ],
    },
  ];
}
