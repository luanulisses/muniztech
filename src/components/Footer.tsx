import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container-high py-16 px-4 md:px-8 mb-16 md:mb-0 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="text-2xl font-black text-on-surface tracking-tighter uppercase">
              Muniz<span className="text-secondary">Tech</span>
            </div>
            <p className="font-label-bold text-on-surface-variant max-w-sm mx-auto md:mx-0 text-base leading-relaxed">
              Sua fonte confiável para análises de tecnologia e as melhores ofertas da internet. Testamos tudo para você comprar com segurança.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              {[Instagram, Twitter, Github, Send].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-surface-container-low text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-full transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface">Institucional</h4>
            <div className="flex flex-col gap-3">
              <Link to="/sobre" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Sobre Nós</Link>
              <Link to="/contato" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Contato</Link>
              <a href="#" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Trabalhe Conosco</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface">Legal</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Política Editorial</a>
              <a href="#" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Termos de Uso</a>
              <a href="#" className="text-sm font-label-bold text-on-surface-variant hover:text-secondary transition-colors">Privacidade</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            © 2024 MunizTech. Todos os direitos reservados.
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant max-w-md text-center md:text-right">
            Divulgação: Ganhamos comissão por links afiliados. Isso não afeta nossa opinião editorial.
          </p>
        </div>
      </div>
    </footer>
  );
}
