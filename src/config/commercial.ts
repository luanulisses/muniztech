// ══════════════════════════════════════════════════════════════════════════════
// COMMERCIAL CONFIG — Faixas de ticket estimado por serviço (Muniz Tech)
// ══════════════════════════════════════════════════════════════════════════════

export interface TicketRange {
  min: number;
  max: number;
  currency: string;
}

export const COMMERCIAL_TICKET_RANGES: Record<string, TicketRange> = {
  'Landing Page': { min: 1500, max: 5000, currency: 'BRL' },
  'Desenvolvimento Web': { min: 3000, max: 15000, currency: 'BRL' },
  'Dashboard': { min: 3000, max: 12000, currency: 'BRL' },
  'Automação': { min: 2500, max: 20000, currency: 'BRL' },
  'Integrações API': { min: 3000, max: 25000, currency: 'BRL' },
  'ERP Senior': { min: 3000, max: 30000, currency: 'BRL' },
  'Oracle': { min: 2500, max: 20000, currency: 'BRL' },
  'SaaS': { min: 8000, max: 50000, currency: 'BRL' },
  'Inteligência Artificial': { min: 5000, max: 50000, currency: 'BRL' },
  'Outro': { min: 2000, max: 15000, currency: 'BRL' },
};

export function getTicketRangeForService(servico: string): TicketRange {
  return COMMERCIAL_TICKET_RANGES[servico] || COMMERCIAL_TICKET_RANGES['Outro'];
}
