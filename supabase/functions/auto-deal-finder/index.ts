import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const shopeeAppId = Deno.env.get("SHOPEE_APP_ID") || "";
const shopeeAppSecret = Deno.env.get("SHOPEE_APP_SECRET") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
