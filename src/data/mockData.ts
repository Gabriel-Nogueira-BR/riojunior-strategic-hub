import { Evento, EJ, Transacao } from '@/types';

export const INITIAL_EVENTS: Evento[] = [
  { 
    id: 1, 
    nome: 'Prêmio RioJunior', 
    dataInicio: '2025-10-15', 
    dataFim: '2025-10-16', 
    tipo: 'Premiação', 
    pauta: 'Cerimônia de reconhecimento das EJs alto crescimento.',
    diretorias: ['Presidência Executiva', 'DDR'] 
  },
  { 
    id: 2, 
    nome: 'Reunião de Conselho', 
    dataInicio: '2025-05-10', 
    dataFim: '2025-05-10', 
    tipo: 'Deliberativo', 
    pauta: 'Votação do novo regimento interno.',
    diretorias: ['Presidência Executiva'] 
  },
  { 
    id: 3, 
    nome: 'Imersão de Líderes', 
    dataInicio: '2025-03-01', 
    dataFim: '2025-03-03', 
    tipo: 'Capacitação', 
    pauta: 'Treinamento de liderança e gestão de projetos.',
    diretorias: ['Formação Empreendedora', 'DDR'] 
  },
  { 
    id: 4, 
    nome: 'Rodada de Negócios', 
    dataInicio: '2025-06-20', 
    dataFim: '2025-06-20', 
    tipo: 'Produto de conexão (presencial)', 
    pauta: 'Conexão entre EJs e empresas parceiras.',
    diretorias: ['VP Negócios'] 
  },
  { 
    id: 5, 
    nome: 'Workshop de Vendas', 
    dataInicio: '2025-04-15', 
    dataFim: '2025-04-15', 
    tipo: 'Capacitação', 
    pauta: 'Técnicas avançadas de vendas B2B.',
    diretorias: ['VP Negócios', 'Formação Empreendedora'] 
  },
];

export const MOCK_EJS: EJ[] = [
  { 
    id: 1, 
    nome: 'Fluxo Consultoria', 
    cluster: 5, 
    cnpj: '12.345.678/0001-90', 
    regiao: 'Centro Sul 1', 
    localizacao: 'UFRJ - Fundão, Rio de Janeiro',
    faturamentoMeta: 150000,
    faturamentoAtual: 112500,
    faturamentoQ1: 30000,
    faturamentoQ2: 42500,
    faturamentoQ3: 40000,
    faturamentoQ4: 0
  },
  { 
    id: 2, 
    nome: 'Meta Consultoria', 
    cluster: 3, 
    cnpj: '98.765.432/0001-10', 
    regiao: 'Centro Norte', 
    localizacao: 'UFF - Niterói',
    faturamentoMeta: 80000,
    faturamentoAtual: 45000,
    faturamentoQ1: 20000,
    faturamentoQ2: 25000,
    faturamentoQ3: 0,
    faturamentoQ4: 0
  },
  { 
    id: 3, 
    nome: 'Rural Jr', 
    cluster: 2, 
    cnpj: '45.123.789/0001-22', 
    regiao: 'Sul', 
    localizacao: 'UFRRJ - Seropédica',
    faturamentoMeta: 40000,
    faturamentoAtual: 18000,
    faturamentoQ1: 8000,
    faturamentoQ2: 10000,
    faturamentoQ3: 0,
    faturamentoQ4: 0
  },
  { 
    id: 4, 
    nome: 'CEFET Jr', 
    cluster: 4, 
    cnpj: '33.456.789/0001-55', 
    regiao: 'Centro Sul 2', 
    localizacao: 'CEFET/RJ - Maracanã',
    faturamentoMeta: 100000,
    faturamentoAtual: 72000,
    faturamentoQ1: 25000,
    faturamentoQ2: 27000,
    faturamentoQ3: 20000,
    faturamentoQ4: 0
  },
  { 
    id: 5, 
    nome: 'PUC Jr', 
    cluster: 5, 
    cnpj: '22.111.333/0001-88', 
    regiao: 'Centro Sul 1', 
    localizacao: 'PUC-Rio - Gávea',
    faturamentoMeta: 200000,
    faturamentoAtual: 165000,
    faturamentoQ1: 55000,
    faturamentoQ2: 60000,
    faturamentoQ3: 50000,
    faturamentoQ4: 0
  },
  { 
    id: 6, 
    nome: 'Norte Jr Consultoria', 
    cluster: 1, 
    cnpj: '11.222.333/0001-99', 
    regiao: 'Norte', 
    localizacao: 'UENF - Campos dos Goytacazes',
    faturamentoMeta: 25000,
    faturamentoAtual: 8000,
    faturamentoQ1: 3000,
    faturamentoQ2: 5000,
    faturamentoQ3: 0,
    faturamentoQ4: 0
  },
];

export const MOCK_TRANSACOES: Transacao[] = [
  { id: 1, descricao: 'Patrocínio Evento Anual', valor: 15000, tipo: 'entrada', categoria: 'Patrocínio', data: '2025-01-15', status: 'realizado' },
  { id: 2, descricao: 'Contribuição Associativas Q1', valor: 8500, tipo: 'entrada', categoria: 'Contribuição', data: '2025-02-01', status: 'realizado' },
  { id: 3, descricao: 'Locação Espaço Evento', valor: 3500, tipo: 'saida', categoria: 'Eventos', data: '2025-02-10', status: 'realizado' },
  { id: 4, descricao: 'Material de Marketing', valor: 1200, tipo: 'saida', categoria: 'Marketing', data: '2025-02-20', status: 'realizado' },
  { id: 5, descricao: 'Consultoria Jurídica', valor: 2000, tipo: 'saida', categoria: 'Administrativo', data: '2025-03-01', status: 'realizado' },
  { id: 6, descricao: 'Contribuição Associativas Q2', valor: 8500, tipo: 'entrada', categoria: 'Contribuição', data: '2025-04-01', status: 'projetado' },
  { id: 7, descricao: 'Patrocínio Imersão', valor: 5000, tipo: 'entrada', categoria: 'Patrocínio', data: '2025-03-15', status: 'projetado' },
  { id: 8, descricao: 'Infraestrutura Digital', valor: 800, tipo: 'saida', categoria: 'Tecnologia', data: '2025-03-20', status: 'projetado' },
];

export const DIRETORIAS = [
  'Presidência Executiva',
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
  'Contribuição',
  'Eventos',
  'Marketing',
  'Administrativo',
  'Tecnologia',
  'Capacitação',
  'Outros'
];
