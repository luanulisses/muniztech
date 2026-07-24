import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Code2,
  Database,
  Bot,
  Zap,
  Globe,
  Layers,
  LayoutDashboard,
  Search,
  Settings,
  Rocket,
  MessageSquare,
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  CreditCard,
  Ticket,
  Scale,
  Server,
  ChevronRight,
  ExternalLink,
  Phone,
  Send,
  Star,
  User,
  Cpu,
  Layout,
  Lock,
  CheckCircle2,
  Terminal,
  Sparkles,
  Mail,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  PORTFOLIO_PROFILE,
  PORTFOLIO_WHATSAPP_URL,
  PORTFOLIO_BUDGET_URL,
  PORTFOLIO_TECHS,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_SERVICES,
  PortfolioProject,
  PortfolioService,
} from '@/data/portfolio';
import { SITE_CONFIG } from '@/config/site';
import { getEmailUrl } from '@/config/links';
import BudgetModal from '@/components/portfolio/BudgetModal';

// ── ICON MAPPER ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, any> = {
  Globe,
  Layers,
  Server,
  Database,
  Bot,
  MessageSquare,
  Zap,
  Rocket,
  LayoutDashboard,
  Briefcase,
  Search,
  Settings,
  Layout,
  Cpu,
  GraduationCap,
  CreditCard,
  Ticket,
  Scale,
};

// ── SEO ─────────────────────────────────────────────────────────────────────
function usePortfolioSEO() {
  useEffect(() => {
    document.title = 'Muniz Tech | Portfólio, Tecnologia, ERP, Oracle e Inteligência Artificial';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Conheça os projetos, tecnologias e serviços da Muniz Tech em desenvolvimento web, ERP Senior, Oracle, inteligência artificial, automações e SaaS.'
      );
    }
    return () => {
      document.title = 'MunizTech | Tecnologia com Verdade';
    };
  }, []);
}

// ── IMAGE WITH FALLBACK COMPONENT ───────────────────────────────────────────
function ProjectImage({ src, alt, title, category }: { src: string; alt: string; title: string; category: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15),transparent)]" />
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-3 relative z-10">
          <Terminal className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1 relative z-10">
          {category}
        </span>
        <h4 className="text-sm md:text-base font-black text-white uppercase tracking-tight relative z-10">
          {title}
        </h4>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
    />
  );
}

// ── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i * 0.05, 0.3), duration: 0.45, ease: 'easeOut' },
  }),
};

