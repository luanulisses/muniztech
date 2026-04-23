import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export default function PoliticaEditorial() {
  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors mb-8 md:mb-12">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <header className="mb-10 md:mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-on-surface uppercase tracking-tight">
              Política Editorial
            </h1>
          </div>
          <p className="text-on-surface-variant font-label-bold text-sm md:text-base">
            Última atualização: Janeiro de 2026
          </p>
        </header>

        <div className="space-y-10 md:space-y-14">
          {[
            {
              title: '1. Nossa Missão',
              content: 'A MunizTech tem como missão fornecer análises honestas, imparciais e baseadas em evidências reais sobre produtos de tecnologia. Nosso compromisso é com o leitor — não com fabricantes ou anunciantes.',
            },
            {
              title: '2. Independência Editorial',
              content: 'Todo conteúdo publicado pela MunizTech é produzido de forma 100% independente. Nenhum fabricante, loja ou parceiro comercial possui controle sobre a nota, o conteúdo ou a conclusão de nossas análises. Empresas que anunciam conosco não recebem tratamento editorial diferenciado.',
            },
            {
              title: '3. Links de Afiliados',
              content: 'A MunizTech pode ganhar comissão quando você clica em links de afiliados e realiza uma compra. Essa prática não interfere na nossa avaliação dos produtos. Os preços e a disponibilidade são verificados no momento da publicação, mas podem variar.',
            },
            {
              title: '4. Processo de Análise',
              content: 'Nossas análises são baseadas em: uso real dos produtos, especificações técnicas verificadas, feedback de usuários da comunidade, comparação com produtos similares do mercado e histórico de preços. A nota final é decidida exclusivamente pela equipe editorial.',
            },
            {
              title: '5. Correções e Atualizações',
              content: 'Se identificarmos erros em um conteúdo publicado, realizamos a correção imediatamente, indicando a data e a natureza da alteração. Nosso compromisso é com a precisão das informações.',
            },
            {
              title: '6. Produtos Enviados para Teste',
              content: 'Eventualmente, fabricantes enviam produtos para teste editorial. Nesses casos, o produto é devolvido após a análise ou indicamos claramente no texto que se trata de uma unidade de teste. O envio de produto não garante avaliação positiva.',
            },
            {
              title: '7. Contato Editorial',
              content: 'Para questões editoriais, sugestões de pauta ou correções, entre em contato pelo e-mail: contato@muniztech.com.br',
            },
          ].map((section) => (
            <section key={section.title} className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-surface-container-high shadow-sm">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <div className="space-y-3">
                  <h2 className="text-base md:text-lg font-black text-on-surface uppercase tracking-tight">{section.title}</h2>
                  <p className="text-on-surface-variant font-label-bold text-sm md:text-base leading-relaxed">{section.content}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
