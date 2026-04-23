import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-16">
      <header className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tightest uppercase">
          Vamos{' '}
          <span className="text-secondary underline underline-offset-8 decoration-4">
            Conversar
          </span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant font-label-bold leading-relaxed">
          Tem dúvidas sobre um produto? Sugestões de pauta? Parcerias comerciais? Nossa equipe está
          pronta para ouvir você.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-2">
                Nome
              </label>
              <input
                type="text"
                className="w-full bg-white  border border-surface-container-high rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition-colors"
                placeholder="João Muniz"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-2">
                E-mail
              </label>
              <input
                type="email"
                className="w-full bg-white  border border-surface-container-high rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition-colors"
                placeholder="joao@exemplo.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-2">
              Assunto
            </label>
            <select className="w-full bg-white  border border-surface-container-high rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition-colors">
              <option>Dúvida sobre Produto</option>
              <option>Parceria Comercial</option>
              <option>Sugestão de Pauta</option>
              <option>Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-2">
              Mensagem
            </label>
            <textarea
              rows={6}
              className="w-full bg-white  border border-surface-container-high rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition-colors resize-none"
              placeholder="Como podemos ajudar?"
            ></textarea>
          </div>
          <button className="w-full py-5 bg-secondary text-on-secondary rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-secondary/20">
            Enviar Mensagem <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-12">
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-secondary/5">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight">
                  E-mail Direto
                </h3>
                <p className="text-on-surface-variant font-label-bold text-lg">
                  contato@muniztech.com.br
                </p>
                <p className="text-xs font-black text-secondary uppercase tracking-widest">
                  Respostas em até 24h
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-secondary/5">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight">
                  Imprensa e Mídia
                </h3>
                <p className="text-on-surface-variant font-label-bold text-lg">
                  press@muniztech.com.br
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-secondary/5">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight">
                  Base de Operações
                </h3>
                <p className="text-on-surface-variant font-label-bold text-lg">
                  São Paulo, SP - Brasil
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface-container-highest rounded-4xl border border-surface-container-high space-y-4">
            <h4 className="font-black text-on-surface uppercase tracking-tight">Acompanhe-nos</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 bg-white  rounded-xl flex items-center justify-center shadow-sm hover:translate-y-[-2px] transition-transform"
              >
                <Icons.Instagram className="w-5 h-5 text-on-surface-variant" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white  rounded-xl flex items-center justify-center shadow-sm hover:translate-y-[-2px] transition-transform"
              >
                <Icons.Youtube className="w-5 h-5 text-on-surface-variant" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white  rounded-xl flex items-center justify-center shadow-sm hover:translate-y-[-2px] transition-transform"
              >
                <Icons.Twitter className="w-5 h-5 text-on-surface-variant" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import * as Icons from 'lucide-react';
import { MessageCircle } from 'lucide-react';
