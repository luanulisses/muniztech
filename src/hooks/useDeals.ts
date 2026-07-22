import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Deal } from '@/types';

export function useDeals(category?: string, limit?: number, isAchadinho?: boolean) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDeals() {
      if (!isSupabaseConfigured) {
        if (import.meta.env.DEV) {
          console.warn('[useDeals] Supabase não configurado. Ausência das variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY.');
        }
        if (isMounted) {
          setError('Supabase não configurado');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let query = supabase.from('deals').select('*');

        if (category) {
          query = query.eq('category', category);
        }

        if (isAchadinho !== undefined) {
          query = query.eq('is_achadinho', isAchadinho);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: supabaseError } = await query.order('created_at', { ascending: false });

        if (supabaseError) {
          if (import.meta.env.DEV) {
            console.error('[useDeals] Erro Supabase:', supabaseError.message);
          }
          if (isMounted) setError(supabaseError.message);
        } else if (data) {
          if (import.meta.env.DEV && data.length === 0) {
            console.warn('[useDeals] Resposta vazia do Supabase na tabela deals.');
          }
          const mappedDeals: Deal[] = data.map((d) => ({
            id: d.id,
            title: d.title,
            slug: d.slug,
            price: d.price,
            originalPrice: d.original_price,
            discount: d.discount,
            store: d.store,
            link: d.link,
            image: d.image,
            category: d.category,
            views: d.views,
            isAchadinho: d.is_achadinho,
            urgencyText: d.urgency_text,
            endsInHours: d.ends_in_hours,
            features: d.features,
          }));

          if (isMounted) {
            setDeals(mappedDeals);
          }
        }
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error('[useDeals] Exceção ao buscar ofertas:', err?.message || err);
        }
        if (isMounted) {
          setError(err?.message || 'Erro inesperado ao carregar ofertas');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDeals();

    return () => {
      isMounted = false;
    };
  }, [category, limit, isAchadinho]);

  return { deals, loading, error };
}
