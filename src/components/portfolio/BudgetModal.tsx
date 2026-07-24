import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2, MessageSquare, Building2, User, Phone, Mail, Sparkles, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/config/site';
import { sendLeadConfirmation } from '@/config/links';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const SERVICES_OPTIONS = [
  'Desenvolvimento Web',
  'ERP Senior',
  'Oracle',
  'Inteligência Artificial',
  'Automação',
  'Landing Page',
  'SaaS',
  'Dashboard',
  'Integrações',
  'Outro',
];

// ── Lead Score Calculator ────────────────────────────────────────────────────
function calculateLeadScore(lead: {
  servico: string;
  empresa?: string;
  telefone?: string;
  email?: string;
  descricao?: string;
}): number {
  let score = 0;

  // Serviço
  if (lead.servico === 'ERP Senior') score += 10;
  else if (lead.servico === 'Oracle') score += 10;
  else if (lead.servico === 'Inteligência Artificial') score += 8;
  else if (lead.servico === 'SaaS') score += 8;
  else if (lead.servico === 'Automação') score += 7;
  else if (lead.servico === 'Dashboard') score += 6;
  else if (lead.servico === 'Landing Page') score += 4;

  // Possui empresa
  if (lead.empresa && lead.empresa.trim().length > 0) score += 2;

  // Possui telefone
  if (lead.telefone && lead.telefone.trim().length > 0) score += 2;

  // Possui e-mail
  if (lead.email && lead.email.trim().length > 0) score += 2;

  // Descrição
  const descLength = lead.descricao ? lead.descricao.trim().length : 0;
  if (descLength > 100) {
    score += 10;
  } else if (descLength > 50) {
    score += 5;
  }

  return score;
}

