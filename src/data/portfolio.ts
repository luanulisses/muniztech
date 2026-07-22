export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  technologies: string[];
  highlights: string[];
  status: 'online' | 'private' | 'in_development';
  featured?: boolean;
}

export interface PortfolioService {
  id: string;
  title: string;
  description: string;
  benefit: string;
  included: string[];
  icon: string;
  ctaText: string;
}

export interface PortfolioTechCategory {
  id: string;
  title: string;
  icon: string;
  bgLight: string;
  items: string[];
}

export interface PortfolioProfile {
  name: string;
  role: string;
  subrole: string;
  bio: string;
  image: string;
  fallbackInitials: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
}

export const PORTFOLIO_PROFILE: PortfolioProfile = {
  name: 'Luan Muniz',
  role: 'Fundador & Especialista em Tecnologia',
  subrole: 'Tecnologia • Sistemas • ERP • IA • Automação',
  bio: 'Meu nome é Luan Muniz. Atuo com tecnologia, desenvolvimento de sistemas, ERP Senior, Oracle, inteligência artificial, automações e soluções digitais. Meu objetivo é transformar problemas reais em soluções práticas, escaláveis e eficientes.',
  image: '/portfolio/luan-muniz.jpg',
  fallbackInitials: 'LM',
  whatsappNumber: '5562999999999',
  whatsappMessage: 'Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Muniz%20Tech%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.',
  email: 'contato@muniztech.com.br',
};

export const PORTFOLIO_WHATSAPP_URL = `https://wa.me/${PORTFOLIO_PROFILE.whatsappNumber}?text=${PORTFOLIO_PROFILE.whatsappMessage}`;

export const PORTFOLIO_TECHS: PortfolioTechCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'Layout',
    bgLight: 'bg-blue-50/70 border-blue-100 text-blue-700',
    items: ['React', 'Vite', 'TypeScript', 'TailwindCSS', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'backend',
    title: 'Backend & Cloud',
    icon: 'Server',
    bgLight: 'bg-emerald-50/70 border-emerald-100 text-emerald-700',
    items: ['Node.js', 'Supabase', 'Edge Functions', 'APIs REST', 'Vercel', 'VPS', 'GitHub'],
  },
  {
    id: 'database',
    title: 'Banco de Dados',
    icon: 'Database',
    bgLight: 'bg-indigo-50/70 border-indigo-100 text-indigo-700',
    items: ['Oracle', 'PostgreSQL', 'SQL', 'PL/SQL', 'Supabase'],
  },
  {
    id: 'erp',
    title: 'ERP Senior',
    icon: 'Cpu',
    bgLight: 'bg-amber-50/70 border-amber-100 text-amber-700',
    items: ['Senior Sapiens', 'Senior HCM', 'NF-e', 'GNRE', 'E-social'],
  },
  {
    id: 'ai',
    title: 'Inteligência Artificial',
    icon: 'Bot',
    bgLight: 'bg-purple-50/70 border-purple-100 text-purple-700',
    items: ['Gemini', 'OpenAI', 'ChatGPT', 'Prompt Engineering'],
  },
  {
    id: 'automation',
    title: 'Automação & Integrações',
    icon: 'Zap',
    bgLight: 'bg-orange-50/70 border-orange-100 text-orange-700',
    items: ['Evolution API', 'WhatsApp Automation', 'Webhooks', 'Mercado Pago', 'Integrações API'],
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'muniz-academy',
    title: 'Muniz Academy AI',
    category: 'EdTech & IA Pedagógica',
    description: 'Plataforma educacional completa alimentada por Inteligência Artificial, com gamificação estilo Duolingo, jornadas de aprendizagem personalizadas, analytics e portal para responsáveis.',
    image: '/portfolio/muniz-academy.png',
    url: 'https://academy.muniztech.com.br/',
    status: 'online',
    featured: true,
    technologies: ['React', 'TypeScript', 'Supabase', 'Gemini', 'Vercel', 'Analytics'],
    highlights: [
      'IA tutora pedagógica 24/7',
      'Gamificação estilo Duolingo',
      'Jornada de Aprendizagem CMB',
      'Dashboard para responsáveis',
      'CMS de conteúdos e avaliações',
    ],
  },
  {
    id: 'muniz-connect',
    title: 'Muniz Connect',
    category: 'Plataforma SaaS & NFC',
    description: 'Plataforma SaaS corporativa para criação e gestão de cartões digitais interativos com tecnologia NFC, TV corporativa em tempo real, gestão de assinaturas e marketplace.',
    image: '/portfolio/connect.png',
    url: 'https://connect.muniztech.com.br/',
    status: 'online',
    technologies: ['React', 'Supabase', 'Mercado Pago', 'NFC', 'Vercel', 'Analytics'],
    highlights: [
      'Cartões digitais inteligentes',
      'Integração com tecnologia NFC',
      'Painel de TV corporativa dinâmica',
      'Checkout e assinaturas via Mercado Pago',
      'Analytics detalhado de acessos',
    ],
  },
  {
    id: 'quintal-da-fafa',
    title: 'Quintal da Fafá',
    category: 'Sistema de Ingressos & PIX',
    description: 'Sistema web completo para gestão, venda e validação de ingressos digitais com confirmação automática via Webhook PIX e leitor de QR Code para portaria.',
    image: '/portfolio/quintal-da-fafa.jpg',
    url: 'https://www.quintaldafafa.com.br/',
    status: 'online',
    technologies: ['React', 'Supabase', 'Mercado Pago', 'Webhooks', 'PIX', 'QR Code'],
    highlights: [
      'Checkout PIX com aprovação instantânea',
      'Envio automático via Webhooks',
      'Ingresso digital com validação QR Code',
      'Gestão de lista VIP e lotes',
      'Painel de portaria em tempo real',
    ],
  },
  {
    id: 'israel-advocacia',
    title: 'Duarte Advogados — Israel',
    category: 'Portal Jurídico & Captação',
    description: 'Plataforma institucional profissional para escritório de advocacia, focada em autoridade digital, SEO estratégico e captação de clientes qualificados.',
    image: '/portfolio/israel-advocacia.png',
    url: 'https://duarte-jus.vercel.app/',
    status: 'online',
    technologies: ['React', 'Vite', 'TailwindCSS', 'Vercel', 'SEO'],
    highlights: [
      'Design responsivo e institucional',
      'Arquitetura focada em conversão',
      'Integração direta com atendimento WhatsApp',
      'Otimização de performance e SEO',
    ],
  },
  {
    id: 'rvgs-eletrica',
    title: 'RVGS Elétrica e Fotovoltaica',
    category: 'Energia Solar & Engenharia Elétrica',
    description: 'Plataforma web institucional e comercial para empresa especializada em engenharia elétrica, projetos e soluções de energia solar fotovoltaica.',
    image: '/portfolio/rvgs.png',
    url: 'https://www.rvgseletricafotovoltaica.com/',
    status: 'online',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Vite', 'Vercel'],
    highlights: [
      'Apresentação de soluções solares',
      'Formulários e simulação de orçamento',
      'Design responsivo e institucional',
      'SEO otimizado para captação de clientes',
    ],
  },
];

