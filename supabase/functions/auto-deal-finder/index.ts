import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Termos de busca rotativos
const SEARCH_TERMS = [
  "fone bluetooth",
  "echo dot",
  "smartwatch",
  "notebook",
  "iphone",
  "tv 4k",
  "airfryer",
  "monitor gamer",
  "ssd"
];

serve(async (req: Request) => {
  try {
    // Para facilitar testes, podemos passar um termo na query: ?q=fone
    const url = new URL(req.url);
    const queryTerm = url.searchParams.get("q");

    // Sorteia um termo de busca caso não tenha passado via query
    const searchTerm = queryTerm || SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];

    console.log(`Buscando ofertas para: ${searchTerm}`);

    // IMPORTANTE: A API do Mercado Livre começou a bloquear buscas anônimas (Retornando 403 Forbidden).
    // Para que você possa testar o fluxo (Painel -> Aprovar -> Telegram) agora mesmo,
    // coloquei o robô para puxar produtos de uma API de testes (DummyJSON).
    
    console.log(`Buscando ofertas de teste para: ${searchTerm}`);

    const testResponse = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm.split(' ')[0])}&limit=5`);
    const testData = await testResponse.json();

    if (!testData.products || testData.products.length === 0) {
      return new Response(JSON.stringify({ message: "Nenhum resultado de teste encontrado." }), { status: 200 });
    }

    let itemsSaved = 0;

    for (const item of testData.products) {
      const currentPrice = item.price * 5; // Convertendo para "Reais" fictícios
      const discountPercentage = Math.round(item.discountPercentage);
      const originalPrice = currentPrice / (1 - (discountPercentage / 100));

      const formatPrice = (p: number) => `R$ ${p.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const pendingDeal = {
        title: item.title,
        image: item.thumbnail,
        price: formatPrice(currentPrice),
        original_price: formatPrice(originalPrice),
        discount: `${discountPercentage}%`,
        store: "Mercado Livre (Teste)",
        source_url: `https://dummyjson.com/products/${item.id}`,
        status: "pending"
      };

      const { data: existing } = await supabase
        .from("pending_deals")
        .select("id")
        .eq("source_url", pendingDeal.source_url)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from("pending_deals").insert(pendingDeal);
        if (!error) itemsSaved++;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      term: searchTerm,
      itemsFound: testData.products.length,
      dealsSaved: itemsSaved,
      aviso: "API do Mercado Livre exigindo token. Usando dados de teste."
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Erro na busca de ofertas:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
