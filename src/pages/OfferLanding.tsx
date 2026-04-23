import { useParams, Link } from 'react-router-dom';
import { useDeals } from '@/hooks/useDeals';
import {
  Timer,
  ShieldCheck,
  Truck,
  Star,
  Check,
  Target,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OfferLanding() {
  const { slug } = useParams();
  const { deals, loading } = useDeals();
  const deal = deals.find((d) => d.slug === slug || d.id === slug);
  const relatedProducts = deals.filter((d) => d.id !== deal?.id).slice(0, 3);

  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    if (deal?.endsInHours) {
      setTimeLeft(prev => ({ ...prev, hours: deal.endsInHours || 5 }));
    }
  }, [deal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  if (!deal)
    return (
      <div className="p-20 text-center font-black text-2xl">Oferta expirada ou não encontrada.</div>
    );

  return (
    <div className="bg-surface min-h-screen pb-20">
      <div className="bg-red-50 text-red-600 py-3 px-4 border-b border-red-200 flex justify-center items-center gap-4">
        <div className="font-black uppercase text-sm flex items-center gap-2">
          <Timer className="w-5 h-5 animate-pulse" />
          Restam Poucas Unidades
        </div>
        <div className="font-mono text-lg font-black bg-white px-3 py-1 rounded shadow-sm">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="bg-white rounded-4xl p-8 md:p-12 shadow-sm border border-surface-container-high flex flex-col items-center justify-center relative sticky top-24 h-fit">
            <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-red-600 text-white text-sm font-black uppercase rounded-xl shadow-lg animate-pulse">
              {deal.discount} OFF
            </div>
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full max-w-sm object-contain mix-blend-multiply "
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-4 border-b border-surface-container-high pb-6">
              <div className="inline-block px-3 py-1 bg-surface-container-highest text-on-surface-variant font-black text-xs uppercase tracking-widest rounded-lg">
                Vendido por {deal.store}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
                {deal.title}
              </h1>
              <div className="flex items-center gap-2 text-yellow-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-secondary font-black text-sm ml-2">
                  4.8 (Baseado em milhares de vendas)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-on-surface-variant line-through font-label-bold text-lg">
                  {deal.originalPrice}
                </span>
                <div className="text-5xl md:text-6xl font-black text-on-surface tracking-tighter flex items-center gap-4">
                  {deal.price}
                </div>
                <div className="text-sm font-black text-secondary uppercase tracking-widest pt-1 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Em até 10x sem juros
                </div>
              </div>

              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-6 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgb(22,163,74,0.4)] relative overflow-hidden group"
              >
                <ShoppingCart className="w-6 h-6" />
                Comprar com Desconto
              </a>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center justify-center gap-2 text-sm font-black text-on-surface bg-surface-container-highest py-3 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  Compra Segura
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-black text-on-surface bg-surface-container-highest py-3 rounded-xl">
                  <Truck className="w-5 h-5 text-secondary" />
                  Frete Rápido
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 md:p-8 rounded-3xl border border-green-200 space-y-3">
              <h3 className="font-black text-green-900 uppercase tracking-tight text-lg flex items-center gap-2">
                💰 Vale a pena comprar hoje?
              </h3>
              <p className="text-green-800 font-label-bold text-base flex items-start gap-3">
                <Check className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
                <span>
                  <strong>Sim!</strong> O preço foi validado pelo nosso sistema como uma das melhores ofertas do dia.
                </span>
              </p>
            </div>

            <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-surface-container-high space-y-4">
              <h3 className="font-black text-on-surface uppercase tracking-tight text-lg">
                Destaques do Produto
              </h3>
              <ul className="space-y-3">
                {(
                  deal.features || [
                    'Produto original lacrado na caixa',
                    'Garantia de fábrica de 1 ano',
                    'Devolução grátis em até 7 dias',
                  ]
                ).map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-on-surface-variant font-label-bold text-base items-center"
                  >
                    <Check className="w-5 h-5 text-secondary shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-16 pt-12 border-t border-surface-container-high">
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-8 border-l-4 border-secondary pl-4">
            Quem viu este, também comprou
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/ofertas/${rel.slug || rel.id}`}
                className="bg-white border border-surface-container-high rounded-[32px] p-5 shadow-sm hover:shadow-xl transition-all flex gap-4 items-center group"
              >
                <div className="w-20 h-20 shrink-0 bg-surface-container-lowest rounded-2xl flex items-center justify-center p-2">
                  <img
                    src={rel.image}
                    className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                    alt={rel.title}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-on-surface line-clamp-2 leading-snug group-hover:text-secondary transition-colors">
                    {rel.title}
                  </h4>
                  <div className="text-lg font-black text-secondary">{rel.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
