import { addDays, subDays, format, differenceInDays } from 'date-fns';

export interface PresidenciaEventoInput {
  nomeEvento: string;
  dataEvento: string;
  dataReferenciaStatus: string;
  prazoIdvBrainstorm: number | null;
  prazoIdvTerceirizada: number | null;
  prazoPfElaboracao: number | null;
  prazoPfAprovacaoCa: number | null;
  prazoAvisoPrevio: number | null;
  prazoColetaPesquisa: number | null;
  prazoAberturaCoordenadoria: number | null;
  prazoArticulacaoLocal: number | null;
}

export interface CronogramaCalculado {
  dataMarcoZero: string;
  dataIdvInicioBrainstorm: string | null;
  dataIdvInicioTerceirizada: string | null;
  dataPfInicioElaboracao: string | null;
  dataPfAprovacaoCa: string | null;
  dataPesquisaLancamento: string | null;
  dataPesquisaAvisoPrevio: string | null;
  dataPesquisaLimiteColeta: string | null;
  dataAberturaCoordenadoria: string | null;
  dataArticulacaoLocal: string | null;
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
  const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

  // Fluxo IDV — only if both prazos are set
  let dataIdvInicioBrainstorm: Date | null = null;
  let dataIdvInicioTerceirizada: Date | null = null;
  if (input.prazoIdvBrainstorm != null && input.prazoIdvTerceirizada != null) {
    dataIdvInicioTerceirizada = subDays(marcoZero, input.prazoIdvTerceirizada);
    dataIdvInicioBrainstorm = subDays(dataIdvInicioTerceirizada, input.prazoIdvBrainstorm);
  }

  // Fluxo Financeiro — only if both prazos are set
  let dataPfInicioElaboracao: Date | null = null;
  let dataPfAprovacaoCa: Date | null = null;
  if (input.prazoPfElaboracao != null && input.prazoPfAprovacaoCa != null) {
    // Aprovação CA começa X dias antes do Marco Zero e vai até o Marco Zero
    dataPfAprovacaoCa = subDays(marcoZero, input.prazoPfAprovacaoCa);
    // Elaboração começa antes da Aprovação
    dataPfInicioElaboracao = subDays(dataPfAprovacaoCa, input.prazoPfElaboracao);
  }

  // Fluxo Infraestrutura — only if articulação local and PF elaboração are set
  let dataArticulacaoLocal: Date | null = null;
  if (input.prazoArticulacaoLocal != null && dataPfInicioElaboracao) {
    dataArticulacaoLocal = subDays(dataPfInicioElaboracao, input.prazoArticulacaoLocal);
  }

  // Fluxo Articulação
  let dataPesquisaLimiteColeta: Date | null = null;
  let dataPesquisaLancamento: Date | null = null;
  let dataPesquisaAvisoPrevio: Date | null = null;
  if (input.prazoColetaPesquisa != null) {
    dataPesquisaLimiteColeta = marcoZero;
    dataPesquisaLancamento = subDays(marcoZero, input.prazoColetaPesquisa);
    if (input.prazoAvisoPrevio != null) {
      dataPesquisaAvisoPrevio = subDays(dataPesquisaLancamento, input.prazoAvisoPrevio);
    }
  }

  // Fluxo Coordenadoria — only if there's at least one flow to anchor to
  let dataAberturaCoordenadoria: Date | null = null;
  if (input.prazoAberturaCoordenadoria != null) {
    const flowStarts: number[] = [];
    if (dataIdvInicioBrainstorm) flowStarts.push(dataIdvInicioBrainstorm.getTime());
    if (dataPfInicioElaboracao) flowStarts.push(dataPfInicioElaboracao.getTime());
    if (flowStarts.length > 0) {
      const earliestFlowStart = new Date(Math.min(...flowStarts));
      dataAberturaCoordenadoria = subDays(earliestFlowStart, input.prazoAberturaCoordenadoria);
    }
  }

  return {
    dataMarcoZero: fmt(marcoZero),
    dataIdvInicioBrainstorm: dataIdvInicioBrainstorm ? fmt(dataIdvInicioBrainstorm) : null,
    dataIdvInicioTerceirizada: dataIdvInicioTerceirizada ? fmt(dataIdvInicioTerceirizada) : null,
    dataPfInicioElaboracao: dataPfInicioElaboracao ? fmt(dataPfInicioElaboracao) : null,
    dataPfAprovacaoCa: dataPfAprovacaoCa ? fmt(dataPfAprovacaoCa) : null,
    dataPesquisaLancamento: dataPesquisaLancamento ? fmt(dataPesquisaLancamento) : null,
    dataPesquisaAvisoPrevio: dataPesquisaAvisoPrevio ? fmt(dataPesquisaAvisoPrevio) : null,
    dataPesquisaLimiteColeta: dataPesquisaLimiteColeta ? fmt(dataPesquisaLimiteColeta) : null,
    dataAberturaCoordenadoria: dataAberturaCoordenadoria ? fmt(dataAberturaCoordenadoria) : null,
    dataArticulacaoLocal: dataArticulacaoLocal ? fmt(dataArticulacaoLocal) : null,
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
    { label: 'Marco Zero (Status SEBRAE)', data: cronograma.dataMarcoZero, cor: '#ef4444', fluxo: 'marco' },
    { label: 'Evento', data: input.dataEvento, cor: '#3b82f6', fluxo: 'evento' },
  ];

