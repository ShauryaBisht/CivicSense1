import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CitizenFeed from './components/CitizenFeed';
import MapExplorer from './components/MapExplorer';
import AdminDashboard from './components/AdminDashboard';
import WardLeaderboard from './components/WardLeaderboard';
import ReportWizardModal from './components/ReportWizardModal';
import IssueDetailModal from './components/IssueDetailModal';
import ReceiptModal from './components/ReceiptModal';
import CivicKarmaModal from './components/CivicKarmaModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import { WifiOff, Loader2 } from 'lucide-react';

// ── Main App Layout (only rendered after sign-in) ─────────────────────────────
function MainLayout() {
  const {
    activeTab,
    isReportModalOpen,
    setIsReportModalOpen,
    selectedIssue,
    setSelectedIssue,
    receiptIssue,
    setReceiptIssue,
    isKarmaModalOpen,
    setIsKarmaModalOpen,
    isOnline,
    offlineQueue
  } = useCivic();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-200 antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 font-semibold text-center flex items-center justify-center gap-2 shadow-sm">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Offline Mode: Submissions stored locally and will auto-sync once reconnected.</span>
          {offlineQueue?.length > 0 && (
            <span className="bg-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
              {offlineQueue.length} Pending Sync
            </span>
          )}
        </div>
      )}

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-6">
        {activeTab === 'home'  && <HomePage />}
        {activeTab === 'feed'  && <CitizenFeed />}
        {activeTab === 'map'   && <MapExplorer />}
        {activeTab === 'wards' && <WardLeaderboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      <ReportWizardModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

      {selectedIssue && (
        <IssueDetailModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}

      {receiptIssue && (
        <ReceiptModal issue={receiptIssue} onClose={() => setReceiptIssue(null)} />
      )}

      <CivicKarmaModal isOpen={isKarmaModalOpen} onClose={() => setIsKarmaModalOpen(false)} />
      <AuthModal />
      <ToastContainer />
      <Footer />
    </div>
  );
}

// ── Root: shows LandingPage or app depending on auth state ────────────────────
function RootRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b18]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return user ? <MainLayout /> : <LandingPage />;
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <CivicProvider>
      <AuthProvider>
        <RootRouter />
      </AuthProvider>
    </CivicProvider>
  );
}
