import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getTicketRangeForService } from '@/config/commercial';

export interface AIAnalysisResult {
  ai_summary: string;
  ai_category: string;
  ai_score: number;
  ai_priority: 'baixa' | 'média' | 'alta' | 'crítica';
  classification: 'FRIO' | 'MORNO' | 'QUENTE' | 'PRIORITÁRIO';
  estimated_ticket_min: number;
  estimated_ticket_max: number;
  recommended_action: string;
  suggested_reply: string;
  ai_risks: string[];
  ai_opportunities: string[];
  ai_analyzed_at: string;
  ai_model: string;
  ai_analysis_version: string;
  isFallback?: boolean;
  source?: string;
}

/**
 * Invoca a Edge Function de análise de lead por IA ('muniz-lead-agent').
 * Utiliza fetch direto garantindo apikey (Anon Key) + Authorization (Bearer JWT do Usuário).
 */
export async function analyzeLeadWithAI(lead: any): Promise<AIAnalysisResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  // 1. Obter e Validar Sessão Ativa do Usuário
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token || !session.user?.id) {
    console.error('[AUTH ERROR] Sessão expirada ou não encontrada:', sessionError);
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  console.log('[AI USER ID]', session.user.id);
  console.log('[AI TOKEN PRESENT]', Boolean(session.access_token));

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 2. Invocar Edge Function muniz-lead-agent via Fetch Direto
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/muniz-lead-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        lead_id: lead.id,
      }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error('[AI EDGE ERROR]', responseBody);
      throw new Error(responseBody?.error || 'A análise não pôde ser concluída.');
    }

    if (!responseBody?.success || !responseBody?.analysis) {
      throw new Error('A IA não retornou uma análise válida.');
    }

    return {
      ...responseBody.analysis,
      isFallback: false,
      source: 'edge_function',
    };
  } catch (err: any) {
    // Se o fallback local estrito não estiver habilitado explicitamente, propagar a falha oficial
    const isFallbackEnabled = import.meta.env.VITE_ENABLE_AI_LOCAL_FALLBACK === 'true';
    if (!isFallbackEnabled) {
      throw new Error(err?.message || 'A análise não pôde ser concluída agora. Tente novamente em alguns instantes.');
    }

    console.warn('[aiAgent] Edge Function indisponível. VITE_ENABLE_AI_LOCAL_FALLBACK=true ativado. Gerando prévia local.');
  }

  // 3. Fallback de Prévia Local (Apenas em DEV se VITE_ENABLE_AI_LOCAL_FALLBACK === 'true')
  const ticketRange = getTicketRangeForService(lead.servico);
  const baseScore = Number(lead.score ?? 30);
  
  let calculatedScore = baseScore * 3;
  if (lead.empresa) calculatedScore += 5;
  if (lead.descricao && lead.descricao.length > 50) calculatedScore += 5;
  calculatedScore = Math.min(98, Math.max(25, calculatedScore));

  let priority: 'baixa' | 'média' | 'alta' | 'crítica' = 'média';
  let classification: 'FRIO' | 'MORNO' | 'QUENTE' | 'PRIORITÁRIO' = 'MORNO';

  if (calculatedScore >= 80) {
    priority = 'crítica';
    classification = 'PRIORITÁRIO';
  } else if (calculatedScore >= 60) {
    priority = 'alta';
    classification = 'QUENTE';
  } else if (calculatedScore >= 30) {
    priority = 'média';
    classification = 'MORNO';
  } else {
    priority = 'baixa';
    classification = 'FRIO';
  }

  const nowIso = new Date().toISOString();
  const leadFirstName = lead.nome ? lead.nome.split(' ')[0] : 'Cliente';

  return {
    ai_summary: `[PRÉVIA LOCAL] Interesse registrado em ${lead.servico}${lead.empresa ? ` para a empresa ${lead.empresa}` : ''}.`,
    ai_category: lead.servico,
    ai_score: calculatedScore,
    ai_priority: priority,
    classification,
    estimated_ticket_min: ticketRange.min,
    estimated_ticket_max: ticketRange.max,
    recommended_action: 'Entrar em contato via WhatsApp e agendar conversa inicial.',
    suggested_reply: `Olá, ${leadFirstName}! Tudo bem?\n\nSou o Luan Muniz da Muniz Tech. Vi que você solicitou informações sobre ${lead.servico}.\n\nEstou à disposição para apresentar a melhor solução para o seu negócio. Quando teria 10 minutos para conversarmos?`,
    ai_risks: ['Prévia gerada localmente sem gravação em banco de dados.'],
    ai_opportunities: [`Demanda na stack de ${lead.servico}`],
    ai_analyzed_at: nowIso,
    ai_model: 'preview-local-fallback',
    ai_analysis_version: 'v1.0-preview',
    isFallback: true,
    source: 'local_fallback',
  };
}
