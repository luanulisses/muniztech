// ══════════════════════════════════════════════════════════════════════════════
// LINKS — Helpers para URLs de contato (WhatsApp, E-mail) e envio de notificações
// ══════════════════════════════════════════════════════════════════════════════

import { SITE_CONFIG } from './site';

// ── Mensagens ────────────────────────────────────────────────────────────────

const BUDGET_MESSAGE =
  "Olá Luan! Vim pelo site da Muniz Tech e gostaria de solicitar um orçamento.";

const PROJECT_MESSAGE =
  "Olá Luan! Vi seu portfólio e gostaria de conversar sobre um projeto.";

// ── WhatsApp ─────────────────────────────────────────────────────────────────

/** URL do WhatsApp para solicitar orçamento */
export function getWhatsAppBudgetUrl(): string {
  const msg = encodeURIComponent(BUDGET_MESSAGE);
  return `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${msg}`;
}

/** URL do WhatsApp para conversar sobre um projeto */
export function getWhatsAppProjectUrl(): string {
  const msg = encodeURIComponent(PROJECT_MESSAGE);
  return `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${msg}`;
}

// ── E-mail ───────────────────────────────────────────────────────────────────

/** URL mailto para solicitar orçamento */
export function getEmailUrl(subject?: string): string {
  const s = encodeURIComponent(subject ?? 'Solicitação de Orçamento — Muniz Tech');
  return `mailto:${SITE_CONFIG.owner.email}?subject=${s}`;
}

// ── Confirmação de E-mail Automática ─────────────────────────────────────────

/**
 * Simula ou envia uma confirmação de lead via e-mail.
 * No ambiente frontend puro, isso é registrado no console de desenvolvimento
 * preparando para uma futura integração SMTP ou webhook de disparo (Resend/SendGrid).
 */
export async function sendLeadConfirmation(nome: string, email: string, servico: string, protocol: string): Promise<boolean> {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
  SIMULAÇÃO DE DISPARO DE E-MAIL CONFIRMAÇÃO
  Para: ${email}
  Assunto: Recebemos sua solicitação!
  
  Mensagem:
  Olá ${nome}.
  
  Recebemos sua solicitação referente ao serviço:
  ${servico}
  
  Número:
  ${protocol}
  
  Em breve entraremos em contato.
  
  Equipe Muniz Tech.
╚══════════════════════════════════════════════════════════════════════╝
  `);

  // Se houver necessidade futura de disparar para um endpoint real:
  // try {
  //   await fetch('https://api.muniztech.com.br/leads/confirm', { method: 'POST', body: JSON.stringify({ nome, email, servico, protocol }) });
  // } catch(e) {}

  return true;
}
