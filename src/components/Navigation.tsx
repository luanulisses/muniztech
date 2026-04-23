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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-container-high rounded-t-xl shadow-lg pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90',
              location.pathname === item.path ? 'text-secondary' : 'text-on-surface-variant'
            )}
          >
            <item.icon
              className={cn('w-6 h-6 mb-1', location.pathname === item.path && 'fill-current')}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
