import { useState } from 'react';
import { Lead } from '@/hooks/useLeads';
import { Building2, Calendar, Phone, Mail, ChevronDown, Award, FileText, CheckCircle2, Trash2, Sparkles, Bot } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: Lead['status']) => void;
  onUpdateFields?: (id: string, fields: Partial<Lead>) => void;
  onDeleteLead?: (id: string) => void;
  onSelectLead?: (lead: Lead) => void;
}

const STATUS_CONFIG: Record<Lead['status'], { label: string; bg: string; text: string }> = {
  novo: { label: 'Novo', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  em_contato: { label: 'Em Contato', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  reuniao_agendada: { label: 'Reunião Agendada', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  proposta_enviada: { label: 'Proposta Enviada', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  negociacao: { label: 'Negociação', bg: 'bg-pink-50 border-pink-200', text: 'text-pink-700' },
  fechado: { label: 'Fechado', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  perdido: { label: 'Perdido', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
};

export default function LeadsTable({ leads, onStatusChange, onUpdateFields, onDeleteLead, onSelectLead }: LeadsTableProps) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [tempMeeting, setTempMeeting] = useState('');

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-surface-container-high text-center space-y-3">
        <p className="text-on-surface-variant font-label-bold text-base">Nenhum lead encontrado.</p>
        <p className="text-xs text-slate-400">Tente ajustar a busca ou os filtros aplicados.</p>
      </div>
    );
  }

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-purple-700 bg-purple-50 border-purple-200';
    if (score >= 60) return 'text-red-700 bg-red-50 border-red-200';
    if (score >= 30) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getScoreText = (score: number, aiPriority?: string) => {
    if (aiPriority) return aiPriority.toUpperCase();
    if (score >= 80) return 'PRIORITÁRIO ⚡';
    if (score >= 60) return 'QUENTE 🔥';
    if (score >= 30) return 'MORNO ⚡';
    return 'FRIO ❄️';
  };

  const handleSaveNotes = (id: string) => {
    if (onUpdateFields) {
      onUpdateFields(id, { notes: tempNotes });
    }
    setEditingNotesId(null);
  };

  const handleSaveMeeting = (id: string) => {
    if (onUpdateFields) {
      onUpdateFields(id, { meeting_date: tempMeeting || null });
    }
    setEditingMeetingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (onDeleteLead && window.confirm(`Tem certeza que deseja excluir o lead "${name}"? Esta ação não pode ser desfeita.`)) {
      onDeleteLead(id);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-container-high overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
              <th className="py-4 px-6">Nome / Contato</th>
              <th className="py-4 px-6">Empresa</th>
              <th className="py-4 px-6">Serviço / Descrição</th>
              <th className="py-4 px-6">Status / Acompanhamento</th>
              <th className="py-4 px-6">Score & IA</th>
              <th className="py-4 px-6">Data</th>
              <th className="py-4 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high text-xs">
            {leads.map((lead) => {
              const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.novo;
              const displayScore = (lead as any).ai_score ?? lead.score ?? 0;
              const isAnalyzed = Boolean((lead as any).ai_analyzed_at);

              return (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Nome & Contato */}
                  <td className="py-4 px-6 font-medium space-y-1">
                    <div className="font-black text-on-surface text-sm flex items-center gap-1.5">
                      {lead.nome}
                      {isAnalyzed && (
                        <span title="Analisado por IA" className="p-0.5 bg-secondary/10 text-secondary rounded">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 text-[11px] text-on-surface-variant">
                      {lead.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-secondary" /> {lead.telefone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-secondary" /> {lead.email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Empresa */}
                  <td className="py-4 px-6 font-medium text-on-surface-variant">
                    {lead.empresa ? (
                      <span className="flex items-center gap-1.5 text-on-surface font-bold">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {lead.empresa}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </td>

                  {/* Serviço & Descrição */}
                  <td className="py-4 px-6 space-y-1.5 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block px-2.5 py-1 bg-surface-container-low text-on-surface font-black uppercase text-[10px] tracking-wider rounded-lg border border-surface-container-high">
                        {lead.servico}
                      </span>
                      {(lead as any).ai_category && (lead as any).ai_category !== lead.servico && (
                        <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 font-bold uppercase text-[9px] rounded border border-purple-100">
                          IA: {(lead as any).ai_category}
                        </span>
                      )}
                    </div>
                    {lead.descricao && (
                      <p className="text-[11px] text-on-surface-variant line-clamp-3 font-normal leading-relaxed">
                        {lead.descricao}
                      </p>
                    )}
                  </td>

                  {/* Status & Acompanhamento */}
                  <td className="py-4 px-6 space-y-2">
                    {/* Select Status */}
                    <div className="relative inline-block">
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
                        className={`appearance-none px-3 py-1.5 pr-7 rounded-xl font-black text-[10px] uppercase tracking-wider border cursor-pointer focus:outline-none transition-colors ${statusCfg.bg} ${statusCfg.text}`}
                      >
                        <option value="novo">Novo</option>
                        <option value="em_contato">Em Contato</option>
                        <option value="reuniao_agendada">Reunião Agendada</option>
                        <option value="proposta_enviada">Proposta Enviada</option>
                        <option value="negociacao">Negociação</option>
                        <option value="fechado">Fechado</option>
                        <option value="perdido">Perdido</option>
                      </select>
                      <ChevronDown className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${statusCfg.text}`} />
                    </div>

                    {/* Notas do CRM */}
                    <div className="text-[11px]">
                      {editingNotesId === lead.id ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Adicionar nota..."
                            className="px-2 py-1 border border-surface-container-high rounded text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveNotes(lead.id)}
                            className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span
                            onClick={() => {
                              setEditingNotesId(lead.id);
                              setTempNotes(lead.notes || '');
                            }}
                            className="hover:underline cursor-pointer truncate max-w-[120px]"
                            title={lead.notes || 'Clique para adicionar notas'}
                          >
                            {lead.notes || 'Adicionar notas...'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Data de Reunião */}
                    <div className="text-[11px]">
                      {editingMeetingId === lead.id ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="datetime-local"
                            value={tempMeeting}
                            onChange={(e) => setTempMeeting(e.target.value)}
                            className="px-1 py-0.5 border border-surface-container-high rounded text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveMeeting(lead.id)}
                            className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span
                            onClick={() => {
                              setEditingMeetingId(lead.id);
                              setTempMeeting(lead.meeting_date ? new Date(lead.meeting_date).toISOString().slice(0, 16) : '');
                            }}
                            className="hover:underline cursor-pointer"
                            title={lead.meeting_date ? `Reunião marcada: ${formatDate(lead.meeting_date)}` : 'Clique para marcar reunião'}
                          >
                            {lead.meeting_date ? `Reunião: ${formatDate(lead.meeting_date)}` : 'Marcar reunião...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Lead Score & IA */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 font-black text-on-surface">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{displayScore}</span>
                      </div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${getScoreBadgeColor(displayScore)}`}>
                        {getScoreText(displayScore, (lead as any).ai_priority)}
                      </span>
                    </div>
                  </td>

                  {/* Data de Cadastro */}
                  <td className="py-4 px-6 text-on-surface-variant whitespace-nowrap text-[11px] font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(lead.created_at)}
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="py-4 px-6 text-center space-x-1 whitespace-nowrap">
                    {onSelectLead && (
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                        title="Ver análise completa de IA"
                      >
                        <Bot className="w-3.5 h-3.5 text-secondary" />
                        <span>{isAnalyzed ? 'Ver Análise' : 'Analisar'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(lead.id, lead.nome)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center border border-transparent hover:border-red-200"
                      title="Excluir Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
