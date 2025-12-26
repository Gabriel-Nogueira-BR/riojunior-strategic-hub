export interface Evento {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  tipo: string;
  pauta?: string;
  diretorias: string[];
}

export interface EJ {
  id: string;
  nome: string;
  cluster: 1 | 2 | 3 | 4 | 5;
  cnpj: string;
  regiao: 'Norte' | 'Centro Norte' | 'Centro Sul 1' | 'Centro Sul 2' | 'Sul';
  localizacao: string;
  faturamentoMeta: number;
  faturamentoAtual: number;
  faturamentoQ1?: number;
  faturamentoQ2?: number;
  faturamentoQ3?: number;
  faturamentoQ4?: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
  status: 'realizado' | 'projetado';
  isRecorrente?: boolean;
  recorrenciaMeses?: number;
  ejId?: string;
  parceiroNome?: string;
  custoEmbutido?: number;
  jurosAplicados?: number;
}

export interface TipoTransacao {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida' | 'ambos';
}

export interface Anuidade {
  id: string;
  ejId: string;
  ano: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado';
  jurosPercentual: number;
  valorJuros: number;
  ejNome?: string;
}

export interface Documento {
  id: string;
  nome: string;
  etapa: 1 | 2 | 3 | 4;
  descricao?: string;
}

export interface EntregaDocumento {
  id: string;
  ejId: string;
  documentoId: string;
  dataEntrega?: string;
  entregue: boolean;
  ejNome?: string;
  documentoNome?: string;
  documentoEtapa?: number;
}

export interface Ciclo {
  id: string;
  nome: string;
  tipo: 'estrategico' | 'tatico' | 'operacional';
  numero: number;
  ano: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface OKREstrategica {
  id: string;
  titulo: string;
  descricao?: string;
  ano: number;
  objetivos?: Objetivo[];
}

export interface Objetivo {
  id: string;
  titulo: string;
  descricao?: string;
  nivel: 'estrategico' | 'tatico' | 'operacional';
  okrEstrategicaId?: string;
  diretoria?: string;
  objetivoPaiId?: string;
  cicloId?: string;
  keyResults?: KeyResult[];
}

export interface KeyResult {
  id: string;
  objetivoId: string;
  titulo: string;
  descricao?: string;
  tipoMetrica: 'valor' | 'quantidade' | 'porcentagem';
  meta: number;
  atual: number;
  unidade?: string;
}

export interface FaturamentoMensal {
  id: string;
  ejId: string;
  ano: number;
  mes: number;
  valor: number;
  metaMes: number;
}

// Faróis de faturamento
export type FarolStatus = 'azul' | 'verde' | 'amarelo' | 'vermelho' | 'preto';

export type TabType = 'calendar' | 'ddr' | 'operations' | 'presidency' | 'business' | 'formation' | 'council' | 'strategic';

export type ViewMode = 'list' | 'month' | 'year';

export const DIRETORIAS = [
  'Presidência Executiva',
  'Presidência do Conselho',
  'VP Negócios',
  'Operações',
  'DDR',
  'Formação Empreendedora'
] as const;

export const DIRETORIAS_SIGLAS: Record<string, string> = {
  'Presidência Executiva': 'PRESEX',
  'Presidência do Conselho': 'PRESCON',
  'VP Negócios': 'VPNEG',
  'Operações': 'DOP',
  'DDR': 'DDR',
  'Formação Empreendedora': 'DFE'
};

export type Diretoria = typeof DIRETORIAS[number];
