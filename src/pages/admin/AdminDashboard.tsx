import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingBag, 
  FileText, 
  Layers, 
  TrendingUp,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    deals: 0,
    reviews: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [dealsRes, reviewsRes, categoriesRes] = await Promise.all([
        supabase.from('deals').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        deals: dealsRes.count || 0,
        reviews: reviewsRes.count || 0,
        categories: categoriesRes.count || 0
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total de Ofertas', value: stats.deals, icon: ShoppingBag, color: 'text-secondary', bg: 'bg-secondary/10', link: '/admin/ofertas' },
    { title: 'Avaliações Ativas', value: stats.reviews, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/avaliacoes' },
    { title: 'Categorias', value: stats.categories, icon: Layers, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/categorias' }
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-on-surface uppercase tracking-tight">Painel de Controle</h1>
        <p className="text-on-surface-variant font-label-bold text-lg">Bem-vindo de volta, Administrador.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            to={card.link}
            className="bg-white p-8 rounded-[2.5rem] border border-surface-container-high shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-4 ${card.bg} ${card.color} rounded-2xl`}>
                <card.icon className="w-8 h-8" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all" />
            </div>

            <div className="mt-8 relative z-10">
              <div className="text-5xl font-black text-on-surface tracking-tighter mb-1">{card.value}</div>
              <div className="text-sm font-black uppercase tracking-widest text-on-surface-variant">{card.title}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent)]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary rounded-full font-black text-[10px] uppercase tracking-widest border border-secondary/30">
              <TrendingUp className="w-4 h-4" /> Dica do Painel
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight leading-tight">
              Mantenha o conteúdo <br /><span className="text-secondary underline">sempre atualizado</span>
            </h2>
            <p className="text-gray-400 font-label-bold text-lg leading-relaxed">
              Ofertas com mais de 48h tendem a expirar. Verifique as promoções da Amazon e atualize os links para não perder comissões.
            </p>
          </div>
          <div className="flex justify-end">
            <Link 
              to="/admin/ofertas"
              className="px-10 py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-secondary-fixed-variant transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Gerenciar Ofertas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
