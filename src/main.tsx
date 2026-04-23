import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// Configuração global do QueryClient focada em performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dados são considerados "frescos" por 5 minutos
      gcTime: 1000 * 60 * 15, // Garbage collection remove do cache após 15 minutos inativos
      refetchOnWindowFocus: false, // Evita requisições extras ao focar na aba se o dado não está "stale"
      retry: 2, // Em caso de falha de rede, tenta novamente 2 vezes
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
