import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquareText, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: 'Início', icon: Home, path: '/' },
    { label: 'Análises', icon: MessageSquareText, path: '/analises' },
    { label: 'Ofertas', icon: Tag, path: '/ofertas' },
    { label: 'Busca', icon: Search, path: '/busca' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-surface-container-high shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-safe rounded-t-[32px] overflow-hidden translate-z-0">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 relative py-2',
                isActive ? 'text-secondary' : 'text-on-surface-variant/70'
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                isActive ? "bg-secondary/15 scale-110" : "hover:bg-surface-container-low"
              )}>
                <item.icon
                  className={cn('w-6 h-6', isActive ? 'fill-current stroke-[3px]' : 'stroke-[2px]')}
                />
              </div>
              <span className={cn(
                "text-[10px] uppercase tracking-widest mt-1 transition-all duration-300 whitespace-nowrap",
                isActive ? "font-black opacity-100" : "font-bold opacity-60"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-secondary rounded-b-full shadow-[0_2px_10px_rgba(22,163,74,0.4)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
