import { useState, useMemo } from 'react';
import { Search as SearchIcon, Tag, MessageSquareText, ChevronRight, X, Loader2, ArrowRight } from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';
import { useReviews } from '@/hooks/useReviews';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const { deals, loading: dealsLoading } = useDeals();
  const { reviews, loading: reviewsLoading } = useReviews();

  const results = useMemo(() => {
    if (query.length < 2) return { deals: [], reviews: [] };
    
    const searchTerm = query.toLowerCase();
    
    return {
      deals: deals.filter(d => 
        d.title.toLowerCase().includes(searchTerm) || 
        d.store.toLowerCase().includes(searchTerm) ||
        d.category?.toLowerCase().includes(searchTerm)
      ),
      reviews: reviews.filter(r => 
        r.title.toLowerCase().includes(searchTerm) || 
        r.excerpt.toLowerCase().includes(searchTerm) ||
        r.category.toLowerCase().includes(searchTerm)
      )
    };
  }, [query, deals, reviews]);

  const hasResults = results.deals.length > 0 || results.reviews.length > 0;
  const loading = dealsLoading || reviewsLoading;

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-16 space-y-8">
        <header className="space-y-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-on-surface uppercase tracking-tight">
            O que você <span className="text-secondary">procura?</span>
          </h1>
          <p className="text-on-surface-variant font-label-bold">
            Busque por produtos, marcas ou análises detalhadas.
          </p>
        </header>

        {/* Barra de Busca */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <SearchIcon className={cn("w-6 h-6 transition-colors", query ? "text-secondary" : "text-on-surface-variant/40")} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: iPhone, Alexa, Monitor..."
            className="w-full bg-white border-2 border-surface-container-high rounded-[24px] md:rounded-[32px] py-5 md:py-6 pl-16 pr-16 text-lg font-black text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-secondary transition-all shadow-xl focus:shadow-secondary/10"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-6 flex items-center p-2 text-on-surface-variant/40 hover:text-on-surface"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Resultados */}
        <div className="space-y-12 pt-8">
          {loading ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <Loader2 className="w-10 h-10 text-secondary animate-spin" />
              <span className="font-black text-xs uppercase tracking-widest text-on-surface-variant">Sincronizando banco de dados...</span>
            </div>
          ) : query.length >= 2 ? (
            <>
              {/* Ofertas Encontradas */}
              {results.deals.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-l-4 border-secondary pl-4">
                    <Tag className="w-5 h-5 text-secondary" />
                    <h2 className="text-lg font-black text-on-surface uppercase tracking-tight">Ofertas Encontradas ({results.deals.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.deals.map(deal => (
                      <Link 
                        key={deal.id}
                        to={`/ofertas/${deal.slug || deal.id}`}
                        className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-surface-container-high hover:shadow-lg transition-all group"
                      >
                        <div className="w-16 h-16 shrink-0 bg-surface-container-low rounded-xl flex items-center justify-center p-2">
                          <img src={deal.image} className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-black text-on-surface line-clamp-1 leading-tight">{deal.title}</h4>
                          <span className="text-lg font-black text-secondary">{deal.price}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-on-surface-variant/20 group-hover:text-secondary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Análises Encontradas */}
              {results.reviews.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-l-4 border-secondary pl-4">
                    <MessageSquareText className="w-5 h-5 text-secondary" />
                    <h2 className="text-lg font-black text-on-surface uppercase tracking-tight">Análises Encontradas ({results.reviews.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {results.reviews.map(review => (
                      <Link 
                        key={review.id}
                        to={`/analises/${review.slug}`}
                        className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-surface-container-high hover:shadow-lg transition-all group"
                      >
                        <div className="w-full sm:w-32 h-32 sm:h-24 shrink-0 rounded-2xl overflow-hidden">
                          <img src={review.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <h4 className="text-lg font-black text-on-surface line-clamp-2 leading-tight group-hover:text-secondary transition-colors">{review.title}</h4>
                          <p className="text-xs font-label-bold text-on-surface-variant mt-1 line-clamp-1">{review.excerpt}</p>
                        </div>
                        <div className="hidden sm:flex items-center">
                           <ArrowRight className="w-5 h-5 text-on-surface-variant/20 group-hover:text-secondary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!hasResults && (
                <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-surface-container-high">
                  <div className="text-4xl mb-4">🛸</div>
                  <h3 className="text-xl font-black text-on-surface">Nada foi encontrado para "{query}"</h3>
                  <p className="text-on-surface-variant font-label-bold mt-2">Tente outros termos ou navegue pelas categorias.</p>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Smartphones', 'Informática', 'Casa Inteligente', 'Áudio'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setQuery(cat)}
                  className="p-6 bg-white border border-surface-container-high rounded-3xl font-black text-xs uppercase tracking-widest text-on-surface-variant hover:border-secondary hover:text-secondary transition-all shadow-sm"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility function that was missing in previous attempts if I use it
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
