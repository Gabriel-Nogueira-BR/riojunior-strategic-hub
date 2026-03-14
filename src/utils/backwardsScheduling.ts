import { addDays, subDays, format, differenceInDays } from 'date-fns';

export interface PresidenciaEventoInput {
  nomeEvento: string;
  dataEvento: string;
  dataReferenciaStatus: string;
  prazoIdvBrainstorm: number;
  prazoIdvTerceirizada: number;
  prazoPfElaboracao: number;
  prazoPfAprovacaoCa: number;
  prazoAvisoPrevio: number;
  prazoColetaPesquisa: number;
  prazoAberturaCoordenadoria: number;
  prazoArticulacaoLocal: number;
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
  dataAberturaCoordenadoria: string;
  dataArticulacaoLocal: string;
}

function calcularMarcoZero(dataEvento: Date, dataReferenciaStatus: Date): Date {
  const limite = subDays(dataEvento, 45);
  const anchorTime = dataReferenciaStatus.getTime();
  const limiteTime = limite.getTime();
  const intervaloMs = 14 * 24 * 60 * 60 * 1000;

  const diffMs = limiteTime - anchorTime;
  let n = Math.floor(diffMs / intervaloMs);

  let candidata = addDays(dataReferenciaStatus, n * 14);

  while (candidata.getTime() > limiteTime) {
    n--;
    candidata = addDays(dataReferenciaStatus, n * 14);
  }
  const next = addDays(dataReferenciaStatus, (n + 1) * 14);
  if (next.getTime() <= limiteTime) {
    candidata = next;
  }

  return candidata;
}

export function calcularCronograma(input: PresidenciaEventoInput): CronogramaCalculado {
  const dataEvento = new Date(input.dataEvento + 'T12:00:00');
  const dataRef = new Date(input.dataReferenciaStatus + 'T12:00:00');

  const marcoZero = calcularMarcoZero(dataEvento, dataRef);

  // Fluxo IDV — independente, prazo final = Marco Zero
  const dataIdvInicioTerceirizada = subDays(marcoZero, input.prazoIdvTerceirizada);
  const dataIdvInicioBrainstorm = subDays(dataIdvInicioTerceirizada, input.prazoIdvBrainstorm);

  // Fluxo Financeiro — independente, prazo final = Marco Zero
  const dataPfAprovacaoCa = subDays(marcoZero, 0);
  const dataPfInicioElaboracao = subDays(marcoZero, input.prazoPfAprovacaoCa + input.prazoPfElaboracao);

  // Fluxo Infraestrutura — antecede Elaboração PF
  const dataArticulacaoLocal = subDays(dataPfInicioElaboracao, input.prazoArticulacaoLocal);

  // Fluxo Articulação — independente, prazo final = Marco Zero
  const dataPesquisaLimiteColeta = marcoZero;
  const dataPesquisaLancamento = subDays(marcoZero, input.prazoColetaPesquisa);
  const dataPesquisaAvisoPrevio = subDays(dataPesquisaLancamento, input.prazoAvisoPrevio);

  // Fluxo Coordenadoria — gatilho global: antecede o fluxo mais antigo (IDV ou PF)
  const earliestFlowStart = new Date(Math.min(
    dataIdvInicioBrainstorm.getTime(),
    dataPfInicioElaboracao.getTime()
  ));
  const dataAberturaCoordenadoria = subDays(earliestFlowStart, input.prazoAberturaCoordenadoria);

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
    dataAberturaCoordenadoria: fmt(dataAberturaCoordenadoria),
    dataArticulacaoLocal: fmt(dataArticulacaoLocal),
  };
}

export interface MarcoTimeline {
  label: string;
  data: string;
  cor: string;
  fluxo: 'marco' | 'idv' | 'financeiro' | 'articulacao' | 'coordenadoria' | 'infraestrutura' | 'evento';
}

export function gerarTimeline(input: PresidenciaEventoInput, cronograma: CronogramaCalculado): MarcoTimeline[] {
  const marcos: MarcoTimeline[] = [
    { label: 'Abertura Coordenadoria', data: cronograma.dataAberturaCoordenadoria, cor: '#64748b', fluxo: 'coordenadoria' },
    { label: 'Articulação de Local', data: cronograma.dataArticulacaoLocal, cor: '#4f46e5', fluxo: 'infraestrutura' },
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

export interface GanttBar {
  fluxo: string;
  label: string;
  cor: string;
  inicio: string;
  fim: string;
  etapas: { label: string; inicio: string; fim: string }[];
}

export function gerarGanttBars(input: PresidenciaEventoInput, cronograma: CronogramaCalculado): GanttBar[] {
  // Determine earliest flow start for coordenadoria bar end
  const earliestFlowStart = [cronograma.dataIdvInicioBrainstorm, cronograma.dataPfInicioElaboracao]
    .sort()[0];

  return [
    {
      fluxo: 'coordenadoria',
      label: '📋 Coordenadoria',
      cor: '#64748b',
      inicio: cronograma.dataAberturaCoordenadoria,
      fim: earliestFlowStart,
      etapas: [
        { label: 'Abertura Processo', inicio: cronograma.dataAberturaCoordenadoria, fim: earliestFlowStart },
      ],
    },
    {
      fluxo: 'infraestrutura',
      label: '🏗️ Infraestrutura',
      cor: '#4f46e5',
      inicio: cronograma.dataArticulacaoLocal,
      fim: cronograma.dataPfInicioElaboracao,
      etapas: [
        { label: 'Articulação Local', inicio: cronograma.dataArticulacaoLocal, fim: cronograma.dataPfInicioElaboracao },
      ],
    },
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
