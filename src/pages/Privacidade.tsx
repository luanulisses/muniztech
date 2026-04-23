import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export default function Privacidade() {
  const sections = [
    {
      title: '1. Informações que Coletamos',
      content: 'Coletamos informações que você nos fornece voluntariamente, como nome e e-mail ao preencher formulários de contato. Também coletamos dados de uso do site de forma anônima e agregada (páginas visitadas, tempo de sessão) para melhorar nossa experiência.',
    },
    {
      title: '2. Como Usamos suas Informações',
      content: 'Utilizamos as informações coletadas para: responder às suas mensagens de contato, melhorar o conteúdo e a navegação do site, entender quais análises e ofertas são mais relevantes para nosso público.',
    },
    {
      title: '3. Cookies',
      content: 'Nosso site utiliza cookies para análise de tráfego (Google Analytics) e para salvar suas preferências de navegação. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.',
    },
    {
      title: '4. Links de Afiliados e Terceiros',
      content: 'Cliques em links de afiliados podem ser rastreados por plataformas parceiras (Amazon, Mercado Livre, etc.) para fins de comissionamento. Estas plataformas possuem suas próprias políticas de privacidade.',
    },
    {
      title: '5. Compartilhamento de Dados',
      content: 'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. Podemos compartilhar dados apenas se exigido por lei ou para proteger nossos direitos legais.',
    },
    {
      title: '6. Segurança',
      content: 'Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet é 100% seguro.',
    },
    {
      title: '7. Seus Direitos (LGPD)',
      content: 'De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: acessar seus dados pessoais, corrigir dados incompletos ou incorretos, solicitar a exclusão de seus dados, e revogar o consentimento a qualquer momento.',
    },
    {
      title: '8. Contato',
      content: 'Para exercer seus direitos ou esclarecer dúvidas sobre esta política de privacidade, entre em contato: contato@muniztech.com.br',
    },
  ];

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors mb-8 md:mb-12">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <header className="mb-10 md:mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-on-surface uppercase tracking-tight">
              Privacidade
            </h1>
          </div>
          <p className="text-on-surface-variant font-label-bold text-sm md:text-base">
            Última atualização: Janeiro de 2026 · Em conformidade com a LGPD
          </p>
        </header>

        <div className="space-y-4 md:space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="bg-white rounded-[20px] md:rounded-[28px] p-6 md:p-8 border border-surface-container-high shadow-sm">
              <h2 className="text-sm md:text-base font-black text-on-surface uppercase tracking-tight mb-3">{section.title}</h2>
              <p className="text-on-surface-variant font-label-bold text-sm leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
