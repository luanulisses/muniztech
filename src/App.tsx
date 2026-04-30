import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import UrgencyBar from '@/components/UrgencyBar';

// Lazy loading pages
const Home = React.lazy(() => import('@/pages/Home'));
const Category = React.lazy(() => import('@/pages/Category'));
const Review = React.lazy(() => import('@/pages/Review'));
const Comparison = React.lazy(() => import('@/pages/Comparison'));
const Deals = React.lazy(() => import('@/pages/Deals'));
const OfferLanding = React.lazy(() => import('@/pages/OfferLanding'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Listicle = React.lazy(() => import('@/pages/Listicle'));
const Search = React.lazy(() => import('@/pages/Search'));
const Achadinhos = React.lazy(() => import('@/pages/Achadinhos'));
const TrabalheConosco = React.lazy(() => import('@/pages/TrabalheConosco'));
const PoliticaEditorial = React.lazy(() => import('@/pages/PoliticaEditorial'));
const TermosDeUso = React.lazy(() => import('@/pages/TermosDeUso'));
const Privacidade = React.lazy(() => import('@/pages/Privacidade'));

// Admin Pages
const AdminLogin = React.lazy(() => import('@/pages/admin/Login'));
const AdminLayout = React.lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminPendingDeals = React.lazy(() => import('@/pages/admin/AdminPendingDeals'));
const AdminDeals = React.lazy(() => import('@/pages/admin/AdminDeals'));
const AdminReviews = React.lazy(() => import('@/pages/admin/AdminReviews'));
const AdminCategories = React.lazy(() => import('@/pages/admin/AdminCategories'));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-grow"
    >
      {children}
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {!isAdminPath && <UrgencyBar />}
      {!isAdminPath && <Header />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/categoria/:slug" element={<PageWrapper><Category /></PageWrapper>} />
              <Route path="/analises" element={<PageWrapper><Review /></PageWrapper>} />
              <Route path="/analises/:slug" element={<PageWrapper><Review /></PageWrapper>} />
              <Route path="/comparativo" element={<PageWrapper><Comparison /></PageWrapper>} />
              <Route path="/comparativo/:slug" element={<PageWrapper><Comparison /></PageWrapper>} />
              <Route path="/ofertas" element={<PageWrapper><Deals /></PageWrapper>} />
              <Route path="/ofertas/:slug" element={<PageWrapper><OfferLanding /></PageWrapper>} />
              <Route path="/sobre" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contato" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/busca" element={<PageWrapper><Search /></PageWrapper>} />
              <Route path="/trabalhe-conosco" element={<PageWrapper><TrabalheConosco /></PageWrapper>} />
              <Route path="/politica-editorial" element={<PageWrapper><PoliticaEditorial /></PageWrapper>} />
              <Route path="/termos-de-uso" element={<PageWrapper><TermosDeUso /></PageWrapper>} />
              <Route path="/privacidade" element={<PageWrapper><Privacidade /></PageWrapper>} />
              <Route path="/achadinhos" element={<PageWrapper><Achadinhos /></PageWrapper>} />
              <Route path="/artigo/5-gadgets-baratos" element={<PageWrapper><Listicle /></PageWrapper>} />

              {/* Admin Login (No Layout) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="pendentes" element={<AdminPendingDeals />} />
                <Route path="ofertas" element={<AdminDeals />} />
                <Route path="avaliacoes" element={<AdminReviews />} />
                <Route path="categorias" element={<AdminCategories />} />
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {!isAdminPath && <Footer />}
      {!isAdminPath && <Navigation />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
