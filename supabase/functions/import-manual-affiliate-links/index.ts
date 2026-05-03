import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

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

async function generateHash(str: string) {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
}

// Regex Helpers para extrair meta tags
function extractMetaTag(html: string, property: string): string | null {
  // Tenta extrair <meta property="prop" content="val"> ou <meta content="val" property="prop">
  // Tambem funciona com name="..."
  const regex1 = new RegExp(`<meta[^>]*?(?:property|name)=["']${property}["'][^>]*?content=["']([^"']+)["'][^>]*?>`, "i");
  const regex2 = new RegExp(`<meta[^>]*?content=["']([^"']+)["'][^>]*?(?:property|name)=["']${property}["'][^>]*?>`, "i");
  
  const match1 = html.match(regex1);
  if (match1) return match1[1];
  
  const match2 = html.match(regex2);
  if (match2) return match2[1];
  
  return null;
}

serve(async (req: Request) => {
  try {
    console.log(`[MANUAL LINKS] Iniciando importação manual...`);

    // 1. Buscar links manuais pendentes
    const { data: links, error: fetchError } = await supabase
      .from("manual_affiliate_links")
      .select("*")
      .eq("status", "pending")
      .limit(10); // Processar em lotes para evitar timeout

    if (fetchError) {
      throw new Error(`Erro ao buscar links pendentes: ${fetchError.message}`);
    }

    if (!links || links.length === 0) {
      console.log(`[MANUAL LINKS] Nenhum link pendente para processar`);
      return new Response(JSON.stringify({ message: "No pending links" }), { status: 200 });
    }

    console.log(`[MANUAL LINKS] Encontrados ${links.length} links pendentes.`);

    let processedCount = 0;

    for (const linkObj of links) {
      const affiliateLink = linkObj.affiliate_link || linkObj.link;
      const platformStr = linkObj.platform || "Manual";
      
      console.log(`\n[MANUAL LINKS] Processando: ${affiliateLink}`);

      try {
        // 2. Fetch da página para tentar ler OpenGraph
        const res = await fetch(affiliateLink, {
          redirect: "follow",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
          }
        });

        const html = await res.text();
        const finalUrl = res.url; // URL após os redirects
        
        // 3. Extrair metadados
        let title = extractMetaTag(html, "og:title") || extractMetaTag(html, "twitter:title");
        if (!title) {
          const tMatch = html.match(/<title>([^<]+)<\/title>/i);
          title = tMatch ? tMatch[1] : "Oferta Especial";
        }

        // Limpar HTML entities simples
        title = title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim();

        let image = extractMetaTag(html, "og:image") || extractMetaTag(html, "twitter:image");
        let priceValue = extractMetaTag(html, "product:price:amount");
        
        // Se a página não expor product:price:amount, tentar pegar do banco manual se o usuario ja forneceu
        let finalPrice = linkObj.price || (priceValue ? `R$ ${priceValue}` : "Ver Oferta na Loja");

        if (!title || !image || title === "Oferta Especial") {
           throw new Error("Não foi possível capturar Título ou Imagem (Bloqueio anti-scraping ou meta tags ausentes)");
        }

        if (hasForbiddenWord(title)) {
           throw new Error("Produto bloqueado por palavras proibidas (Blacklist)");
        }

        const isNiche = hasNicheWord(title);
        const externalId = await generateHash(affiliateLink);

        // 4. Inserir em bot_offers
        const botOfferData = {
          external_id: externalId,
          platform: platformStr,
          title: title,
          price: finalPrice,
          original_price: null,
          discount: "Oferta Manual",
          affiliate_link: affiliateLink,
          image: image,
          category: "manual",
          is_niche: isNiche,
          status: "pending",
          score: 80 // Conforme solicitado
        };

        const { error: upsertError } = await supabase
          .from("bot_offers")
          .upsert(botOfferData, { onConflict: "external_id" });

        if (upsertError) {
           throw new Error(`Falha no upsert em bot_offers: ${upsertError.message}`);
        }

        // Marcar como processado
        await supabase
          .from("manual_affiliate_links")
          .update({ 
             status: "processed", 
             final_url: finalUrl,
             title: title, // salva titulo na tabela manual tb de backup
             error_message: null
          })
          .eq("id", linkObj.id);
        
        console.log(`[MANUAL LINKS] SUCESSO! Oferta salva na bot_offers com score 80.`);
        processedCount++;

      } catch (err: any) {
        console.error(`[MANUAL LINKS] ERRO: ${err.message}`);
        // Marcar como error
        await supabase
          .from("manual_affiliate_links")
          .update({ 
             status: "error", 
             error_message: err.message
          })
          .eq("id", linkObj.id);
      }
    }

    console.log(`\n[MANUAL LINKS] Fim da execução. ${processedCount} processados com sucesso.`);
    return new Response(JSON.stringify({ success: true, processed: processedCount }), { status: 200 });

  } catch (error: any) {
    console.error(`[MANUAL LINKS] EXCEPTION FATAL:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
