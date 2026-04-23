import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-12 md:space-y-16 pb-32">
      <header className="max-w-2xl space-y-4">
        <h1 className="text-3xl md:text-6xl font-black text-on-surface leading-tight tracking-tight uppercase">
          Vamos{' '}
          <span className="text-secondary underline underline-offset-8 decoration-4">
            Conversar
          </span>
        </h1>
        <p className="text-sm md:text-xl text-on-surface-variant font-label-bold leading-relaxed">
          Tem dúvidas sobre um produto? Sugestões de pauta? Parcerias comerciais? Nossa equipe está
          pronta para ouvir você.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        {/* Formulário */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Nome</label>
              <input
                type="text"
                className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors text-sm font-label-bold"
                placeholder="João Muniz"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">E-mail</label>
              <input
                type="email"
                className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors text-sm font-label-bold"
                placeholder="joao@exemplo.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Assunto</label>
            <select className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors text-sm font-label-bold text-on-surface">
              <option>Dúvida sobre Produto</option>
              <option>Parceria Comercial</option>
              <option>Sugestão de Pauta</option>
              <option>Imprensa e Mídia</option>
              <option>Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mensagem</label>
            <textarea
              rows={6}
              className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors resize-none text-sm font-label-bold"
              placeholder="Como podemos ajudar?"
            />
          </div>
          <button className="w-full py-4 bg-secondary text-on-secondary rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-secondary/20 text-sm">
            Enviar Mensagem <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Informações de Contato */}
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-6 md:space-y-8">
            {/* Email Direto */}
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight text-sm">E-mail Direto</h3>
                <p className="text-on-surface-variant font-label-bold text-base md:text-lg">
                  contato@muniztech.com.br
                </p>
                <p className="text-xs font-black text-secondary uppercase tracking-widest">
                  Respostas em até 24h
                </p>
              </div>
            </div>

            {/* Imprensa e Mídia */}
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight text-sm">Imprensa e Mídia</h3>
                <p className="text-on-surface-variant font-label-bold text-base md:text-lg">
                  midia@muniztech.com.br
                </p>
                <p className="text-xs font-black text-on-surface-variant/60 uppercase tracking-widest">
                  Para assessores e jornalistas
                </p>
              </div>
            </div>

            {/* Base de Operações */}
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight text-sm">Base de Operações</h3>
                <p className="text-on-surface-variant font-label-bold text-base md:text-lg">
                  Brasília, DF – Brasil
                </p>
                <p className="text-xs font-black text-on-surface-variant/60 uppercase tracking-widest">
                  Operação 100% remota
                </p>
              </div>
            </div>
          </div>

          {/* Nota sobre redes sociais */}
          <div className="p-6 bg-surface-container-lowest rounded-[24px] border border-surface-container-high space-y-3">
            <h4 className="font-black text-on-surface uppercase tracking-tight text-sm">Redes Sociais</h4>
            <p className="text-sm font-label-bold text-on-surface-variant leading-relaxed">
              Estamos construindo nossa presença nas redes sociais. Em breve você nos encontrará no Instagram, YouTube e outros canais. Fique de olho!
            </p>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Em breve →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
