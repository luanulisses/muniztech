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

        const allToInsert: any[] = [];

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

          if (hasForbiddenWord(title)) continue;
          
          const isNiche = hasNicheWord(title);
          const externalId = getCol("aw_product_id") || getCol("product_id") || link;
          const storeName = getCol("advertiser_name") || getCol("merchant_name") || "Awin Store";

          // Tentar calcular score se tiver preço original
          const originalPriceCol = getCol("price") || getCol("rrp_price");
          let baseScore = 50;
          let discountLabel = "Oferta";
          let originalPrice = null;
          
          if (originalPriceCol && originalPriceCol !== price) {
              const currPriceNum = parseFloat(price.replace(/[^0-9.]/g, ""));
              const origPriceNum = parseFloat(originalPriceCol.replace(/[^0-9.]/g, ""));
              if (origPriceNum > currPriceNum && currPriceNum > 0) {
                  baseScore = Math.round(((origPriceNum - currPriceNum) / origPriceNum) * 100);
                  discountLabel = `${baseScore}% OFF`;
                  originalPrice = originalPriceCol.includes("BRL") ? `R$ ${originalPriceCol.replace(" BRL", "")}` : originalPriceCol;
              }
          }

          const priceNumeric = parseFloat(price.replace(/[^0-9.]/g, ""));
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
            title: title,
            image: image,
            price: price.includes("BRL") ? `R$ ${price.replace(" BRL", "")}` : price,
            original_price: originalPrice,
            discount: discountLabel,
            store: storeName,
            source_url: link,
            affiliate_link: link,
            status: "pending",
            platform: "Awin",
            category: "Oferta Awin",
            is_niche: isNiche,
            score: finalScore
          });
        }

        if (allToInsert.length > 0) {
          // Lote 1: pending_deals
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

          const { error } = await supabase
            .from("pending_deals")
            .upsert(pendingDealsData, { onConflict: "external_id" });

          if (!error) {
            savedCount = pendingDealsData.length;
          }

          // Lote 2: bot_offers
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

          await supabase
            .from("bot_offers")
            .upsert(botOffersData, { onConflict: "external_id" });
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
