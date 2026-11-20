import React, { useState, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ListFilter,
  PlusCircle,
  Bell,
  RotateCcw,
  Menu,
  X,
  Map as MapIcon,
  LayoutDashboard,
  Sun,
  Moon,
  Trophy,
  Award,
  WifiOff,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';
import UserProfileModal from './UserProfileModal';

export default function Header() {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    setIsReportModalOpen,
    unreadNotifCount,
    resetToDefaultData,
    issues,
    theme,
    toggleTheme,
    isOnline,
    offlineQueue,
    userKarma,
    setIsKarmaModalOpen,
    isBackendConnected,
    addToast
  } = useCivic();

  const {
    user,
    profile,
    openLogin,
    openRegister,
    signOut
  } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Synchronize context role strictly with authenticated profile role from Supabase DB
  useEffect(() => {
    if (profile?.role === 'admin') {
      setRole('admin');
    } else {
      setRole('citizen');
      if (activeTab === 'admin') {
        setActiveTab('feed');
      }
    }
  }, [profile?.role, setRole, activeTab, setActiveTab]);

  // Count active (non-resolved) issues
  const activeReportsCount = issues.filter((i) => i.status !== 'Resolved').length;

  const handleOpenReport = () => {
    if (!user) {
      addToast('Please sign in or create an account to report a grievance.', 'info');
      openLogin();
      return;
    }
    setIsReportModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 transition-colors border-b bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-800 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px] gap-4">
            
            {/* 1. Brand & Portal Title */}
            <div
              onClick={() => {
                setActiveTab(role === 'admin' ? 'admin' : 'feed');
              }}
              className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                    Civic<span className="text-blue-600 dark:text-blue-400">Fix</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    Bengaluru
                  </span>
                  {isBackendConnected && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60" title="Connected to live Supabase PostgreSQL backend">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Cloud Sync
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block -mt-0.5 font-medium">
                  Municipal Redressal & Public Works
                </span>
              </div>
            </div>

            {/* 2. Desktop Navigation Bar (Feed, Map View, Ward Index, Admin Console) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Feed</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeTab === 'feed'
                    ? 'bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {activeReportsCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>

              <button
                onClick={() => setActiveTab('wards')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'wards'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Ward Index</span>
              </button>

              {profile?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Admin Console</span>
                </button>
              )}
            </nav>

            {/* 3. Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Civic Karma Points Badge */}
              <button
                onClick={() => setIsKarmaModalOpen(true)}
                className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="View Civic Karma Points & Badges"
              >
                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{userKarma?.points || 120}</span>
                <span className="hidden xl:inline text-[10px] font-medium text-amber-600/80 dark:text-amber-400/80">pts</span>
              </button>

              {/* Primary Report Issue CTA */}
              <button
                onClick={handleOpenReport}
                className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs shadow-emerald-900/10 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Issue</span>
              </button>



              {/* Supabase Auth Component: Sign In Button or Profile Pill */}
              {!user ? (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shadow-blue-900/10 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  title="View Civic Profile & Account Details"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden xl:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[105px]">
                      {profile?.fullName?.split(' ')[0] || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {profile?.role === 'admin' ? 'Official' : 'Citizen'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
                </button>
              )}

              {/* Utility Icon Group (Theme, Notifications, Reset Demo) */}
              <div className="flex items-center gap-1 sm:gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-90" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
                  )}
                </button>

                {/* Notification Bell */}
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="System Notifications & Alerts"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Reset Demo Data Button */}
                <button
                  onClick={resetToDefaultData}
                  className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset demo data to initial Bengaluru grievances"
                  aria-label="Reset demo state"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 dark:bg-slate-900/98 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2.5 backdrop-blur-md shadow-lg">
            
            {/* Mobile Auth Banner / Profile Header */}
            {!user ? (
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
                    Welcome to CivicFix
                  </span>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300">
                    Sign in to track reports & earn karma
                  </span>
                </div>
                <button
                  onClick={() => {
                    openLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {profile?.fullName || 'User'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                      {profile?.role === 'admin' ? 'Municipal Official' : 'Citizen Member'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold p-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Navigation Links */}
            {/* Mobile Navigation Links */}
            <button
              onClick={() => {
                setActiveTab('feed');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'feed'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ListFilter className="w-4 h-4" />
                <span>Grievance Feed</span>
              </div>
              <span className="font-mono bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">
                {activeReportsCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('map');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'map'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map Explorer</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('wards');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'wards'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Ward Performance Index</span>
            </button>

            {profile?.role === 'admin' && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === 'admin'
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Admin Operations</span>
              </button>
            )}

            {/* Mobile Actions Section */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenReport();
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>

              <button
                onClick={() => {
                  resetToDefaultData();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-2 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
