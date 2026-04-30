import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const WHATSAPP_API_URL = Deno.env.get("WHATSAPP_API_URL") || "";
const WHATSAPP_API_KEY = Deno.env.get("WHATSAPP_API_KEY") || "";
const WHATSAPP_INSTANCE = Deno.env.get("WHATSAPP_INSTANCE") || "";
const WHATSAPP_CHAT_ID = Deno.env.get("WHATSAPP_CHAT_ID") || "";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { record, table, type } = payload;

    // Apenas envia em caso de INSERT (nova postagem)
    if (type !== 'INSERT') {
       return new Response(JSON.stringify({ message: "Ignore update/delete" }), { status: 200 });
    }

    if (!WHATSAPP_API_URL || !WHATSAPP_API_KEY || !WHATSAPP_INSTANCE) {
      return new Response(JSON.stringify({ error: "WhatsApp config missing" }), { status: 500 });
    }

    let message = "";
    let imageUrl = "";
    let linkUrl = "";

    if (table === "deals") {
      imageUrl = record.image;
      linkUrl = `https://www.muniztech.com.br/ofertas/${record.slug || record.id}`;
      
      message = `🔥 *OFERTA RELÂMPAGO* \n\n` +
                `🛍 *${record.title}*\n\n` +
                `💰 *Por apenas: ${record.price}*\n` +
                `📉 *Desconto: ${record.discount}*\n` +
                `🏪 *Loja: ${record.store || 'Shopee'}*\n\n` +
                `⚡ *Aproveite agora:* \n` +
                `${linkUrl}\n\n` +
                `_Preço sujeito a alteração a qualquer momento._`;
    }

    if (message) {
      const endpoint = imageUrl 
        ? `${WHATSAPP_API_URL}/message/sendMedia/${WHATSAPP_INSTANCE}`
        : `${WHATSAPP_API_URL}/message/sendText/${WHATSAPP_INSTANCE}`;

      const body: any = {
        number: WHATSAPP_CHAT_ID,
        delay: 1200,
      };

      if (imageUrl) {
        body.mediatype = "image";
        body.caption = message;
        body.media = imageUrl;
      } else {
        body.text = message;
      }

      console.log(`Enviando para: ${endpoint}`);
      console.log(`Payload:`, JSON.stringify(body));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "apikey": WHATSAPP_API_KEY,
          "Bypass-Tunnel-Reminder": "true",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(body),
      });

      const textResult = await response.text();
      console.log(`Status da API (Evolution/Localtunnel): ${response.status}`);
      console.log(`Resposta bruta:`, textResult);

      let result = {};
      try { 
        result = JSON.parse(textResult); 
      } catch(e) {
        console.log("A resposta não é JSON (Pode ser uma página de erro do Localtunnel).");
      }

      return new Response(JSON.stringify(result || { raw: textResult }), { status: response.status });
    }

    return new Response(JSON.stringify({ message: "No content match" }), { status: 200 });
  } catch (error: any) {
    console.error("ERRO FATAL:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
