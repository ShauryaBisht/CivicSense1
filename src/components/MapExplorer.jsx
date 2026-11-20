import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import InteractiveMap from './InteractiveMap';
import {
  Search,
  MapPin,
  ThumbsUp,
  PlusCircle,
  Map as MapIcon,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function MapExplorer() {
  const {
    issues,
    setSelectedIssue,
    setIsReportModalOpen,
    categories,
    urgencies,
    statuses,
    addToast
  } = useCivic();

  const { user, openLogin } = useAuth();

  const handleOpenReport = () => {
    if (!user) {
      addToast('Please sign in or create an account to report a grievance.', 'info');
      openLogin();
      return;
    }
    setIsReportModalOpen(true);
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [mapSearch, setMapSearch] = useState('');
  const [focusedIssueId, setFocusedIssueId] = useState(null);

  // Filter issues for the map view
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (selectedCategory !== 'All' && issue.category !== selectedCategory) return false;
      if (selectedUrgency !== 'All' && issue.urgency !== selectedUrgency) return false;
      if (selectedStatus !== 'All' && issue.status !== selectedStatus) return false;

      if (mapSearch.trim()) {
        const q = mapSearch.toLowerCase();
        const matches =
          issue.title.toLowerCase().includes(q) ||
          issue.ticketId.toLowerCase().includes(q) ||
          (issue.location.address || '').toLowerCase().includes(q) ||
          (issue.location.neighborhood || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [issues, selectedCategory, selectedUrgency, selectedStatus, mapSearch]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedUrgency !== 'All' ||
    selectedStatus !== 'All' ||
    mapSearch.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedUrgency('All');
    setSelectedStatus('All');
    setMapSearch('');
    setFocusedIssueId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs backdrop-blur-md transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-500/20">
                <MapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                  Bengaluru Municipal Geo-Explorer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time geographic distribution of logged citizen grievances across ward sectors
                </p>
              </div>
            </div>
          </div>

          {/* Action & Filter Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                placeholder="Search ticket, ward, keyword..."
                className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              {mapSearch && (
                <button
                  onClick={() => setMapSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>
                {(categories || []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Urgency Filter */}
            <div className="relative">
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="appearance-none text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="All">All Priorities</option>
                {(urgencies || []).map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {(statuses || []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Report Button */}
            <button
              onClick={handleOpenReport}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs shadow-emerald-950/20 transition-all whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[670px]">
        {/* Left Sidebar List of matching issues */}
        <div className="hidden lg:flex lg:col-span-4 flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs h-full overflow-hidden transition-colors">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/80 text-xs bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white">
                {filteredIssues.length} Grievances Found
              </span>
              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/40">
                Live OpenStreetMap
              </span>
            </div>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">
              Click to pinpoint
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 p-3.5">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs space-y-2">
                <SlidersHorizontal className="w-8 h-8 mx-auto opacity-50" />
                <p>No complaints match current map filters.</p>
                <button
                  onClick={resetFilters}
                  className="text-blue-600 dark:text-blue-400 font-semibold underline text-xs cursor-pointer"
                >
                  Clear active filters
                </button>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isEmergency = issue.urgency === 'Emergency';
                const isHigh = issue.urgency === 'High';
                const isResolved = issue.status === 'Resolved';
                const isSelected = focusedIssueId === issue.id;

                return (
                  <div
                    key={issue.id}
                    onClick={() => {
                      setFocusedIssueId(issue.id);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 text-xs ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200/80 dark:border-slate-700/70 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {issue.ticketId}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[110px]">
                          {issue.category}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : isEmergency
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
                            : isHigh
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        }`}
                      >
                        {issue.urgency}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      {issue.mediaUrl && (
                        <img
                          src={issue.mediaUrl}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                          {issue.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate">
                            {issue.location.address || issue.location.neighborhood}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        👍 {issue.upvotes || 0} Endorsements
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue(issue);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Map Canvas */}
        <div className="col-span-12 lg:col-span-8 h-full rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700/80">
          <InteractiveMap
            issues={filteredIssues}
            mode="explorer"
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            height="100%"
            activeMarkerId={focusedIssueId}
          />
        </div>
      </div>
    </div>
  );
}