export default function BudgetModal({ isOpen, onClose, defaultService }: BudgetModalProps) {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [servico, setServico] = useState(defaultService || SERVICES_OPTIONS[0]);
  const [descricao, setDescricao] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdLead, setCreatedLead] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!nome.trim()) {
      setSubmitError('Por favor, informe seu nome.');
      return;
    }
    if (!servico) {
      setSubmitError('Por favor, selecione um serviço.');
      return;
    }

    setLoading(true);

    const calculatedScore = calculateLeadScore({
      servico,
      empresa,
      telefone,
      email,
      descricao,
    });

    const leadPayload = {
      nome: nome.trim(),
      empresa: empresa.trim() || null,
      telefone: telefone.trim() || null,
      email: email.trim() || null,
      servico,
      descricao: descricao.trim() || null,
      origem: 'portfolio_site',
      source: 'site',
      status: 'novo',
      score: calculatedScore,
    };

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadPayload])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar lead:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        setSubmitError('Não foi possível registrar sua solicitação. Tente novamente.');
        setLoading(false);
        return;
      }

      if (!data?.id) {
        setSubmitError('O cadastro não foi confirmado pelo servidor. Tente novamente.');
        setLoading(false);
        return;
      }

      setCreatedLead(data);
      setLoading(false);

      // Disparar confirmação de e-mail assincronamente
      if (email.trim()) {
        sendLeadConfirmation(nome.trim(), email.trim(), servico, `MT-${data.id.slice(0, 6)}`)
          .catch(err => console.error('[BudgetModal] Falha ao enviar email:', err));
      }

    } catch (err: any) {
      console.error('[BudgetModal] Exceção inesperada:', err);
      setSubmitError('Ocorreu um erro inesperado ao salvar seus dados. Tente novamente.');
      setLoading(false);
    }
  };

  const handleContinueWhatsApp = () => {
    if (!createdLead?.id) return;

    const leadDate = new Date(createdLead.created_at);
    const formattedDate = leadDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + leadDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const lines = [
      '🚀 NOVO LEAD — MUNIZ TECH',
      '',
      'Protocolo:',
      createdLead.id,
      '',
      'Nome:',
      createdLead.nome,
      '',
      'Empresa:',
      createdLead.empresa || 'Não informada',
      '',
      'Telefone:',
      createdLead.telefone || 'Não informado',
      '',
      'E-mail:',
      createdLead.email || 'Não informado',
      '',
      'Serviço:',
      createdLead.servico,
      '',
      'Descrição:',
      createdLead.descricao || 'Não informada',
      '',
      'Score:',
      createdLead.score,
      '',
      'Origem:',
      'www.muniztech.com.br',
      '',
      'Data:',
      formattedDate,
    ];

    const messageText = lines.join('\n');
    const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${encodeURIComponent(messageText)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setNome('');
    setEmpresa('');
    setTelefone('');
    setEmail('');
    setServico(SERVICES_OPTIONS[0]);
    setDescricao('');
    setCreatedLead(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Card Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden z-10 my-8"
        >
          {/* Header do Modal */}
          <div className="bg-slate-900 px-6 py-6 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary rounded-full font-black text-[10px] uppercase tracking-widest border border-secondary/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solicitação de Orçamento</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Vamos transformar sua ideia em <span className="text-secondary">resultado</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 font-label-bold">
              Preencha os dados abaixo para darmos início ao atendimento rápido via WhatsApp.
            </p>
          </div>

          {/* Body do Modal */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {createdLead ? (
              /* Tela de Sucesso */
              <div className="py-4 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-on-surface uppercase tracking-tight">
                    Solicitação registrada com sucesso!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-label-bold max-w-md mx-auto">
                    Obrigado! Recebemos sua solicitação. Clique no botão abaixo para darmos andamento no WhatsApp.
                  </p>
                </div>

                {/* Grid de Informações Premium */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                  <div className="flex items-start gap-2 text-xs font-label-bold text-on-surface-variant">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <div>
                      <span className="block font-black text-[10px] text-slate-400 uppercase">Tempo médio de resposta</span>
                      <span className="text-on-surface font-bold">Menos de 15 minutos</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-label-bold text-on-surface-variant">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <div>
                      <span className="block font-black text-[10px] text-slate-400 uppercase">Atendimento</span>
                      <span className="text-on-surface font-bold text-[11px]">Seg a Sex — 08:00 às 18:00</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-label-bold text-on-surface-variant sm:col-span-2 pt-2 border-t border-slate-100">
                    <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                    <div>
                      <span className="block font-black text-[10px] text-slate-400 uppercase">Número do protocolo</span>
                      <span className="font-mono font-black text-sm text-secondary truncate block max-w-xs">{createdLead.id}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleContinueWhatsApp}
                    disabled={!createdLead?.id}
                    className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/25 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="w-5 h-5" /> Continuar no WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              /* Formulário */
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                    {submitError}
                  </div>
                )}

                {/* Nome */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-secondary" /> Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome ou como prefere ser chamado"
                    className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                {/* Grid Empresa / Telefone / Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Empresa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-secondary" /> Empresa
                    </label>
                    <input
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Nome da sua empresa (opcional)"
                      className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-secondary" /> Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(61) 99999-9999"
                      className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-secondary" /> E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com.br"
                    className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                {/* Serviço desejado */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-black uppercase tracking-wider text-on-surface">
                    Serviço desejado <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SERVICES_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setServico(opt)}
                        className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border text-left transition-all ${
                          servico === opt
                            ? 'bg-secondary text-white border-secondary shadow-sm'
                            : 'bg-surface-container-low border-surface-container-high text-on-surface-variant hover:border-secondary/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-on-surface">
                    Descreva sua necessidade
                  </label>
                  <textarea
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Preciso integrar meu ERP com o WhatsApp ou desenvolver um portal web."
                    className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
                  />
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-1/3 h-12 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-black uppercase text-xs tracking-widest rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-2/3 h-12 bg-secondary hover:bg-secondary-fixed-variant text-white font-black uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-secondary/20 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Enviar Solicitação
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
