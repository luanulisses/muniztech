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
      buttonText = "🔥 VER OFERTA AGORA";
      message = `🔥 <b>OFERTA RELÂMPAGO</b>\n\n` +
                `🎧 <b>${record.title}</b>\n\n` +
                `💰 <b>Por apenas: ${record.price}</b>\n` +
                `📉 <b>Desconto: ${record.discount}</b>\n` +
                `🏪 <b>Loja: ${record.store || 'Amazon'}</b>\n\n` +
                `⚡ Preço pode mudar a qualquer momento\n\n` +
                `👉 <b>Aproveite agora:</b>\n` +
                `${buttonUrl}\n\n` +
                `#oferta #muniztech #tecnologia #${record.category?.toLowerCase().replace(/\s+/g, '') || 'desconto'}`;
    } else if (table === "reviews") {
      imageUrl = record.image;
      buttonUrl = `https://www.muniztech.com.br/analises/${record.slug || record.id}`;
      buttonText = "💰 VER MELHOR PREÇO";
      
      if (record.type === 'ranking') {
        const items = Array.isArray(record.ranking_items) ? record.ranking_items : [];
        const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
        const listText = items.slice(0, 5).map((item: any, i: number) => 
          `${medals[i] || "🔹"} <b>${item.name}</b>\n` +
          `⭐ ${item.rating}\n` +
          `💰 ${item.price}\n` +
          (Array.isArray(item.benefits) ? item.benefits.slice(0, 2).map((b: string) => `✔ ${b}`).join('\n') : '')
        ).join('\n\n');

        message = `🏆 <b>${record.title}</b>\n\n` +
                  `📊 <b>OS MELHORES DO MOMENTO:</b>\n\n` +
                  `${listText}\n\n` +
                  `✨ <b>Ranking Rápido:</b> \n` +
                  (record.quick_ranking?.best_overall ? `🥇 Melhor Geral: ${record.quick_ranking.best_overall}\n` : '') +
                  (record.quick_ranking?.best_value ? `💰 Custo-Benefício: ${record.quick_ranking.best_value}\n` : '') +
                  `\n🔥 <b>Veja a lista completa com prós, contras e preços:</b> \n` +
                  `👉 ${buttonUrl}\n\n` +
                  `⚡ Ofertas atualizadas TODOS os dias\n` +
                  `💰 Links confiáveis e com desconto real\n\n` +
                  `#Ranking #Top5 #MunizTech #MelhoresProdutos #${record.category?.replace(/\s+/g, '')}`;
      } else {
        const p1Pros = Array.isArray(record.pros) ? record.pros.slice(0, 3).map(p => `✔ ${p}`).join('\n') : '';
        const p2Pros = Array.isArray(record.product2_pros) ? record.product2_pros.slice(0, 3).map(p => `✔ ${p}`).join('\n') : '';

        message = `🚀 <b>${record.title}</b>\n\n` +
                  `📊 ${record.excerpt}\n\n` +
                  `🍎 <b>${record.product1_name || 'Produto 1'}</b>\n${p1Pros}\n\n` +
                  (record.product2_name ? `🤖 <b>${record.product2_name}</b>\n${p2Pros}\n\n` : '') +
                  `⚖️ <b>Resumo direto:</b>\n👉 ${record.for_whom || 'Vale a pena conferir!'}\n\n` +
                  `🔥 <b>Veja o comparativo completo e escolha o melhor antes de comprar:</b>\n` +
                  `👉 ${buttonUrl}\n\n` +
                  `⚡ Ofertas atualizadas TODOS os dias\n` +
                  `💰 Links confiáveis e com desconto real\n\n` +
                  `#${record.product1_name?.replace(/\s+/g, '')} #${record.product2_name?.replace(/\s+/g, '') || 'Review'} #MunizTech #Comparativo`;
      }
    }

    if (message) {
      // Tenta enviar com foto se houver URL, caso contrário envia apenas texto
      const method = imageUrl ? "sendPhoto" : "sendMessage";
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
      
      const payload: any = {
        chat_id: TELEGRAM_CHAT_ID,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: buttonText, url: buttonUrl }]]
        }
      };

      if (imageUrl) {
        payload.photo = imageUrl;
        payload.caption = message;
      } else {
        payload.text = message;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    const result = await response.json();
      return new Response(JSON.stringify(result), { status: response.status });
    }

    return new Response(JSON.stringify({ message: "No content match" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
