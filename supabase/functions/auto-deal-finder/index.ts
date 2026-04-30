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

function isSafeProduct(title: string): boolean {
  const t = title.toLowerCase();
  const hasNicheWord = NICHE_KEYWORDS.some(word => t.includes(word));
  const hasForbiddenWord = FORBIDDEN_KEYWORDS.some(word => t.includes(word));
  return hasNicheWord && !hasForbiddenWord;
}

async function generateSignature(timestamp: number, appId: string, secret: string) {
  const data = appId + timestamp + secret;
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  try {
    console.log("Buscando ofertas quentes na Shopee...");
    
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = await generateSignature(timestamp, shopeeAppId, shopeeAppSecret);

    // Buscando ofertas de categorias que você gosta (Tecnologia/Gamer)
    const query = `
      query getOffers {
        productOfferV2(limit: 40, listType: 1) {
          nodes {
            productName
            imageUrl
            priceMin
            priceMax
            offerLink
            discount
          }
        }
      }
    `;

    const res = await fetch("https://open-api.affiliate.shopee.com.br/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `SHA256 Credential=${shopeeAppId}, Timestamp=${timestamp}, Signature=${sign}`
      },
      body: JSON.stringify({ query })
    });

    const result = await res.json();
    const offers = result.data?.productOfferV2?.nodes || [];
    
    let saved = 0;
    for (const item of offers) {
      if (!isSafeProduct(item.productName)) continue;
      
      // Salva apenas se tiver algum desconto visível
      const { error } = await supabase.from("pending_deals").insert({
        title: item.productName,
        image: item.imageUrl,
        price: `R$ ${item.priceMin.toLocaleString("pt-BR")}`,
        discount: item.discount ? `${item.discount}% OFF` : "Oferta",
        store: "Shopee",
        source_url: item.offerLink,
        affiliate_link: item.offerLink,
        status: "pending"
      });
      if (!error) saved++;
    }

    console.log(`Shopee: ${saved} novas ofertas no radar.`);
    return new Response(JSON.stringify({ success: true, saved }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