  if (cronograma.dataAberturaCoordenadoria) {
    marcos.push({ label: 'Abertura Coordenadoria', data: cronograma.dataAberturaCoordenadoria, cor: '#64748b', fluxo: 'coordenadoria' });
  }
  if (cronograma.dataArticulacaoLocal) {
    marcos.push({ label: 'Articulação de Local', data: cronograma.dataArticulacaoLocal, cor: '#4f46e5', fluxo: 'infraestrutura' });
  }
  if (cronograma.dataPesquisaAvisoPrevio) {
    marcos.push({ label: 'Aviso Prévio Conselheiros', data: cronograma.dataPesquisaAvisoPrevio, cor: '#a855f7', fluxo: 'articulacao' });
  }
  if (cronograma.dataIdvInicioBrainstorm) {
    marcos.push({ label: 'Início Brainstorm IDV', data: cronograma.dataIdvInicioBrainstorm, cor: '#f59e0b', fluxo: 'idv' });
  }
  if (cronograma.dataPfInicioElaboracao) {
    marcos.push({ label: 'Início Elaboração PF', data: cronograma.dataPfInicioElaboracao, cor: '#10b981', fluxo: 'financeiro' });
  }
  if (cronograma.dataPfAprovacaoCa) {
    marcos.push({ label: 'Início Aprovação CA', data: cronograma.dataPfAprovacaoCa, cor: '#059669', fluxo: 'financeiro' });
  }
  if (cronograma.dataPesquisaLancamento) {
    marcos.push({ label: 'Lançamento Pesquisa', data: cronograma.dataPesquisaLancamento, cor: '#a855f7', fluxo: 'articulacao' });
  }
  if (cronograma.dataIdvInicioTerceirizada) {
    marcos.push({ label: 'Início Terceirizada IDV', data: cronograma.dataIdvInicioTerceirizada, cor: '#f59e0b', fluxo: 'idv' });
  }

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
  const bars: GanttBar[] = [];

  // Coordenadoria
  if (cronograma.dataAberturaCoordenadoria) {
    const flowStarts: string[] = [];
    if (cronograma.dataIdvInicioBrainstorm) flowStarts.push(cronograma.dataIdvInicioBrainstorm);
    if (cronograma.dataPfInicioElaboracao) flowStarts.push(cronograma.dataPfInicioElaboracao);
    const earliestFlowStart = flowStarts.sort()[0] || cronograma.dataMarcoZero;

    bars.push({
      fluxo: 'coordenadoria',
      label: '📋 Coordenadoria',
      cor: '#64748b',
      inicio: cronograma.dataAberturaCoordenadoria,
      fim: earliestFlowStart,
      etapas: [
        { label: 'Abertura Processo', inicio: cronograma.dataAberturaCoordenadoria, fim: earliestFlowStart },
      ],
    });
  }

  // Infraestrutura
  if (cronograma.dataArticulacaoLocal && cronograma.dataPfInicioElaboracao) {
    bars.push({
      fluxo: 'infraestrutura',
      label: '🏗️ Infraestrutura',
      cor: '#4f46e5',
      inicio: cronograma.dataArticulacaoLocal,
      fim: cronograma.dataPfInicioElaboracao,
      etapas: [
        { label: 'Articulação Local', inicio: cronograma.dataArticulacaoLocal, fim: cronograma.dataPfInicioElaboracao },
      ],
    });
  }

  // IDV
  if (cronograma.dataIdvInicioBrainstorm && cronograma.dataIdvInicioTerceirizada) {
    bars.push({
      fluxo: 'idv',
      label: '🎨 Identidade Visual',
      cor: '#f59e0b',
      inicio: cronograma.dataIdvInicioBrainstorm,
      fim: cronograma.dataMarcoZero,
      etapas: [
        { label: 'Brainstorm', inicio: cronograma.dataIdvInicioBrainstorm, fim: cronograma.dataIdvInicioTerceirizada },
        { label: 'Terceirizada', inicio: cronograma.dataIdvInicioTerceirizada, fim: cronograma.dataMarcoZero },
      ],
    });
  }

  // Financeiro
  if (cronograma.dataPfInicioElaboracao && cronograma.dataPfAprovacaoCa) {
    bars.push({
      fluxo: 'financeiro',
      label: '💰 Financeiro (PF)',
      cor: '#10b981',
      inicio: cronograma.dataPfInicioElaboracao,
      fim: cronograma.dataMarcoZero,
      etapas: [
        { label: 'Elaboração', inicio: cronograma.dataPfInicioElaboracao, fim: cronograma.dataPfAprovacaoCa },
        { label: 'Aprovação CA', inicio: cronograma.dataPfAprovacaoCa, fim: cronograma.dataMarcoZero },
      ],
    });
  }

  // Articulação
  if (cronograma.dataPesquisaLancamento && cronograma.dataPesquisaLimiteColeta) {
    const etapas: { label: string; inicio: string; fim: string }[] = [];
    if (cronograma.dataPesquisaAvisoPrevio) {
      etapas.push({ label: 'Aviso Prévio', inicio: cronograma.dataPesquisaAvisoPrevio, fim: cronograma.dataPesquisaLancamento });
    }
    etapas.push({ label: 'Pesquisa Conselheiros', inicio: cronograma.dataPesquisaLancamento, fim: cronograma.dataPesquisaLimiteColeta });

    bars.push({
      fluxo: 'articulacao',
      label: '🤝 Articulação',
      cor: '#a855f7',
      inicio: cronograma.dataPesquisaAvisoPrevio || cronograma.dataPesquisaLancamento,
      fim: cronograma.dataMarcoZero,
      etapas,
    });
  }

  return bars;
}
