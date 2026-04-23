import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Send, CheckCircle, ChevronRight } from 'lucide-react';

const vagas = [
  {
    id: 1,
    titulo: 'Redator(a) de Tecnologia',
    area: 'Editorial',
    tipo: 'Freelancer / Remoto',
    descricao: 'Buscamos redatores apaixonados por tecnologia para escrever análises, comparativos e guias de compra. Você testará produtos reais e ajudará nossos leitores a tomar melhores decisões.',
    requisitos: [
      'Interesse genuíno em produtos de tecnologia',
      'Boa escrita em português — clara, direta e honesta',
      'Capacidade de explicar conceitos técnicos de forma acessível',
      'Proatividade para buscar informações e testamentos práticos',
    ],
    diferencial: 'Experiência prévia com análise de produtos ou jornalismo de tecnologia.',
  },
  {
    id: 2,
    titulo: 'Caçador(a) de Ofertas',
    area: 'Curadoria',
    tipo: 'Part-time / Remoto',
    descricao: 'Monitora promoções, bugs de preço e oportunidades de compra em lojas como Amazon, Mercado Livre e Magazine Luiza. Você alimenta nosso banco de ofertas diariamente.',
    requisitos: [
      'Conhecimento das principais lojas virtuais do Brasil',
      'Agilidade para identificar e publicar oportunidades rapidamente',
      'Atenção a detalhes como preço original, % de desconto e validade',
      'Disponibilidade para monitorar ao longo do dia',
    ],
    diferencial: 'Participação em grupos de ofertas e comunidades de compras.',
  },
];

export default function TrabalheConosco() {
  const [vagaSelecionada, setVagaSelecionada] = useState<number | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', linkedin: '', mensagem: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula envio
    setTimeout(() => setEnviado(true), 500);
  };

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors mb-8 md:mb-12">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        {/* Hero */}
        <header className="mb-12 md:mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full font-black text-[10px] uppercase tracking-widest border border-secondary/20">
            <Briefcase className="w-3.5 h-3.5" /> Oportunidades Abertas
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-on-surface uppercase tracking-tight leading-tight">
            Trabalhe <span className="text-secondary">Conosco</span>
          </h1>
          <p className="text-on-surface-variant font-label-bold text-base md:text-xl max-w-2xl leading-relaxed">
            A MunizTech é um veículo de tecnologia 100% digital, baseado em Brasília – DF. Procuramos pessoas curiosas, honestas e apaixonadas por ajudar outras pessoas a comprar melhor.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: MapPin, text: 'Brasília, DF – Brasil' },
              { icon: Clock, text: 'Trabalho Remoto' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-container-high rounded-xl text-xs font-black uppercase tracking-widest text-on-surface-variant shadow-sm">
                <Icon className="w-4 h-4 text-secondary" /> {text}
              </div>
            ))}
          </div>
        </header>

        {/* Vagas */}
        <section className="mb-12 md:mb-16 space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight border-l-4 border-secondary pl-4">
            Vagas Abertas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                onClick={() => setVagaSelecionada(vagaSelecionada === vaga.id ? null : vaga.id)}
                className={`bg-white border-2 rounded-[24px] md:rounded-[32px] p-6 md:p-8 cursor-pointer transition-all shadow-sm ${
                  vagaSelecionada === vaga.id
                    ? 'border-secondary shadow-xl shadow-secondary/10'
                    : 'border-surface-container-high hover:border-secondary/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 rounded-lg">{vaga.area}</span>
                    <h3 className="text-lg md:text-xl font-black text-on-surface mt-2">{vaga.titulo}</h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-secondary transition-transform shrink-0 mt-1 ${vagaSelecionada === vaga.id ? 'rotate-90' : ''}`} />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
                  <Clock className="w-3.5 h-3.5" /> {vaga.tipo}
                </div>
                <p className="text-sm font-label-bold text-on-surface-variant leading-relaxed">{vaga.descricao}</p>

                {vagaSelecionada === vaga.id && (
                  <div className="mt-6 space-y-4 border-t border-surface-container-high pt-6">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-secondary mb-3">Requisitos</h4>
                      <ul className="space-y-2">
                        {vaga.requisitos.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm font-label-bold text-on-surface-variant">
                            <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {vaga.diferencial && (
                      <div className="bg-surface-container-low rounded-2xl p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Diferencial: </span>
                        <span className="text-sm font-label-bold text-on-surface-variant">{vaga.diferencial}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Formulário de Candidatura */}
        <section className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-12 border border-surface-container-high shadow-lg">
          {enviado ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">Candidatura Enviada!</h3>
              <p className="text-on-surface-variant font-label-bold max-w-md mx-auto">
                Recebemos seu contato. Nossa equipe vai analisar e retornar em até 5 dias úteis. Obrigado pelo interesse!
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight mb-6 md:mb-8">
                Envie sua Candidatura
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Nome Completo *</label>
                    <input
                      required
                      type="text"
                      value={form.nome}
                      onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
                      className="w-full bg-surface-container-lowest border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors font-label-bold text-on-surface text-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">E-mail *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-surface-container-lowest border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors font-label-bold text-on-surface text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">LinkedIn ou Portfólio</label>
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors font-label-bold text-on-surface text-sm"
                    placeholder="https://linkedin.com/in/seu-perfil"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Por que quer trabalhar com a MunizTech? *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={(e) => setForm(f => ({ ...f, mensagem: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors resize-none font-label-bold text-on-surface text-sm"
                    placeholder="Conte um pouco sobre você e sua experiência com tecnologia..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-secondary/20 text-sm">
                  Enviar Candidatura <Send className="w-5 h-5" />
                </button>
                <p className="text-center text-[10px] text-on-surface-variant font-label-bold">
                  Também podemos ser contactados em: <a href="mailto:contato@muniztech.com.br" className="text-secondary hover:underline">contato@muniztech.com.br</a>
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
