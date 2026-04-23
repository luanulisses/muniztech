import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermosDeUso() {
  const sections = [
    {
      title: '1. Aceitação dos Termos',
      content: 'Ao acessar e utilizar o site MunizTech (muniztech.com.br), você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize o site.',
    },
    {
      title: '2. Uso do Site',
      content: 'O conteúdo deste site é fornecido para fins informativos e educacionais. Você pode acessar e ler o conteúdo livremente. É proibido copiar, reproduzir ou distribuir o conteúdo sem autorização expressa da MunizTech.',
    },
    {
      title: '3. Precisão das Informações',
      content: 'Nos esforçamos para manter as informações atualizadas e precisas. No entanto, preços, disponibilidade e especificações de produtos podem mudar sem aviso prévio. A MunizTech não se responsabiliza por decisões de compra baseadas exclusivamente em nosso conteúdo.',
    },
    {
      title: '4. Links de Terceiros',
      content: 'Nosso site contém links para lojas e serviços de terceiros. A MunizTech não se responsabiliza pelo conteúdo, políticas de privacidade ou práticas de sites terceiros. O acesso a esses links é de sua total responsabilidade.',
    },
    {
      title: '5. Links de Afiliados',
      content: 'Alguns links em nosso site são links de afiliados. Quando você clica e realiza uma compra, podemos receber uma comissão sem custo adicional para você. Isso nos ajuda a manter o site ativo e o conteúdo gratuito.',
    },
    {
      title: '6. Propriedade Intelectual',
      content: 'Todo o conteúdo do site — textos, imagens, logotipos e análises — é propriedade da MunizTech ou de seus autores, protegido por leis de direitos autorais. Qualquer uso não autorizado é expressamente proibido.',
    },
    {
      title: '7. Limitação de Responsabilidade',
      content: 'A MunizTech não se responsabiliza por danos diretos, indiretos ou consequentes resultantes do uso ou da impossibilidade de usar nosso site ou seu conteúdo.',
    },
    {
      title: '8. Alterações nos Termos',
      content: 'Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação. O uso contínuo do site constitui aceitação dos novos termos.',
    },
    {
      title: '9. Contato',
      content: 'Para dúvidas sobre estes Termos de Uso, entre em contato: contato@muniztech.com.br',
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
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-on-surface uppercase tracking-tight">
              Termos de Uso
            </h1>
          </div>
          <p className="text-on-surface-variant font-label-bold text-sm md:text-base">
            Última atualização: Janeiro de 2026
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
