import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/analises', label: 'Avaliações' },
    { to: '/ofertas', label: 'Ofertas' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-[70] border-b border-surface-container-high shadow-sm h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-on-surface-variant hover:text-secondary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-xl font-extrabold text-on-surface tracking-tighter">
            MunizTech
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-label-bold">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'transition-colors hover:text-secondary relative py-1',
                location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                  ? 'text-secondary'
                  : 'text-on-surface-variant'
              )}
            >
              {link.label}
              {(location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                />
              )}
            </Link>
          ))}
        </nav>

        <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[80] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[90] md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-surface-container-high flex items-center justify-between">
                <span className="text-xl font-black text-on-surface tracking-tighter">MunizTech</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-surface-container-low rounded-full"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all',
                      location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    )}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>

              <div className="p-8 border-t border-surface-container-high">
                <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                  <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest text-center">
                    Acompanhe as novidades
                  </p>
                  <div className="flex justify-center gap-4">
                    {/* Placeholder para redes sociais se quiser */}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
