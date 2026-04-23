import { useParams, Link } from 'react-router-dom';
import { useReview, useReviews } from '@/hooks/useReviews';
import { Star, Check, X, ArrowRight, ShoppingCart, Info, Loader2, User, Calendar } from 'lucide-react';

export default function Review() {
  const { slug } = useParams();
  const { review, loading: reviewLoading } = useReview(slug || '');
  const { reviews: allReviews, loading: reviewsLoading } = useReviews();

  if (reviewLoading) {
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
        <Link to="/" className="text-secondary font-black uppercase tracking-widest text-sm hover:underline">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const otherReviews = allReviews.filter((r) => r.slug !== review.slug).slice(0, 5);

  return (
    <div className="bg-surface min-h-screen pb-20 font-sans overflow-x-hidden">
      {/* 1. HEADER DO ARTIGO */}
      <header className="max-w-4xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-8">
        <div className="space-y-6 text-center">
          <div className="inline-block px-4 py-1.5 bg-surface-container-high text-on-surface-variant font-black text-[10px] uppercase tracking-[0.2em] rounded-full">
            {review.category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
            {review.title}
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant font-label-bold max-w-2xl mx-auto leading-relaxed">
            {review.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-black uppercase tracking-widest text-on-surface-variant pt-4 border-t border-surface-container-high w-fit mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                <User className="w-4 h-4" />
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

      {/* 2. IMAGEM DE CAPA */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-12 md:mb-20">
        <div className="relative aspect-video md:aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl border border-white/20">
          <img
            src={review.image}
            className="w-full h-full object-cover"
            alt={review.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 3. CONTEÚDO PRINCIPAL (8 COLUNAS) */}
        <article className="lg:col-span-8 space-y-12">
          {/* Veredito Rápido */}
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-surface-container-high relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/10 transition-colors" />
             
             <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-8 flex items-center gap-3">
               <Info className="w-6 h-6 text-secondary" /> O Veredito Rápido
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-secondary">Principais Benefícios</h4>
                 <ul className="space-y-3">
                   {(review.benefits || []).map((b, i) => (
                     <li key={i} className="flex gap-3 text-on-surface-variant font-label-bold text-sm leading-relaxed">
                       <Check className="w-5 h-5 text-secondary shrink-0" /> {b}
                     </li>
                   ))}
                 </ul>
               </div>
               
               <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                 <div className="flex items-end gap-2">
                   <span className="text-6xl font-black text-secondary tracking-tighter">{review.rating}</span>
                   <span className="text-xl font-bold text-on-surface-variant pb-2">/ 10</span>
                 </div>
                 <p className="text-sm font-label-bold text-on-surface-variant leading-relaxed">
                   Baseado em testes reais e feedback da comunidade técnica MunizTech.
                 </p>
               </div>
             </div>
          </div>

          {/* Prós e Contras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50/50 rounded-[32px] p-8 border border-green-100">
              <h3 className="text-lg font-black text-green-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Check className="w-5 h-5" /> Pontos Positivos
              </h3>
              <ul className="space-y-4">
                {(review.pros || []).map((p, i) => (
                  <li key={i} className="flex gap-3 text-green-800 font-label-bold text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/50 rounded-[32px] p-8 border border-red-100">
              <h3 className="text-lg font-black text-red-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                <X className="w-5 h-5" /> Pontos Negativos
              </h3>
              <ul className="space-y-4">
                {(review.cons || []).map((c, i) => (
                  <li key={i} className="flex gap-3 text-red-800 font-label-bold text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3" />
                    </div>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conteúdo Rico */}
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:font-label-bold prose-p:text-on-surface-variant prose-img:rounded-[32px]">
            {review.content ? (
              <div dangerouslySetInnerHTML={{ __html: review.content }} />
            ) : (
              <p className="italic text-on-surface-variant">Esta análise completa está em desenvolvimento...</p>
            )}
          </div>

          {/* CTA Final */}
          <div className="bg-slate-900 rounded-[40px] p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15),transparent)]" />
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight relative z-10">
              Gostou do que viu?
            </h3>
            <p className="text-gray-400 font-label-bold text-lg max-w-xl mx-auto relative z-10">
              Garanta o seu agora pelo menor preço verificado pelo nosso time.
            </p>
            <a
              href={review.buy_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-12 py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-lg items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgb(22,163,74,0.4)] relative z-10"
            >
              Comprar Agora <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </article>

        {/* 4. SIDEBAR STICKY (4 COLUNAS) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* Card de Compra */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-surface-container-high">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Melhor Preço</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-lg">Verificado</span>
              </div>
              <div className="text-4xl font-black text-on-surface mb-2">{review.buy_price}</div>
              <p className="text-xs text-on-surface-variant font-label-bold mb-6">No boleto ou PIX com desconto</p>
              
              <a
                href={review.buy_link}
                className="w-full py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-secondary-fixed-variant shadow-lg shadow-secondary/20"
              >
                <ShoppingCart className="w-5 h-5" /> Ir para a Loja
              </a>
            </div>

            {/* Outras Avaliações */}
            {otherReviews.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-surface-container-high">
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface mb-6 flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary fill-current" /> Outras Análises
                </h3>
                <div className="space-y-4">
                  {otherReviews.map((r) => (
                    <Link
                      key={r.id}
                      to={`/analises/${r.slug}`}
                      className="flex gap-4 group items-center"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-surface-container-high">
                        <img src={r.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-on-surface leading-tight line-clamp-2 group-hover:text-secondary transition-colors">
                          {r.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-secondary fill-current" />
                          <span className="text-xs font-black text-on-surface-variant">{r.rating}/10</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/analises" className="mt-8 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-secondary hover:underline pt-4 border-t border-surface-container-high">
                  Ver Tudo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
