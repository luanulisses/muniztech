import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react';
import {
  extractPersonName,
  extractCompanyName,
  normalizeCompanyName,
} from '@/lib/chatParsers';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  timestamp: string;
  options?: string[];
  actionType?: 'whatsapp' | 'service_select';
}

const SERVICE_SUGGESTIONS = [
  'Desenvolvimento Web',
  'ERP Senior',
  'Oracle',
  'Inteligência Artificial',
  'Automação',
  'Dashboards',
  'Landing Pages',
  'SaaS',
  'Integrações API',
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export default function MunizAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<number>(0);

  const [sessionId, setSessionId] = useState<string | null>(() => sessionStorage.getItem('muniz_ai_session_id'));
  const [sessionToken, setSessionToken] = useState<string | null>(() => sessionStorage.getItem('muniz_ai_session_token'));
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analyzingLead, setAnalyzingLead] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    servico: '',
    descricao: '',
    telefone: '',
    email: '',
  });

  const formDataRef = useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initSession();
    }
  }, [isOpen]);

  const getCurrentTimeStr = () =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const callEdgeFunction = async (bodyPayload: any) => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Configuração do Supabase indisponível no cliente.');
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/muniz-ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(bodyPayload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || `Erro HTTP ${res.status}`);
    }
    return json;
  };

  const initSession = async () => {
    setIsTyping(true);
    setErrorMsg(null);

    let activeId = sessionId;
    let activeToken = sessionToken;

    if (!activeId || !activeToken) {
      try {
        const data = await callEdgeFunction({ action: 'start_session' });
        if (data.session_id && data.session_token) {
          activeId = data.session_id;
          activeToken = data.session_token;
          setSessionId(activeId);
          setSessionToken(activeToken);
          sessionStorage.setItem('muniz_ai_session_id', activeId!);
          sessionStorage.setItem('muniz_ai_session_token', activeToken!);
        }
      } catch (err: any) {
        console.warn('[MunizAIChat] Erro ao iniciar sessão remota:', err);
      }
    }

    setIsTyping(false);
    addBotMessage(
      'Olá! Sou a Muniz AI, vendedora digital da Muniz Tech.\n\nPosso te ajudar com orçamentos e soluções em ERP Senior, Oracle, IA, Automação, SaaS e Web. Como posso te chamar?',
    );
    setStep(1);
  };

  const addBotMessage = (content: string, options?: string[], actionType?: 'whatsapp' | 'service_select') => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        sender: 'bot',
        content,
        timestamp: getCurrentTimeStr(),
        options,
        actionType,
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (text.length > 500) {
      setErrorMsg('A mensagem deve ter no máximo 500 caracteres.');
      return;
    }

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      content: text,
      timestamp: getCurrentTimeStr(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    await processFlow(text);
  };

  const processFlow = async (userText: string) => {
    const currentStep = step;

    if (currentStep === 1) {
      // ── ETAPA 1: NOME (Sprint 3.2.4 — chatParsers oficial) ─────────────────
      console.log('[PARSER NAME INPUT]', userText);
      const extractedName = extractPersonName(userText);
      console.log('[PARSER NAME OUTPUT]', extractedName);

      if (!extractedName) {
        addBotMessage('Perfeito! Antes de começarmos, como posso te chamar?');
        return;
      }

      setFormData((prev) => ({ ...prev, nome: extractedName }));
      setStep(2);
      addBotMessage(
        `Prazer em te conhecer, ${extractedName}! 😊\n\nDe qual empresa você é? (Se for projeto pessoal ou startup, pode colocar a ideia)`,
      );

      // Notificar backend de forma assíncrona
      if (sessionId && sessionToken) {
        callEdgeFunction({
          action: 'send_message',
          session_id: sessionId,
          session_token: sessionToken,
          content: userText,
        }).catch((e) => console.warn('[MunizAIChat] send_message step 1:', e));
      }

    } else if (currentStep === 2) {
      // ── ETAPA 2: EMPRESA (Sprint 3.2.4 — chatParsers oficial) ──────────────
      console.log('[PARSER COMPANY INPUT]', userText);
      const extractedCompany = extractCompanyName(userText) || normalizeCompanyName(userText);
      console.log('[PARSER COMPANY OUTPUT]', extractedCompany);

      if (!extractedCompany) {
        addBotMessage("Você representa alguma empresa? Se for um projeto pessoal, pode responder 'projeto pessoal'.");
        return;
      }

      setFormData((prev) => ({ ...prev, empresa: extractedCompany }));
      setStep(3);
      addBotMessage(
        `Excelente! Qual solução você está buscando para a ${extractedCompany}?`,
        SERVICE_SUGGESTIONS,
        'service_select',
      );

      if (sessionId && sessionToken) {
        callEdgeFunction({
          action: 'send_message',
          session_id: sessionId,
          session_token: sessionToken,
          content: userText,
        }).catch((e) => console.warn('[MunizAIChat] send_message step 2:', e));
      }

    } else if (currentStep === 3) {
      // ── ETAPA 3: SERVIÇO ──────────────────────────────────────────────────
      const cleanServico = userText.trim();
      setFormData((prev) => ({ ...prev, servico: cleanServico }));
      setStep(4);

      if (sessionId && sessionToken) {
        callEdgeFunction({
          action: 'send_message',
          session_id: sessionId,
          session_token: sessionToken,
          content: userText,
        }).catch((e) => console.warn('[MunizAIChat] send_message step 3:', e));
      }

      addBotMessage(`Excelente escolha! Me conte rapidamente o que você gostaria de resolver ou melhorar.`);

    } else if (currentStep === 4) {
      // ── ETAPA 4: DESCRIÇÃO ────────────────────────────────────────────────
      setFormData((prev) => ({ ...prev, descricao: userText }));
      setStep(5);
      addBotMessage(`Entendi. Perfeito! Qual o seu WhatsApp com DDD para podermos enviar os detalhes e manter contato direto?`);

    } else if (currentStep === 5) {
      // ── ETAPA 5: TELEFONE ─────────────────────────────────────────────────
      setFormData((prev) => ({ ...prev, telefone: userText }));
      setStep(6);
      addBotMessage(`Ótimo, estamos quase terminando! Qual o seu melhor e-mail para enviarmos a proposta?`);

    } else if (currentStep === 6) {
      // ── ETAPA 6: E-MAIL → FINALIZAR ───────────────────────────────────────
      const finalForm = { ...formDataRef.current, email: userText };
      setFormData(finalForm);
      setStep(7);

      addBotMessage(
        `Obrigado pelas informações, ${finalForm.nome || 'Cliente'}! Processando a qualificação comercial no nosso servidor seguro...`,
      );

      await handleFinishSession(finalForm);
    }
  };

  const handleFinishSession = async (finalForm: typeof formData) => {
    setAnalyzingLead(true);
    try {
      if (sessionId && sessionToken) {
        const res = await callEdgeFunction({
          action: 'finish_session',
          session_id: sessionId,
          session_token: sessionToken,
          form_data: finalForm,
        });

        if (res.whatsapp_url) {
          setWhatsAppUrl(res.whatsapp_url);
        }

        const score = res.score || 85;
        const ticketMin = res.estimated_ticket_min
          ? `R$ ${Number(res.estimated_ticket_min).toLocaleString('pt-BR')}`
          : 'R$ 5.000';
        const ticketMax = res.estimated_ticket_max
          ? `R$ ${Number(res.estimated_ticket_max).toLocaleString('pt-BR')}`
          : 'R$ 20.000';

        addBotMessage(
          `🎉 Solicitação registrada com sucesso, ${finalForm.nome || 'Cliente'}!\n\n` +
            `📊 **Análise Preditiva Muniz AI:**\n` +
            `• Score Comercial: ${score}/100\n` +
            `• Ticket Estimado: ${ticketMin} a ${ticketMax}\n\n` +
            `Este projeto foi qualificado com **Alta Prioridade**! Clique abaixo para iniciar o atendimento direto com o nosso especialista:`,
          undefined,
          'whatsapp',
        );
      }
    } catch (err: any) {
      console.error('[MunizAIChat] Erro ao finalizar sessão:', err);
      setErrorMsg(err.message || 'Falha ao conectar com o backend. Tente pelo WhatsApp.');
    } finally {
      setAnalyzingLead(false);
    }
  };

  const getFallbackWhatsAppUrl = () => {
    const nome = formData.nome || 'Cliente';
    const empresa = formData.empresa ? ` (${formData.empresa})` : '';
    const servico = formData.servico || 'Tecnologia';
    const msg = `Olá Luan!\nAcabei de conversar com a Muniz AI no site.\n\nResumo:\n- Nome: ${nome}${empresa}\n- Serviço: ${servico}\n- WhatsApp: ${formData.telefone}\n- Email: ${formData.email}\n- Descrição: ${formData.descricao}`;
    return `https://wa.me/5561998274390?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* BOTÃO FLUTUANTE PREMIUM */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-slate-900/95 hover:bg-slate-900 text-white rounded-3xl pl-4 pr-5 py-3.5 shadow-2xl border border-secondary/40 backdrop-blur-md flex items-center gap-3.5 group cursor-pointer max-w-[340px] sm:max-w-none"
          >
            {/* Pulsing neon glow */}
            <span className="absolute -inset-1 rounded-3xl bg-secondary/30 blur-lg group-hover:bg-secondary/60 transition-all animate-pulse pointer-events-none" />

            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary shrink-0 shadow-md">
              <Bot className="w-6 h-6" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-ping" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>

            <div className="relative flex flex-col text-left space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                  🚀 SOLICITAR ORÇAMENTO
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-300 font-label-bold">
                <span>Muniz AI • 24h</span>
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span className="text-secondary font-bold flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> Resposta em até 5min
                </span>
              </div>

              <div className="text-[9px] text-slate-400 font-mono hidden sm:block">
                Atendemos 12 empresas hoje
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[430px] h-[600px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white font-sans"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/30 text-secondary flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-tight text-white">Muniz AI SDR</h3>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-secondary/20 text-secondary border border-secondary/30">
                      Premium
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atendimento Comercial Ativo
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900 text-xs">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] shrink-0 border border-secondary/30">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-secondary text-white rounded-br-none font-medium shadow-md shadow-secondary/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-500 mt-1 font-mono px-1">{msg.timestamp}</span>

                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 max-w-[90%] pl-8">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSendMessage(opt)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-secondary/20 text-slate-200 hover:text-secondary border border-slate-800 hover:border-secondary/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{opt}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* BOTÃO WHATSAPP PREMIUM */}
                  {msg.actionType === 'whatsapp' && (
                    <div className="mt-4 pl-8 w-full max-w-[90%]">
                      <a
                        href={whatsAppUrl || getFallbackWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#25D366]/25 cursor-pointer active:scale-95"
                      >
                        <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
                        <span>🚀 FALAR COM O ESPECIALISTA</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] border border-secondary/30">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {analyzingLead && (
                <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-2xl text-secondary text-xs flex items-center gap-2 font-bold animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando lead e disparando e-mail de notificação...</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                maxLength={500}
                placeholder={step === 7 ? 'Atendimento concluído.' : 'Digite sua mensagem...'}
                disabled={step === 7}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || step === 7}
                className="h-10 w-10 bg-secondary hover:bg-secondary-fixed-variant text-white rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
