import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// ─── FORMSPREE CONFIG ──────────────────────────────────────────────────────
// Para ativar: acesse https://formspree.io, crie uma conta gratuita,
// clique em "New Form", coloque o email contato@muniztech.com.br,
// e substitua FORMSPREE_FORM_ID pelo ID gerado (ex: "xkgjbzpq").
const FORMSPREE_FORM_ID = 'mgorrlyy';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    assunto: 'Dúvida sobre Produto',
    mensagem: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          assunto: form.assunto,
          mensagem: form.mensagem,
          _subject: `[MunizTech] ${form.assunto} - ${form.nome}`,
          _replyto: form.email,
        }),
      });

      if (response.ok) {
        setFormState('success');
        setForm({ nome: '', email: '', assunto: 'Dúvida sobre Produto', mensagem: '' });
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

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
        <div>
          {formState === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-[24px] md:rounded-[32px] p-10 md:p-16 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-green-900 uppercase tracking-tight">Mensagem Enviada!</h3>
              <p className="text-green-700 font-label-bold">
                Recebemos seu contato e responderemos em até 24h no e-mail <strong>{form.email || 'informado'}</strong>.
              </p>
              <button
                onClick={() => setFormState('idle')}
                className="mt-4 px-6 py-3 bg-secondary text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-secondary-fixed-variant transition-colors"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Nome *</label>
                  <input
                    required
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    disabled={formState === 'loading'}
                    className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors text-sm font-label-bold disabled:opacity-50"
                    placeholder="João Muniz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">E-mail *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={formState === 'loading'}
                    className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors text-sm font-label-bold disabled:opacity-50"
                    placeholder="joao@exemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Assunto</label>
                <select
                  name="assunto"
                  value={form.assunto}
                  onChange={handleChange}
                  disabled={formState === 'loading'}
                  className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors text-sm font-label-bold text-on-surface disabled:opacity-50"
                >
                  <option>Dúvida sobre Produto</option>
                  <option>Parceria Comercial</option>
                  <option>Sugestão de Pauta</option>
                  <option>Imprensa e Mídia</option>
                  <option>Outro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mensagem *</label>
                <textarea
                  required
                  rows={6}
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  disabled={formState === 'loading'}
                  className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-3.5 focus:outline-none focus:border-secondary transition-colors resize-none text-sm font-label-bold disabled:opacity-50"
                  placeholder="Como podemos ajudar?"
                />
              </div>

              {formState === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-label-bold">
                    Erro ao enviar. Por favor, tente novamente ou envie direto para{' '}
                    <a href="mailto:contato@muniztech.com.br" className="underline font-black">
                      contato@muniztech.com.br
                    </a>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={formState === 'loading'}
                className="w-full py-4 bg-secondary text-on-secondary rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-secondary/20 text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {formState === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    Enviar Mensagem <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Informações de Contato */}
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-6 md:space-y-8">
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight text-sm">E-mail Direto</h3>
                <a href="mailto:contato@muniztech.com.br" className="text-on-surface-variant font-label-bold text-base md:text-lg hover:text-secondary transition-colors">
                  contato@muniztech.com.br
                </a>
                <p className="text-xs font-black text-secondary uppercase tracking-widest">
                  Respostas em até 24h
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-on-surface uppercase tracking-tight text-sm">Imprensa e Mídia</h3>
                <a href="mailto:midia@muniztech.com.br" className="text-on-surface-variant font-label-bold text-base md:text-lg hover:text-secondary transition-colors">
                  midia@muniztech.com.br
                </a>
                <p className="text-xs font-black text-on-surface-variant/60 uppercase tracking-widest">
                  Para assessores e jornalistas
                </p>
              </div>
            </div>

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

          <div className="p-6 bg-surface-container-lowest rounded-[24px] border border-surface-container-high space-y-3">
            <h4 className="font-black text-on-surface uppercase tracking-tight text-sm">Redes Sociais</h4>
            <p className="text-sm font-label-bold text-on-surface-variant leading-relaxed">
              Estamos construindo nossa presença nas redes sociais. Em breve você nos encontrará no Instagram, YouTube e outros canais.
            </p>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Em breve →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
