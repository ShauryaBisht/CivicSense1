import React from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  Map,
  Trophy,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Flame,
  MapPin,
  ArrowRight,
  FileText,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Activity,
  Inbox
} from 'lucide-react';

// ─── Shared sub-components ───────────────────────────────────────────────────

function QuickActionCard({ icon: Icon, iconColor, iconBg, title, desc, label, labelColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      {label && (
        <span className={`inline-block mt-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${labelColor}`}>
          {label}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  );
}

// ─── Citizen Home ─────────────────────────────────────────────────────────────

function CitizenHome() {
  const { issues, setActiveTab, setIsReportModalOpen, userKarma, setIsKarmaModalOpen } = useCivic();
  const { profile, user } = useAuth();

  const firstName = profile?.fullName?.split(' ')[0] || 'Citizen';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // My issues: match by userId (real accounts) or by name (demo citizen fallback)
  const myIssues = issues.filter(i =>
    (user?.id && i.reporter?.userId === user.id) ||
    (profile?.fullName && i.reporter?.name === profile.fullName)
  );

  const myActive   = myIssues.filter(i => i.status !== 'Resolved').length;
  const myResolved = myIssues.filter(i => i.status === 'Resolved').length;

  // City-wide trending (top 3 by upvotes, unresolved) — visible to everyone, it's public
  const trending = [...issues]
    .filter(i => i.status !== 'Resolved')
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  const urgencyColor = {
    Emergency: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300',
    High:      'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300',
    Medium:    'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    Low:       'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
  };

  const statusColor = {
    Pending:     'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    'In Progress': 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
    Resolved:    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
  };

  return (
    <div className="space-y-8">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-blue-500/20" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{firstName} 👋</h1>
            <p className="text-blue-100 text-sm mt-2 max-w-md">
              Help make Bengaluru better. Report an issue, endorse your neighbors' reports, or verify resolved tickets to earn Karma.
            </p>
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>

      {/* My Issue Stats */}
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">My Activity</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Issues Reported" value={myIssues.length} icon={FileText}
            color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/40" />
          <StatCard label="Open / Active" value={myActive} icon={Clock}
            color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-950/40" />
          <StatCard label="Resolved" value={myResolved} icon={CheckCircle2}
            color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-950/40" />
        </div>
      </div>

      {/* My Reported Issues list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">My Reported Issues</h2>
          </div>
          <button
            onClick={() => setActiveTab('feed')}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Browse all →
          </button>
        </div>

        {myIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <MapPin className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No issues reported yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center max-w-xs">
              Spot a problem in your neighbourhood? Report it and help the community.
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report your first issue
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myIssues.slice(0, 5).map(issue => (
              <div
                key={issue.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{issue.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusColor[issue.status] || statusColor.Pending}`}>
                      {issue.status || 'Pending'}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${urgencyColor[issue.urgency] || urgencyColor.Low}`}>
                      {issue.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {issue.location?.neighborhood || 'Bengaluru'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-500 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {issue.upvotes || 0}
                </div>
              </div>
            ))}
            {myIssues.length > 5 && (
              <button
                onClick={() => setActiveTab('feed')}
                className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 py-2 hover:underline cursor-pointer"
              >
                View all {myIssues.length} issues →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={PlusCircle}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-50 dark:bg-emerald-950/50"
            title="Report an Issue"
            desc="Submit a civic hazard with photo, location and categorisation."
            label="4-step wizard"
            labelColor="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
            onClick={() => setIsReportModalOpen(true)}
          />
          <QuickActionCard
            icon={Zap}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-50 dark:bg-blue-950/50"
            title="Grievance Feed"
            desc="Browse, search, and endorse civic issues reported across Bengaluru."
            label={`${issues.filter(i => i.status !== 'Resolved').length} active`}
            labelColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
            onClick={() => setActiveTab('feed')}
          />
          <QuickActionCard
            icon={Map}
            iconColor="text-indigo-600 dark:text-indigo-400"
            iconBg="bg-indigo-50 dark:bg-indigo-950/50"
            title="Map Explorer"
            desc="View all reported issues on a live Leaflet map with urgency pins."
            label="Interactive"
            labelColor="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
            onClick={() => setActiveTab('map')}
          />
          <QuickActionCard
            icon={Trophy}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-50 dark:bg-amber-950/50"
            title="Ward Rankings"
            desc="See which wards are resolving fastest and which need more attention."
            label="198 wards"
            labelColor="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
            onClick={() => setActiveTab('wards')}
          />
        </div>
      </div>

      {/* Karma + City Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Civic Karma */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Your Civic Karma</h2>
            </div>
            <button
              onClick={() => setIsKarmaModalOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              View badges →
            </button>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {userKarma?.points || 0}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm pb-1 font-medium">points</span>
            <span className="ml-auto text-sm font-bold text-amber-600 dark:text-amber-400 pb-1">
              Level {Math.floor((userKarma?.points || 0) / 100) + 1}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              style={{ width: `${(userKarma?.points || 0) % 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Reports', value: userKarma?.reportsCount || 0, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Endorsed', value: userKarma?.endorsementsCount || 0, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Verified', value: userKarma?.verificationsCount || 0, color: 'text-indigo-600 dark:text-indigo-400' }
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl py-3">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* City-wide Trending */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Top City Issues</h2>
            </div>
            <button
              onClick={() => setActiveTab('feed')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              View all →
            </button>
          </div>
          {trending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-400" />
              <p className="text-sm font-medium">All issues resolved!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trending.map((issue, idx) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 mt-0.5 w-4 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{issue.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${urgencyColor[issue.urgency] || urgencyColor.Low}`}>
                        {issue.urgency}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {issue.location?.neighborhood || 'Bengaluru'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-500 shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {issue.upvotes}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Admin Home ───────────────────────────────────────────────────────────────

function AdminHome() {
  const { issues, setActiveTab } = useCivic();
  const { profile } = useAuth();

  const firstName = profile?.fullName?.split(' ')[0] || 'Official';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const total      = issues.length;
  const pending    = issues.filter(i => i.status === 'Pending').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved   = issues.filter(i => i.status === 'Resolved').length;
  const emergency  = issues.filter(i => (i.urgency === 'Emergency' || i.urgency === 'High') && i.status !== 'Resolved').length;
  const resRate    = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Department breakdown
  const deptMap = {};
  issues.forEach(i => {
    const dept = i.department || 'Other';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptBreakdown = Object.entries(deptMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent unresolved issues
  const recentOpen = [...issues]
    .filter(i => i.status !== 'Resolved')
    .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Admin welcome banner — distinct indigo/violet theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-violet-500/20" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-violet-200" />
              <span className="text-violet-200 text-xs font-bold uppercase tracking-wider">Municipal Official</span>
            </div>
            <p className="text-indigo-200 text-sm font-medium">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{firstName} 👋</h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-md">
              Welcome to the BBMP Operations Centre. Manage open tickets, dispatch field crews, and track city-wide resolution progress.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <LayoutDashboard className="w-4 h-4" />
            Open Admin Console
          </button>
        </div>
      </div>

      {/* Emergency alert */}
      {emergency > 0 && (
        <div
          onClick={() => setActiveTab('admin')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/60 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800 dark:text-red-300">
              {emergency} Emergency / High-Priority Issue{emergency > 1 ? 's' : ''} Require Action
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              Click to open the Admin Console and manage these tickets immediately.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-red-500 shrink-0" />
        </div>
      )}

      {/* City-wide stats */}
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">City Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Reported" value={total} icon={MapPin}
            color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/40" />
          <StatCard label="Pending" value={pending} icon={Clock}
            color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-950/40" />
          <StatCard label="In Progress" value={inProgress} icon={Activity}
            color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-950/40" />
          <StatCard label="Resolved" value={resolved} icon={CheckCircle2}
            color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-950/40" />
          <StatCard label="Emergency/High" value={emergency} icon={AlertTriangle}
            color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-950/40" />
          <StatCard label="Resolution Rate" value={`${resRate}%`} icon={TrendingUp}
            color="text-violet-600 dark:text-violet-400" bg="bg-violet-50 dark:bg-violet-950/40" />
        </div>
      </div>

      {/* Recent open tickets + department breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent open tickets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Recent Open Tickets</h2>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Manage all →
            </button>
          </div>
          {recentOpen.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-400" />
              <p className="text-sm font-medium">All tickets resolved!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOpen.map(issue => (
                <div
                  key={issue.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{issue.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        issue.urgency === 'Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
                        issue.urgency === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>{issue.urgency}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{issue.department || 'General'}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {issue.location?.neighborhood || 'Bengaluru'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-500 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                    {issue.upvotes || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-violet-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Issues by Department</h2>
          </div>
          {deptBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {deptBreakdown.map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-32 truncate shrink-0">{dept}</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${Math.round((count / total) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-6 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Default export — routes by role ─────────────────────────────────────────

export default function HomePage() {
  const { profile } = useAuth();
  return profile?.role === 'admin' ? <AdminHome /> : <CitizenHome />;
}
