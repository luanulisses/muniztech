import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReview, useReviews } from '@/hooks/useReviews';
import { Star, Check, X, ArrowRight, ShoppingCart, Info, Loader2, User, Calendar, MessageSquareText, Search, BadgeCheck, Handshake, ExternalLink, Swords, Trophy, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Review } from '@/types';

// ── Mapa de lojas parceiras (mesmo do OfferLanding) ───────────────────────────
const REVIEW_STORE_MAP: Record<string, { color: string; bg: string; border: string; emoji: string; label: string; description: string }> = {
  'amazon.com.br': { color: 'text-[#FF9900]', bg: 'bg-[#FF9900]/10', border: 'border-[#FF9900]/30', emoji: '🛒', label: 'Amazon', description: 'O maior marketplace do mundo. Compra 100% garantida.' },
  'amzn.to':       { color: 'text-[#FF9900]', bg: 'bg-[#FF9900]/10', border: 'border-[#FF9900]/30', emoji: '🛒', label: 'Amazon', description: 'O maior marketplace do mundo. Compra 100% garantida.' },
  'amzn.com':      { color: 'text-[#FF9900]', bg: 'bg-[#FF9900]/10', border: 'border-[#FF9900]/30', emoji: '🛒', label: 'Amazon', description: 'O maior marketplace do mundo. Compra 100% garantida.' },
  'mercadolivre.com.br': { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '🛍️', label: 'Mercado Livre', description: 'Plataforma líder na América Latina. Pagamento seguro.' },
  'shopee.com.br':       { color: 'text-[#EE4D2D]', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '🧧', label: 'Shopee', description: 'Preços baixos com entrega rápida e rastreada.' },
  'magazineluiza.com.br':{ color: 'text-[#0080C9]', bg: 'bg-blue-50', border: 'border-blue-200', emoji: '🏪', label: 'Magazine Luiza', description: 'Uma das maiores redes varejistas do Brasil.' },
  'magalu.com':          { color: 'text-[#0080C9]', bg: 'bg-blue-50', border: 'border-blue-200', emoji: '🏪', label: 'Magazine Luiza', description: 'Uma das maiores redes varejistas do Brasil.' },
  'americanas.com.br':   { color: 'text-[#E60014]', bg: 'bg-red-50', border: 'border-red-100', emoji: '🏬', label: 'Americanas', description: 'Gigante do varejo brasileiro com entrega garantida.' },
  'kabum.com.br':        { color: 'text-[#FF6A00]', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '💻', label: 'KaBuM!', description: 'Especialista em tech com preços competitivos.' },
};

function getReviewStoreConfig(url: string) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const [domain, cfg] of Object.entries(REVIEW_STORE_MAP)) {
      if (hostname.includes(domain)) return cfg;
    }
  } catch {
    for (const [domain, cfg] of Object.entries(REVIEW_STORE_MAP)) {
      if (url.toLowerCase().includes(domain)) return cfg;
    }
  }
  return null;
}

