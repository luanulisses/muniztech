import { useState } from 'react';
import { useDeals } from '@/hooks/useDeals';
import { Tag, ExternalLink, Filter, TrendingUp, Clock, Loader2, X, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Deals() {
  const { deals, loading } = useDeals();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const categories = Array.from(new Set(deals.map(d => d.category))).filter(Boolean);

  const filteredDeals = deals
    .filter(d => !selectedCategory || d.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''));
      if (sortBy === 'price-desc') return parseFloat(b.price.replace(/[^\d]/g, '')) - parseFloat(a.price.replace(/[^\d]/g, ''));
      return 0; // Default newest (handled by created_at in hook if possible)
    });

  return (
    <div className="bg-surface min-h-screen pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
        {/* Header Ofertas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-surface-container-high">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full font-black text-xs uppercase tracking-widest border border-red-500/20">
              <TrendingUp className="w-4 h-4 animate-pulse" />
              <span>Ofertas Monitoradas em Tempo Real</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tightest uppercase">
              Seleção de{' '}
              <span className="text-secondary underline decoration-4 underline-offset-8">
                Descontos
              </span>
            </h1>
            <p className="text-xl text-on-surface-variant font-label-bold max-w-2xl leading-relaxed">
              Filtramos a internet para trazer apenas os menores preços reais. Nada de "metade do dobro".
            </p>
          </div>

          {/* Filtros rápidos & Link Listicle */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end mt-4 md:mt-0">
            <Link
              to="/artigo/5-gadgets-baratos"
              className="flex items-center gap-2 px-5 py-3 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary-fixed-variant transition-transform hover:scale-105 whitespace-nowrap shadow-[0_4px_14px_0_rgb(22,163,74,0.39)]"
            >
              ⭐ 5 Gadgets Baratos
            </Link>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-surface-container-highest rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-surface-container-high transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" /> Filtros {selectedCategory && <span className="ml-1 w-2 h-2 bg-secondary rounded-full" />}
            </button>
            <button className="flex items-center gap-2 px-5 py-3 border border-surface-container-high rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-colors whitespace-nowrap text-orange-600">
              🔥 Mais Vendidos
            </button>
          </div>
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
          </div>
        ) : (
          <>
            {filteredDeals.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-2xl font-black text-on-surface">Nenhuma oferta encontrada</h3>
                <p className="text-on-surface-variant font-label-bold mt-2">Tente ajustar os filtros ou pesquisar outro termo.</p>
                <button onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }} className="mt-6 px-6 py-2 bg-secondary text-white rounded-xl font-black uppercase text-xs">Limpar Filtros</button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDeals.map((deal) => (
                <Link
                  key={deal.id}
                  to={`/ofertas/${deal.slug || deal.id}`}
                  className="group bg-white border border-surface-container-high rounded-[32px] p-5 shadow-lg hover:shadow-2xl transition-all relative flex flex-col hover:-translate-y-1"
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
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        Vendido por {deal.store}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" /> Hoje
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

                    <div className="w-full mt-4 py-3 bg-secondary text-white rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-transform hover:bg-secondary-fixed-variant group-hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgb(22,163,74,0.39)]">
                      Ver na Loja <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA Telegram */}
        <div className="bg-slate-900 rounded-[40px] p-12 mt-12 text-center border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent)]" />
          <Tag className="w-16 h-16 text-secondary mx-auto mb-6 relative z-10" />
          <h3 className="text-3xl font-black text-white uppercase tracking-tight relative z-10 mb-4">
            Não encontrou o que procurava?
          </h3>
          <p className="text-gray-400 font-label-bold max-w-lg mx-auto relative z-10 mb-8 text-lg">
            As melhores promoções acabam em minutos. Participe do nosso grupo VIP e receba alertas de bugs de preço antes de todo mundo.
          </p>
          <button className="px-10 py-5 bg-[#0088cc] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#0077b5] transition-all shadow-[0_4px_14px_0_rgba(0,136,204,0.39)] relative z-10 hover:scale-105 active:scale-95 text-lg">
            Entrar no Grupo Telegram
          </button>
        </div>
      </div>

      {/* FILTER OVERLAY */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-8 space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">Filtros</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-secondary">Categorias</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-wide ${!selectedCategory ? 'border-secondary bg-secondary/5 text-secondary' : 'border-surface-container-high text-on-surface-variant'}`}
                  >
                    Todas as Categorias {!selectedCategory && <Check className="w-4 h-4" />}
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-wide ${selectedCategory === cat ? 'border-secondary bg-secondary/5 text-secondary' : 'border-surface-container-high text-on-surface-variant'}`}
                    >
                      {cat} {selectedCategory === cat && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-secondary">Ordenar por</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'newest', label: 'Mais Recentes' },
                    { id: 'price-asc', label: 'Menor Preço' },
                    { id: 'price-desc', label: 'Maior Preço' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setSortBy(opt.id as any)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-wide ${sortBy === opt.id ? 'border-secondary bg-secondary/5 text-secondary' : 'border-surface-container-high text-on-surface-variant'}`}
                    >
                      {opt.label} {sortBy === opt.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
