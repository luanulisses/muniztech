import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquareText, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: 'Início', icon: Home, path: '/' },
    { label: 'Avaliações', icon: MessageSquareText, path: '/analises' },
    { label: 'Ofertas', icon: Tag, path: '/ofertas' },
    { label: 'Pesquisa', icon: Search, path: '/busca' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-surface-container-high shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe rounded-t-3xl overflow-hidden">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 relative group',
                isActive ? 'text-secondary' : 'text-on-surface-variant/80'
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-colors mb-1",
                isActive ? "bg-secondary/10" : "group-hover:bg-surface-container-low"
              )}>
                <item.icon
                  className={cn('w-6 h-6', isActive && 'fill-current stroke-[3px]')}
                />
              </div>
              <span className={cn(
                "text-[10px] uppercase tracking-[0.1em] transition-all",
                isActive ? "font-black" : "font-bold"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-secondary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