// ─── COMPONENTES AUXILIARES DE COMPARATIVO ──────────────────────────────────
function ComparisonSpecs({ specs }: { specs: Review['comparisonSpecs'] }) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="bg-white rounded-[24px] md:rounded-[40px] overflow-hidden border border-surface-container-high shadow-xl">
      <div className="bg-surface-container-low p-5 md:p-8 border-b border-surface-container-high flex items-center justify-between">
        <h3 className="text-base md:text-2xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-secondary" /> Duelo Técnico
        </h3>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest text-[10px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant">
              <th className="px-6 py-4">Especificação</th>
              <th className="px-6 py-4">Produto 1</th>
              <th className="px-6 py-4">Produto 2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {specs.map((spec, i) => (
              <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4 text-xs md:text-sm font-black text-on-surface uppercase tracking-tighter w-1/3">
                  {spec.label}
                </td>
                <td className="px-6 py-4 text-xs md:text-sm font-label-bold text-on-surface-variant">
                  {spec.p1}
                </td>
                <td className="px-6 py-4 text-xs md:text-sm font-label-bold text-on-surface-variant">
                  {spec.p2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden divide-y divide-surface-container-high">
        {specs.map((spec, i) => (
          <div key={i} className="p-5 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary">{spec.label}</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-[8px] font-black uppercase text-on-surface-variant opacity-50">Produto 1</div>
                <div className="text-xs font-label-bold text-on-surface">{spec.p1}</div>
              </div>
              <div className="space-y-1 border-l border-surface-container-high pl-4">
                <div className="text-[8px] font-black uppercase text-on-surface-variant opacity-50">Produto 2</div>
                <div className="text-xs font-label-bold text-on-surface">{spec.p2}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LIST VIEW ──────────────────────────────────────────────────────────────
// ... (ReviewList remains same, I'll replace the whole file to be safe)
function ReviewList() {
  const { reviews, loading } = useReviews();
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(reviews.map(r => r.category))];
  const filteredReviews = activeCategory === 'Todas' 
    ? reviews 
    : reviews.filter(r => r.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-32 pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="mb-8 md:mb-16 space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MessageSquareText className="w-7 h-7 md:w-10 md:h-10 text-secondary" />
              <h1 className="text-3xl md:text-6xl font-black text-on-surface uppercase tracking-tight">
                Análises
              </h1>
            </div>
            <p className="text-sm md:text-xl text-on-surface-variant font-label-bold max-w-2xl text-center md:text-left">
              Avaliações detalhadas e comparativos para você escolher o melhor produto com confiança.
            </p>
          </div>

          {/* Filtro de Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all border-2
                  ${activeCategory === cat 
                    ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20 scale-105' 
                    : 'bg-white border-surface-container-high text-on-surface-variant hover:border-secondary/30'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredReviews.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.08, 0.5) }}
            >
              <Link
                to={`/analises/${item.slug}`}
                className="bg-white border border-surface-container-high rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col h-full group hover:shadow-2xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={item.title}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-secondary shadow-sm flex items-center gap-1.5">
                    {item.type === 'comparativo' && <Swords className="w-2.5 h-2.5" />}
                    {item.category}
                  </div>
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-grow space-y-2 md:space-y-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                    <span className="text-[10px] md:text-xs font-black text-on-surface">{item.rating}/10</span>
                    {item.type === 'comparativo' && (
                       <span className="ml-2 px-1.5 py-0.5 bg-secondary/10 text-secondary text-[8px] font-black uppercase rounded">VS</span>
                    )}
                  </div>
                  <h3 className="text-base md:text-xl font-black text-on-surface group-hover:text-secondary transition-colors leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm font-label-bold text-on-surface-variant line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between border-t border-surface-container-high">
                    <span className="text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" /> {item.date}
                    </span>
                    <span className="text-[10px] md:text-xs font-black text-secondary flex items-center gap-1">
                      Ler agora <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-surface-container-high">
            <Search className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
            <h3 className="text-xl font-black text-on-surface">Nenhuma análise encontrada</h3>
            <p className="text-on-surface-variant font-label-bold mt-2">Estamos preparando novos conteúdos.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SINGLE REVIEW VIEW ─────────────────────────────────────────────────────
function ReviewDetail({ slug }: { slug: string }) {
  const { review, loading } = useReview(slug);
  const { reviews: allReviews } = useReviews();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h2 className="text-2xl font-black text-on-surface">Avaliação não encontrada</h2>
        <Link to="/analises" className="text-secondary font-black uppercase tracking-widest text-sm hover:underline">
          Ver todas as análises
        </Link>
      </div>
    );
  }

  const otherReviews = allReviews.filter((r) => r.slug !== review.slug).slice(0, 5);

  return (
    <div className="bg-surface min-h-screen pb-32 font-sans overflow-x-hidden">
      {/* Header do artigo */}
      <header className="max-w-4xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-8">
        <div className="space-y-4 md:space-y-6 text-center">
          <div className="inline-block px-4 py-1.5 bg-surface-container-high text-on-surface-variant font-black text-[10px] uppercase tracking-[0.2em] rounded-full">
            {review.category}
          </div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
            {review.title}
          </h1>
          <p className="text-sm md:text-xl text-on-surface-variant font-label-bold max-w-2xl mx-auto leading-relaxed line-clamp-4">
            {review.excerpt}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs font-black uppercase tracking-widest text-on-surface-variant pt-4 border-t border-surface-container-high w-fit mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <span>Por {review.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>{review.date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero VS (Se for Comparativo) */}
      {review.type === 'comparativo' ? (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-2 md:gap-0 items-center">
            {/* Produto 1 */}
            <div className="md:col-span-5 bg-white rounded-[2.5rem] md:rounded-[3rem] p-4 md:p-10 border border-surface-container-high shadow-xl relative group order-1 md:order-none">
              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-secondary text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-base md:text-xl shadow-lg group-hover:scale-110 transition-transform">
                {review.rating}
              </div>
              <div className="aspect-square flex items-center justify-center mb-4 md:mb-6">
                <img src={review.image} className="max-h-[140px] md:max-h-full object-contain" alt={review.title} />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-center text-on-surface uppercase tracking-tighter line-clamp-1">
                {review.product1Name || review.title.split(' vs ')[0] || 'Produto 1'}
              </h3>
            </div>

            {/* VS Circle */}
            <div className="md:col-span-1 flex justify-center relative z-10 -my-6 md:my-0 order-2 md:order-none">
               <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-lg md:text-3xl shadow-2xl border-4 border-surface italic tracking-widest">
                 VS
               </div>
            </div>

            {/* Produto 2 */}
            <div className="md:col-span-5 bg-white rounded-[2.5rem] md:rounded-[3rem] p-4 md:p-10 border border-surface-container-high shadow-xl relative group order-3 md:order-none">
              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-secondary text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-base md:text-xl shadow-lg group-hover:scale-110 transition-transform">
                {review.product2Rating}
              </div>
              <div className="aspect-square flex items-center justify-center mb-4 md:mb-6">
                <img src={review.product2Image} className="max-h-[140px] md:max-h-full object-contain" alt={review.product2Name} />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-center text-on-surface uppercase tracking-tighter line-clamp-1">
                {review.product2Name || review.title.split(' vs ')[1] || 'Produto 2'}
              </h3>
            </div>
          </div>
        </div>
      ) : (
        /* Imagem de capa simples */
        review.image && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 mb-8 md:mb-12">
            <div className="relative rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl bg-surface-container-low flex items-center justify-center p-4 md:p-8 min-h-[240px] md:min-h-[360px]">
              <img
                src={review.image}
                className="max-w-full max-h-[400px] object-contain"
                alt={review.title}
                onError={(e) => {
                  const wrapper = (e.currentTarget as HTMLImageElement).closest('.relative') as HTMLElement | null;
                  if (wrapper?.parentElement?.parentElement) wrapper.parentElement.parentElement.style.display = 'none';
                }}
              />
            </div>
          </div>
        )
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Conteúdo principal */}
        <article className="lg:col-span-8 space-y-8 md:space-y-12">
          
          {/* Layout de Comparativo */}
          {review.type === 'comparativo' ? (
            <>
              {/* Tabela de Specs */}
              <ComparisonSpecs specs={review.comparisonSpecs} />

              {/* Prós e Contras Duplos */}
              <div className="space-y-8">
                <h3 className="text-xl md:text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
                  <Swords className="w-6 h-6 text-secondary" /> O Duelo de Prós e Contras
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Produto 1 */}
                  <div className="space-y-4">
                    <div className="bg-surface-container-low px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant border border-surface-container-high w-fit">
                      {review.product1Name || review.title.split(' vs ')[0] || 'Produto 1'}
                    </div>
                    <div className="bg-white rounded-3xl border border-surface-container-high overflow-hidden shadow-sm">
                      <div className="p-6 bg-green-50/30 border-b border-green-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-green-700 flex items-center gap-2 mb-4">
                          <Check className="w-4 h-4" /> Vantagens
                        </h4>
                        <ul className="space-y-2">
                          {(review.pros || []).map((p, i) => (
                            <li key={i} className="text-xs font-label-bold text-green-900 flex gap-2">
                              <span className="text-green-500 shrink-0">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-red-50/30">
                        <h4 className="text-xs font-black uppercase tracking-widest text-red-700 flex items-center gap-2 mb-4">
                          <X className="w-4 h-4" /> Desvantagens
                        </h4>
                        <ul className="space-y-2">
                          {(review.cons || []).map((c, i) => (
                            <li key={i} className="text-xs font-label-bold text-red-900 flex gap-2">
                              <span className="text-red-500 shrink-0">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Produto 2 */}
                  <div className="space-y-4">
                    <div className="bg-surface-container-low px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant border border-surface-container-high w-fit">
                      {review.product2Name || review.title.split(' vs ')[1] || 'Produto 2'}
                    </div>
                    <div className="bg-white rounded-3xl border border-surface-container-high overflow-hidden shadow-sm">
                      <div className="p-6 bg-green-50/30 border-b border-green-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-green-700 flex items-center gap-2 mb-4">
                          <Check className="w-4 h-4" /> Vantagens
                        </h4>
                        <ul className="space-y-2">
                          {(review.product2Pros || []).map((p, i) => (
                            <li key={i} className="text-xs font-label-bold text-green-900 flex gap-2">
                              <span className="text-green-500 shrink-0">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-red-50/30">
                        <h4 className="text-xs font-black uppercase tracking-widest text-red-700 flex items-center gap-2 mb-4">
                          <X className="w-4 h-4" /> Desvantagens
                        </h4>
                        <ul className="space-y-2">
                          {(review.product2Cons || []).map((c, i) => (
                            <li key={i} className="text-xs font-label-bold text-red-900 flex gap-2">
                              <span className="text-red-500 shrink-0">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Layout de Review Simples */
            <>
              {/* Veredito Rápido */}
              <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-xl border border-surface-container-high relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h2 className="text-lg md:text-2xl font-black text-on-surface uppercase tracking-tight mb-6 md:mb-8 flex items-center gap-3">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-secondary" /> O Veredito Rápido
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary">Principais Benefícios</h4>
                    <ul className="space-y-2 md:space-y-3">
                      {(review.benefits || []).map((b, i) => (
                        <li key={i} className="flex gap-3 text-on-surface-variant font-label-bold text-sm leading-relaxed">
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-secondary shrink-0 mt-0.5" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl md:rounded-3xl p-5 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl md:text-6xl font-black text-secondary tracking-tighter">{review.rating}</span>
                      <span className="text-lg md:text-xl font-bold text-on-surface-variant pb-2">/ 10</span>
                    </div>
                    <p className="text-xs md:text-sm font-label-bold text-on-surface-variant leading-relaxed">
                      Baseado em testes reais e feedback da comunidade MunizTech.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prós e Contras */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-green-50/50 rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-green-100">
                  <h3 className="text-base md:text-lg font-black text-green-900 uppercase tracking-widest flex items-center gap-2 mb-4 md:mb-6">
                    <Check className="w-4 h-4 md:w-5 md:h-5" /> Pontos Positivos
                  </h3>
                  <ul className="space-y-3 md:space-y-4">
                    {(review.pros || []).map((p, i) => (
                      <li key={i} className="flex gap-3 text-green-800 font-label-bold text-sm">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50/50 rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-red-100">
                  <h3 className="text-base md:text-lg font-black text-red-900 uppercase tracking-widest flex items-center gap-2 mb-4 md:mb-6">
                    <X className="w-4 h-4 md:w-5 md:h-5" /> Pontos Negativos
                  </h3>
                  <ul className="space-y-3 md:space-y-4">
                    {(review.cons || []).map((c, i) => (
                      <li key={i} className="flex gap-3 text-red-800 font-label-bold text-sm">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0">
                          <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </div>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Conteúdo Rico (Comum a ambos) */}
          {(review.content || review.excerpt) && (
            <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-surface-container-high shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-black uppercase text-[10px] tracking-widest pb-4 border-b border-surface-container-low">
                 <MessageSquareText className="w-4 h-4" /> {review.type === 'comparativo' ? 'Análise Detalhada & Veredito' : 'Análise Completa'}
              </div>
              {review.content ? (
                <div
                  className="prose prose-sm md:prose-base max-w-none
                    prose-headings:font-black prose-headings:text-on-surface prose-headings:uppercase prose-headings:tracking-tight prose-headings:mt-8 prose-headings:mb-3
                    prose-p:text-on-surface-variant prose-p:leading-relaxed prose-p:font-label-bold prose-p:mb-4
                    prose-strong:text-on-surface prose-strong:font-black
                    prose-ul:space-y-1 prose-li:text-on-surface-variant prose-li:font-label-bold
                    prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full prose-img:object-contain
                    prose-a:text-secondary prose-a:font-black prose-a:no-underline hover:prose-a:underline
                    [&_*]:break-words [&_img]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
              ) : (
                <p className="text-on-surface-variant font-label-bold text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {review.excerpt}
                </p>
              )}
            </div>
          )}

          {/* CTAs Finais */}
          {review.type === 'comparativo' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-[32px] p-8 text-center space-y-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                  <h4 className="text-white font-black uppercase tracking-widest text-xs relative z-10">{review.title.split(' vs ')[0] || 'Produto 1'}</h4>
                  <div className="text-2xl font-black text-secondary relative z-10">{review.buyPrice}</div>
                  <a href={review.buyLink} target="_blank" rel="noopener noreferrer" className="inline-flex w-full py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-[10px] items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform relative z-10">
                    Comprar {review.title.split(' vs ')[0]} <ShoppingCart className="w-4 h-4" />
                  </a>
                </div>
                <div className="bg-slate-900 rounded-[32px] p-8 text-center space-y-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                  <h4 className="text-white font-black uppercase tracking-widest text-xs relative z-10">{review.product2Name || review.title.split(' vs ')[1] || 'Produto 2'}</h4>
                  <div className="text-2xl font-black text-secondary relative z-10">{review.product2Price}</div>
                  <a href={review.product2Link} target="_blank" rel="noopener noreferrer" className="inline-flex w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform relative z-10">
                    Comprar {review.product2Name || 'P2'} <ShoppingCart className="w-4 h-4" />
                  </a>
                </div>
             </div>
          ) : (
            /* CTA Final Simples */
            <div className="bg-slate-900 rounded-[24px] md:rounded-[40px] p-8 md:p-16 text-center space-y-6 md:space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15),transparent)]" />
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight relative z-10">
                Gostou do que viu?
              </h3>
              <p className="text-gray-400 font-label-bold text-sm md:text-lg max-w-xl mx-auto relative z-10">
                Garanta o seu agora pelo menor preço verificado pelo nosso time.
              </p>
              <a
                href={review.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-8 md:px-12 py-4 md:py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-sm md:text-lg items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgb(22,163,74,0.4)] relative z-10"
              >
                Comprar Agora <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
            {/* Card de Compra */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-surface-container-high space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant">
                   {review.type === 'comparativo' ? 'Onde Comprar' : 'Melhor Preço'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] md:text-[10px] font-black uppercase rounded-lg">Verificado</span>
              </div>

              {review.type === 'comparativo' ? (
                 <div className="space-y-3">
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high group">
                       <div className="text-[9px] font-black uppercase text-on-surface-variant mb-1">{review.product1Name || review.title.split(' vs ')[0]}</div>
                       <div className="flex items-center justify-between">
                          <div className="font-black text-on-surface">{review.buyPrice}</div>
                          <a href={review.buyLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary text-white rounded-lg group-hover:scale-110 transition-transform"><ShoppingCart className="w-3 h-3" /></a>
                       </div>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high group">
                       <div className="text-[9px] font-black uppercase text-on-surface-variant mb-1">{review.product2Name}</div>
                       <div className="flex items-center justify-between">
                          <div className="font-black text-on-surface">{review.product2Price}</div>
                          <a href={review.product2Link} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 text-white rounded-lg group-hover:scale-110 transition-transform"><ShoppingCart className="w-3 h-3" /></a>
                       </div>
                    </div>
                 </div>
              ) : (
                <>
                  <div className="text-3xl md:text-4xl font-black text-on-surface">{review.buyPrice}</div>
                  <p className="text-[10px] md:text-xs text-on-surface-variant font-label-bold">No boleto ou PIX com desconto</p>
                </>
              )}

              {/* Bloco de Parceria */}
              {(() => {
                const cfg = getReviewStoreConfig(review.buyLink || '');
                if (!cfg) return null;
                return (
                  <div className={`flex items-center gap-2.5 p-3 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                    <span className="text-xl shrink-0">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`font-black text-xs uppercase tracking-wider ${cfg.color}`}>
                          Parceria com a {cfg.label}
                        </span>
                        <BadgeCheck className={`w-3.5 h-3.5 shrink-0 ${cfg.color}`} />
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-label-bold leading-snug mt-0.5">
                        {cfg.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Selos de confiança */}
              <div className="flex flex-wrap gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
                  <BadgeCheck className="w-3 h-3 text-green-600 shrink-0" />
                  <span className="text-[9px] font-black text-green-700 uppercase tracking-wider">Parceiro Verificado</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                  <Handshake className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider">Link Direto</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                  <ShoppingCart className="w-3 h-3 text-purple-600 shrink-0" />
                  <span className="text-[9px] font-black text-purple-700 uppercase tracking-wider">Compra Garantida</span>
                </div>
              </div>

              {review.type !== 'comparativo' && (
                <a
                  href={review.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 md:py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-secondary-fixed-variant shadow-lg shadow-secondary/20 text-sm"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> Ir para a Loja
                </a>
              )}
            </div>

            {/* Outras Avaliações */}
            {otherReviews.length > 0 && (
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-surface-container-high">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-on-surface mb-5 md:mb-6 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary fill-current" /> Outras Análises
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {otherReviews.map((r) => (
                    <Link key={r.id} to={`/analises/${r.slug}`} className="flex gap-3 md:gap-4 group items-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shrink-0 border border-surface-container-high">
                        <img src={r.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-black text-on-surface leading-tight line-clamp-2 group-hover:text-secondary transition-colors">
                          {r.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-secondary fill-current" />
                          <span className="text-[10px] md:text-xs font-black text-on-surface-variant">{r.rating}/10</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/analises" className="mt-5 md:mt-8 flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary hover:underline pt-4 border-t border-surface-container-high">
                  Ver Todas <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT (Router Switch) ─────────────────────────────────────────
export default function Review() {
  const { slug } = useParams();

  if (slug) {
    return <ReviewDetail slug={slug} />;
  }

  return <ReviewList />;
}

