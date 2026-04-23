import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Hook base para buscar dados do Supabase utilizando React Query.
 * @param queryKey Chave única para o cache (ex: ['users', userId])
 * @param tableName Nome da tabela no Supabase
 * @param select Opcional. Quais colunas selecionar (default: '*')
 * @param options Opções adicionais do react-query
 */
export function useSupabaseQuery<T>(
  queryKey: unknown[],
  tableName: string,
  select = '*',
  options?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T[], Error>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName).select(select);

      if (error) {
        throw new Error(error.message);
      }

      return data as T[];
    },
    ...options,
  });
}
