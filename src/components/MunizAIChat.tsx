import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

// ── Opções humanizadas de serviços (Sprint 3.2.5) ────────────────────────────
interface ServiceCardInfo {
  key: string;
  emoji: string;
  title: string;
  subtitle?: string;
  badge?: string;
  fullWidth?: boolean;
}

const SERVICE_CARDS: ServiceCardInfo[] = [
  { key: '🌐 Criar um Site', emoji: '🌐', title: 'Criar um Site', subtitle: 'Sites, landing pages e portfólios' },
  { key: '📈 Aumentar minhas Vendas', emoji: '📈', title: 'Aumentar minhas Vendas', subtitle: 'Marketing digital e tráfego pago' },
  { key: '📊 Relatórios e Dashboards (Power BI)', emoji: '📊', title: 'Relatórios e Dashboards', subtitle: 'Power BI', badge: 'MAIS PROCURADO' },
  { key: '🤖 Inteligência Artificial', emoji: '🤖', title: 'Inteligência Artificial', subtitle: 'Chatbots, automação e IA generativa', badge: 'DESTAQUE' },
  { key: '⚡ Automatizar Processos', emoji: '⚡', title: 'Automatizar Processos', subtitle: 'Elimine tarefas repetitivas', badge: 'RECOMENDADO' },
  { key: '🏢 Melhorar a Gestão da Empresa', emoji: '🏢', title: 'Melhorar a Gestão', subtitle: 'ERP, financeiro e operações' },
  { key: '💻 Suporte Técnico', emoji: '💻', title: 'Suporte Técnico', subtitle: 'Computadores, servidores e TI' },
  { key: '📶 Wi-Fi, Redes e Infraestrutura', emoji: '📶', title: 'Wi-Fi, Redes e Infra', subtitle: 'Cabeamento e conectividade' },
  { key: '🖨️ Impressoras e Equipamentos', emoji: '🖨️', title: 'Impressoras e Equipamentos' },
  { key: '🔗 Integrar Sistemas', emoji: '🔗', title: 'Integrar Sistemas', subtitle: 'APIs e integrações' },
  { key: '📱 Cartão Digital e QR Code', emoji: '📱', title: 'Cartão Digital e QR Code' },
  { key: '📺 TV Corporativa', emoji: '📺', title: 'TV Corporativa', subtitle: 'Digital signage' },
  { key: '🛠️ Não sei o que preciso (Quero ajuda)', emoji: '🛠️', title: 'Não sei o que preciso', subtitle: 'Conte seu problema e a Muniz AI indica a melhor solução.', fullWidth: true },
];

// Chaves usadas no fluxo (SERVICE_OPTIONS mantido para compatibilidade)
const SERVICE_OPTIONS = SERVICE_CARDS.map((c) => c.key);

// Mapeamento: label exibido → categoria interna no CRM
const SERVICE_DISPLAY_TO_CRM: Record<string, string> = {
  '🌐 Criar um Site': 'Desenvolvimento Web',
  '📈 Aumentar minhas Vendas': 'Marketing Digital',
  '📊 Relatórios e Dashboards (Power BI)': 'Power BI',
  '🤖 Inteligência Artificial': 'Inteligência Artificial',
  '⚡ Automatizar Processos': 'Automação',
  '🏢 Melhorar a Gestão da Empresa': 'ERP / Consultoria',
  '💻 Suporte Técnico': 'Suporte Técnico',
  '📶 Wi-Fi, Redes e Infraestrutura': 'Infraestrutura',
  '🖨️ Impressoras e Equipamentos': 'Equipamentos',
  '🔗 Integrar Sistemas': 'Integrações API',
  '📱 Cartão Digital e QR Code': 'Muniz Connect',
  '📺 TV Corporativa': 'Digital Signage',
  '🛠️ Não sei o que preciso (Quero ajuda)': 'Consultoria Comercial',
};

