import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

serve(async (req: Request) => {
  try {
    const { store, force } = await req.json().catch(() => ({}));
    const now = new Date();
    const minutes = now.getMinutes();
    
    // Rotação de lojas (ou override manual com 'force')
    let targetStore = store;
    if (!targetStore && !force) {
      // Revezamento de 15 em 15 minutos entre as duas que funcionam
      if ((minutes >= 0 && minutes < 15) || (minutes >= 30 && minutes < 45)) {
        targetStore = "Shopee";
      } else {
        targetStore = "Awin"; // Pega qualquer uma da Awin (Arno, Cellfy, etc)
      }
      console.log(`[POSTER] Janela de tempo: ${minutes}min. Alvo selecionado: ${targetStore}`);
    }

    // Se force for true mas não passou store, tenta pegar a da janela ou todas
    if (force && !targetStore) {
        targetStore = ""; // Busca qualquer loja pendente
    }

    console.log(`Iniciando postagem para: ${targetStore}`);

    // Pega a oferta mais recente no radar desta loja
    const { data: pending, error: fetchError } = await supabase
      .from("pending_deals")
      .select("*")
      .ilike("store", `%${targetStore}%`)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(3);

    if (fetchError || !pending || pending.length === 0) {
      return new Response(JSON.stringify({ message: `Sem ofertas para ${targetStore}` }), { status: 200 });
    }

    for (const deal of pending) {
      if (!isSafeProduct(deal.title)) {
        console.log(`[POSTER] Pulando item fora de nicho: ${deal.title}`);
        await supabase.from("pending_deals").update({ status: "posted" }).eq("id", deal.id);
        continue;
      }

      // Gera Slug Determinístico
      const slug = `${targetStore.toLowerCase().replace(/ /g, "-")}-${deal.external_id || Math.random().toString(36).substring(7)}`;

      // Tenta postar
      const { error: postError } = await supabase.from("deals").insert({
        title: deal.title,
        image: deal.image,
        price: deal.price,
        discount: deal.discount,
        store: deal.store,
        link: deal.affiliate_link,
        slug: slug
      });

      if (!postError) {
        // Marca como postado
        await supabase.from("pending_deals").update({ status: "posted" }).eq("id", deal.id);
      } else {
        console.error(`Erro ao postar deal ${deal.id}:`, postError.message);
      }
    }

    return new Response(JSON.stringify({ success: true, posted: pending.length }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
