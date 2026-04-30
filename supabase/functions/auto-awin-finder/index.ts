import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { parse } from "https://deno.land/std@0.177.0/encoding/csv.ts";

const awinToken = Deno.env.get("AWIN_API_TOKEN") || "";
const publisherId = Deno.env.get("AWIN_PUBLISHER_ID") || "";
const awinFeedKey = Deno.env.get("AWIN_FEED_API_KEY") || awinToken;
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

serve(async (req: Request) => {
  try {
    console.log("Busca ILIMITADA iniciada...");
    let savedCount = 0;

    const feedUrl = `https://ui.awin.com/productdata-darwin-download/publisher/${publisherId}/${awinFeedKey}/1/feed/F2908.csv.gz`;
    const feedRes = await fetch(feedUrl);
    
    if (feedRes.ok) {
      const arrayBuffer = await feedRes.arrayBuffer();
      const view = new Uint8Array(arrayBuffer);
      let csvText = "";
      
      if (view[0] === 0x1F && view[1] === 0x8B) {
         const ds = new DecompressionStream("gzip");
         const writer = ds.writable.getWriter();
         writer.write(view);
         writer.close();
         csvText = await new Response(ds.readable).text();
      } else {
         csvText = new TextDecoder().decode(view);
      }
      
      const rows = await parse(csvText) as string[][];
      if (rows.length > 1) {
        const headers = rows[0].map(h => h.trim());
        console.log(`Processando catálogo completo: ${rows.length - 1} produtos.`);

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const getCol = (name: string) => {
              const idx = headers.indexOf(name);
              return idx >= 0 ? row[idx] : "";
          };

          const availability = getCol("availability").toLowerCase();
          const inStock = availability.includes("in_stock") || availability === "in stock" || availability === "instock" || availability === "";

          if (!inStock) continue;

          const title = getCol("title") || getCol("product_name");
          const price = getCol("sale_price") || getCol("search_price") || getCol("price");
          const link = getCol("aw_deep_link") || getCol("link");
          const image = getCol("image_link") || getCol("aw_image_url") || `https://www.awin1.com/logos/${getCol("advertiser_id")}/logo.gif`;

          if (!isSafeProduct(title)) continue;

          const { error } = await supabase.from("pending_deals").insert({
            title: title,
            image: image,
            price: price.includes("BRL") ? `R$ ${price.replace(" BRL", "")}` : price,
            store: getCol("advertiser_name") || getCol("merchant_name") || "Awin Store",
            source_url: link,
            affiliate_link: link,
            discount: "Oferta",
            status: "pending"
          });

          if (!error) savedCount++;
        }
      }
    }

    console.log(`Processo finalizado. ${savedCount} produtos novos no radar.`);
    return new Response(JSON.stringify({ success: true, saved: savedCount }), { 
      status: 200, headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
