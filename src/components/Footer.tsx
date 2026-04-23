import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container-high py-12 md:py-16 px-4 md:px-8 mb-20 md:mb-0 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-left mb-10 md:mb-12">
          {/* Marca */}
          <div className="col-span-2 space-y-4">
            <div className="text-2xl font-black text-on-surface tracking-tighter uppercase">
              Muniz<span className="text-secondary">Tech</span>
            </div>
            <p className="font-label-bold text-on-surface-variant max-w-sm text-sm leading-relaxed">
              Sua fonte confiável para análises de tecnologia e as melhores ofertas da internet. Testamos tudo para você comprar com segurança.
            </p>
            {/* Redes sociais comentadas até termos os links */}
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
              Redes sociais em breve
            </p>
          </div>

          {/* Institucional */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface">Institucional</h4>
            <div className="flex flex-col gap-3">
              <Link to="/sobre" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Sobre Nós</Link>
              <Link to="/contato" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Contato</Link>
              <Link to="/trabalhe-conosco" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Trabalhe Conosco</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface">Legal</h4>
            <div className="flex flex-col gap-3">
              <Link to="/politica-editorial" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Política Editorial</Link>
              <Link to="/termos-de-uso" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Termos de Uso</Link>
              <Link to="/privacidade" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Privacidade</Link>
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center md:text-left">
            © 2026 MunizTech. Todos os direitos reservados.
          </p>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-on-surface-variant max-w-xs md:max-w-md text-center md:text-right leading-relaxed">
            Divulgação: Ganhamos comissão por links afiliados. Isso não afeta nossa opinião editorial.
          </p>
        </div>
      </div>
    </footer>
  );
}
