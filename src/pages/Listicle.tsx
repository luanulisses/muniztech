import { Check, Flame, ShoppingCart, AlertTriangle } from 'lucide-react';

const LISTICLE_DATA = {
  title: '5 Gadgets Baratos que Valem MUITO a Pena Comprar Hoje',
  subtitle:
    'Selecionamos produtos com ótimo custo-benefício e avaliações reais. Aproveite enquanto ainda estão com desconto.',
  products: [
    {
      id: 1,
      name: 'Echo Dot 5ª Geração',
      highlight: '💡 Produto em destaque',
      description:
        'Perfeito para quem quer mais praticidade no dia a dia com tecnologia acessível. A Alexa responde rápido e o som impressiona pelo tamanho.',
      features: ['Fácil de usar', 'Ótimo custo-benefício', 'Um dos mais vendidos'],
      socialProof: 'Mais de 1.000 pessoas já visualizaram hoje',
      link: 'https://amzn.to/3Oycf9t',
      image:
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      name: 'JBL Tune 520BT',
      highlight: '🎧 Ideal para uso diário',
      description:
        'Se você busca qualidade e praticidade, esse é um dos melhores nessa faixa de preço.',
      features: ['Boa durabilidade', 'Avaliações positivas', 'Muito procurado'],
      socialProof: 'Oferta com desconto ativo',
      link: 'https://amzn.to/48jjLM9',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      name: 'Bettdow SmartWatch com Alexa',
      highlight: '⌚ Tecnologia no seu pulso',
      description:
        'Monitore sua rotina com um relógio inteligente simples, funcional e eficiente que conta com mais de 100 modos esportivos.',
      features: ['Funcionalidades úteis', 'Visual moderno', 'Excelente custo-benefício'],
      socialProof: 'Alta procura nas últimas horas',
      link: 'https://amzn.to/4ctRVzf',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 4,
      name: 'Carregador Turbo 50W Lagus',
      highlight: '⚡ Mais velocidade no seu dia',
      description: 'Ideal para quem precisa de carregamento rápido e eficiência no dia a dia.',
      features: ['Compacto', 'Carregamento rápido', 'Compatível com vários dispositivos'],
      socialProof: 'Desconto por tempo limitado',
      link: 'https://amzn.to/4u4nhSH',
      image:
        'https://images.unsplash.com/photo-1583863788434-e58a36340cf0?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 5,
      name: 'Cabo USB-C 60W Trançado',
      highlight: '🔌 Essencial para o dia a dia',
      description:
        'Um cabo de 2 metros reforçado em nylon trançado que faz toda diferença na resistência diária.',
      features: ['Alta resistência', 'Boa avaliação', 'Preço acessível'],
      socialProof: 'Um dos mais comprados da categoria',
      link: 'https://amzn.to/4cuewf6',
      image:
        'https://images.unsplash.com/photo-1615526659134-4bc6cb52c4dd?auto=format&fit=crop&q=80&w=800',
    },
  ],
};

export default function Listicle() {
  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Header do Artigo */}
      <header className="bg-white border-b border-surface-container-high py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full font-black text-sm uppercase tracking-widest border border-red-200">
            <Flame className="w-5 h-5 animate-pulse" />
            Em Alta
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tightest">
            🔥 5 Gadgets Baratos que{' '}
            <span className="text-secondary underline decoration-secondary/30">Valem MUITO</span> a
            Pena Comprar Hoje
          </h1>
          <p className="text-xl text-on-surface-variant font-label-bold max-w-2xl mx-auto leading-relaxed">
            {LISTICLE_DATA.subtitle}
          </p>
        </div>
      </header>

      {/* Conteúdo / Lista */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {LISTICLE_DATA.products.map((product, index) => (
          <article
            key={product.id}
            className="bg-white rounded-4xl border border-surface-container-high shadow-xl overflow-hidden group hover:border-secondary/30 transition-colors relative"
          >
            {/* Rank Badge */}
            <div className="absolute top-6 left-6 z-10 w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg border-4 border-white">
              #{index + 1}
            </div>

            {/* Imagem do Produto */}
            <div className="h-64 sm:h-80 bg-surface-container-lowest relative overflow-hidden flex items-center justify-center p-8">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Detalhes */}
            <div className="p-8 md:p-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-secondary font-black text-sm uppercase tracking-widest">
                  {product.highlight}
                </h3>
                <h2 className="text-3xl font-black text-on-surface tracking-tight">
                  {product.name}
                </h2>
                <p className="text-on-surface-variant font-label-bold text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Benefícios */}
              <ul className="space-y-3 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex gap-3 text-on-surface font-label-bold items-center">
                    <Check className="w-5 h-5 text-secondary shrink-0" /> {feat}
                  </li>
                ))}
              </ul>

              {/* Prova Social */}
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 font-black text-sm">
                <Flame className="w-5 h-5 shrink-0" /> {product.socialProof}
              </div>

              {/* Call to Action */}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_8px_30px_rgb(22,163,74,0.3)] mt-8"
              >
                <ShoppingCart className="w-6 h-6" />
                Ver Preço na Amazon
              </a>
            </div>
          </article>
        ))}

        {/* Bloco de Fechamento */}
        <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-center space-y-6 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15),transparent)]" />
          <h3 className="text-2xl font-black text-white uppercase tracking-tight relative z-10">
            💰 Esses produtos estão entre os mais procurados atualmente e com ótimo custo-benefício.
          </h3>
          <div className="flex items-start gap-3 text-left bg-black/30 p-6 rounded-2xl relative z-10">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-gray-300 font-label-bold leading-relaxed text-sm">
              <strong className="text-white">Atenção:</strong> Os preços podem mudar a qualquer
              momento — recomendamos aproveitar as ofertas enquanto ainda estão com desconto ativo
              nos sites parceiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
