// ══════════════════════════════════════════════════════════════════════════════
// SUITE DE TESTES: chatParsers.test.ts (Sprint 3.2.4)
// Validando importação direta de src/lib/chatParsers.ts
// ══════════════════════════════════════════════════════════════════════════════

import { extractPersonName, extractCompanyName, normalizeCompanyName } from './chatParsers.ts';

interface TestCase {
  input: string;
  expected: string | null;
}

const nameTestCases: TestCase[] = [
  { input: 'pode me chamar de Luis', expected: 'Luis' },
  { input: 'boa tarde, pode me chamar de Luis', expected: 'Luis' },
  { input: 'oie boa tarde, me chamo Luan !', expected: 'Luan' },
  { input: 'me chamo João Silva', expected: 'João Silva' },
  { input: 'boa tarde, quero um orçamento', expected: null },
  { input: 'preciso de um sistema', expected: null },
];

const companyTestCases: TestCase[] = [
  { input: 'sou da empresa aqui de Power bi', expected: 'Power BI' },
  { input: 'eu sou da empresa Connect', expected: 'Connect' },
  { input: 'sou da BASA', expected: 'BASA' },
  { input: 'trabalho na FVO Alimentos', expected: 'FVO Alimentos' },
  { input: 'represento a Muniz Tech', expected: 'Muniz Tech' },
  { input: 'projeto pessoal', expected: 'Projeto Pessoal' },
];

export function runChatParserTests() {
  console.log('=== RUNNING CHAT PARSER UNIT TESTS ===');
  let passed = 0;
  let total = nameTestCases.length + companyTestCases.length;

  console.log('\n[NAME TESTS]');
  for (const tc of nameTestCases) {
    const output = extractPersonName(tc.input);
    const ok = output === tc.expected;
    if (ok) passed++;
    console.log(
      `${ok ? '✅' : '❌'} Input: "${tc.input}" => Output: ${JSON.stringify(output)} (Expected: ${JSON.stringify(tc.expected)})`
    );
  }

  console.log('\n[COMPANY TESTS]');
  for (const tc of companyTestCases) {
    const output = extractCompanyName(tc.input);
    const ok = output === tc.expected;
    if (ok) passed++;
    console.log(
      `${ok ? '✅' : '❌'} Input: "${tc.input}" => Output: ${JSON.stringify(output)} (Expected: ${JSON.stringify(tc.expected)})`
    );
  }

  console.log(`\nFinal Score: ${passed}/${total} passed (${((passed / total) * 100).toFixed(1)}%)`);
  return passed === total;
}

// Auto-executar se rodado via Node.js CLI
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('chatParsers.test')) {
  const success = runChatParserTests();
  if (!success) {
    process.exit(1);
  }
}
