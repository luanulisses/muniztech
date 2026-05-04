import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { encode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const WHATSAPP_API_URL = Deno.env.get("WHATSAPP_API_URL") || "";
const WHATSAPP_API_KEY = Deno.env.get("WHATSAPP_API_KEY") || "";
const WHATSAPP_INSTANCE = Deno.env.get("WHATSAPP_INSTANCE") || "";
const WHATSAPP_CHAT_ID = Deno.env.get("WHATSAPP_CHAT_ID") || "";

const TITLES = [
  "🔥 OFERTA RELÂMPAGO",
  "🚨 BAIXOU AGORA",
  "💥 PREÇO INSANO",
  "⚡ CORRE QUE ACABA",
  "🛒 SUPER OFERTA"
];

async function sendWhatsAppMessage(deal: any, isNiche: boolean, slug?: string) {
  console.log(`[WHATSAPP] Preparando envio para: ${deal.title}`);
  
  if (!WHATSAPP_API_URL || !WHATSAPP_API_KEY || !WHATSAPP_INSTANCE || !WHATSAPP_CHAT_ID) {
    console.error("[WHATSAPP] ERRO: Configuração ausente (URL, KEY, INSTANCE ou CHAT_ID)");
    return { success: false, error: "WhatsApp config missing" };
  }

  const linkUrl = isNiche && slug 
    ? `https://www.muniztech.com.br/ofertas/${slug}` 
    : deal.affiliate_link;
    
  const randomTitle = TITLES[Math.floor(Math.random() * TITLES.length)];

  const message = `${randomTitle} \n\n` +
            `🛍 *${deal.title}*\n\n` +
            `💰 *Por apenas: ${deal.price}*\n` +
            `📉 *Desconto: ${deal.discount}*\n` +
            `🏪 *Loja: ${deal.platform || deal.store}*\n\n` +
            `⚡ *Aproveite agora:* \n` +
            `${linkUrl}\n\n` +
            `_Preço sujeito a alteração a qualquer momento._`;

  const headers = { 
    "Content-Type": "application/json",
    "apikey": WHATSAPP_API_KEY,
    "Bypass-Tunnel-Reminder": "true",
    "ngrok-skip-browser-warning": "true"
  };

  const doFetch = async (endpoint: string, bodyObj: any, tag: string = "") => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyObj),
      });
      const status = response.status;
      const textResult = await response.text();
      
      if (status >= 200 && status < 300) {
        return { success: true, status, data: textResult };
      } else {
        return { success: false, status, error: textResult };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  let base64Str = "";
  if (deal.image && typeof deal.image === 'string') {
     const img = deal.image.trim();
     if (img.startsWith('https://') && !img.includes('placeholder') && !img.includes('fake')) {
         try {
           const res = await fetch(img, {
             headers: { "User-Agent": "Mozilla/5.0" }
           });
           if (res.ok) {
             const contentType = res.headers.get("content-type");
             if (contentType && contentType.startsWith("image/")) {
                const arrayBuffer = await res.arrayBuffer();
                if (arrayBuffer.byteLength > 0) {
                    base64Str = encode(new Uint8Array(arrayBuffer));
                }
             }
           }
         } catch(e: any) {}
     }
  }

  // Envio de Mídia Base64 Puro
  if (base64Str) {
    const endpointMedia = `${WHATSAPP_API_URL}/message/sendMedia/${WHATSAPP_INSTANCE}`;
    const bodyMedia = {
      number: WHATSAPP_CHAT_ID,
      mediatype: "image",
      media: base64Str,
      caption: message,
      delay: 1200
    };
    
    const resMedia = await doFetch(endpointMedia, bodyMedia, "MEDIA");
    if (resMedia.success) return resMedia;
  }

  // Fallback Texto
  const endpointText = `${WHATSAPP_API_URL}/message/sendText/${WHATSAPP_INSTANCE}`;
  const bodyText = {
    number: WHATSAPP_CHAT_ID,
    text: message,
    delay: 1200
  };

  return await doFetch(endpointText, bodyText, "TEXTO");
}

