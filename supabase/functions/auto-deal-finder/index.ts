import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const shopeeAppId = Deno.env.get("SHOPEE_APP_ID") || "";
const shopeeAppSecret = Deno.env.get("SHOPEE_APP_SECRET") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const NICHE_KEYWORDS = [
  "gamer", "pc", "notebook", "laptop", "smartphone", "celular", "monitor", "teclado", "mouse", 
  "fone", "headphone", "console", "playstation", "xbox", "nintendo", "hardware", "processador", 
  "placa", "gpu", "ram", "ssd", "hd", "roteador", "wi-fi", "smart", "alexa", "echo", "tablet", 
  "ipad", "kindle", "watch", "iphone", "galaxy", "moto", "xiaomi", "redmi", "poco", "razer", 
  "logitech", "corsair", "hyperx", "asus", "acer", "dell", "lenovo", "hp", "samsung", "lg", 
  "tcl", "msi", "gigabyte", "rtx", "gtx", "ryzen", "intel", "core i", "gaming", "tecnologia",
  "eletrônico", "informática", "cabo", "usb", "hdmi", "carregador", "bateria", "caixa de som",
  "bluetooth", "tv", "televisão", "câmera", "webcam", "microfone", "impressora", "scanner",
  "projetor", "apple", "macbook", "airpods", "beats", "jbl", "sony", "canon", "nikon", "drone",
  "gopro", "kindle", "fire stick", "roku", "chromecast"
];

const FORBIDDEN_KEYWORDS = [
  "roupa", "camiseta", "calça", "sapato", "tenis", "moda", "cozinha", "panela", "frigideira", 
  "prato", "talher", "banheiro", "lixeira", "toalha", "escova", "maquiagem", "beleza", "perfume", 
  "hidratante", "shampoo", "condicionador", "mangueira", "jardim", "ferramenta", "martelo", 
  "furadeira", "parafusadeira", "cinto", "mochila", "bolsa", "oculos", "suplemento", "vitamina", 
  "brinquedo", "boneca", "carrinho", "lego", "pet", "ração", "coleira", "limpeza", "detergente", 
  "amaciante"
];

const BLACKLIST = [
  "infantil", "brinco", "tarraxa", "bijuteria", "revenda", "atacado", "cápsulas", 
  "emagrecedor", "suplemento", "vitamina", "unha", "cabelo", "roupa íntima"
];

function hasForbiddenWord(title: string): boolean {
  const t = title.toLowerCase();
  return FORBIDDEN_KEYWORDS.some(word => t.includes(word)) || BLACKLIST.some(word => t.includes(word));
}

function hasNicheWord(title: string): boolean {
  const t = title.toLowerCase();
  return NICHE_KEYWORDS.some(word => t.includes(word));
}

