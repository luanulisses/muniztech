import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '@/constants';
import { ArrowRight, Tag, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';

export default function Category() {
  const { slug } = useParams();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const { deals, loading } = useDeals(category?.name);

  if (!category)
    return <div className="p-20 text-center font-black text-2xl">Categoria não encontrada</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <div className="bg-surface-container-highest rounded-[40px] p-8 md:p-16 text-center border border-surface-container-high shadow-inner">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
            {(() => {
              const IconComponent = (Icons as any)[category.icon];
              return IconComponent ? (
                <IconComponent className="w-10 h-10" />
              ) : (
                <Tag className="w-10 h-10" />
              );
            })()}
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tightest uppercase mb-4">
          {category.tagline || `Tudo sobre ${category.name}`}
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-label-bold">
          As melhores ofertas garimpadas da internet para você não perder tempo nem dinheiro.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-secondary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
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
                  VER NA LOJA <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && deals.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant font-label-bold">
          Nenhuma oferta encontrada para esta categoria no momento.
        </div>
      )}
    </div>
  );
}
