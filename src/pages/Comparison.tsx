import { useParams, Link } from 'react-router-dom';
import { Scale, ChevronRight, Swords } from 'lucide-react';
import { COMPARISONS } from '@/constants';

const SPEC_GROUPS = [
  {
    name: 'Geral',
    specs: [
      { name: 'Custo-Benefício', p1: '9/10', p2: '8/10' },
      { name: 'Design', p1: 'Clássico', p2: 'Moderno' },
    ],
  },
];

export default function Comparison() {
  const { slug } = useParams();

  // 1. HUB DE COMPARATIVOS (Se não tiver slug)
  if (!slug) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Scale className="w-16 h-16 text-secondary mx-auto" />
          <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tightest uppercase">
            Luta de <span className="text-secondary text-shadow-glow">Titãs</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-label-bold leading-relaxed">
            Nossos guias definitivos frente-a-frente. Descubra qual produto vence na relação
            custo-benefício.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {COMPARISONS.map((comp) => (
            <Link
              key={comp.id}
              to={`/comparativo/${comp.slug}`}
              className="group flex flex-col bg-white  rounded-4xl border border-surface-container-high transition-all hover:shadow-2xl overflow-hidden hover:-translate-y-2 p-8"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl rotate-[-5deg] group-hover:rotate-0 transition-transform">
                  <img
                    src={comp.image1}
                    className="w-full h-full object-cover"
                    alt={comp.item1Name}
                  />
                </div>
                <Swords className="w-8 h-8 text-secondary animate-pulse" />
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl rotate-[5deg] group-hover:rotate-0 transition-transform">
                  <img
                    src={comp.image2}
                    className="w-full h-full object-cover"
                    alt={comp.item2Name}
                  />
                </div>
              </div>
              <h2 className="text-2xl font-black text-on-surface text-center mb-2 group-hover:text-secondary transition-colors">
                {comp.title}
              </h2>
              <p className="text-center text-on-surface-variant font-label-bold">{comp.excerpt}</p>
              <div className="mt-8 flex justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-secondary border border-secondary px-6 py-2 rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                  Ver Duelo Completo
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // 2. PÁGINA DO DUELO ESPECÍFICO
  const comp = COMPARISONS.find((c) => c.slug === slug);
  if (!comp)
    return <div className="p-20 text-center font-black text-2xl">Comparativo não encontrado</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tightest uppercase max-w-4xl mx-auto">
          {comp.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado a Lado Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white  p-8 md:p-12 rounded-[40px] border border-surface-container-high shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />

          <div className="w-full md:w-1/2 flex flex-col items-center gap-6 z-10">
            <h2 className="text-2xl font-black text-on-surface text-center">{comp.item1Name}</h2>
            <div className="w-48 h-48 md:h-64 bg-surface-container-highest rounded-3xl p-4 flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src={comp.image1}
                className="max-h-full object-cover rounded-2xl"
                alt={comp.item1Name}
              />
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform w-full">
              Ver Preço
            </button>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-black text-xl animate-pulse shadow-lg shadow-secondary/30 z-10">
              VS
            </div>
            <div className="w-px h-full bg-surface-container-highest absolute z-0" />
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center gap-6 z-10">
            <h2 className="text-2xl font-black text-on-surface text-center">{comp.item2Name}</h2>
            <div className="w-48 h-48 md:h-64 bg-surface-container-highest rounded-3xl p-4 flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src={comp.image2}
                className="max-h-full object-cover rounded-2xl"
                alt={comp.item2Name}
              />
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform w-full">
              Ver Preço
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-highest p-8 rounded-4xl space-y-6 border border-surface-container-high">
            <h3 className="flex items-center gap-2 text-xl font-black text-on-surface uppercase tracking-tight">
              <Scale className="w-6 h-6 text-secondary" /> Comparativo Direto
            </h3>

            <div className="space-y-8">
              {SPEC_GROUPS.map((group) => (
                <div key={group.name} className="space-y-4">
                  <div className="text-[10px] font-black text-secondary uppercase tracking-widest border-b border-secondary/20 pb-1">
                    {group.name}
                  </div>
                  <div className="space-y-3">
                    {group.specs.map((spec) => (
                      <div
                        key={spec.name}
                        className="grid grid-cols-3 gap-4 text-sm font-label-bold"
                      >
                        <div className="text-on-surface-variant italic">{spec.name}</div>
                        <div className="text-center font-black text-on-surface">{spec.p1}</div>
                        <div className="text-center font-black text-on-surface">{spec.p2}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Veredito */}
      <div className="bg-slate-900 rounded-[64px] p-8 md:p-16 space-y-8 text-white relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.1),transparent)]" />
        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight relative z-10 text-center">
          O Veredito Final
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 mt-12">
          <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="text-secondary font-black uppercase tracking-widest text-sm text-center">
              Vencedor: Custo-Benefício
            </h4>
            <div className="text-2xl font-black text-center">{comp.item2Name}</div>
            <p className="text-gray-300 font-label-bold text-center">
              Ganha na bateria e no preço muito mais acessível.
            </p>
          </div>
          <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="text-secondary font-black uppercase tracking-widest text-sm text-center">
              Vencedor: Performance Premium
            </h4>
            <div className="text-2xl font-black text-center">{comp.item1Name}</div>
            <p className="text-gray-300 font-label-bold text-center">
              Se dinheiro não é problema, a integração e tela são superiores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
