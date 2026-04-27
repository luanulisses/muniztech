import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Loader2, LayoutDashboard, Tag, ShoppingCart, 
  Star, LogOut, ArrowLeft, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
      if (!session?.user) {
        navigate('/admin/login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fechar sidebar ao mudar de rota em mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pendentes 🔥', path: '/admin/pendentes', icon: ShoppingCart },
    { name: 'Ofertas', path: '/admin/ofertas', icon: ShoppingCart },
    { name: 'Avaliações', path: '/admin/avaliacoes', icon: Star },
    { name: 'Categorias', path: '/admin/categorias', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-surface font-sans flex flex-col md:flex-row overflow-x-hidden">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b border-surface-container-high px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <h2 className="text-xl font-black text-on-surface tracking-tight uppercase">
          Muniz<span className="text-secondary">Tech</span>
        </h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-on-surface hover:text-secondary transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR (Responsive) */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className={`fixed inset-y-0 left-0 w-64 bg-surface-container-lowest border-r border-surface-container-high flex flex-col z-[40] md:z-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <div className="p-6 hidden md:block">
              <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">
                Muniz<span className="text-secondary">Tech</span>
              </h2>
              <div className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mt-1">
                Painel de Controle
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-6 md:mt-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-sm transition-colors ${
                      isActive
                        ? 'bg-secondary text-white shadow-md'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-surface-container-high space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Ver Site
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* OVERLAY for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
