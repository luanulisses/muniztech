import { useState } from 'react';
import { useDeals } from '@/hooks/useDeals';
import { Tag, ExternalLink, Filter, TrendingUp, Loader2, X, Check, ShoppingCart, BadgeCheck, ShieldCheck, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Achadinhos() {
  const { deals, loading } = useDeals(undefined, undefined, true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const categories = Array.from(new Set(deals.map(d => d.category))).filter(Boolean);
  const stores = Array.from(new Set(deals.map(d => d.store))).filter(Boolean);

  const filteredDeals = deals
    .filter(d => !selectedCategory || d.category === selectedCategory)
    .filter(d => !selectedStore || d.store === selectedStore)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return parseFloat(a.price.replace(/[^\d]/g, '').replace(',', '.')) - parseFloat(b.price.replace(/[^\d]/g, '').replace(',', '.'));
      if (sortBy === 'price-desc') return parseFloat(b.price.replace(/[^\d]/g, '').replace(',', '.')) - parseFloat(a.price.replace(/[^\d]/g, '').replace(',', '.'));
      return 0;
    });

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Header Achadinhos */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-container-high">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest border border-secondary/20 mx-auto md:mx-0">
              <Tag className="w-3.5 h-3.5 animate-pulse" />
              <span>Achadinhos Imperdíveis</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-on-surface tracking-tight uppercase">
              Todos os{' '}
              <span className="text-secondary">Achadinhos</span>
            </h1>
            <p className="text-sm md:text-xl text-on-surface-variant font-label-bold max-w-2xl leading-relaxed">
              Aqueles produtos que você não sabia que precisava, com preços que você não vai acreditar.
            </p>
          </div>

          {/* Filtros rápidos */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-surface-container-high rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-low transition-all shrink-0 shadow-sm"
            >
              <Filter className="w-4 h-4 text-secondary" /> Filtros {(selectedCategory || selectedStore) && <span className="w-2 h-2 bg-secondary rounded-full" />}
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
                <h3 className="text-xl font-black text-on-surface">Nenhum achadinho encontrado</h3>
                <button onClick={() => setSelectedCategory(null)} className="mt-4 px-6 py-2 bg-secondary text-white rounded-xl font-black uppercase text-xs">Limpar Filtros</button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredDeals.map((deal) => (
                <a
                  key={deal.id}
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-surface-container-high rounded-2xl md:rounded-[32px] p-4 flex gap-4 items-center group hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-surface-container-lowest rounded-2xl flex items-center justify-center p-2 relative">
                    {deal.discount && (
                      <div className="absolute -top-2 -left-2 z-10 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase rounded-lg shadow-md">
                        {deal.discount} OFF
                      </div>
                    )}
                    <img
                      src={deal.image}
                      className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                      alt={deal.title}
                    />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <div className="text-[8px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-low w-fit px-2 py-0.5 rounded-md">
                      {deal.store}
                    </div>
                    <h3 className="font-black text-sm md:text-base text-on-surface line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-lg md:text-2xl font-black text-secondary">{deal.price}</span>
                      {deal.originalPrice && (
                        <span className="text-xs text-on-surface-variant line-through opacity-60">
                          {deal.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Parcerias */}
        <div className="bg-surface-container-low rounded-[40px] p-8 md:p-16 border border-surface-container-high space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full font-black text-[10px] uppercase tracking-widest border border-secondary/20">
              <BadgeCheck className="w-4 h-4" />
              <span>Transparência MunizTech</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-on-surface uppercase tracking-tight">Achadinhos de Confiança</h2>
            <p className="text-on-surface-variant font-label-bold max-w-2xl mx-auto">
              Todos os nossos achadinhos são verificados e vêm de lojas parceiras oficiais.
            </p>
          </div>

          <div className="pt-8 border-t border-surface-container-high flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-green-600" />
               <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface">Links Verificados</div>
                  <div className="text-[9px] font-label-bold text-on-surface-variant uppercase">Proteção Anti-Scam</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <Handshake className="w-6 h-6 text-secondary" />
               <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface">Apoio ao Canal</div>
                  <div className="text-[9px] font-label-bold text-on-surface-variant uppercase">Sem Custo Adicional</div>
               </div>
            </div>
          </div>
        </div>
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
