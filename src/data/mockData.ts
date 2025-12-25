import { Evento, EJ, Transacao } from '@/types';

// These are only used as fallback/initial data - the app now uses Supabase
export const INITIAL_EVENTS: Evento[] = [];

export const MOCK_EJS: EJ[] = [];

export const MOCK_TRANSACOES: Transacao[] = [];

export const DIRETORIAS = [
  'Presidência Executiva',
  'Presidência do Conselho',
  'VP Negócios',
  'Operações',
  'DDR',
  'Formação Empreendedora'
];

export const TIPOS_EVENTO = [
  'Deliberativo',
  'Capacitação',
  'Premiação',
  'Integração',
  'Imersão',
  'Produto de conexão (online)',
  'Produto de conexão (presencial)',
  'Consultivo',
  'Aniversário da RioJunior',
  'Agenda Institucional',
  'Articulação',
  'Outro'
];

export const REGIOES = [
  'Norte',
  'Centro Norte',
  'Centro Sul 1',
  'Centro Sul 2',
  'Sul'
] as const;

export const CATEGORIAS_TRANSACAO = [
  'Patrocínio',
  'Anuidade',
  'Parceria VP Negócios',
  'Contribuição',
  'Eventos',
  'Marketing',
  'Administrativo',
  'Tecnologia',
  'Capacitação',
  'Outros'
];
