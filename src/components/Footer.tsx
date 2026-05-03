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
            {/* Card de convite para o grupo de WhatsApp */}
            <a
              href="https://chat.whatsapp.com/Gx9zc632S6ELMamlBmnlHx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b85a] text-white rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Grupo Gratuito</p>
                <p className="text-sm font-bold leading-tight">Ofertas no WhatsApp 🔥</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Institucional */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface">Institucional</h4>
            <div className="flex flex-col gap-3">
              <Link to="/sobre" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Sobre Nós</Link>
              <Link to="/contato" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Contato</Link>
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
