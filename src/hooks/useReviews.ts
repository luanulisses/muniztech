import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/types';

export function useReviews(limit?: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      let query = supabase.from('reviews').select('*');
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (data) {
        const mapped: Review[] = data.map(r => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt,
          image: r.image,
          category: r.category,
          author: r.author,
          date: r.date,
          rating: parseFloat(r.rating),
          type: r.type || 'review',
          content: r.content,
          benefits: r.benefits,
          pros: r.pros,
          cons: r.cons,
          forWhom: r.for_whom,
          buyLink: r.buy_link,
          buyPrice: r.buy_price,
          product2Name: r.product2_name,
          product2Rating: r.product2_rating,
          product2Pros: r.product2_pros,
          product2Cons: r.product2_cons,
          product2Link: r.product2_link,
          product2Price: r.product2_price,
          product2Image: r.product2_image,
          comparisonSpecs: r.comparison_specs
        }));
        setReviews(mapped);
      }
      setLoading(false);
    }

    fetchReviews();
  }, [limit]);

  return { reviews, loading };
}

export function useReview(slug: string) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setReview({
          id: data.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          image: data.image,
          category: data.category,
          author: data.author,
          date: data.date,
          rating: parseFloat(data.rating),
          type: data.type || 'review',
          content: data.content,
          benefits: data.benefits,
          pros: data.pros,
          cons: data.cons,
          forWhom: data.for_whom,
          buyLink: data.buy_link,
          buyPrice: data.buy_price,
          product2Name: data.product2_name,
          product2Rating: data.product2_rating,
          product2Pros: data.product2_pros,
          product2Cons: data.product2_cons,
          product2Link: data.product2_link,
          product2Price: data.product2_price,
          product2Image: data.product2_image,
          comparisonSpecs: data.comparison_specs
        });
      }
      setLoading(false);
    }

    fetchReview();
  }, [slug]);

  return { review, loading };
}
