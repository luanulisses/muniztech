import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { record, table, type } = payload;

    // Apenas envia em caso de INSERT (nova postagem)
    if (type !== 'INSERT') {
       return new Response(JSON.stringify({ message: "Ignore update/delete" }), { status: 200 });
    }

    let message = "";
    let imageUrl = "";
    let buttonText = "🚀 Ver no Site";
    let buttonUrl = "";

    if (table === "deals") {
      imageUrl = record.image;
      buttonUrl = `https://www.muniztech.com.br/ofertas/${record.slug || record.id}`;
      message = `🔥 *OFERTA MONITORADA: ${record.title}*\n\n` +
                `💰 *Preço:* ${record.price}\n` +
                `📉 *Desconto:* ${record.discount}\n` +
                `🛒 *Loja:* ${record.store || 'Amazon'}\n\n` +
                `🔗 *Link:* ${buttonUrl}\n\n` +
                `✅ *MunizTech: O menor preço real.*`;
    } else if (table === "reviews") {
      imageUrl = record.image;
      buttonUrl = `https://www.muniztech.com.br/analises/${record.slug || record.id}`;
      message = `📝 *ANÁLISE NOVA: ${record.title}*\n\n` +
                `⭐ *Nota Muniz:* ${record.rating}/10\n` +
                `🧐 *Resumo:* ${record.excerpt}\n\n` +
                `🔗 *Leia a análise completa:* ${buttonUrl}`;
    }

    if (message) {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          photo: imageUrl,
          caption: message,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: buttonText, url: buttonUrl }]
            ]
          }
        }),
      });

      const result = await response.json();
      return new Response(JSON.stringify(result), { status: response.status });
    }

    return new Response(JSON.stringify({ message: "No content match" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
