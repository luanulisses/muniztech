import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, X, ChevronRight, Home, MessageSquareText, Tag, Info, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/analises', label: 'Avaliações', icon: MessageSquareText },
    { to: '/ofertas', label: 'Ofertas', icon: Tag },
    { to: '/sobre', label: 'Sobre Nós', icon: Info },
    { to: '/contato', label: 'Contato', icon: Phone },
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
          <Link to="/" className="text-xl md:text-2xl font-black text-on-surface tracking-tighter uppercase">
            Muniz<span className="text-secondary">Tech</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-black uppercase text-xs tracking-widest">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'transition-all hover:text-secondary relative py-1',
                location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                  ? 'text-secondary'
                  : 'text-on-surface-variant'
              )}
            >
              {link.label}
              {(location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <Link to="/busca" className="p-2 text-on-surface-variant hover:text-secondary transition-colors">
          <Search className="w-6 h-6" />
        </Link>
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
              className="fixed inset-0 bg-on-surface/60 backdrop-blur-md z-[150] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[160] md:hidden flex flex-col shadow-2xl border-r border-surface-container-high"
            >
              <div className="p-6 border-b border-surface-container-high flex items-center justify-between bg-surface-container-lowest">
                <div className="text-xl font-black text-on-surface tracking-tighter uppercase">
                  Muniz<span className="text-secondary">Tech</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 mb-4">Navegação Principal</p>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all',
                        isActive
                          ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      )}
                    >
                      <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-secondary")} />
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight className={cn("w-4 h-4", isActive ? "opacity-100" : "opacity-20")} />
                    </Link>
                  );
                })}
              </div>

              <div className="p-6 border-t border-surface-container-high bg-surface-container-lowest">
                <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">
                    MunizTech © 2024
                  </p>
                  <div className="flex justify-center gap-4">
                    {/* Aqui você pode adicionar links de redes sociais se quiser futuramente */}
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
