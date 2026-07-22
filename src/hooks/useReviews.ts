import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Review } from '@/types';

export function useReviews(limit?: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      if (!isSupabaseConfigured) {
        if (import.meta.env.DEV) {
          console.warn('[useReviews] Supabase não configurado. Ausência das variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY.');
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
        let query = supabase.from('reviews').select('*');
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: supabaseError } = await query.order('created_at', { ascending: false });

        if (supabaseError) {
          if (import.meta.env.DEV) {
            console.error('[useReviews] Erro Supabase:', supabaseError.message);
          }
          if (isMounted) setError(supabaseError.message);
        } else if (data) {
          if (import.meta.env.DEV && data.length === 0) {
            console.warn('[useReviews] Resposta vazia do Supabase na tabela reviews.');
          }
          const mapped: Review[] = data.map((r) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            excerpt: r.excerpt,
            image: r.image,
            category: r.category,
            author: r.author,
            date: r.date,
            rating: parseFloat(r.rating) || 0,
            type: r.type || 'review',
            content: r.content,
            benefits: r.benefits,
            pros: r.pros,
            cons: r.cons,
            forWhom: r.for_whom,
            buyLink: r.buy_link,
            buyPrice: r.buy_price,
            product1Name: r.product1_name,
            product2Name: r.product2_name,
            product2Rating: r.product2_rating,
            product2Pros: r.product2_pros,
            product2Cons: r.product2_cons,
            product2Link: r.product2_link,
            product2Price: r.product2_price,
            product2Image: r.product2_image,
            comparisonSpecs: r.comparison_specs,
            rankingItems: r.ranking_items,
            quickRanking: r.quick_ranking,
          }));

          if (isMounted) {
            setReviews(mapped);
          }
        }
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error('[useReviews] Exceção ao buscar reviews:', err?.message || err);
        }
        if (isMounted) {
          setError(err?.message || 'Erro inesperado ao carregar reviews');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { reviews, loading, error };
}

export function useReview(slug: string) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchReview() {
      if (!slug) return;

      if (!isSupabaseConfigured) {
        if (import.meta.env.DEV) {
          console.warn('[useReview] Supabase não configurado.');
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
        const { data, error: supabaseError } = await supabase
          .from('reviews')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supabaseError) {
          if (import.meta.env.DEV) {
            console.error('[useReview] Erro Supabase:', supabaseError.message);
          }
          if (isMounted) setError(supabaseError.message);
        } else if (data && isMounted) {
          setReview({
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            image: data.image,
            category: data.category,
            author: data.author,
            date: data.date,
            rating: parseFloat(data.rating) || 0,
            type: data.type || 'review',
            content: data.content,
            benefits: data.benefits,
            pros: data.pros,
            cons: data.cons,
            forWhom: data.for_whom,
            buyLink: data.buy_link,
            buyPrice: data.buy_price,
            product1Name: data.product1_name,
            product2Name: data.product2_name,
            product2Rating: data.product2_rating,
            product2Pros: data.product2_pros,
            product2Cons: data.product2_cons,
            product2Link: data.product2_link,
            product2Price: data.product2_price,
            product2Image: data.product2_image,
            comparisonSpecs: data.comparison_specs,
            rankingItems: data.ranking_items,
            quickRanking: data.quick_ranking,
          });
        }
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error('[useReview] Exceção ao buscar review:', err?.message || err);
        }
        if (isMounted) {
          setError(err?.message || 'Erro ao carregar review');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReview();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { review, loading, error };
}