export const PORTFOLIO_SERVICES: PortfolioService[] = [
  {
    id: 'dev-web',
    title: 'Desenvolvimento Web',
    description: 'Sites, portais e plataformas modernas, responsivas e preparadas para crescer com React e TypeScript.',
    benefit: 'Presença digital profissional',
    included: ['Layout responsivo premium', 'Painel administrativo', 'Otimização de velocidade'],
    icon: 'Globe',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'dev-saas',
    title: 'Desenvolvimento SaaS',
    description: 'Plataformas completas em nuvem com autenticação, planos, pagamento recorrente e analytics.',
    benefit: 'Receita recorrente escalável',
    included: ['Autenticação e controle de acessos', 'Integração de pagamentos', 'Dashboard de métricas'],
    icon: 'Layers',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'erp-senior',
    title: 'ERP Senior',
    description: 'Implantação, suporte, customização e integração do ERP Senior Sapiens e HCM para sua empresa.',
    benefit: 'Processos otimizados',
    included: ['Customização de regras', 'Rotinas fiscais e NF-e', 'Suporte especializado'],
    icon: 'Server',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'oracle-sql',
    title: 'Oracle e SQL',
    description: 'Consultas, relatórios, performance tuning, scripts em PL/SQL e diagnóstico em bases Oracle.',
    benefit: 'Dados confiáveis e rápidos',
    included: ['Relatórios sob medida', 'Otimização de consultas', 'Correção de erros no banco'],
    icon: 'Database',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'ia',
    title: 'Inteligência Artificial',
    description: 'Chatbots inteligentes, automação com IA, integração com Gemini/OpenAI e prompt engineering.',
    benefit: 'Automação inteligente',
    included: ['Agentes virtuais com IA', 'Processamento de linguagem', 'Redução de trabalho manual'],
    icon: 'Bot',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'wpp-auto',
    title: 'Automação de WhatsApp',
    description: 'Envio automático de mensagens, chatbots, fluxos de atendimento e integrações via Evolution API.',
    benefit: 'Atendimento 24/7',
    included: ['Atendimento automatizado', 'Notificações de pedidos', 'Integração com CRM/ERP'],
    icon: 'MessageSquare',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'apis',
    title: 'Integrações API',
    description: 'Conexão segura entre sistemas, gatews de pagamento, ERPs, CRMs e plataformas externas.',
    benefit: 'Sistemas conectados',
    included: ['Sincronização em tempo real', 'Webhooks e notificações', 'Arquitetura segura'],
    icon: 'Zap',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description: 'Páginas de alta conversão com design surpreendente, SEO avançado e foco total em vendas.',
    benefit: 'Mais leads e vendas',
    included: ['Design focado em conversão', 'Carregamento ultra-rápido', 'Captura de contatos'],
    icon: 'Rocket',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'dashboards',
    title: 'Dashboards & Analytics',
    description: 'Painéis de controle interativos com dados em tempo real para tomada de decisões estratégicas.',
    benefit: 'Decisões baseadas em dados',
    included: ['Gráficos e métricas em tempo real', 'Filtros dinâmicos', 'Exportação de relatórios'],
    icon: 'LayoutDashboard',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'consultoria',
    title: 'Consultoria em Tecnologia',
    description: 'Análise, planejamento e orientação técnica para projetos, migração de sistemas e arquitetura.',
    benefit: 'Decisões seguras',
    included: ['Diagnóstico de arquitetura', 'Planejamento de projetos', 'Seleção de tecnologias'],
    icon: 'Briefcase',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'seo-perf',
    title: 'SEO e Performance',
    description: 'Otimização de velocidade, meta tags, Core Web Vitals e posicionamento orgânico no Google.',
    benefit: 'Mais tráfego qualificado',
    included: ['Auditoria de performance', 'Otimização de imagens e código', 'Indexação acelerada'],
    icon: 'Search',
    ctaText: 'Conversar sobre este serviço',
  },
  {
    id: 'custom-systems',
    title: 'Sistemas Personalizados',
    description: 'Desenvolvimento sob medida projetado exclusivamente para as necessidades da sua empresa.',
    benefit: 'Solução única para você',
    included: ['Levantamento de requisitos', 'Prototipagem e desenvolvimento', 'Suporte e evolução'],
    icon: 'Settings',
    ctaText: 'Conversar sobre este serviço',
  },
];
