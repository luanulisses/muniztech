import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWhatsAppProjectUrl } from '@/config/links';

const WA_GROUP_LINK = "https://chat.whatsapp.com/Gx9zc632S6ELMamlBmnlHx";
const WA_PORTFOLIO_LINK = getWhatsAppProjectUrl();

export default function WhatsAppCTA() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(true);
  const location = useLocation();

  const isPortfolio = location.pathname === '/conheca-a-muniz-tech' || location.pathname === '/portfolio';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    const tooltipTimer = setTimeout(() => setTooltip(false), 8000);
    return () => { clearTimeout(timer); clearTimeout(tooltipTimer); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes wa-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wa-pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        .wa-float { animation: wa-float 3s ease-in-out infinite; }
        .wa-pulse { animation: wa-pulse 2s infinite; }
        @media (max-width: 767px) {
          .whatsapp-floating-cta {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="whatsapp-floating-cta hidden md:flex fixed bottom-24 right-4 md:bottom-8 md:right-6 z-30 flex-col items-end gap-2"
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: visible ? 'auto' : 'none'
        }}
      >
        {/* Tooltip */}
        {tooltip && (
          <div className="wa-float bg-white rounded-2xl shadow-lg px-4 py-3 max-w-[220px] border border-green-200 relative">
            <button
              onClick={() => setTooltip(false)}
              className="absolute -top-2 -right-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-300 text-xs font-bold"
              aria-label="Fechar"
            >
              ×
            </button>
            {isPortfolio ? (
              <p className="text-xs font-bold text-gray-800 leading-snug">
                💬 Precisa de um projeto ou automação?{' '}
                <span style={{ color: '#25D366' }}>Fale com a Muniz Tech!</span>
              </p>
            ) : (
              <p className="text-xs font-bold text-gray-800 leading-snug">
                📲 Receba alertas de oferta{' '}
                <span style={{ color: '#25D366' }}>grátis no WhatsApp!</span>
              </p>
            )}
          </div>
        )}

        {/* Botão Principal */}
        <a
          href={isPortfolio ? WA_PORTFOLIO_LINK : WA_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-white font-bold rounded-full shadow-xl px-5 py-3 transition-transform duration-300 hover:scale-105 wa-pulse"
          style={{ backgroundColor: '#25D366' }}
          aria-label={isPortfolio ? "Falar com Luan sobre um projeto" : "Entrar no grupo do WhatsApp da MunizTech"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="text-sm whitespace-nowrap">
            {isPortfolio ? "Falar sobre meu projeto" : "Entrar no Grupo"}
          </span>
        </a>
      </div>
    </>
  );
}
