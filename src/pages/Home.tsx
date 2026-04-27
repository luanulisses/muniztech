import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Star,
  TrendingUp,
  Flame,
  Tag,
  Clock,
  ShoppingCart,
  Eye,
  Send,
  Loader2,
  Search as SearchIcon,
  BadgeCheck,
  ShieldCheck,
  Handshake
} from 'lucide-react';
import { CATEGORIES } from '@/constants';
import * as Icons from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';
import { useReviews } from '@/hooks/useReviews';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { deals, loading: dealsLoading } = useDeals();
  const { reviews, loading: reviewsLoading } = useReviews();
  
  const featuredDeals = deals.filter((d) => !d.isAchadinho).slice(0, 4);
  const achadinhos = deals.filter((d) => d.isAchadinho);
  
  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (dealsLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  const mainHeroProduct = reviews[currentIndex] || reviews[0];

  return (
    <div className="flex flex-col gap-12 pb-32 bg-surface">
      {/* 1. HERO SECTION (CARROSSEL DE NOVIDADES) */}
      <section className="bg-white border-b border-surface-container-high pb-12 pt-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          {mainHeroProduct && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className="space-y-4 md:space-y-6 order-2 lg:order-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest border border-red-500/20 mx-auto lg:mx-0">
                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                    <span>Oferta em Destaque</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
                    {mainHeroProduct.title.split(':')[0].replace(' vs ', ' x ')}
                    <span className="text-secondary block">Vale a Pena?</span>
                  </h1>

                  <p className="text-sm md:text-lg lg:text-xl text-on-surface-variant font-label-bold leading-relaxed line-clamp-2 md:line-clamp-3">
                    {mainHeroProduct.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 w-fit px-3 py-1.5 rounded-lg border border-yellow-200 mx-auto lg:mx-0">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-on-surface-variant font-black text-[10px] md:text-xs ml-1">
                      {mainHeroProduct.rating} Nota MunizTech
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4">
                    <a
                      href={mainHeroProduct.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-secondary/20"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      VER MELHOR PREÇO
                    </a>
                    <Link
                      to={`/analises/${mainHeroProduct.slug}`}
                      className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest text-on-surface rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                    >
                      <SearchIcon className="w-5 h-5" /> Ver Análise Completa
                    </Link>
                  </div>
                </div>

                <div className="order-1 lg:order-2 relative flex justify-center group">
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white text-[10px] md:text-sm font-black uppercase rounded-xl shadow-xl transform rotate-12 animate-pulse">
                    Em Alta!
                  </div>
                  <div className="w-full max-w-sm md:max-w-lg aspect-square rounded-[32px] md:rounded-[40px] shadow-2xl shadow-black/10 bg-surface-container-lowest flex items-center justify-center p-4">
                    <img
                      src={mainHeroProduct.image}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      alt={mainHeroProduct.title}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Dots Pagination */}
          <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-12">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full h-1.5 md:h-2 ${
                  idx === currentIndex ? 'w-8 md:w-10 bg-secondary' : 'w-1.5 md:w-2 bg-surface-container-high hover:bg-surface-container-highest'
                }`}
                aria-label={`Ir para o slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full mt-4">
        <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-4 pb-4 snap-x">
          {CATEGORIES.map((cat) => {
            const IconComponent = (Icons as any)[cat.icon] || Icons.Tag;
            return (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="snap-start shrink-0 min-w-[100px] md:min-w-[120px] p-3 md:p-4 bg-white rounded-2xl md:rounded-3xl border border-surface-container-high shadow-sm hover:border-secondary transition-all text-center flex flex-col items-center gap-2 md:gap-3 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="font-black text-[10px] md:text-sm text-on-surface group-hover:text-secondary transition-colors uppercase tracking-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. OFERTAS RELÂMPAGO */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-6">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
          <h2 className="text-2xl md:text-3xl font-black text-on-surface uppercase tracking-tight">
            Ofertas Relâmpago
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredDeals.map((deal, idx) => (
            <div
              key={deal.id}
              className="bg-white border border-surface-container-high rounded-2xl md:rounded-[32px] p-3 md:p-5 shadow-lg hover:shadow-xl transition-all relative flex flex-col group"
            >
              <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 px-2 py-1 md:px-3 md:py-1.5 bg-red-600 text-white text-[8px] md:text-[11px] font-black uppercase rounded-lg shadow-md">
                {deal.discount} OFF
              </div>
              <div className="h-28 md:h-48 flex items-center justify-center p-2 md:p-4">
                <img
                  src={deal.image}
                  className="max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                  alt={deal.title}
                />
              </div>

              <div className="mt-4 space-y-3 flex-grow flex flex-col">
                <div className="flex flex-wrap items-center gap-1 md:gap-2">
                  <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 w-fit px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">
                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" /> Últimas
                  </div>
                  <div className="text-[8px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-low px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">
                    {deal.store}
                  </div>
                </div>
                <h3 className="font-black text-on-surface leading-tight line-clamp-2 text-[10px] md:text-base">
                  {deal.title}
                </h3>
                <div className="mt-auto space-y-0.5 pt-2">
                  <div className="text-[8px] md:text-xs text-on-surface-variant line-through font-label-bold">
                    {deal.originalPrice}
                  </div>
                  <div className="text-base md:text-3xl font-black text-on-surface leading-none tracking-tighter">
                    {deal.price}
                  </div>
                </div>
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 md:mt-4 py-2 md:py-3 bg-secondary text-white rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-xs tracking-widest flex items-center justify-center transition-transform hover:bg-secondary-fixed-variant active:scale-95 shadow-md shadow-secondary/20"
                >
                  VER MELHOR PREÇO
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ACHADINHOS */}
      {achadinhos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-6 mt-4">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
            <h2 className="text-2xl md:text-3xl font-black text-on-surface uppercase tracking-tight">
              Achadinhos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {achadinhos.map((deal) => (
              <a
                key={deal.id}
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-surface-container-high rounded-2xl md:rounded-3xl p-3 md:p-4 flex gap-4 items-center group hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 bg-surface-container-lowest rounded-xl md:rounded-2xl flex items-center justify-center p-2">
                  <img
                    src={deal.image}
                    className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                    alt={deal.title}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-xs md:text-sm text-on-surface line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
                    {deal.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-base md:text-xl font-black text-secondary">{deal.price}</span>
                    <span className="text-[10px] text-on-surface-variant line-through">
                      {deal.originalPrice}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── SEÇÃO DE PARCERIAS (CONFIANÇA) ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full mt-8">
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-surface-container-high shadow-xl shadow-black/[0.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full font-black text-[10px] uppercase tracking-widest border border-secondary/20">
                <BadgeCheck className="w-4 h-4" />
                <span>Portal Verificado</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface uppercase tracking-tight leading-tight">
                Tecnologia com <span className="text-secondary">Verdade</span> e Parcerias Oficiais
              </h2>
              <p className="text-sm md:text-xl text-on-surface-variant font-label-bold leading-relaxed">
                Selecionamos apenas lojas com selo de confiança e entrega garantida. Ao comprar pelos nossos links, você apoia o MunizTech sem pagar um centavo a mais.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl border border-surface-container-high">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface">Links Seguros</div>
                    <div className="text-[9px] font-label-bold text-on-surface-variant uppercase">Proteção Anti-Fraude</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl border border-surface-container-high">
                  <Handshake className="w-8 h-8 text-secondary" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface">Apoio ao Canal</div>
                    <div className="text-[9px] font-label-bold text-on-surface-variant uppercase">Sem Custos Extras</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 opacity-60">
              {['Amazon', 'Mercado Livre', 'KaBuM!', 'Magazine Luiza', 'AliExpress', 'Shopee'].map((partner) => (
                <div key={partner} className="bg-surface-container-low p-6 rounded-[2rem] border border-surface-container-high flex flex-col items-center justify-center gap-3 hover:bg-white hover:shadow-lg transition-all group">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[10px] font-black text-on-surface-variant group-hover:text-secondary">
                      {partner.substring(0, 3).toUpperCase()}
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface text-center">
                     {partner}
                   </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ANÁLISES DETALHADAS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4 md:mt-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight border-l-4 border-secondary pl-4">
            Análises e Guias
          </h2>

          <div className="space-y-4 md:space-y-6">
            {reviews.slice(0, 5).map((review) => (
              <Link
                key={review.id}
                to={`/analises/${review.slug}`}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 bg-white rounded-3xl border border-surface-container-high overflow-hidden transition-all hover:shadow-lg group p-3 md:p-4"
              >
                <div className="w-full sm:w-48 h-40 md:h-32 shrink-0 rounded-2xl overflow-hidden relative">
                  <img
                    src={review.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    alt={review.title}
                  />
                </div>
                <div className="flex flex-col justify-center gap-1 md:gap-2 w-full">
                  <h3 className="text-lg md:text-xl font-black text-on-surface group-hover:text-secondary transition-colors leading-tight line-clamp-2">
                    {review.title}
                  </h3>
                  <p className="text-xs md:text-sm font-label-bold text-on-surface-variant line-clamp-2">
                    {review.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-1 md:mt-2">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-secondary">
                      {review.category}
                    </span>
                    <span className="text-[10px] md:text-xs font-black text-on-surface flex items-center gap-1 uppercase tracking-wider">
                      Ler artigo <Icons.ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <Link to="/analises" className="flex items-center justify-center w-full py-4 bg-white border-2 border-surface-container-high rounded-2xl text-on-surface font-black uppercase tracking-widest text-xs hover:bg-surface-container-low transition-colors gap-2">
            Ver todas as análises <Icons.ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Direita: Em Alta */}
        <aside className="space-y-8">
          <div className="bg-white rounded-3xl md:rounded-4xl p-6 md:p-8 space-y-6 border border-surface-container-high shadow-lg">
            <h2 className="text-lg md:text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> Mais Vendidos
            </h2>

            <div className="space-y-6">
              {featuredDeals.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-surface-container-low rounded-xl flex items-center justify-center p-2 relative">
                    <div className="absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 bg-secondary text-white rounded-full flex items-center justify-center font-black text-[10px] md:text-xs shadow-md">
                      {index + 1}
                    </div>
                    <img
                      src={item.image}
                      className="max-h-full mix-blend-multiply object-contain"
                      alt={item.title}
                    />
                  </div>
                  <div className="space-y-1 flex-grow">
                    <h4 className="text-xs md:text-sm font-black text-on-surface line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                      <Icons.Eye className="w-3 h-3" /> {1200 + index * 300}+ viram hoje
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telegram */}
          <div className="bg-slate-900 rounded-3xl md:rounded-4xl p-6 md:p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,211,102,0.15),transparent)]" />
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0088cc] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg relative z-10">
              <Send className="w-6 h-6 md:w-8 md:h-8 ml-1" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                Alertas no VIP
              </h3>
              <p className="text-[10px] md:text-sm text-gray-400 font-label-bold">
                Entre no canal e não perca nada.
              </p>
            </div>
            <button className="w-full py-3 md:py-4 bg-[#0088cc] text-white rounded-xl font-black uppercase tracking-widest text-[11px] md:text-sm hover:bg-[#0077b5] transition-colors relative z-10">
              Entrar no Canal
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
