import { useState, useMemo } from 'react';
import { useLeads, Lead } from '@/hooks/useLeads';
import LeadCard from '@/components/admin/LeadCard';
import LeadFilters from '@/components/admin/LeadFilters';
import LeadsTable from '@/components/admin/LeadsTable';
import LeadAIAnalysis from '@/components/admin/LeadAIAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CalendarDays,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Download,
  X,
  Building2,
  Phone,
  Mail,
  Calendar,
  FileText,
  User,
} from 'lucide-react';

const SERVICES_OPTIONS = [
  'Todos',
  'Desenvolvimento Web',
  'ERP Senior',
  'Oracle',
  'Inteligência Artificial',
  'Automação',
  'Landing Page',
  'SaaS',
  'Dashboard',
  'Integrações',
  'Outro',
];

export default function AdminLeads() {
  const [currentFilter, setCurrentFilter] = useState('todos');
  const { leads, loading, error, refetch, updateLeadStatus, updateLeadFields, deleteLead } = useLeads('todos');

  // Estados de busca, filtros e ordenação
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [selectedService, setSelectedService] = useState('Todos');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'>('date_desc');

  // Estado do Lead selecionado para Análise de IA
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // ── Contagem Geral (sempre em cima da lista completa do banco) ────────────────
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('pt-BR');
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let leadsHoje = 0;
    let leadsMes = 0;
    let fechados = 0;
    let perdidos = 0;

    leads.forEach((l) => {
      const d = new Date(l.created_at);
      const leadDateStr = d.toLocaleDateString('pt-BR');

      if (leadDateStr === todayStr) leadsHoje++;
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) leadsMes++;

      if (l.status === 'fechado') fechados++;
      if (l.status === 'perdido') perdidos++;
    });

    const total = leads.length;
    const conversao = total > 0 ? Math.round((fechados / total) * 100) : 0;
    const ticketMedio = 8500; // Ticket médio simulado de serviços Oracle/ERP/IA

    // Obter contagem por status para as abas de filtro
    const countsMap: Record<string, number> = {
      todos: total,
      novo: 0,
      em_contato: 0,
      reuniao_agendada: 0,
      proposta_enviada: 0,
      negociacao: 0,
      fechado: 0,
      perdido: 0,
    };

    leads.forEach((l) => {
      if (countsMap[l.status] !== undefined) {
        countsMap[l.status]++;
      }
    });

    return {
      leadsHoje,
      leadsMes,
      fechados,
      perdidos,
      conversao,
      ticketMedio,
      counts: countsMap,
    };
  }, [leads]);

  // ── Processamento de Filtros e Busca Local ──────────────────────────────────
  const processedLeads = useMemo(() => {
    let result = [...leads];

    // 1. Filtro da Aba lateral de status
    if (currentFilter !== 'todos') {
      result = result.filter((l) => l.status === currentFilter);
    }

    // 2. Busca por Nome
    if (searchName.trim()) {
      const term = searchName.toLowerCase();
      result = result.filter((l) => l.nome.toLowerCase().includes(term));
    }

    // 3. Busca por Empresa
    if (searchCompany.trim()) {
      const term = searchCompany.toLowerCase();
      result = result.filter((l) => l.empresa?.toLowerCase().includes(term));
    }

    // 4. Filtro por Serviço
    if (selectedService !== 'Todos') {
      result = result.filter((l) => l.servico === selectedService);
    }

    // 5. Ordenação
    result.sort((a, b) => {
      const scoreA = (a as any).ai_score ?? a.score ?? 0;
      const scoreB = (b as any).ai_score ?? b.score ?? 0;
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      if (sortBy === 'date_desc') return dateB - dateA;
      if (sortBy === 'date_asc') return dateA - dateB;
      if (sortBy === 'score_desc') return scoreB - scoreA;
      if (sortBy === 'score_asc') return scoreA - scoreB;
      return 0;
    });

    return result;
  }, [leads, currentFilter, searchName, searchCompany, selectedService, sortBy]);

  // ── Exportação para CSV ──────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (processedLeads.length === 0) return;

    const headers = ['ID', 'Nome', 'Empresa', 'Telefone', 'E-mail', 'Servico', 'Descricao', 'Status', 'Score', 'IA_Summary', 'IA_Priority', 'Data Criacao'];
    const rows = processedLeads.map((l) => [
      l.id,
      l.nome,
      l.empresa || '',
      l.telefone || '',
      l.email || '',
      l.servico,
      l.descricao || '',
      l.status,
      (l as any).ai_score ?? l.score ?? 0,
      (l as any).ai_summary || '',
      (l as any).ai_priority || '',
      l.created_at,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_muniztech_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && leads.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-on-surface uppercase tracking-tight">
            Gestão de Leads & CRM
          </h1>
          <p className="text-on-surface-variant font-label-bold text-sm sm:text-base">
            CRM Inteligente Muniz Tech com Agente Comercial e Análise Preditiva de IA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="h-10 px-4 bg-white border border-surface-container-high text-on-surface hover:bg-slate-50 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Atualizar
          </button>
          <button
            onClick={handleExportCSV}
            disabled={processedLeads.length === 0}
            className="h-10 px-4 bg-secondary text-white hover:bg-secondary-fixed-variant rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl">
          {error}
        </div>
      )}

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <LeadCard
          title="Leads Hoje"
          value={stats.leadsHoje}
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <LeadCard
          title="Leads Mês"
          value={stats.leadsMes}
          icon={CalendarDays}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <LeadCard
          title="Fechados"
          value={stats.fechados}
          icon={CheckCircle}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <LeadCard
          title="Perdidos"
          value={stats.perdidos}
          icon={XCircle}
          color="text-red-600"
          bg="bg-red-50"
        />
        <LeadCard
          title="Conversão"
          value={`${stats.conversao}%`}
          icon={TrendingUp}
          color="text-secondary"
          bg="bg-secondary/10"
        />
        <LeadCard
          title="Ticket Médio"
          value={`R$ ${stats.ticketMedio.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* Banner Muniz AI Sales Assistant Premium */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-[2rem] p-6 text-white border border-secondary/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-secondary/20 text-secondary border border-secondary/30">
                SDR Digital 24h Premium
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo & Notificações Habilitadas
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              MUNIZ AI SALES ASSISTANT PREMIUM
            </h2>
            <p className="text-xs text-slate-300 font-label-bold">
              Painel analítico do Vendedor Digital: qualificação preditiva, disparo de e-mails e conversão em tempo real.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-4 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-sm">
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Leads Gerados IA</span>
              <span className="text-xl font-black text-white">{leads.filter((l) => (l as any).source === 'muniz_ai').length}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-sm">
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Alta Prioridade</span>
              <span className="text-xl font-black text-secondary">
                {leads.filter((l) => (l as any).ai_priority === 'alta' || (l as any).ai_priority === 'crítica').length}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-sm">
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Ticket Médio Est.</span>
              <span className="text-xl font-black text-emerald-400">R$ {stats.ticketMedio.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* FASE 6 — MÉTRICAS SDR PREMIUM */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans relative z-10">
          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Atendimento SDR</span>
            <div className="text-base font-black text-white">24h / 7 dias</div>
            <span className="text-[9px] text-emerald-400 font-mono">Resposta em até 5min</span>
          </div>

          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Taxa Qualificação</span>
            <div className="text-base font-black text-secondary">
              {leads.length > 0
                ? Math.round((leads.filter((l) => (l as any).ai_score && (l as any).ai_score >= 70).length / leads.length) * 100)
                : 100}
              %
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Score Preditivo &gt; 70</span>
          </div>

          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Notificação E-mail</span>
            <div className="text-base font-black text-emerald-400 flex items-center gap-1.5">
              <span>Automática</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Cliente + Cópia Luan</span>
          </div>

          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Top Serviço Solicitado</span>
            <div className="text-sm font-black text-white truncate">ERP Senior & IA</div>
            <span className="text-[9px] text-slate-400 font-mono">Alta Oportunidade</span>
          </div>
        </div>
      </div>

      {/* Resumo do Mês */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-black tracking-widest text-secondary">
            Desempenho Comercial do Mês
          </div>
          <div className="text-sm font-label-bold text-gray-300">
            Resumo dos indicadores de prospecção da Muniz Tech no ciclo atual.
          </div>
        </div>
        <div className="flex gap-6">
          <div>
            <span className="block text-[10px] text-gray-400 font-black uppercase">Leads do mês</span>
            <span className="text-2xl font-black text-white">{stats.leadsMes}</span>
          </div>
          <div className="border-l border-white/10 pl-6">
            <span className="block text-[10px] text-gray-400 font-black uppercase">Fechados</span>
            <span className="text-2xl font-black text-secondary">{stats.fechados}</span>
          </div>
          <div className="border-l border-white/10 pl-6">
            <span className="block text-[10px] text-gray-400 font-black uppercase">Conversão</span>
            <span className="text-2xl font-black text-white">{stats.conversao}%</span>
          </div>
        </div>
      </div>

      {/* Painel de Filtros Avançados */}
      <div className="bg-white rounded-3xl p-5 border border-surface-container-high shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-on-surface">
          <SlidersHorizontal className="w-4 h-4 text-secondary" />
          <span>Filtros & Busca Avançada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca por Nome */}
          <div className="relative">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl pl-10 pr-4 py-2.5 text-xs font-label-bold text-on-surface focus:outline-none focus:border-secondary"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Busca por Empresa */}
          <div className="relative">
            <input
              type="text"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="Buscar por empresa..."
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl pl-10 pr-4 py-2.5 text-xs font-label-bold text-on-surface focus:outline-none focus:border-secondary"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filtro por Serviço */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-on-surface focus:outline-none focus:border-secondary"
            >
              {SERVICES_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Todos' ? 'Serviço: Todos' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="date_desc">Ordenar: Recentes</option>
              <option value="date_asc">Ordenar: Antigos</option>
              <option value="score_desc">Ordenar: Score (Maior)</option>
              <option value="score_asc">Ordenar: Score (Menor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Abas de Status */}
      <div className="pt-2">
        <LeadFilters
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          counts={stats.counts}
        />
      </div>

      {/* Grid Principal */}
      <LeadsTable
        leads={processedLeads}
        onStatusChange={(id, newStatus) => updateLeadStatus(id, newStatus)}
        onUpdateFields={(id, fields) => updateLeadFields(id, fields)}
        onDeleteLead={deleteLead}
        onSelectLead={(lead) => setSelectedLead(lead)}
      />

      {/* Drawer / Modal de Detalhes do Lead & Análise da IA */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end p-0 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-surface border-l border-surface-container-high h-full shadow-2xl z-10 flex flex-col overflow-hidden"
            >
              {/* Header do Drawer */}
              <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <div className="text-[10px] font-black text-secondary uppercase tracking-widest">
                    Detalhes do Lead & IA
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">{selectedLead.nome}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corpo com Scroll */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Dados Cadastrais Originais */}
                <div className="bg-white rounded-3xl p-5 border border-surface-container-high shadow-sm space-y-4">
                  <div className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <User className="w-4 h-4 text-secondary" /> Informações Originais Cadastradas
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-label-bold">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Empresa</span>
                      <span className="text-on-surface font-bold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {selectedLead.empresa || 'Não informada'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Serviço Solicitado</span>
                      <span className="text-on-surface font-bold">{selectedLead.servico}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Telefone / WhatsApp</span>
                      <span className="text-on-surface font-bold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-secondary" />
                        {selectedLead.telefone || 'Não informado'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-black uppercase block">E-mail</span>
                      <span className="text-on-surface font-bold flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-secondary" />
                        {selectedLead.email || 'Não informado'}
                      </span>
                    </div>

                    <div className="sm:col-span-2 space-y-1 pt-1 border-t border-surface-container-high">
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Descrição da Necessidade</span>
                      <p className="text-on-surface-variant font-normal leading-relaxed">
                        {selectedLead.descricao || 'Sem descrição cadastrada pelo cliente.'}
                      </p>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between pt-2 text-[10px] text-slate-400 font-mono">
                      <span>ID: {selectedLead.id}</span>
                      <span>Cadastrado em: {new Date(selectedLead.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Componente Agente IA Comercial */}
                <LeadAIAnalysis
                  lead={selectedLead}
                  onAnalysisUpdated={() => {
                    refetch();
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
