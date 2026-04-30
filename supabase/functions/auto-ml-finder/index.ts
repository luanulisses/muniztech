import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MATT_TOOL = Deno.env.get("ML_MATT_TOOL") || "39059881";
const MATT_WORD = Deno.env.get("ML_MATT_WORD") || "luanulisses";

const NICHE_KEYWORDS = [
  "gamer", "pc", "notebook", "laptop", "smartphone", "celular", "monitor", "teclado", "mouse", 
  "fone", "headphone", "console", "playstation", "xbox", "nintendo", "hardware", "processador", 
  "placa", "gpu", "ram", "ssd", "hd", "roteador", "wi-fi", "smart", "alexa", "echo", "tablet", 
  "ipad", "kindle", "watch", "iphone", "galaxy", "moto", "xiaomi", "redmi", "poco", "razer", 
  "logitech", "corsair", "hyperx", "asus", "acer", "dell", "lenovo", "hp", "samsung", "lg", 
  "tcl", "msi", "gigabyte", "rtx", "gtx", "ryzen", "intel", "core i", "gaming"
];

const FORBIDDEN_KEYWORDS = [
  "roupa", "camiseta", "calça", "sapato", "tenis", "moda", "cozinha", "panela", "frigideira", 
  "prato", "talher", "banheiro", "lixeira", "toalha", "escova", "maquiagem", "beleza", "perfume", 
  "hidratante", "shampoo", "condicionador", "mangueira", "jardim", "ferramenta", "martelo", 
  "furadeira", "parafusadeira", "cinto", "mochila", "bolsa", "oculos", "suplemento", "vitamina", 
  "brinquedo", "boneca", "carrinho", "lego", "pet", "ração", "coleira", "limpeza", "detergente", 
  "amaciante"
];

function isSafeProduct(title: string): boolean {
  const t = title.toLowerCase();
  const hasNicheWord = NICHE_KEYWORDS.some(word => t.includes(word));
  const hasForbiddenWord = FORBIDDEN_KEYWORDS.some(word => t.includes(word));
  return hasNicheWord && !hasForbiddenWord;
}

serve(async () => {
  try {
    console.log("Iniciando Caça aos Descontos no Mercado Livre (20% OFF+)");

    // 1. Obter Access Token (oficial) para evitar o 403 Forbidden
    const CLIENT_ID = Deno.env.get("ML_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("ML_CLIENT_SECRET");

    console.log("[ML] Solicitando Access Token oficial...");
    const authRes = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET || ""
      })
    });

    const authData = await authRes.json();
    if (!authRes.ok) {
        console.error("[ML] Erro ao obter token:", authData);
        throw new Error(`Erro Auth ML: ${authData.message || "Falha na autenticação"}`);
    }

    const accessToken = authData.access_token;
    console.log("[ML] Token obtido com sucesso!");

    // LISTA DE TERMOS DE BUSCA (Foco total em Tecnologia e Gamer)
    const searchTerms = [
      "monitor gamer", 
      "notebook gamer", 
      "smartphone 5g", 
      "placa de vídeo", 
      "periféricos pc",
      "console video game",
      "smartwatch promoção",
      "hardware pc"
    ];
    let totalSaved = 0;
    const allToInsert: any[] = [];

    for (const term of searchTerms) {
      console.log(`[ML] Iniciando busca pelo termo: ${term}`);
      
      const mlRes = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(term)}&limit=50`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          }
        }
      );

      if (!mlRes.ok) {
          console.error(`[ML] Erro na API para termo ${term}: ${mlRes.status} ${mlRes.statusText}`);
          continue;
      }

      const data = await mlRes.json();
      const items = data.results || [];
      console.log(`[ML] Termo "${term}": API retornou ${items.length} itens.`);

      for (const item of items) {
        const currentPrice = item.price;
        const originalPrice = item.original_price;
        
        if (!currentPrice || !isSafeProduct(item.title)) continue;

        let discountLabel = "Oferta";
        if (originalPrice && originalPrice > currentPrice) {
            const pct = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
            discountLabel = `${pct}% OFF`;
        }
        
        const affiliateLink = `${item.permalink}?matt_tool=${MATT_TOOL}&matt_word=${MATT_WORD}`;
        const image = item.thumbnail.replace("-I.jpg", "-O.jpg");

        allToInsert.push({
          external_id: item.id,
          title: item.title,
          image,
          price: "R$ " + currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
          original_price: originalPrice ? "R$ " + originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : null,
          discount: discountLabel,
          store: "Mercado Livre",
          source_url: item.permalink,
          affiliate_link: affiliateLink,
          status: "pending",
        });
      }
    }

    if (allToInsert.length > 0) {
      console.log(`[ML] Tentando salvar ${allToInsert.length} itens no banco em massa...`);
      const { error, count } = await supabase
        .from("pending_deals")
        .upsert(allToInsert, { onConflict: "external_id" });

      if (error) {
        console.error(`[ML] Erro ao salvar no banco:`, error.message, error.details);
      } else {
        totalSaved = allToInsert.length;
        console.log(`[ML] Sucesso! ${totalSaved} itens processados.`);
      }
    } else {
      console.warn("[ML] Nenhum item encontrado em nenhuma categoria.");
    }

    return new Response(JSON.stringify({ 
        success: true, 
        found: allToInsert.length,
        saved: totalSaved 
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
