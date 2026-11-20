import React, { useMemo, useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Trophy,
  Award,
  Medal,
  CheckCircle,
  Clock,
  Star,
  Building,
  TrendingUp,
  MapPin,
  ArrowRight,
  Filter,
  BarChart3,
  ShieldAlert,
  Flame
} from 'lucide-react';

export default function WardLeaderboard() {
  const { issues, setActiveTab, setFilter, wardsConfig } = useCivic();
  const [selectedMetric, setSelectedMetric] = useState('rate'); // 'rate' | 'turnaround' | 'satisfaction'

  // Standard Bengaluru Ward Configurations
  const WARDS_CONFIG = [
    {
      id: 'ward-151',
      name: 'Ward 151: Koramangala',
      zone: 'South Zone',
      neighborhood: 'Koramangala',
      slaHoursAvg: 18,
      leadEngineer: 'AEE Suresh Gowda',
      wardOffice: '80 Feet Road, 5th Block'
    },
    {
      id: 'ward-174',
      name: 'Ward 174: HSR Layout',
      zone: 'Bommanahalli Zone',
      neighborhood: 'HSR Layout',
      slaHoursAvg: 22,
      leadEngineer: 'AEE Venkatesh Murthy',
      wardOffice: '27th Main Road, Sector 1'
    },
    {
      id: 'ward-134',
      name: 'Ward 134: Jayanagar',
      zone: 'South Zone',
      neighborhood: 'Jayanagar',
      slaHoursAvg: 16,
      leadEngineer: 'AEE Ramesh Kumar',
      wardOffice: '10th Main, 3rd Block'
    },
    {
      id: 'ward-85',
      name: 'Ward 85: Indiranagar',
      zone: 'East Zone',
      neighborhood: 'Indiranagar',
      slaHoursAvg: 26,
      leadEngineer: 'AEE Radhakrishna',
      wardOffice: '100 Feet Road, HAL 2nd Stage'
    },
    {
      id: 'ward-45',
      name: 'Ward 45: Malleshwaram',
      zone: 'West Zone',
      neighborhood: 'Malleshwaram',
      slaHoursAvg: 20,
      leadEngineer: 'AEE S. Narayana',
      wardOffice: 'Sampige Road, 8th Cross'
    },
    {
      id: 'ward-83',
      name: 'Ward 83: Whitefield / ITPL',
      zone: 'Mahadevapura Zone',
      neighborhood: 'Whitefield',
      slaHoursAvg: 34,
      leadEngineer: 'AEE Manjunath B.',
      wardOffice: 'ITPL Main Road, Hope Farm'
    },
    {
      id: 'ward-160',
      name: 'Ward 160: Outer Ring Road',
      zone: 'Mahadevapura Zone',
      neighborhood: 'Outer Ring Road',
      slaHoursAvg: 30,
      leadEngineer: 'AEE Anand Rao',
      wardOffice: 'Bellandur EcoSpace Junction'
    }
  ];

  // Compute live statistics for each ward based on current issues state
  const wardStats = useMemo(() => {
    const list = wardsConfig && wardsConfig.length > 0 ? wardsConfig : WARDS_CONFIG;
    return list.map((cfg) => {
      // Match issues that mention this neighborhood
      const matchedIssues = issues.filter((i) => {
        const text = `${i.location?.neighborhood || ''} ${i.location?.address || ''} ${i.title}`.toLowerCase();
        return text.includes(cfg.neighborhood.toLowerCase());
      });

      const total = matchedIssues.length;
      const resolved = matchedIssues.filter((i) => i.status === 'Resolved').length;
      const active = total - resolved;
      const emergency = matchedIssues.filter(
        (i) => (i.urgency === 'Emergency' || i.urgency === 'High') && i.status !== 'Resolved'
      ).length;

      // Calculate resolution rate %
      const rate = total > 0 ? Math.round((resolved / total) * 100) : 80;

      // Average satisfaction rating from feedback
      const verifiedWithRating = matchedIssues.filter((i) => i.feedback?.rating);
      const avgRating =
        verifiedWithRating.length > 0
          ? (
              verifiedWithRating.reduce((sum, item) => sum + item.feedback.rating, 0) /
              verifiedWithRating.length
            ).toFixed(1)
          : '4.8';

      // Computed Civic Grade
      let grade = 'A';
      if (rate >= 80) grade = 'A+';
      else if (rate >= 60) grade = 'A';
      else if (rate >= 40) grade = 'B';
      else grade = 'C';

      return {
        ...cfg,
        totalIssues: total,
        resolvedIssues: resolved,
        activeIssues: active,
        emergencyIssues: emergency,
        resolutionRate: rate,
        avgRating,
        grade
      };
    }).sort((a, b) => {
      if (selectedMetric === 'rate') return b.resolutionRate - a.resolutionRate;
      if (selectedMetric === 'turnaround') return a.slaHoursAvg - b.slaHoursAvg;
      if (selectedMetric === 'satisfaction') return parseFloat(b.avgRating) - parseFloat(a.avgRating);
      return 0;
    });
  }, [issues, selectedMetric]);

  // Overall City Averages
  const cityResolutionRate = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter((i) => i.status === 'Resolved').length;
    return total > 0 ? Math.round((resolved / total) * 100) : 0;
  }, [issues]);

  const topWard = wardStats[0];

  const handleFilterWardInFeed = (neighborhood) => {
    setFilter((prev) => ({
      ...prev,
      search: neighborhood
    }));
    setActiveTab('feed');
  };

  return (
    <div className="space-y-5">
      {/* Top Hero Overview Banner */}
      <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>BBMP Municipal Ward Accountability Index</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Bengaluru Ward Performance Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent evaluation of ward public works divisions across South, East, West, Bommanahalli, and Mahadevapura zones based on resolution velocity, SLA adherence, and citizen satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center min-w-[130px]">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">City Redressal Rate</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {cityResolutionRate}%
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center min-w-[140px]">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Top Performing Ward</div>
              <div className="text-xs font-black text-blue-600 dark:text-blue-400 truncate mt-1">
                {topWard?.name.replace('Ward ', '')}
              </div>
            </div>
          </div>
        </div>

        {/* Metric Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Sort Rankings By:
          </span>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900/60">
            <button
              onClick={() => setSelectedMetric('rate')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                selectedMetric === 'rate'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Resolution Rate %
            </button>
            <button
              onClick={() => setSelectedMetric('turnaround')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                selectedMetric === 'turnaround'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Fastest Turnaround SLA
            </button>
            <button
              onClick={() => setSelectedMetric('satisfaction')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                selectedMetric === 'satisfaction'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Citizen Satisfaction ★
            </button>
          </div>
        </div>
      </div>

      {/* Ward Cards List */}
      <div className="space-y-3.5">
        {wardStats.map((ward, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;

          let medalColor = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
          if (rank === 1) medalColor = 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20';
          else if (rank === 2) medalColor = 'bg-slate-300 text-slate-900 font-bold';
          else if (rank === 3) medalColor = 'bg-amber-700 text-white font-bold';

          return (
            <div
              key={ward.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Rank & Ward Info */}
              <div className="flex items-start gap-3.5 min-w-[280px]">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${medalColor}`}>
                  #{rank}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {ward.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {ward.zone}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Office: {ward.wardOffice} • Lead: {ward.leadEngineer}</span>
                  </div>
                </div>
              </div>

              {/* Middle Metrics Progress Bar */}
              <div className="flex-1 max-w-md space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Resolution Rate: <strong className="text-emerald-600 dark:text-emerald-400">{ward.resolutionRate}%</strong>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {ward.resolvedIssues} of {ward.totalIssues} fixed
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${ward.resolutionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Avg Turnaround: <strong>{ward.slaHoursAvg}h</strong></span>
                  <span>Citizen Rating: <strong>{ward.avgRating} / 5.0 ★</strong></span>
                  {ward.emergencyIssues > 0 && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      <span>{ward.emergencyIssues} Critical</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Right Grade & View Action */}
              <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700/60">
                <div className="text-center px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[9px] uppercase font-bold text-slate-400">Grade</div>
                  <div className="text-sm font-black text-blue-600 dark:text-blue-400">{ward.grade}</div>
                </div>

                <button
                  onClick={() => handleFilterWardInFeed(ward.neighborhood)}
                  className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-bold text-xs px-3.5 py-2 rounded-xl border border-blue-200/80 dark:border-blue-800/80 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>View Ward Feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
