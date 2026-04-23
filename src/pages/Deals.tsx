import { useState } from 'react';
import { useDeals } from '@/hooks/useDeals';
import { Tag, ExternalLink, Filter, TrendingUp, Clock, Loader2, X, Check, ShoppingCart } from 'lucide-react';
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
      return 0;
    });

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Header Ofertas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-container-high">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest border border-red-500/20 mx-auto md:mx-0">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
              <span>Ofertas Monitoradas</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-on-surface tracking-tight uppercase">
              Seleção de{' '}
              <span className="text-secondary">Descontos</span>
            </h1>
            <p className="text-sm md:text-xl text-on-surface-variant font-label-bold max-w-2xl leading-relaxed">
              Filtramos a internet para trazer os menores preços reais.
            </p>
          </div>

          {/* Filtros rápidos */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-surface-container-high rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-low transition-all shrink-0 shadow-sm"
            >
              <Filter className="w-4 h-4 text-secondary" /> Filtros {selectedCategory && <span className="w-2 h-2 bg-secondary rounded-full" />}
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-surface-container-high rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-low transition-all shrink-0 shadow-sm text-orange-600">
              🔥 Em Alta
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
              <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-surface-container-high">
                <Tag className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                <h3 className="text-xl font-black text-on-surface">Nenhuma oferta encontrada</h3>
                <button onClick={() => setSelectedCategory(null)} className="mt-4 px-6 py-2 bg-secondary text-white rounded-xl font-black uppercase text-xs">Limpar Filtros</button>
              </div>
            )}
            
            {/* 2 colunas no mobile, 4 no desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredDeals.map((deal) => (
                <Link
                  key={deal.id}
                  to={`/ofertas/${deal.slug || deal.id}`}
                  className="group bg-white border border-surface-container-high rounded-2xl md:rounded-[32px] p-3 md:p-5 shadow-sm hover:shadow-xl transition-all relative flex flex-col hover:-translate-y-1"
                >
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 px-2 py-1 md:px-3 md:py-1.5 bg-red-600 text-white text-[8px] md:text-[11px] font-black uppercase rounded-lg shadow-md">
                    {deal.discount} OFF
                  </div>
                  <div className="h-32 md:h-48 flex items-center justify-center p-2 md:p-4">
                    <img
                      src={deal.image}
                      className="max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                      alt={deal.title}
                    />
                  </div>

                  <div className="mt-2 md:mt-4 space-y-2 md:space-y-3 flex-grow flex flex-col">
                    <div className="text-[8px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest line-clamp-1">
                      {deal.store}
                    </div>

                    <h3 className="font-black text-on-surface leading-tight line-clamp-2 text-[11px] md:text-base h-8 md:h-12">
                      {deal.title}
                    </h3>

                    <div className="mt-auto pt-2">
                      <div className="text-[9px] md:text-xs text-on-surface-variant line-through font-label-bold opacity-60">
                        {deal.originalPrice}
                      </div>
                      <div className="text-lg md:text-3xl font-black text-on-surface leading-none tracking-tighter">
                        {deal.price}
                      </div>
                    </div>

                    <div className="w-full mt-2 md:mt-4 py-2 md:py-3 bg-secondary text-white rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-xs tracking-widest flex items-center justify-center gap-1 md:gap-2 transition-all hover:bg-secondary-fixed-variant shadow-md shadow-secondary/10">
                      Ver Oferta <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FILTER OVERLAY */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-[85%] md:max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 md:p-8 space-y-6 md:space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight">Filtros</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Categorias</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center justify-between p-3 md:p-4 rounded-xl border-2 transition-all font-black text-xs uppercase ${!selectedCategory ? 'border-secondary bg-secondary/5 text-secondary' : 'border-surface-container-high text-on-surface-variant'}`}
                  >
                    Tudo {!selectedCategory && <Check className="w-4 h-4" />}
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between p-3 md:p-4 rounded-xl border-2 transition-all font-black text-xs uppercase ${selectedCategory === cat ? 'border-secondary bg-secondary/5 text-secondary' : 'border-surface-container-high text-on-surface-variant'}`}
                    >
                      {cat} {selectedCategory === cat && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Ordenar por</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'newest', label: 'Recentes' },
                    { id: 'price-asc', label: 'Menor Preço' },
                    { id: 'price-desc', label: 'Maior Preço' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setSortBy(opt.id as any)}
                      className={`flex items-center justify-between p-3 md:p-4 rounded-xl border-2 transition-all font-black text-xs uppercase ${sortBy === opt.id ? 'border-secondary bg-secondary/5 text-secondary' : 'border-surface-container-high text-on-surface-variant'}`}
                    >
                      {opt.label} {sortBy === opt.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest shadow-xl text-sm"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
