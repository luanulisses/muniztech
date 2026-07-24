// ══════════════════════════════════════════════════════════════════════════════
// SUPABASE EDGE FUNCTION: muniz-notification-service (Sprint 3.2.3 — Fine-tuned Logo & Email)
// URL Pública da Logo: https://www.muniztech.com.br/muniztech-email-logo.png
// Fallback Textual: MUNIZ TECH • AUTOMAÇÃO INTELIGENTE
// ══════════════════════════════════════════════════════════════════════════════

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = 'luan.ulisses@muniztech.com.br';

function buildClientHtmlEmail(params: {
  nome: string;
  servico: string;
  empresa: string;
  objetivo: string;
  prioridade: string;
  ticket: string;
  linkWhatsapp: string;
}): string {
  const { nome, servico, empresa, objetivo, prioridade, ticket, linkWhatsapp } = params;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Muniz Tech — Solicitação Recebida</title>
</head>
<body style="margin:0;padding:0;background:#040D1A;font-family:Arial,Helvetica,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#040D1A;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card Principal -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:#07111F;border-radius:20px;overflow:hidden;border:1px solid #0E2A45;">

          <!-- ── HEADER ─────────────────────────────────────────────────────── -->
          <tr>
            <td style="background:#081426;padding:40px 40px 30px;text-align:center;border-bottom:1px solid #0E2A45;">

              <!-- Logo Pública via muniztech-email-logo.png -->
              <img
                src="https://www.muniztech.com.br/muniztech-email-logo.png"
                alt="Muniz Tech"
                width="180"
                style="display:block;margin:0 auto;border:0;max-width:100%;height:auto;"
              />

              <!-- Fallback Textual visível mesmo com imagens desabilitadas -->
              <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#00D9FF;margin-top:12px;text-align:center;letter-spacing:1px;">
                MUNIZ TECH
              </div>
              <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#00D26A;margin-top:4px;text-align:center;letter-spacing:2px;text-transform:uppercase;">
                AUTOMAÇÃO INTELIGENTE
              </div>

              <p style="color:#3A6080;margin:8px 0 0;font-size:12px;">
                Tecnologia &bull; ERP &bull; Oracle &bull; IA &bull; Automação
              </p>
            </td>
          </tr>

          <!-- ── SAUDAÇÃO ───────────────────────────────────────────────────── -->
          <tr>
            <td style="padding:40px 40px 0;">
              <h1 style="margin:0 0 16px;font-size:26px;color:#00D26A;font-weight:900;">
                Olá, ${nome}!
              </h1>
              <p style="margin:0;font-size:15px;line-height:1.8;color:#C8DCF0;">
                Obrigado por entrar em contato com a <strong style="color:#ffffff;">Muniz Tech</strong>.<br />
                Recebemos sua solicitação sobre <strong style="color:#00D9FF;">${servico}</strong> e ela já foi registrada
                em nosso CRM com <strong style="color:#00D26A;">qualificação automática por IA</strong>.
              </p>
            </td>
          </tr>

          <!-- ── CARD DE RESUMO ─────────────────────────────────────────────── -->
          <tr>
            <td style="padding:30px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0B1B2F;border-radius:14px;border-left:4px solid #00D26A;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px;font-size:16px;font-weight:800;color:#00D26A;text-transform:uppercase;letter-spacing:1px;">
                      Resumo da Solicitação
                    </p>

                    <!-- Linha: Empresa -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:10px;">
                      <tr>
                        <td width="120" style="font-size:13px;color:#4A7090;font-weight:700;padding-bottom:6px;">Empresa</td>
                        <td style="font-size:13px;color:#E0EAF6;font-weight:600;padding-bottom:6px;">${empresa}</td>
                      </tr>
                      <tr>
                        <td width="120" style="font-size:13px;color:#4A7090;font-weight:700;padding-bottom:6px;">Serviço</td>
                        <td style="font-size:13px;color:#E0EAF6;font-weight:600;padding-bottom:6px;">${servico}</td>
                      </tr>
                      <tr>
                        <td width="120" style="font-size:13px;color:#4A7090;font-weight:700;padding-bottom:6px;">Objetivo</td>
                        <td style="font-size:13px;color:#E0EAF6;font-weight:600;padding-bottom:6px;">${objetivo}</td>
                      </tr>
                      <tr>
                        <td width="120" style="font-size:13px;color:#4A7090;font-weight:700;padding-bottom:6px;">Prioridade</td>
                        <td style="font-size:13px;padding-bottom:6px;">
                          <span style="
                            background:#00D26A20;
                            color:#00D26A;
                            border:1px solid #00D26A50;
                            border-radius:6px;
                            padding:2px 10px;
                            font-size:12px;
                            font-weight:800;
                            text-transform:uppercase;
                          ">${prioridade}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="120" style="font-size:13px;color:#4A7090;font-weight:700;">Ticket Estimado</td>
                        <td style="font-size:14px;color:#00D9FF;font-weight:800;">${ticket}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── STATUS STEPS ───────────────────────────────────────────────── -->
          <tr>
            <td style="padding:0 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0B1B2F;border-radius:14px;border-left:4px solid #00D9FF;">
                <tr>
                  <td style="padding:22px 28px;">
                    <p style="margin:0 0 14px;font-size:14px;font-weight:800;color:#00D9FF;text-transform:uppercase;letter-spacing:1px;">
                      Status do Atendimento
                    </p>
                    <p style="margin:0 0 8px;font-size:13px;color:#C8DCF0;">
                      <span style="color:#00D26A;font-weight:700;margin-right:8px;">✔</span> Solicitação registrada no CRM
                    </p>
                    <p style="margin:0 0 8px;font-size:13px;color:#C8DCF0;">
                      <span style="color:#00D26A;font-weight:700;margin-right:8px;">✔</span> IA realizou a qualificação preditiva
                    </p>
                    <p style="margin:0 0 8px;font-size:13px;color:#C8DCF0;">
                      <span style="color:#00D26A;font-weight:700;margin-right:8px;">✔</span> Equipe comercial notificada
                    </p>
                    <p style="margin:0;font-size:13px;color:#C8DCF0;">
                      <span style="color:#00D26A;font-weight:700;margin-right:8px;">✔</span> Nossa equipe foi notificada e retornará <strong style="color:#ffffff;">assim que possível</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── CTA PREMIUM ────────────────────────────────────────────────── -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <a href="${linkWhatsapp}"
                 target="_blank"
                 style="
                   display:inline-block;
                   background:#00D26A;
                   color:#ffffff;
                   text-decoration:none;
                   padding:20px 44px;
                   border-radius:14px;
                   font-size:17px;
                   font-weight:900;
                   letter-spacing:0.5px;
                   box-shadow:0 0 30px rgba(0,210,106,0.45), 0 4px 20px rgba(0,210,106,0.25);
                   text-transform:uppercase;
                 "
              >
                🚀 FALAR COM LUAN AGORA
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#4A7090;">
                Ou responda este e-mail para continuar o atendimento.
              </p>
            </td>
          </tr>

          <!-- ── FOOTER ─────────────────────────────────────────────────────── -->
          <tr>
            <td style="background:#050C18;padding:24px 40px;text-align:center;border-top:1px solid #0E2A45;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:800;color:#C8DCF0;">
                Muniz Tech
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#3A6080;">
                ERP Senior &bull; Oracle &bull; Inteligência Artificial &bull; Dashboards &bull; SaaS
              </p>
              <p style="margin:0;font-size:12px;">
                🌐 <a href="https://www.muniztech.com.br" style="color:#00D9FF;text-decoration:none;">www.muniztech.com.br</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: jsonHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor indisponível.' }),
        { status: 500, headers: jsonHeaders }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const body = await req.json();
    const { lead_id, nome, email, servico, empresa, descricao, min, max, score, priority } = body;

    if (!nome || !servico) {
      return new Response(
        JSON.stringify({ error: 'Campos nome e servico são obrigatórios.' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const formattedMin = min ? `R$ ${Number(min).toLocaleString('pt-BR')}` : 'R$ 5.000';
    const formattedMax = max ? `R$ ${Number(max).toLocaleString('pt-BR')}` : 'R$ 20.000';
    const ticketText = `${formattedMin} ~ ${formattedMax}`;
    const empresaText = empresa ? empresa : 'Não informada';
    const objetivoText = descricao ? descricao : 'Não informado';
    const prioridadeText = priority ? String(priority).toUpperCase() : 'ALTA';

    // Gerar Link do WhatsApp formatado
    const waMsg = `Olá Luan!\nAcabei de receber o e-mail de confirmação da Muniz Tech.\n\nResumo:\n- Nome: ${nome}\n- Serviço: ${servico}\n- Empresa: ${empresaText}`;
    const linkWhatsapp = `https://wa.me/5561998274390?text=${encodeURIComponent(waMsg)}`;

    // Template HTML Premium para o Cliente
    const clientSubject = nome
      ? `Olá, ${nome.split(' ')[0]}! Sua solicitação foi recebida com sucesso.`
      : '🚀 Recebemos sua solicitação na Muniz Tech!';

    const clientHtml = buildClientHtmlEmail({
      nome,
      servico,
      empresa: empresaText,
      objetivo: objetivoText,
      prioridade: prioridadeText,
      ticket: ticketText,
      linkWhatsapp,
    });

    const clientBodyText = `Olá, ${nome}!
Obrigado por entrar em contato com a Muniz Tech.
Recebemos sua solicitação sobre ${servico}.

Resumo:
- Empresa: ${empresaText}
- Serviço: ${servico}
- Objetivo: ${objetivoText}
- Prioridade: ${prioridadeText}
- Ticket Estimado: ${ticketText}

WhatsApp: ${linkWhatsapp}`;

    // Template Texto para o Admin (Luan)
    const adminSubject = `[NOVO LEAD] ${nome} — ${servico}`;
    const adminBodyText = `🔥 NOVO LEAD QUALIFICADO PELA MUNIZ AI

Nome: ${nome}
Empresa: ${empresaText}
E-mail: ${email || 'Não informado'}
Serviço: ${servico}
Objetivo: ${objetivoText}
Score de Qualificação: ${score || 85}/100
Prioridade: ${prioridadeText}
Ticket Estimado: ${ticketText}

---
Gerado automaticamente pelo Muniz AI Sales Assistant v1.0`;

    // Disparo via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailStatus = 'simulated';
    let emailError: string | null = null;

    if (resendApiKey) {
      try {
        if (email && email.includes('@')) {
          const clientRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'Muniz Tech <contato@muniztech.com.br>',
              to: [email],
              subject: clientSubject,
              html: clientHtml,
              text: clientBodyText,
            }),
          });

          if (!clientRes.ok) {
            const errText = await clientRes.text();
            console.warn('[muniz-notification-service] Resend client email error:', errText);
          }
        }

        const adminRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Muniz AI <notificacoes@muniztech.com.br>',
            to: [ADMIN_EMAIL],
            subject: adminSubject,
            text: adminBodyText,
          }),
        });

        if (!adminRes.ok) {
          const errText = await adminRes.text();
          console.warn('[muniz-notification-service] Resend admin email error:', errText);
          emailStatus = 'partial';
          emailError = errText.slice(0, 300);
        } else {
          emailStatus = 'sent';
        }
      } catch (err: any) {
        console.warn('[muniz-notification-service] Erro ao enviar e-mail via Resend:', err);
        emailStatus = 'failed';
        emailError = err.message || 'Erro desconhecido';
      }
    } else {
      console.warn('[muniz-notification-service] RESEND_API_KEY não configurada — modo simulado.');
    }

    const logsToInsert: any[] = [
      {
        lead_id: lead_id || null,
        recipient_email: ADMIN_EMAIL,
        recipient_type: 'admin',
        subject: adminSubject,
        body_text: adminBodyText,
        status: emailStatus,
        error_message: emailError,
      },
    ];

    if (email && email.includes('@')) {
      logsToInsert.unshift({
        lead_id: lead_id || null,
        recipient_email: email,
        recipient_type: 'client',
        subject: clientSubject,
        body_text: clientBodyText,
        status: emailStatus,
        error_message: emailError,
      });
    }

    await adminClient.from('notification_logs').insert(logsToInsert);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'E-mail de notificação processado com sucesso.',
        status: emailStatus,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error: any) {
    console.error('[muniz-notification-service] Erro crítico:', error?.message || error);
    return new Response(
      JSON.stringify({ error: 'Falha ao processar e-mail de notificação.' }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
