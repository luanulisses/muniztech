import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Deal } from '@/types';

export function useDeals(category?: string, limit?: number, isAchadinho?: boolean) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
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

      const { data, error } = await query.order('created_at', { ascending: false });

      if (data) {
        const mappedDeals: Deal[] = data.map(d => ({
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
          features: d.features
        }));
        setDeals(mappedDeals);
      }
      setLoading(false);
    }

    fetchDeals();
  }, [category, limit]);

  return { deals, loading };
}
