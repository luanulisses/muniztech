import { useState } from 'react';
import { Lead } from '@/hooks/useLeads';
import { analyzeLeadWithAI, AIAnalysisResult } from '@/lib/aiAgent';
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Check,
  Copy,
  MessageSquare,
  RefreshCw,
  Loader2,
  DollarSign,
  Calendar,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface LeadAIAnalysisProps {
  lead: Lead;
  onAnalysisUpdated?: () => void;
}

export default function LeadAIAnalysis({ lead, onAnalysisUpdated }: LeadAIAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<Partial<Lead & { isFallback?: boolean }>>(lead);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await analyzeLeadWithAI(lead);
      setLocalAnalysis((prev) => ({
        ...prev,
        ...res,
      }));
      if (!res.isFallback && onAnalysisUpdated) {
        onAnalysisUpdated();
      }
    } catch (err: any) {
      console.error('[LeadAIAnalysis] Erro ao analisar:', err);
      setErrorMsg(err?.message || 'A análise não pôde ser concluída agora. Tente novamente em alguns instantes.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyReply = () => {
    const textToCopy = localAnalysis.suggested_reply || '';
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatPhoneNumber = (phoneStr?: string | null) => {
    if (!phoneStr) return null;
    const clean = phoneStr.replace(/\D/g, '');
    if (clean.length < 10) return null;
    if (clean.startsWith('55')) return clean;
    return `55${clean}`;
  };

  const formattedPhone = formatPhoneNumber(localAnalysis.telefone);

  const handleOpenWhatsApp = () => {
    if (!formattedPhone || !localAnalysis.suggested_reply) return;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(localAnalysis.suggested_reply)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getClassificationBadge = (score: number) => {
    if (score >= 80) return { label: 'PRIORITÁRIO', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (score >= 60) return { label: 'QUENTE', bg: 'bg-red-100 text-red-800 border-red-200' };
    if (score >= 30) return { label: 'MORNO', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'FRIO', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const getPriorityBadge = (p?: string) => {
    switch (p) {
      case 'crítica':
        return { label: 'Prioridade Crítica', bg: 'bg-red-500 text-white' };
      case 'alta':
        return { label: 'Prioridade Alta', bg: 'bg-orange-500 text-white' };
      case 'média':
        return { label: 'Prioridade Média', bg: 'bg-amber-500 text-white' };
      default:
        return { label: 'Prioridade Baixa', bg: 'bg-slate-400 text-white' };
    }
  };

  const hasAnalysis = Boolean(localAnalysis.ai_analyzed_at);
  const score = localAnalysis.ai_score ?? 0;
  const classBadge = getClassificationBadge(score);
  const priorityBadge = getPriorityBadge(localAnalysis.ai_priority);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Agente */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/30 text-secondary flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">IA Comercial Muniz Tech</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-secondary/20 text-secondary border border-secondary/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-label-bold">
              Qualificação preditiva, análise de riscos e recomendação de próxima ação.
            </p>
          </div>
        </div>

        {/* Botão de Disparo */}
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="h-11 px-5 bg-secondary hover:bg-secondary-fixed-variant text-white font-black uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20 cursor-pointer disabled:opacity-50 active:scale-95"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analisando Lead...
            </>
          ) : hasAnalysis ? (
            <>
              <RefreshCw className="w-4 h-4" /> Analisar novamente
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Analisar com IA
            </>
          )}
        </button>
      </div>

      {/* Banner de aviso para Prévia Local */}
      {localAnalysis.isFallback && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-2xl flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Prévia local. Esta análise não foi gerada pela IA de produção.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold rounded-2xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Conteúdo da Análise */}
      {hasAnalysis ? (
        <div className="space-y-6 relative z-10 text-xs font-sans">
          {/* Top Cards: Score, Classificação & Ticket Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Score & Classificação */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score & Classificação</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-white">{score} <span className="text-xs text-slate-400 font-normal">/100</span></div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${classBadge.bg}`}>
                  {classBadge.label}
                </span>
              </div>
            </div>

            {/* Prioridade */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nível de Prioridade</div>
              <div>
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${priorityBadge.bg}`}>
                  {priorityBadge.label}
                </span>
              </div>
            </div>

            {/* Ticket Estimado */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Ticket Comercial Estimado
              </div>
              <div className="text-sm font-black text-emerald-400">
                R$ {Number(localAnalysis.estimated_ticket_min || 0).toLocaleString('pt-BR')} — R$ {Number(localAnalysis.estimated_ticket_max || 0).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Resumo & Categoria */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Resumo Estratégico da Necessidade
              </div>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-black uppercase">
                Categoria: {localAnalysis.ai_category || lead.servico}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-label-bold text-xs sm:text-sm">
              {localAnalysis.ai_summary}
            </p>
          </div>

          {/* Ação Recomendada */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-5 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Próxima Ação Recomendada
            </div>
            <p className="text-white font-bold text-xs sm:text-sm leading-relaxed">
              {localAnalysis.recommended_action}
            </p>
          </div>

          {/* Riscos e Oportunidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Oportunidades */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Oportunidades Mapeadas
              </div>
              <ul className="space-y-1.5">
                {(localAnalysis.ai_risks || []).length > 0 ? (
                  (localAnalysis.ai_opportunities || []).map((opp: string, i: number) => (
                    <li key={i} className="text-emerald-200 text-xs flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      <span>{opp}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 text-xs font-normal">Nenhuma oportunidade identificada.</li>
                )}
              </ul>
            </div>

            {/* Riscos */}
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Riscos & Atenção
              </div>
              <ul className="space-y-1.5">
                {(localAnalysis.ai_risks || []).length > 0 ? (
                  (localAnalysis.ai_risks || []).map((risk: string, i: number) => (
                    <li key={i} className="text-amber-200 text-xs flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 text-xs font-normal">Nenhum risco relevante.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Resposta Sugerida para o Cliente */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-secondary" /> Resposta Sugerida para WhatsApp
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Não enviado automaticamente</span>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {localAnalysis.suggested_reply}
            </div>

            {/* Botões de Ação para Resposta */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleCopyReply}
                className="w-full sm:w-auto h-10 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Resposta copiada!' : 'Copiar resposta sugerida'}
              </button>

              <button
                onClick={handleOpenWhatsApp}
                disabled={!formattedPhone}
                className="w-full sm:w-auto h-10 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#25D366]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                title={!formattedPhone ? 'Telefone inválido ou não informado' : 'Abrir conversa no WhatsApp'}
              >
                <MessageSquare className="w-4 h-4" />
                {formattedPhone ? 'Abrir no WhatsApp' : 'Telefone inválido ou não informado'}
              </button>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Analisado em: {new Date(localAnalysis.ai_analyzed_at!).toLocaleString('pt-BR')}
            </span>
            <span>Modelo: {localAnalysis.ai_model || 'gemini-3.6-flash'}</span>
          </div>
        </div>
      ) : (
        /* Card Sem Análise */
        <div className="py-8 text-center space-y-3 text-slate-400">
          <Sparkles className="w-8 h-8 text-secondary/40 mx-auto animate-pulse" />
          <p className="text-xs font-label-bold">
            Clique em "Analisar com IA" para gerar a qualificação preditiva, ticket estimado e resposta sugerida.
          </p>
        </div>
      )}
    </div>
  );
}
