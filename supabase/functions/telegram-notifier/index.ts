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
      buttonText = "💰 Ver Melhor Preço";
      message = `🔥 *${record.title}*\n\n` +
                `📊 *Oportunidade Monitorada*\n` +
                `💰 *Preço Atual:* ${record.price}\n` +
                `📉 *Desconto:* ${record.discount}\n` +
                `🛒 *Loja:* ${record.store || 'Amazon'}\n\n` +
                `⚡ Ofertas atualizadas TODOS os dias\n` +
                `💰 Links confiáveis e com desconto real\n\n` +
                `👉 *Acesse pelo link:* ${buttonUrl}\n\n` +
                `#oferta #tecnologia #muniztech #${record.category?.toLowerCase() || 'desconto'}`;
    } else if (table === "reviews") {
      imageUrl = record.image;
      buttonUrl = `https://www.muniztech.com.br/analises/${record.slug || record.id}`;
      
      if (record.type === 'ranking') {
        buttonText = "🏆 Ver Ranking Completo";
        const items = Array.isArray(record.ranking_items) ? record.ranking_items : [];
        const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
        const listText = items.slice(0, 5).map((item: any, i: number) => `${medals[i] || "🔹"} *${item.name}* - ⭐ ${item.rating}`).join('\n');

        message = `🏆 *${record.title}*\n\n` +
                  `📊 *OS MELHORES DO MOMENTO:*\n` +
                  `${listText}\n\n` +
                  `✨ *Destaques do Muniz:* \n` +
                  (record.quick_ranking?.best_overall ? `🥇 Melhor Geral: ${record.quick_ranking.best_overall}\n` : '') +
                  (record.quick_ranking?.best_value ? `💰 Custo-Benefício: ${record.quick_ranking.best_value}\n` : '') +
                  `\n🔥 *Veja a lista completa com prós, contras e preços:* \n` +
                  `👉 ${buttonUrl}\n\n` +
                  `⚡ Ofertas atualizadas TODOS os dias\n` +
                  `💰 Links confiáveis e com desconto real\n\n` +
                  `#Ranking #Top5 #MunizTech #MelhoresProdutos #${record.category?.replace(/\s+/g, '')}`;
      } else {
        buttonText = "📊 Ver Comparativo Completo";
        const p1Pros = Array.isArray(record.pros) ? record.pros.slice(0, 3).map(p => `✔ ${p}`).join('\n') : '';
        const p2Pros = Array.isArray(record.product2_pros) ? record.product2_pros.slice(0, 3).map(p => `✔ ${p}`).join('\n') : '';

        message = `🚀 *${record.title}*\n\n` +
                  `📊 ${record.excerpt}\n\n` +
                  `🍎 *${record.product1_name || 'Produto 1'}*\n${p1Pros}\n\n` +
                  (record.product2_name ? `🤖 *${record.product2_name}*\n${p2Pros}\n\n` : '') +
                  `⚖️ *Resumo direto:*\n👉 ${record.rating}/10 - ${record.for_whom || 'Vale a pena conferir!'}\n\n` +
                  `🔥 *Veja o comparativo completo e escolha o melhor:* \n` +
                  `👉 ${buttonUrl}\n\n` +
                  `⚡ Ofertas atualizadas TODOS os dias\n` +
                  `💰 Links confiáveis e com desconto real\n\n` +
                  `#${record.product1_name?.replace(/\s+/g, '')} #${record.product2_name?.replace(/\s+/g, '') || 'Review'} #MunizTech #Comparativo`;
      }
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
