export interface Evento {
  id: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  tipo: string;
  pauta?: string;
  diretorias: string[];
}

export interface EJ {
  id: number;
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
  id: number;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
  status: 'realizado' | 'projetado';
}

export type TabType = 'calendar' | 'ddr' | 'operations' | 'presidency' | 'business' | 'formation';

export type ViewMode = 'list' | 'month' | 'year';
