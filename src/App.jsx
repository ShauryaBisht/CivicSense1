import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
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
import { WifiOff } from 'lucide-react';

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
          <span>Offline Mode: You are working offline. Submissions will be stored in local cache and automatically synced to municipal dispatch once reconnected.</span>
          {offlineQueue?.length > 0 && (
            <span className="bg-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
              {offlineQueue.length} Pending Sync
            </span>
          )}
        </div>
      )}

      {/* Top Navigation Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-6">
        {activeTab === 'feed' && <CitizenFeed />}
        {activeTab === 'map' && <MapExplorer />}
        {activeTab === 'wards' && <WardLeaderboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Report Issue Modal */}
      <ReportWizardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Issue Details Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}

      {/* Official Grievance Acknowledgement Receipt Modal */}
      {receiptIssue && (
        <ReceiptModal
          issue={receiptIssue}
          onClose={() => setReceiptIssue(null)}
        />
      )}

      {/* Civic Karma Profile & Badges Modal */}
      <CivicKarmaModal
        isOpen={isKarmaModalOpen}
        onClose={() => setIsKarmaModalOpen(false)}
      />

      {/* Supabase Authentication Modal (Sign In / Register / Reset Password) */}
      <AuthModal />

      {/* Toast Alert Notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </CivicProvider>
  );
}
