interface LeadFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'novo', label: 'Novo' },
  { id: 'em_contato', label: 'Em contato' },
  { id: 'reuniao_agendada', label: 'Reunião Agendada' },
  { id: 'proposta_enviada', label: 'Proposta enviada' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'fechado', label: 'Fechado' },
  { id: 'perdido', label: 'Perdido' },
];

export default function LeadFilters({ currentFilter, onFilterChange, counts }: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const count = f.id === 'todos' ? counts.todos || 0 : counts[f.id] || 0;
        const isActive = currentFilter === f.id;

        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white text-on-surface border border-surface-container-high hover:bg-surface-container-low'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
