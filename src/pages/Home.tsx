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
  Loader2
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
    <div className="flex flex-col gap-12 pb-16 bg-surface">
      {/* 1. HERO SECTION (CARROSSEL DE NOVIDADES) */}
      <section className="bg-white border-b border-surface-container-high pb-12 pt-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          {mainHeroProduct && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6 order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full font-black text-xs uppercase tracking-widest border border-red-500/20">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>Oferta em Destaque</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tightest">
                    {mainHeroProduct.title.split(':')[0].replace(' vs ', ' x ')}{' '}
                    <span className="text-secondary block mt-2">Vale a Pena?</span>
                  </h1>

                  <p className="text-lg md:text-xl text-on-surface-variant font-label-bold leading-relaxed line-clamp-3">
                    {mainHeroProduct.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 w-fit px-3 py-1.5 rounded-lg border border-yellow-200">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-on-surface-variant font-black text-sm ml-1">
                      {mainHeroProduct.rating} Nota Editorial
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a
                      href={mainHeroProduct.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgb(22,163,74,0.3)] hover:shadow-[0_8px_30px_rgb(22,163,74,0.5)]"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Comprar Agora
                    </a>
                    <Link
                      to={`/analises/${mainHeroProduct.slug}`}
                      className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest text-on-surface rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                    >
                      <Icons.Search className="w-5 h-5" /> Ver Análise Completa
                    </Link>
                  </div>
                </div>

                <div className="order-1 lg:order-2 relative flex justify-center group">
                  <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-600 text-white text-sm font-black uppercase rounded-xl shadow-xl transform rotate-12 animate-pulse">
                    Em Alta!
                  </div>
                  <img
                    src={mainHeroProduct.image}
                    className="w-full max-w-md h-[400px] object-cover rounded-[40px] shadow-2xl shadow-black/10 transition-transform duration-700 group-hover:scale-105"
                    alt={mainHeroProduct.title}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Dots Pagination */}
          <div className="flex justify-center gap-3 mt-12">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  idx === currentIndex ? 'w-10 bg-secondary' : 'w-2 bg-surface-container-high hover:bg-surface-container-highest'
                }`}
                aria-label={`Ir para o slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full mt-4">
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 snap-x">
          {CATEGORIES.map((cat) => {
            const IconComponent = (Icons as any)[cat.icon] || Icons.Tag;
            return (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="snap-start shrink-0 min-w-[120px] p-4 bg-white rounded-3xl border border-surface-container-high shadow-sm hover:border-secondary hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="font-black text-sm text-on-surface group-hover:text-secondary transition-colors">
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
          <Flame className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-black text-on-surface uppercase tracking-tight">
            Ofertas Relâmpago
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDeals.map((deal, idx) => (
            <div
              key={deal.id}
              className="bg-white border border-surface-container-high rounded-[32px] p-5 shadow-lg hover:shadow-xl transition-all relative flex flex-col group"
            >
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-red-600 text-white text-[11px] font-black uppercase rounded-xl shadow-md">
                {deal.discount} OFF
              </div>
              <div className="h-48 flex items-center justify-center p-4">
                <img
                  src={deal.image}
                  className="max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                  alt={deal.title}
                />
              </div>

              <div className="mt-4 space-y-3 flex-grow flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 w-fit px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" /> Últimas
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 w-fit px-2 py-1 rounded-md">
                    <Flame className="w-3 h-3" /> {32 + idx * 5} compras em 24h
                  </div>
                </div>
                <h3 className="font-black text-on-surface leading-tight line-clamp-2">
                  {deal.title}
                </h3>
                <div className="mt-auto space-y-1 pt-2">
                  <div className="text-xs text-on-surface-variant line-through font-label-bold">
                    {deal.originalPrice}
                  </div>
                  <div className="text-3xl font-black text-on-surface leading-none tracking-tighter">
                    {deal.price}
                  </div>
                </div>
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 py-3 bg-secondary text-white rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center transition-transform hover:bg-secondary-fixed-variant active:scale-95 shadow-md shadow-secondary/20"
                >
                  Comprar Agora
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ACHADINHOS */}
      {achadinhos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-6 mt-8">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-secondary" />
            <h2 className="text-3xl font-black text-on-surface uppercase tracking-tight">
              Achadinhos Imperdíveis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achadinhos.map((deal) => (
              <a
                key={deal.id}
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-surface-container-high rounded-3xl p-4 flex gap-4 items-center group hover:shadow-xl transition-all"
              >
                <div className="w-24 h-24 shrink-0 bg-surface-container-lowest rounded-2xl flex items-center justify-center p-2">
                  <img
                    src={deal.image}
                    className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                    alt={deal.title}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-sm text-on-surface line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
                    {deal.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-secondary">{deal.price}</span>
                    <span className="text-xs text-on-surface-variant line-through">
                      {deal.originalPrice}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 5. ANÁLISES DETALHADAS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight border-l-4 border-secondary pl-4">
            Análises e Guias
          </h2>

          <div className="space-y-6">
            {reviews.map((review) => (
              <Link
                key={review.id}
                to={`/analises/${review.slug}`}
                className="flex flex-col sm:flex-row gap-6 bg-white rounded-3xl border border-surface-container-high overflow-hidden transition-all hover:shadow-lg group p-4"
              >
                <div className="w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-2xl overflow-hidden relative">
                  <img
                    src={review.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    alt={review.title}
                  />
                </div>
                <div className="flex flex-col justify-center gap-2 w-full">
                  <h3 className="text-xl font-black text-on-surface group-hover:text-secondary transition-colors leading-tight line-clamp-2">
                    {review.title}
                  </h3>
                  <p className="text-sm font-label-bold text-on-surface-variant line-clamp-2">
                    {review.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">
                      {review.category}
                    </span>
                    <span className="text-xs font-black text-on-surface flex items-center gap-1">
                      Ler artigo <Icons.ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Direita: Em Alta */}
        <aside className="space-y-8">
          <div className="bg-white rounded-4xl p-8 space-y-6 border border-surface-container-high shadow-lg">
            <h2 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> Mais Vendidos
            </h2>

            <div className="space-y-6">
              {featuredDeals.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-16 h-16 shrink-0 bg-surface-container-low rounded-xl flex items-center justify-center p-2 relative">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center font-black text-xs shadow-md">
                      {index + 1}
                    </div>
                    <img
                      src={item.image}
                      className="max-h-full mix-blend-multiply object-contain"
                      alt={item.title}
                    />
                  </div>
                  <div className="space-y-1 flex-grow">
                    <h4 className="text-sm font-black text-on-surface line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                      <Icons.Eye className="w-3 h-3" /> {item.views || 1000}+ viram hoje
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telegram */}
          <div className="bg-slate-900 rounded-4xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,211,102,0.15),transparent)]" />
            <div className="w-16 h-16 bg-[#0088cc] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg relative z-10">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Receba alertas no VIP
              </h3>
              <p className="text-sm text-gray-400 font-label-bold">
                Entre no canal e seja o primeiro a saber.
              </p>
            </div>
            <button className="w-full py-4 bg-[#0088cc] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#0077b5] transition-colors relative z-10">
              Entrar no Canal
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
