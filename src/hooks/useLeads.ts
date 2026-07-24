import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Lead {
  id: string;
  nome: string;
  empresa?: string | null;
  telefone?: string | null;
  email?: string | null;
  servico: string;
  descricao?: string | null;
  origem?: string | null;
  status: 'novo' | 'em_contato' | 'reuniao_agendada' | 'proposta_enviada' | 'negociacao' | 'fechado' | 'perdido';
  score: number;
  source?: string | null;
  notes?: string | null;
  last_contact?: string | null;
  meeting_date?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  created_at: string;
  updated_at: string;
}

export function useLeads(statusFilter?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase não configurado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        setError(supabaseError.message);
      } else if (data) {
        setLeads(data as Lead[]);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = async (id: string, newStatus: Lead['status']) => {
    if (!isSupabaseConfigured) return false;

    try {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) {
        console.error('[useLeads] Erro ao atualizar status:', updateError.message);
        return false;
      }

      setLeads((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      return true;
    } catch (err) {
      console.error('[useLeads] Exceção ao atualizar status:', err);
      return false;
    }
  };

  const updateLeadFields = async (id: string, fields: Partial<Lead>) => {
    if (!isSupabaseConfigured) return false;

    try {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) {
        console.error('[useLeads] Erro ao atualizar campos:', updateError.message);
        return false;
      }

      setLeads((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
      );
      return true;
    } catch (err) {
      console.error('[useLeads] Exceção ao atualizar campos:', err);
      return false;
    }
  };

  const deleteLead = async (id: string) => {
    if (!isSupabaseConfigured) return false;

    try {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('[useLeads] Erro ao deletar lead:', deleteError.message);
        return false;
      }

      setLeads((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      console.error('[useLeads] Exceção ao deletar lead:', err);
      return false;
    }
  };

  return { leads, loading, error, refetch: fetchLeads, updateLeadStatus, updateLeadFields, deleteLead };
}
