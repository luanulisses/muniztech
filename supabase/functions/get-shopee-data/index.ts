import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ok = (data: unknown) => new Response(JSON.stringify(data), {
  status: 200,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url) return ok({ error: 'URL é obrigatória' });

    console.log("URL recebida:", url);

    // Normalizar a URL (remover query params desnecessários)
    let parsedUrl = url.trim();

    // ---- ESTRATÉGIA 1: Extrair IDs do Shopee da URL ----
    // Padrão: shopee.com.br/Nome-Produto-i.SHOPID.ITEMID
    const idMatch = parsedUrl.match(/[-.\/]i\.(\d+)\.(\d+)/i);
    
    if (idMatch) {
      const shopid = idMatch[1];
      const itemid = idMatch[2];
      console.log(`IDs encontrados: Shop=${shopid} Item=${itemid}`);

      try {
        const apiRes = await fetch(
          `https://shopee.com.br/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
              'Referer': 'https://shopee.com.br/',
              'Accept': 'application/json',
            },
          }
        );

        const json = await apiRes.json();
        
        if (json?.data) {
          const item = json.data;
          return ok({
            title: item.name || '',
            image: item.image ? `https://cf.shopee.com.br/file/${item.image}` : '',
            price: fmtBRL(item.price / 100000),
            original_price: item.price_before_discount > 0
              ? fmtBRL(item.price_before_discount / 100000)
              : '',
          });
        }

        console.log("API não retornou dados:", JSON.stringify(json).slice(0, 200));
      } catch (e) {
        console.log("Erro na API da Shopee:", e.message);
      }

      // Mesmo sem dados da API, podemos extrair o título do slug da URL
      const titleFromSlug = extractTitleFromSlug(parsedUrl, shopid, itemid);
      if (titleFromSlug) {
        return ok({
          title: titleFromSlug,
          image: '',
          price: '',
          original_price: '',
          partial: true, // sinaliza que é parcial
        });
      }
    }

    // ---- ESTRATÉGIA 2: Extrair título do slug mesmo sem IDs ----
    const titleFromSlug = extractTitleFromSlug(parsedUrl, '', '');
    if (titleFromSlug) {
      return ok({
        title: titleFromSlug,
        image: '',
        price: '',
        original_price: '',
        partial: true,
      });
    }

    return ok({ error: 'Não foi possível extrair dados. Verifique o link e preencha manualmente.' });

  } catch (err) {
    console.error("Erro geral:", err?.message);
    return ok({ error: String(err?.message || 'Erro desconhecido') });
  }
});

function extractTitleFromSlug(url: string, _shopid: string, _itemid: string): string {
  try {
    // Pega o path: /Nome-Do-Produto-i.shopid.itemid
    const path = new URL(url).pathname;
    // Remove o prefixo / e o sufixo -i.SHOPID.ITEMID
    const slug = path.replace(/^\//, '').replace(/-i\.\d+\.\d+.*$/, '');
    if (!slug || slug.length < 3) return '';
    // Converte kebab-case para Title Case
    return slug
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  } catch {
    return '';
  }
}

function fmtBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}