// Assinatura correta para a Shopee Affiliate GraphQL (SHA256 simples concatenando tudo)
async function generateSignature(appId: string, timestamp: number, bodyStr: string, secret: string) {
  const payload = appId + timestamp + bodyStr + secret;
  const msgUint8 = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  try {
    console.log("[SHOPEE FINDER] Iniciando busca de ofertas na Shopee...");
    
    console.log(`[SHOPEE FINDER] APP_ID configurado? ${shopeeAppId ? "SIM" : "NÃO"}`);
    console.log(`[SHOPEE FINDER] APP_SECRET configurado? ${shopeeAppSecret ? "SIM" : "NÃO"}`);

    if (!shopeeAppId || !shopeeAppSecret) {
        throw new Error("SHOPEE_APP_ID ou SHOPEE_APP_SECRET estão vazios nas variáveis de ambiente!");
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    console.log(`[SHOPEE FINDER] Timestamp usado: ${timestamp}`);

    const terms = ["celular", "fone bluetooth", "monitor", "notebook", "promoção"];
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    
    console.log(`[SHOPEE FINDER] Termo selecionado para teste: "${randomTerm}"`);

    const endpoint = "https://open-api.affiliate.shopee.com.br/graphql";
    const query = `
      query getOffers($keyword: String) {
        productOfferV2(limit: 40, keyword: $keyword) {
          nodes {
            productName
            imageUrl
            priceMin
            priceMax
            offerLink
          }
        }
      }
    `;
    const variables = { keyword: randomTerm };

    // 1. Corpo estrito
    const bodyObj = { query, variables };
    const bodyStr = JSON.stringify(bodyObj);

    console.log(`[SHOPEE FINDER] Body string gerado para envio/assinatura:\n${bodyStr}`);

    // 2. Gerar a assinatura via SHA-256 Simples: AppId + Timestamp + Payload + Secret
    const sign = await generateSignature(shopeeAppId, timestamp, bodyStr, shopeeAppSecret);
    console.log(`[SHOPEE FINDER] Sign gerado (oculto parcial): ${sign.substring(0, 10)}...${sign.substring(sign.length - 10)}`);

    // 3. Montar o header
    const authHeader = `SHA256 Credential=${shopeeAppId}, Timestamp=${timestamp}, Signature=${sign}`;
    console.log(`[SHOPEE FINDER] Authorization Header:\n${authHeader}`);

    // 4. Disparar API
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: bodyStr // Enviando a mesmíssima string usada no cálculo
    });

    const status = res.status;
    console.log(`[SHOPEE FINDER] HTTP Status da Resposta: ${status}`);

    const textResponse = await res.text();
    const limitedText = textResponse.length > 3000 ? textResponse.substring(0, 3000) + "...[TRUNCATED]" : textResponse;
    console.log(`[SHOPEE FINDER] Corpo Bruto da Resposta Shopee:\n${limitedText}`);

    let result: any = {};
    try {
        result = JSON.parse(textResponse);
    } catch(e: any) {
        console.error(`[SHOPEE FINDER] Falha ao fazer parse do JSON.`, e.message);
    }

    if (result.errors) {
        console.error(`[SHOPEE FINDER] ALERTA: A API GraphQL da Shopee retornou um array de 'errors':`, JSON.stringify(result.errors, null, 2));
    }

    const offers = result.data?.productOfferV2?.nodes || [];
    console.log(`[SHOPEE FINDER] Total Extraído: ${offers.length} produtos.`);
    
    if (offers.length > 0) {
        console.log(`[SHOPEE FINDER] Campos disponíveis no primeiro produto:`, Object.keys(offers[0]).join(", "));
    }
    
    let saved = 0;
    let discardedForbidden = 0;
    const allToInsert: any[] = [];

    for (const item of offers) {
      if (hasForbiddenWord(item.productName)) {
         discardedForbidden++;
         continue;
      }
      
      const isNiche = hasNicheWord(item.productName);
      const externalId = item.offerLink ? item.offerLink.split('?')[0] : `${item.productName}-${item.priceMin}`;

      let discountLabel = "Oferta";
      let baseScore = 50; // Score base para produto que existe e tem preço
      
      const pMin = item.priceMin || 0;
      const pMax = item.priceMax || 0;

      if (pMax > pMin && pMin > 0) {
          const disc = Math.round(((pMax - pMin) / pMax) * 100);
          if (disc > 0) {
             discountLabel = `${disc}% OFF`;
             baseScore = disc;
          }
      }

      // Preço formatado
      const priceNumeric = pMin; // em reais, pois não precisa dividir
      let bonusPrice = 0;
      if (priceNumeric >= 80 && priceNumeric <= 250) {
          bonusPrice = 30;
      } else if (priceNumeric >= 50 && priceNumeric <= 300) {
          bonusPrice = 20;
      }

      const bonusNiche = isNiche ? 40 : 0;
      const finalScore = baseScore + bonusPrice + bonusNiche;

      allToInsert.push({
        external_id: externalId,
        title: item.productName,
        image: item.imageUrl,
        price: `R$ ${pMin.toLocaleString("pt-BR")}`,
        original_price: pMax > pMin ? `R$ ${pMax.toLocaleString("pt-BR")}` : null,
        discount: discountLabel,
        store: "Shopee",
        source_url: item.offerLink,
        affiliate_link: item.offerLink,
        status: "pending",
        platform: "Shopee",
        category: "Oferta Shopee",
        is_niche: isNiche,
        score: finalScore
      });
    }

    console.log(`[SHOPEE FINDER] Descartados (Forbidden): ${discardedForbidden}`);
    console.log(`[SHOPEE FINDER] Preparados para Banco: ${allToInsert.length}`);

    if (allToInsert.length > 0) {
      const pendingDealsData = allToInsert.map(item => ({
          external_id: item.external_id,
          title: item.title,
          image: item.image,
          price: item.price,
          original_price: item.original_price,
          discount: item.discount,
          store: item.store,
          source_url: item.source_url,
          affiliate_link: item.affiliate_link,
          status: item.status
      }));

      const { error: errorPending } = await supabase
        .from("pending_deals")
        .upsert(pendingDealsData, { onConflict: "external_id" });

      if (errorPending) console.error(`[SHOPEE FINDER] ERRO (pending_deals):`, errorPending.message);
      else saved = pendingDealsData.length;

      const botOffersData = allToInsert.map(item => ({
          external_id: item.external_id,
          platform: item.platform,
          title: item.title,
          price: item.price,
          original_price: item.original_price,
          discount: item.discount,
          affiliate_link: item.affiliate_link,
          image: item.image,
          category: item.category,
          is_niche: item.is_niche,
          status: item.status,
          score: item.score
      }));

      const { error: errorBot } = await supabase
        .from("bot_offers")
        .upsert(botOffersData, { onConflict: "external_id" });

      if (errorBot) console.error(`[SHOPEE FINDER] ERRO FATAL (bot_offers):`, errorBot.message);
    }

    console.log(`[SHOPEE FINDER] Processo finalizado.`);
    return new Response(JSON.stringify({ success: true, saved }), { status: 200 });

  } catch (error: any) {
    console.error(`[SHOPEE FINDER] EXCEPTION:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