serve(async (req: Request) => {
  try {
    const now = new Date();
    // Converter para BRT (UTC-3) para exibição do log
    const brtLogTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    console.log(`\n=================================================`);
    console.log(`[SCHEDULER START] Função invocada em: ${brtLogTime.toLocaleString('pt-BR')} (BRT)`);
    console.log(`[SCHEDULER START] Método HTTP: ${req.method}`);
    console.log(`=================================================\n`);

    // Validar Horário BRT
    const brtTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    const hours = brtTime.getUTCHours();
    
    if (hours < 9 || hours >= 22) {
      console.log(`[SCHEDULER] Fora do horário de envio (${hours}h BRT).`);
      return new Response(JSON.stringify({ message: "Fora do horário de envio" }), { status: 200 });
    }

    // 1. Anti-Spam: Verificar tempo desde o último envio global
    const isPeakHour = hours >= 18 && hours < 22;
    const minInterval = isPeakHour ? 6 : 10;

    const { data: lastGlobalList } = await supabase
      .from("bot_offers")
      .select("last_posted_at, platform, category")
      .eq("was_sent_whatsapp", true)
      .not("last_posted_at", "is", null)
      .order("last_posted_at", { ascending: false })
      .limit(3);

    const lastOne = lastGlobalList?.[0];
    let minutesSinceLast = 999;

    if (lastOne) {
      const lastTime = new Date(lastOne.last_posted_at).getTime();
      minutesSinceLast = Math.floor((now.getTime() - lastTime) / (1000 * 60));
    }

    console.log(`[SCHEDULER] Horário de pico: ${isPeakHour ? 'SIM' : 'NÃO'}`);
    console.log(`[SCHEDULER] Intervalo mínimo aplicado: ${minInterval} minutos`);
    console.log(`[SCHEDULER] Tempo desde último envio: ${minutesSinceLast} minutos`);

    if (minutesSinceLast < minInterval) {
      console.log(`[SCHEDULER] Abortando! O intervalo mínimo no momento é de ${minInterval} minutos.`);
      return new Response(JSON.stringify({ message: "Intervalo anti-spam ativo" }), { status: 200 });
    }

    // 2. Rotação: Manual -> Shopee -> Awin
    const lastRotation = lastGlobalList?.map(d => d.category === 'manual' ? 'manual' : d.platform) || [];
    console.log(`[SCHEDULER] Últimas 3 plataformas/categorias enviadas: ${lastRotation.join(" -> ") || "Nenhuma"}`);

    const lastCat = lastRotation[0];
    let targetOrder = [];
    if (lastCat === 'manual') {
      targetOrder = ['Shopee', 'Awin', 'manual'];
    } else if (lastCat === 'Shopee') {
      targetOrder = ['Awin', 'manual', 'Shopee'];
    } else {
      targetOrder = ['manual', 'Shopee', 'Awin'];
    }

    console.log(`[SCHEDULER] Vez atual da rotação: ${targetOrder[0]}`);

    function getQualityDiscardReason(deal: any) {
        if (!deal.title || deal.title.length < 5) return "Título muito curto";
        if (!deal.image || deal.image.trim() === "") return "Sem imagem";
        if (!deal.affiliate_link || deal.affiliate_link.trim() === "") return "Sem link afiliado";
        if (!deal.price || deal.price.trim() === "") return "Preço vazio";
        if ((deal.score || 0) < 30) return `Score baixo (${deal.score})`;
        return null;
    }

    async function findOfferByType(type: string) {
       const isManual = type === 'manual';
       
       // 1. Tenta Nova
       let query = supabase.from("bot_offers").select("*").eq("status", "pending").eq("was_sent_whatsapp", false);
       if (isManual) {
         query = query.eq("category", "manual");
       } else {
         query = query.eq("platform", type).neq("category", "manual");
       }
       
       const { data: news } = await query.order("score", { ascending: false }).limit(5);
       if (news && news.length > 0) {
         for (const d of news) {
           const reason = getQualityDiscardReason(d);
           if (!reason) return { deal: d, isLoop: false };
           await supabase.from("bot_offers").update({ status: "rejected" }).eq("id", d.id);
         }
       }

       // 2. Tenta Loop
       const todayMidnight = new Date(brtTime);
       todayMidnight.setUTCHours(0,0,0,0);
       const todayIso = new Date(todayMidnight.getTime() + (3 * 60 * 60 * 1000)).toISOString();
       const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000)).toISOString();

       let loopQuery = supabase.from("bot_offers").select("*").eq("status", "posted").eq("was_sent_whatsapp", true)
         .lt("send_count", 3).lt("last_posted_at", twoHoursAgo).gte("created_at", todayIso);
       
       if (isManual) {
         loopQuery = loopQuery.eq("category", "manual");
       } else {
         loopQuery = loopQuery.eq("platform", type).neq("category", "manual");
       }

       const { data: loops } = await loopQuery.order("score", { ascending: false }).limit(5);
       if (loops && loops.length > 0) {
         for (const d of loops) {
           const reason = getQualityDiscardReason(d);
           if (!reason) return { deal: d, isLoop: true };
           await supabase.from("bot_offers").update({ status: "rejected_loop" }).eq("id", d.id);
         }
       }
       return null;
    }

    let selected = null;
    for (const type of targetOrder) {
      selected = await findOfferByType(type);
      if (selected) {
        if (type === 'manual' && lastCat === 'manual') {
          console.log(`[SCHEDULER] Enviando manual seguida pois Shopee/Awin estão vazias.`);
        }
        break;
      }
    }

    if (!selected) {
      console.log(`[SCHEDULER] Nenhuma oferta válida encontrada em nenhuma plataforma/categoria.`);
      return new Response(JSON.stringify({ message: "Nenhuma oferta na fila." }), { status: 200 });
    }

    const { deal, isLoop } = selected;

    console.log(`[SCHEDULER] Selecionado: "${deal.title}" (${deal.platform} / ${deal.category})`);
    console.log(`[SCHEDULER] Tipo: ${isLoop ? "loop" : "nova oferta"}`);
    console.log(`[SCHEDULER] Score Final: ${deal.score}`);

    // 3. Fluxo de Blog / Slug
    let slug = "";
    let publishedBlog = false;

    if (deal.is_niche) {
      // Verificar se já existe no blog pelo link
      const { data: existingDeal } = await supabase
        .from("deals")
        .select("slug")
        .eq("link", deal.affiliate_link)
        .limit(1);

      if (existingDeal && existingDeal.length > 0) {
          console.log(`[SCHEDULER] Reutilizando slug: ${existingDeal[0].slug}`);
          slug = existingDeal[0].slug;
          publishedBlog = true;
      } else if (!isLoop) {
          // Gerar slug seguro e único para novas ofertas de nicho
          const baseTitle = deal.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").substring(0, 40);
          const shortId = (deal.external_id || Math.random().toString(36).substring(7)).substring(0, 6);
          slug = `${baseTitle}-${shortId}`;
          
          const { error: postError } = await supabase.from("deals").insert({
            title: deal.title,
            image: deal.image,
            price: deal.price,
            original_price: deal.original_price,
            discount: deal.discount,
            store: deal.platform,
            link: deal.affiliate_link,
            category: deal.category,
            slug: slug
          });

          if (postError) {
            if (postError.code === "23505" || postError.message.includes("duplicate key")) {
                console.warn(`[SCHEDULER] Slug duplicado. Usando link direto.`);
                slug = ""; 
            } else {
                console.error(`[SCHEDULER] Erro blog:`, postError.message);
            }
          } else {
            publishedBlog = true;
          }
      }
    }

    // 4. Disparar WhatsApp
    const waResult = await sendWhatsAppMessage(deal, deal.is_niche, slug);

    if (waResult && waResult.success) {
      await supabase.from("bot_offers").update({
        status: "posted",
        was_sent_whatsapp: true,
        was_published_blog: publishedBlog || deal.was_published_blog,
        send_count: (deal.send_count || 0) + 1,
        last_posted_at: new Date().toISOString()
      }).eq("id", deal.id);

      console.log(`[SCHEDULER] Enviado com sucesso!`);
      return new Response(JSON.stringify({ success: true, deal: deal.title }), { status: 200 });
    } else {
      console.error(`[SCHEDULER] Erro WhatsApp:`, waResult?.error);
      return new Response(JSON.stringify({ error: "Falha Evolution API" }), { status: 500 });
    }

  } catch (error: any) {
    console.error(`[SCHEDULER] EXCEPTION:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
