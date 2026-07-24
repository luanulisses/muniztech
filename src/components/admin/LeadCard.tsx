import { LucideIcon } from 'lucide-react';

interface LeadCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bg: string;
  subtitle?: string;
}

export default function LeadCard({ title, value, icon: Icon, color, bg, subtitle }: LeadCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-surface-container-high shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`absolute top-0 right-0 w-28 h-28 ${bg} rounded-full -mr-14 -mt-14 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity`} />

      <div className="flex items-start justify-between relative z-10">
        <div className={`p-3.5 ${bg} ${color} rounded-2xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <div className="text-4xl font-black text-on-surface tracking-tighter mb-1">{value}</div>
        <div className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{title}</div>
        {subtitle && <div className="text-[10px] font-medium text-slate-400 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}
