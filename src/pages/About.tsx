import { Shield, Target, Search } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-white border-b border-surface-container-high py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-surface-container-lowest border-2 border-surface-container-high rounded-3xl mx-auto flex items-center justify-center shadow-sm mb-8 transform -rotate-6">
            <Search className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tightest leading-tight">
            Simplificamos tecnologia para{' '}
            <span className="text-secondary underline decoration-secondary/30">
              você comprar melhor
            </span>
            .
          </h1>
          <p className="text-xl text-on-surface-variant font-label-bold max-w-2xl mx-auto leading-relaxed">
            A internet está cheia de falsas promoções e reviews patrocinados. O MunizTech nasceu
            para filtrar o ruído e conectar você diretamente aos melhores produtos pelo menor preço
            real.
          </p>
        </div>
      </section>

      {/* Blocos de Confiança */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white  p-8 rounded-4xl border border-surface-container-high shadow-lg text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
              Transparência
            </h3>
            <p className="text-on-surface-variant font-label-bold leading-relaxed">
              Nossas análises mostram os prós e os contras reais. Se um produto é ruim, nós vamos te
              falar. Não escondemos defeitos para forçar vendas.
            </p>
          </div>

          <div className="bg-white  p-8 rounded-4xl border border-surface-container-high shadow-lg text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl mx-auto flex items-center justify-center">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
              Independência
            </h3>
            <p className="text-on-surface-variant font-label-bold leading-relaxed">
              Não somos pagos pelas marcas para elogiá-las. Somos um portal de curadoria sustentado
              por comissões de lojas apenas quando você compra algo que realmente gostou.
            </p>
          </div>

          <div className="bg-white  p-8 rounded-4xl border border-surface-container-high shadow-lg text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl mx-auto flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
              Curadoria
            </h3>
            <p className="text-on-surface-variant font-label-bold leading-relaxed">
              Passamos horas monitorando histórico de preços e lendo relatos de usuários para
              separar o que é "hype" do que é uma compra realmente inteligente.
            </p>
          </div>
        </div>
      </section>

      {/* Como Ganha Dinheiro */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-center bg-surface-container-low rounded-[40px] border border-surface-container-high">
        <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-4">
          Como o MunizTech se sustenta?
        </h2>
        <p className="text-lg text-on-surface-variant font-label-bold leading-relaxed">
          Nós participamos de programas de associados de grandes redes de varejo (como Amazon,
          Mercado Livre e outras). Isso significa que, se você clicar em um dos nossos links e
          realizar uma compra, nós ganhamos uma pequena comissão.
          <br />
          <br />
          <strong className="text-on-surface">
            Isso não gera nenhum custo extra para você.
          </strong>{' '}
          Pelo contrário, focamos em achar os menores preços para que você economize dinheiro, e em
          troca, a loja nos recompensa por levar você até lá.
        </p>
      </section>
    </div>
  );
}