// ── SCROLL HELPER ───────────────────────────────────────────────────────────
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── CTA CHECKLIST ITEMS ─────────────────────────────────────────────────────
const CTA_SERVICES = [
  'Desenvolvimento Web',
  'ERP Senior',
  'Oracle',
  'Inteligência Artificial',
  'Automação',
  'Dashboards',
  'Sistemas personalizados',
];

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Portfolio() {
  usePortfolioSEO();
  const [imageError, setImageError] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const handleOpenBudget = (serviceName?: string) => {
    setSelectedService(serviceName);
    setIsBudgetOpen(true);
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* ═══════════════════ 1. HERO SECTION ═══════════════════ */}
      <section className="bg-white border-b border-surface-container-high relative overflow-hidden py-12 sm:py-16 md:py-24">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-secondary/[0.04] rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Lado Esquerdo: Textos & CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-5 sm:space-y-6 text-center sm:text-left"
            >
              {/* Badge */}
              <motion.div
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary/10 text-secondary rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest border border-secondary/20 mx-auto sm:mx-0"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>Desenvolvimento • ERP • Oracle • IA • Automação</span>
              </motion.div>

              {/* Título Principal */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-black text-on-surface leading-[1.08] tracking-tight"
              >
                Tecnologia, automação e soluções que geram{' '}
                <span className="text-secondary">resultados</span>
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-base sm:text-lg md:text-xl text-on-surface-variant font-label-bold leading-relaxed max-w-2xl mx-auto sm:mx-0"
              >
                Conheça os projetos, tecnologias e serviços desenvolvidos pela Muniz Tech.
              </motion.p>

              {/* Botões de Ação */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                <button
                  onClick={() => scrollToSection('projetos')}
                  className="h-12 px-6 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-secondary-fixed-variant active:scale-95 shadow-md shadow-secondary/20 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" /> Ver Projetos
                </button>
                <button
                  onClick={() => handleOpenBudget()}
                  className="h-12 px-6 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-800 active:scale-95 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Solicitar Orçamento
                </button>
                <a
                  href={PORTFOLIO_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 bg-emerald-500/10 text-emerald-700 border border-emerald-300 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-emerald-500 hover:text-white active:scale-95"
                >
                  <Phone className="w-4 h-4" /> WhatsApp
                </a>
              </motion.div>
            </motion.div>

            {/* Lado Direito: Composicao Visual de Codigo/Painel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-md bg-slate-900 rounded-[28px] p-6 border border-slate-800 shadow-2xl shadow-slate-950/20 relative overflow-hidden">
                {/* Efeito Glow Verde sutil */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

                {/* Header da Janela de Código */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">muniztech.config.ts</span>
                </div>

                {/* Conteudo do Code Mockup */}
                <div className="py-4 font-mono text-xs space-y-2 text-slate-300">
                  <p className="text-secondary font-bold">const munizTech = &#123;</p>
                  <p className="pl-4">foco: <span className="text-emerald-400">'Resultados & Escala'</span>,</p>
                  <p className="pl-4">stack: [</p>
                  <div className="pl-8 flex flex-wrap gap-1.5 py-1">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px] font-sans font-bold">React</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-sans font-bold">Oracle</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px] font-sans font-bold">Inteligência Artificial</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-sans font-bold">ERP Senior</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-sans font-bold">Automação</span>
                  </div>
                  <p className="pl-4">],</p>
                  <p className="pl-4">status: <span className="text-emerald-400">'Pronto para o seu projeto'</span></p>
                  <p className="text-secondary font-bold">&#125;;</p>
                </div>

                {/* Card Flutuante Interno */}
                <div className="mt-2 bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider">Soluções Sob Medida</div>
                      <div className="text-[10px] text-slate-400">Desenvolvimento, IA & Consultoria</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">100% Ativo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. SEÇÃO SOBRE ═══════════════════ */}
      <section className="py-14 sm:py-20 md:py-24 border-b border-surface-container-high">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto com Moldura e Fallback */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-[32px] bg-white border-4 border-secondary/20 p-2 shadow-xl shadow-black/5 relative group hover:shadow-2xl hover:shadow-secondary/10 transition-shadow duration-500">
                <div className="w-full h-full rounded-[24px] overflow-hidden bg-surface-container-low relative flex items-center justify-center">
                  {!imageError ? (
                    <img
                      src={PORTFOLIO_PROFILE.image}
                      alt={PORTFOLIO_PROFILE.name}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white space-y-2">
                      <span className="text-6xl font-black text-secondary">
                        {PORTFOLIO_PROFILE.fallbackInitials}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Muniz Tech</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Texto de Apresentação */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-4 sm:space-y-6 text-center sm:text-left"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-black text-[10px] uppercase tracking-widest mx-auto sm:mx-0"
              >
                <User className="w-3.5 h-3.5 text-secondary" />
                <span>Quem está por trás da Muniz Tech</span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="text-2xl sm:text-3xl md:text-[38px] font-black text-on-surface uppercase tracking-tight leading-tight"
              >
                {PORTFOLIO_PROFILE.name}
              </motion.h2>

              <motion.div variants={fadeUp} custom={1.5}>
                <span className="inline-block text-xs sm:text-sm font-black text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
                  {PORTFOLIO_PROFILE.subrole}
                </span>
              </motion.div>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-base sm:text-lg text-on-surface-variant font-label-bold leading-relaxed"
              >
                {PORTFOLIO_PROFILE.bio}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 3. TECNOLOGIAS E FERRAMENTAS ═══════════════════ */}
      <section className="py-14 sm:py-20 md:py-24 border-b border-surface-container-high">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-black text-[10px] uppercase tracking-widest">
              <Code2 className="w-3.5 h-3.5 text-secondary" />
              <span>Stack & Especialidades</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-black text-on-surface uppercase tracking-tight">
              Tecnologias e Ferramentas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PORTFOLIO_TECHS.map((techCat, idx) => {
              const IconComp = ICON_MAP[techCat.icon] || Code2;
              return (
                <motion.div
                  key={techCat.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={idx}
                  className="bg-white rounded-2xl p-5 border border-surface-container-high shadow-sm hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${techCat.bgLight}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">
                      {techCat.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {techCat.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-lg text-[11px] font-black uppercase tracking-wider border border-surface-container-high"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. PROJETOS E CASES ═══════════════════ */}
      <section id="projetos" className="py-14 sm:py-20 md:py-24 border-b border-surface-container-high">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-black text-[10px] uppercase tracking-widest">
              <Star className="w-3.5 h-3.5 text-secondary" />
              <span>Portfólio de Cases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-black text-on-surface uppercase tracking-tight">
              Projetos e Cases de Sucesso
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PORTFOLIO_PROJECTS.map((project, idx) => (
              <motion.div
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx}
                className={`bg-white rounded-2xl md:rounded-[24px] border border-surface-container-high overflow-hidden shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all duration-300 flex flex-col ${
                  project.featured ? 'md:col-span-2' : ''
                } group`}
              >
                {/* Container de Imagem */}
                <div className={`w-full ${project.featured ? 'h-56 sm:h-72' : 'h-48 sm:h-56'} relative overflow-hidden bg-slate-900`}>
                  <ProjectImage
                    src={project.image}
                    alt={project.title}
                    title={project.title}
                    category={project.category}
                  />

                  {/* Badge de Status no topo */}
                  <div className="absolute top-3 right-3 z-10">
                    {project.status === 'online' ? (
                      <span className="px-3 py-1 bg-emerald-500/90 text-white backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Em produção
                      </span>
                    ) : project.status === 'private' ? (
                      <span className="px-3 py-1 bg-slate-900/90 text-white backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                        <Lock className="w-3 h-3" /> Projeto Privado
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-500/90 text-white backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Em Desenvolvimento
                      </span>
                    )}
                  </div>
                </div>

                {/* Conteudo do Card */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-secondary uppercase tracking-widest">
                      {project.category}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-on-surface uppercase tracking-tight group-hover:text-secondary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-on-surface-variant font-label-bold leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded text-[10px] font-black uppercase tracking-wider border border-surface-container-high"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Métricas */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Métricas
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.metrics.map((m) => (
                            <span
                              key={m}
                              className="px-2.5 py-1 bg-secondary/5 text-secondary rounded-lg text-[10px] font-black uppercase tracking-wider border border-secondary/10"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Destaques */}
                    <div className="pt-2 space-y-1.5">
                      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">
                        Principais Entregas
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {project.highlights.slice(0, 4).map((h) => (
                          <div key={h} className="flex items-center gap-2 text-xs font-label-bold text-on-surface">
                            <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rodapé com Ações */}
                  <div className="pt-4 border-t border-surface-container-high flex items-center justify-between">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 bg-secondary text-white rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-secondary-fixed-variant transition-colors shadow-sm"
                      >
                        Visitar Projeto <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant/60 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        {project.status === 'in_development' ? 'Em desenvolvimento' : 'Projeto privado'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. SERVIÇOS ═══════════════════ */}
      <section id="servicos" className="py-14 sm:py-20 md:py-24 border-b border-surface-container-high">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-black text-[10px] uppercase tracking-widest">
              <Briefcase className="w-3.5 h-3.5 text-secondary" />
              <span>O que a Muniz Tech faz</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-black text-on-surface uppercase tracking-tight">
              O que a Muniz Tech pode fazer por você
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_SERVICES.map((service, idx) => {
              const IconComp = ICON_MAP[service.icon] || Settings;
              return (
                <motion.div
                  key={service.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={idx}
                  className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group hover:border-secondary/40"
                >
                  <div className="space-y-4">
                    {/* Icone em fundo verde suave */}
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-on-surface uppercase tracking-tight leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-on-surface-variant font-label-bold leading-relaxed">
                      {service.description}
                    </p>

                    {/* Inclui */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">
                        Inclui:
                      </div>
                      <ul className="space-y-1">
                        {service.included.map((item) => (
                          <li key={item} className="text-xs font-label-bold text-on-surface flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Beneficio */}
                    <div className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-3 py-1.5 rounded-lg border border-secondary/10 w-fit">
                      ✦ {service.benefit}
                    </div>
                  </div>

                  {/* CTA Alinhado na Base */}
                  <div className="pt-6 mt-4 border-t border-surface-container-high">
                    <a
                      href={PORTFOLIO_WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-surface-container-low text-on-surface hover:bg-secondary hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                      {service.ctaText} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. CTA FINAL — PREMIUM ═══════════════════ */}
      <section className="py-14 sm:py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15),transparent)]" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                Vamos conversar sobre <span className="text-secondary">seu projeto?</span>
              </h2>

              {/* Checklist de serviços */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-left max-w-md mx-auto">
                {CTA_SERVICES.map((svc) => (
                  <div key={svc} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-sm text-gray-300 font-label-bold">{svc}</span>
                  </div>
                ))}
              </div>

              {/* Tempo médio de resposta */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Tempo médio de resposta:
                </span>
                <span className="text-xs font-black text-secondary uppercase tracking-wider">
                  Menos de 30 minutos
                </span>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => handleOpenBudget()}
                  className="h-12 px-8 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-100 active:scale-95 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Solicitar Orçamento
                </button>
                <a
                  href={PORTFOLIO_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-8 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#25D366]/20"
                >
                  <Phone className="w-4 h-4" /> Falar no WhatsApp
                </a>
                <a
                  href={getEmailUrl()}
                  className="h-12 px-8 bg-white/10 text-white border border-white/20 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-white/20 active:scale-95"
                >
                  <Mail className="w-4 h-4" /> Enviar E-mail
                </a>
              </div>

              {/* E-mail discreto */}
              <a
                href={getEmailUrl()}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-xs font-label-bold tracking-wide"
              >
                <Mail className="w-3.5 h-3.5" />
                {SITE_CONFIG.owner.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Orçamento */}
      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        defaultService={selectedService}
      />
    </div>
  );
}

// FASE 3
//
// IA COMERCIAL
// Qualificar lead
// Fazer perguntas
// Agendar reunião
// Gerar proposta PDF
// Integrar Evolution API
// Integrar Google Calendar
// Dashboard comercial