// Lookup rápido de metadados por key
const SERVICE_CARD_MAP = new Map(SERVICE_CARDS.map((c) => [c.key, c]));

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
    servicoDisplay: '',
    descricao: '',
    telefone: '',
    email: '',
  });

  const formDataRef = useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // 1. Visual Viewport Listener para Teclado Mobile
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateViewport = () => {
      document.documentElement.style.setProperty(
        '--visual-viewport-height',
        `${viewport.height}px`
      );
      document.documentElement.style.setProperty(
        '--visual-viewport-offset-top',
        `${viewport.offsetTop}px`
      );
    };

    updateViewport();

    viewport.addEventListener('resize', updateViewport);
    viewport.addEventListener('scroll', updateViewport);

    return () => {
      viewport.removeEventListener('resize', updateViewport);
      viewport.removeEventListener('scroll', updateViewport);
      document.documentElement.style.removeProperty('--visual-viewport-height');
      document.documentElement.style.removeProperty('--visual-viewport-offset-top');
    };
  }, []);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isTyping]);

  const handleInputFocus = () => {
    window.setTimeout(() => {
      scrollToBottom(true);
    }, 250);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initSession();
    }
  }, [isOpen]);

  // Bloqueio de rolagem mantendo a posição original da página
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.classList.add('muniz-ai-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.classList.remove('muniz-ai-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
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
        `${formDataRef.current.nome || extractedCompany}, qual dessas opções melhor descreve o que você precisa hoje?`,
        SERVICE_OPTIONS,
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
      // ── ETAPA 3: SERVIÇO (Sprint 3.2.5 — Humanizado) ──────────────────────
      const displayLabel = userText.trim();
      const crmCategory = SERVICE_DISPLAY_TO_CRM[displayLabel] || displayLabel;

      setFormData((prev) => ({
        ...prev,
        servico: crmCategory,
        servicoDisplay: displayLabel,
      }));

      if (sessionId && sessionToken) {
        callEdgeFunction({
          action: 'send_message',
          session_id: sessionId,
          session_token: sessionToken,
          content: userText,
        }).catch((e) => console.warn('[MunizAIChat] send_message step 3:', e));
      }

      // Fluxo especial: "Não sei o que preciso"
      if (displayLabel.includes('Não sei o que preciso')) {
        setStep(4);
        addBotMessage(
          `Sem problemas! 😊\n\nMe conta rapidamente o que está acontecendo na sua empresa e eu vou te ajudar a identificar a melhor solução.\n\nExemplos:\n• "Minha empresa está desorganizada."\n• "Perco muito tempo com planilhas."\n• "Quero vender mais."\n• "Preciso controlar melhor meu estoque."\n• "Meu computador vive dando problema."`,
        );
      } else {
        setStep(4);
        addBotMessage(`Excelente escolha! Me conte rapidamente o que você gostaria de resolver ou melhorar com ${crmCategory}.`);
      }

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
            className="fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-40 bg-slate-900/95 hover:bg-slate-900 text-white rounded-3xl px-4 py-3 md:pl-4 md:pr-5 md:py-3.5 shadow-2xl border border-secondary/40 backdrop-blur-md flex items-center gap-3 group cursor-pointer w-auto max-w-none md:max-w-[340px]"
          >
            {/* Pulsing neon glow */}
            <span className="absolute -inset-1 rounded-3xl bg-secondary/30 blur-lg group-hover:bg-secondary/60 transition-all animate-pulse pointer-events-none" />

            <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary shrink-0 shadow-md">
              <Bot className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-ping" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>

            <div className="relative flex flex-col text-left space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white truncate">
                  🚀 SOLICITAR ORÇAMENTO
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  ONLINE
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span className="font-semibold text-slate-200">Muniz AI • Online</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-500" />
                <span className="hidden sm:flex text-secondary font-bold items-center gap-0.5">
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

      {/* CHAT MODAL RENDERIZADO DIRETAMENTE NO BODY VIA PORTAL */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <style>{`
                  @media (max-width: 767px) {
                    .muniz-ai-modal-mobile {
                      position: fixed !important;
                      top: var(--visual-viewport-offset-top, 0px) !important;
                      left: 0 !important;
                      right: 0 !important;
                      bottom: auto !important;
                      width: 100% !important;
                      height: var(--visual-viewport-height, 100dvh) !important;
                      max-height: var(--visual-viewport-height, 100dvh) !important;
                      border-radius: 0 !important;
                    }
                  }
                `}</style>

                {/* Backdrop overlay para mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] md:hidden"
                />

                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="muniz-ai-modal-mobile fixed inset-0 w-full h-[100dvh] md:inset-auto md:bottom-6 md:right-6 md:w-[430px] md:h-[600px] md:max-h-[85vh] z-[100] bg-slate-950 md:border md:border-slate-800 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white font-sans"
                >
                  {/* Header */}
                  <div className="bg-slate-900 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 h-[68px] sm:h-[72px]">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-secondary/20 border border-secondary/30 text-secondary flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white">Muniz AI SDR</h3>
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-secondary/20 text-secondary border border-secondary/30">
                            Premium
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atendimento Comercial Ativo
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                      aria-label="Fechar atendimento"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Corpo de Mensagens */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900 text-xs sm:text-sm overscroll-contain [-webkit-overflow-scrolling:touch]"
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[82%]">
                          {msg.sender === 'bot' && (
                            <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] shrink-0 border border-secondary/30">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <div
                            className={`p-3 sm:p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                              msg.sender === 'user'
                                ? 'bg-secondary text-white rounded-br-none font-medium shadow-md shadow-secondary/20'
                                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>

                        <span className="text-[9px] text-slate-500 mt-1 font-mono px-1">{msg.timestamp}</span>

                        {/* ── Service cards (Sprint 3.2.5 visual) ── */}
                        {msg.options && msg.options.length > 0 && msg.actionType === 'service_select' && (
                          <div className="mt-3 w-full pl-0 sm:pl-8 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {msg.options.map((opt) => {
                              const meta = SERVICE_CARD_MAP.get(opt);
                              if (!meta) return null;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => handleSendMessage(opt)}
                                  className={`relative group px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer
                                    bg-slate-900 border border-slate-700/60 text-slate-200
                                    hover:border-secondary/60 hover:bg-secondary/10 hover:shadow-md hover:shadow-secondary/5 hover:-translate-y-0.5
                                    active:scale-[0.98]
                                    ${meta.fullWidth ? 'col-span-1 md:col-span-2 border-dashed border-secondary/30' : ''}
                                  `}
                                >
                                  {/* Badge */}
                                  {meta.badge && (
                                    <span className="absolute -top-1.5 right-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider bg-slate-800 text-secondary border border-secondary/30 leading-none">
                                      {meta.badge}
                                    </span>
                                  )}

                                  <div className="flex items-center gap-2.5">
                                    <span className="text-base shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">{meta.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                      <span className="block text-[11px] font-bold leading-tight text-slate-100 group-hover:text-secondary transition-colors">
                                        {meta.title}
                                      </span>
                                      {meta.subtitle && (
                                        <span className="block text-[9px] text-slate-400 group-hover:text-slate-300 mt-0.5 leading-tight transition-colors">
                                          {meta.subtitle}
                                        </span>
                                      )}
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-secondary transition-colors" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* ── Generic option buttons (non-service) ── */}
                        {msg.options && msg.options.length > 0 && msg.actionType !== 'service_select' && (
                          <div className="flex flex-wrap gap-1.5 mt-3 max-w-[95%] sm:max-w-[90%] pl-0 sm:pl-8">
                            {msg.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleSendMessage(opt)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-secondary/20 text-slate-200 hover:text-secondary border border-slate-800 hover:border-secondary/40 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span>{opt}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* BOTÃO WHATSAPP PREMIUM */}
                        {msg.actionType === 'whatsapp' && (
                          <div className="mt-4 pl-0 sm:pl-8 w-full max-w-[95%] sm:max-w-[90%]">
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
                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0 relative z-10 pb-[max(10px,env(safe-area-inset-bottom))]">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={handleInputFocus}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      maxLength={500}
                      placeholder={step === 7 ? 'Atendimento concluído.' : 'Digite sua mensagem...'}
                      disabled={step === 7}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-[16px] md:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-secondary transition-colors disabled:opacity-50 h-11 md:h-10"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || step === 7}
                      className="h-11 w-11 md:h-10 md:w-10 bg-secondary hover:bg-secondary-fixed-variant text-white rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
