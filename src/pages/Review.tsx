import { useParams, Link } from 'react-router-dom';
import { useReview, useReviews } from '@/hooks/useReviews';
import { Star, Check, X, ArrowRight, ShoppingCart, Info, Loader2, User, Calendar, MessageSquareText, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── LIST VIEW ──────────────────────────────────────────────────────────────
function ReviewList() {
  const { reviews, loading } = useReviews();

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
        <header className="mb-8 md:mb-12 space-y-2 md:space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquareText className="w-7 h-7 md:w-8 md:h-8 text-secondary" />
            <h1 className="text-2xl md:text-5xl font-black text-on-surface uppercase tracking-tight">
              Análises e Guias
            </h1>
          </div>
          <p className="text-sm md:text-lg text-on-surface-variant font-label-bold max-w-2xl">
            Avaliações detalhadas para você escolher o melhor produto.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {reviews.map((item, idx) => (
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
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-secondary shadow-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-grow space-y-2 md:space-y-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                    <span className="text-[10px] md:text-xs font-black text-on-surface">{item.rating}/10</span>
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
          <p className="text-sm md:text-xl text-on-surface-variant font-label-bold max-w-2xl mx-auto leading-relaxed">
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

      {/* Imagem de capa */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-8 md:mb-20">
        <div className="relative aspect-video md:aspect-[21/9] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl">
          <img src={review.image} className="w-full h-full object-cover" alt={review.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Conteúdo principal */}
        <article className="lg:col-span-8 space-y-8 md:space-y-12">
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

          {/* Conteúdo Rico */}
          {review.content && (
            <div className="prose prose-sm md:prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:font-label-bold prose-p:text-on-surface-variant prose-img:rounded-[24px]">
              <div dangerouslySetInnerHTML={{ __html: review.content }} />
            </div>
          )}

          {/* CTA Final */}
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
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
            {/* Card de Compra */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-surface-container-high">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant">Melhor Preço</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] md:text-[10px] font-black uppercase rounded-lg">Verificado</span>
              </div>
              <div className="text-3xl md:text-4xl font-black text-on-surface mb-2">{review.buyPrice}</div>
              <p className="text-[10px] md:text-xs text-on-surface-variant font-label-bold mb-5 md:mb-6">No boleto ou PIX com desconto</p>
              <a
                href={review.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 md:py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-secondary-fixed-variant shadow-lg shadow-secondary/20 text-sm"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> Ir para a Loja
              </a>
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
