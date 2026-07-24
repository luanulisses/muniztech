// ══════════════════════════════════════════════════════════════════════════════
// MUNIZ TECH — CHAT PARSERS & NORMALIZERS (Sprint 3.2.4 — Single Source of Truth)
// ══════════════════════════════════════════════════════════════════════════════

const GREETING_WORDS = [
  'boa tarde',
  'bom dia',
  'boa noite',
  'olá',
  'ola',
  'oie',
  'oi',
  'ei',
  'salve',
];

const DEMAND_WORDS = [
  'orçamento',
  'orcamento',
  'projeto',
  'preciso',
  'quero',
  'valor',
  'quanto custa',
  'sistema', 'site',
  'ajuda',
  'solução',
  'solucao',
];

const NAME_PREFIX_PATTERNS = [
  /(?:pode\s+me\s+chamar\s+de|pode\s+chamar\s+de|me\s+chama\s+de)\s+([A-Za-zÀ-ÿ\s]{2,40})/i,
  /(?:meu\s+nome\s+[eé]|me\s+chamo|chamo-me|chamo)\s+([A-Za-zÀ-ÿ\s]{2,40})/i,
  /(?:aqui\s+[eé]\s+(?:o|a)?|sou\s+(?:o|a))\s+([A-Za-zÀ-ÿ\s]{2,40})/i,
];

const KNOWN_COMPANIES: Record<string, string> = {
  'power bi': 'Power BI',
  'fvo alimentos': 'FVO Alimentos',
  'muniz tech': 'Muniz Tech',
  'basa': 'BASA',
  'erp senior': 'ERP Senior',
  'oracle': 'Oracle',
  'connect': 'Connect',
};

const COMPANY_PREFIX_REGEXES = [
  /^eu\s+sou\s+da\s+empresa\s+/i,
  /^trabalho\s+na\s+empresa\s+/i,
  /^represento\s+a\s+empresa\s+/i,
  /^minha\s+empresa\s+[eé]\s+/i,
  /^a\s+empresa\s+[eé]\s+/i,
  /^sou\s+da\s+empresa\s+/i,
  /^empresa\s+aqui\s+de\s+/i,
  /^aqui\s+da\s+empresa\s+/i,
  /^trabalho\s+na\s+/i,
  /^trabalho\s+no\s+/i,
  /^represento\s+a\s+/i,
  /^represento\s+o\s+/i,
  /^sou\s+da\s+/i,
  /^sou\s+do\s+/i,
  /^empresa\s+/i,
];

const RESIDUAL_PREFIXES = [
  /^aqui\s+de\s+/i,
  /^aqui\s+da\s+/i,
  /^aqui\s+do\s+/i,
  /^da\s+/i,
  /^de\s+/i,
  /^do\s+/i,
  /^na\s+/i,
  /^no\s+/i,
  /^a\s+/i,
  /^o\s+/i,
];

/**
 * Format person name with correct capitalization.
 * Preserves prepositions in lowercase ("de", "da", "do", "e").
 */
export function formatName(name: string): string {
  const clean = name.replace(/[^A-Za-zÀ-ÿ\s]/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const lowerWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
  return clean
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && lowerWords.includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Extract clean person name from natural input phrase.
 * Returns null if the input is a greeting only or a budget request without name.
 */
export function extractPersonName(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  let text = input.trim();

  // Strip leading greetings (multiple passes if greetings are stacked like "oie boa tarde,")
  let previousText = '';
  while (text !== previousText) {
    previousText = text;
    for (const greeting of GREETING_WORDS) {
      const regex = new RegExp(`^${greeting}[,\\s!.-]*`, 'i');
      text = text.replace(regex, '').trim();
    }
  }

  if (!text) return null;

  // Check if input is purely a budget/demand request
  const lower = text.toLowerCase();
  const isDemandOnly =
    DEMAND_WORDS.some((word) => lower.includes(word)) &&
    !NAME_PREFIX_PATTERNS.some((p) => p.test(text));

  if (isDemandOnly) {
    return null;
  }

  // Check prefix patterns ("pode me chamar de", "me chamo", "sou o", etc.)
  for (const pattern of NAME_PREFIX_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const candidate = match[1].trim();
      const cleanCandidate = candidate
        .replace(/\b(?:quero|preciso|orçamento|orcamento|projeto)\b.*$/i, '')
        .trim();
      if (cleanCandidate.length >= 2) {
        return formatName(cleanCandidate);
      }
    }
  }

  // Direct name fallback (1 to 3 words, no demand keywords, not purely a greeting)
  const words = text.split(/\s+/);
  const containsDemand = DEMAND_WORDS.some((w) => lower.includes(w));

  if (!containsDemand && words.length >= 1 && words.length <= 3) {
    const cleanWord = text.replace(/[^A-Za-zÀ-ÿ\s]/g, '').trim();
    if (cleanWord.length >= 2 && !GREETING_WORDS.includes(cleanWord.toLowerCase())) {
      return formatName(cleanWord);
    }
  }

  return null;
}

/**
 * Normalize company names using official brand capitalization or standard word capitalization.
 */
export function normalizeCompanyName(value: string): string {
  if (!value) return '';
  const trimmed = value.trim().replace(/^[^A-Za-z0-9À-ÿ]+|[^A-Za-z0-9À-ÿ]+$/g, '');
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();

  if (KNOWN_COMPANIES[lower]) {
    return KNOWN_COMPANIES[lower];
  }

  // Preserve acronyms in all-caps (e.g. BASA, IBM, FVO)
  if (/^[A-Z0-9]{2,6}$/.test(trimmed)) {
    return trimmed;
  }

  const words = trimmed.split(/\s+/);
  return words
    .map((w) => {
      if (/^[A-Z0-9]{2,6}$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Extract clean company name from natural user statement.
 * Removes prefixes like "sou da empresa aqui de", "eu sou da empresa", "trabalho na", etc.
 */
export function extractCompanyName(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  let text = input.trim();

  // Strip greetings
  let previousText = '';
  while (text !== previousText) {
    previousText = text;
    for (const greeting of GREETING_WORDS) {
      const regex = new RegExp(`^${greeting}[,\\s!.-]*`, 'i');
      text = text.replace(regex, '').trim();
    }
  }

  if (!text) return null;

  // Handle special case: "projeto pessoal"
  if (/^projeto\s+pessoal$/i.test(text)) {
    return 'Projeto Pessoal';
  }

  // Strip company prefixes
  for (const regex of COMPANY_PREFIX_REGEXES) {
    if (regex.test(text)) {
      text = text.replace(regex, '').trim();
      break;
    }
  }

  // Strip residual prepositions ("aqui de", "da", "do", "na", etc.)
  for (const regex of RESIDUAL_PREFIXES) {
    if (regex.test(text)) {
      text = text.replace(regex, '').trim();
    }
  }

  if (!text) return null;

  return normalizeCompanyName(text);
}
