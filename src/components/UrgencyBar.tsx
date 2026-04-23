import { Flame } from 'lucide-react';

interface UrgencyBarProps {
  text?: string;
}

export default function UrgencyBar({
  text = '🔥 OFERTAS ATUALIZADAS AGORA — DESCONTOS LIMITADOS',
}: UrgencyBarProps) {
  return (
    <div className="bg-red-600 text-white py-2 px-4 text-center sticky top-0 z-[60] flex items-center justify-center gap-2 shadow-md">
      <Flame className="w-4 h-4 animate-pulse" />
      <span className="font-black text-xs md:text-sm uppercase tracking-widest">{text}</span>
      <Flame className="w-4 h-4 animate-pulse hidden sm:block" />
    </div>
  );
}
