import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCivic } from '../context/CivicContext';
import AuthModal from './AuthModal';
import ToastContainer from './ToastContainer';
import {
  ShieldAlert,
  ArrowRight,
  MapPin,
  Zap,
  CheckCircle2,
  Clock,
  Users,
  User,
  ShieldCheck,
  BarChart3,
  Eye,
  Award
} from 'lucide-react';

const FEATURES = [
  {
    icon: MapPin,
    title: 'GPS-Precise Reporting',
    desc: 'Pin the exact location of any civic issue on an interactive Leaflet map with GPS auto-detect or manual placement.',
  },
  {
    icon: Zap,
    title: 'AI Smart Triage',
    desc: 'Describes your issue and the on-device engine auto-classifies category, urgency, and routes it to the right BBMP department.',
  },
  {
    icon: Eye,
    title: 'Live Status Tracking',
    desc: 'Every ticket has a live timeline — Submitted → Assigned → In Progress → Resolved — updated in real time via Supabase.',
  },
  {
    icon: CheckCircle2,
    title: 'Before / After Verification',
    desc: 'Drag a slider to compare the original hazard photo with the resolution proof uploaded by the municipal field team.',
  },
  {
    icon: Award,
    title: 'Civic Karma System',
    desc: 'Earn points and unlock badges for every report, endorsement and resolution you verify. Level up as a civic contributor.',
  },
  {
    icon: BarChart3,
    title: 'Ward Performance Index',
    desc: 'Public SLA rankings for all 198 Bengaluru wards — resolution rates, turnaround time, and engineer contacts.',
  },
];

const STEPS = [
  {
    num: '1',
    title: 'Report the Issue',
    desc: 'Upload a photo, drop a map pin, and describe the problem. The 4-step wizard takes under 60 seconds.',
  },
  {
    num: '2',
    title: 'AI Categorises It',
    desc: 'On-device triage reads your description, picks the category and urgency, and routes to the right department automatically.',
  },
  {
    num: '3',
    title: 'Officials Dispatch',
    desc: 'The ward officer assigns a field crew, sets an ETA, and all updates appear in your ticket timeline.',
  },
  {
    num: '4',
    title: 'You Verify the Fix',
    desc: 'Once resolved, compare Before/After photos, rate the quality, and earn Civic Karma for the verification.',
  },
];

export default function LandingPage() {
  const { openLogin, openRegister, loginAsDemo } = useAuth();
  const { addToast } = useCivic();

  return (
    <div className="min-h-screen bg-[#0b1120] text-white">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Civic<span className="text-blue-400">Fix</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Bengaluru
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openLogin}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
              Sign In
            </button>
            <button onClick={openRegister}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Civic Grievance Platform · Bengaluru, Karnataka
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
              Report. Track.
              <br />
              <span className="text-blue-400">Get it Fixed.</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              CivicFix connects Bengaluru residents with municipal officials.
              Report potholes, broken streetlights, sewage overflows — and track
              every step of resolution in real time.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <button onClick={openRegister}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={openLogin}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer">
                Sign In
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-500">Try a demo account →</span>
              <button
                onClick={() => { loginAsDemo('citizen'); addToast('Signed in as Aarav Sharma (Demo Citizen)', 'success'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer">
                <User className="w-4 h-4 text-emerald-400" />
                Demo Citizen
              </button>
              <button
                onClick={() => { loginAsDemo('admin'); addToast('Signed in as Kavitha R. (Demo Official)', 'success'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Demo Official
              </button>
            </div>
          </div>

          {/* Right — static issue ticket preview */}
          <div className="hidden lg:flex flex-col gap-3">
            {/* Header label */}
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Live Issues · Bengaluru</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">● Live</span>
            </div>

            {/* Ticket 1 */}
            <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">#CIVIC-8492</span>
                  <p className="text-sm font-bold text-white mt-0.5">Deep Crater Pothole on 80 Feet Road</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 shrink-0 ml-2">High</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Koramangala</span>
                <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">In Progress</span>
              </div>
            </div>

            {/* Ticket 2 */}
            <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">#CIVIC-7831</span>
                  <p className="text-sm font-bold text-white mt-0.5">Exposed Live Wire Near School Gate</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 shrink-0 ml-2">Emergency</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Indiranagar</span>
                <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Assigned</span>
              </div>
            </div>

            {/* Ticket 3 */}
            <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">#CIVIC-8290</span>
                  <p className="text-sm font-bold text-white mt-0.5">Garbage Overflow at Market Junction</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0 ml-2">Medium</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Jayanagar</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Resolved</span>
              </div>
            </div>

            {/* Summary row */}
            <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-slate-600">
              <span>Showing 3 of 2,400+ issues</span>
              <span className="text-blue-400 font-medium">Updated just now</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '2,400+', label: 'Issues Resolved', icon: CheckCircle2, color: 'text-emerald-400' },
            { value: '198',    label: 'Wards Covered',   icon: MapPin,       color: 'text-blue-400'    },
            { value: '< 48h', label: 'Avg Response',    icon: Clock,        color: 'text-amber-400'   },
            { value: '12k+',  label: 'Active Citizens', icon: Users,        color: 'text-indigo-400'  },
          ].map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className={`w-5 h-5 ${color} mb-1`} />
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Features</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Everything built in,
            <span className="text-slate-500"> nothing missing.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] hover:border-white/12 transition-colors">
              <Icon className="w-5 h-5 text-blue-400 mb-4" />
              <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Pothole to repaired road
              <span className="text-slate-500"> in 4 steps.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black text-lg flex items-center justify-center">
                  {num}
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Citizen vs Official ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Who Is It For</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Two roles.
            <span className="text-slate-500"> One platform.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Citizen */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Citizen</h3>
                <p className="text-xs text-slate-500">Public resident</p>
              </div>
            </div>
            <ul className="space-y-3 mb-7">
              {[
                'Report issues with photo + GPS pin in 60 seconds',
                'Endorse neighbours\' reports to boost priority',
                'Track live status in a detailed ticket timeline',
                'Compare Before/After photos of resolved issues',
                'Earn Karma points and unlock achievement badges',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={openRegister}
              className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
              Create Citizen Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Official */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Municipal Official</h3>
                <p className="text-xs text-slate-500">BBMP ward officer / field supervisor</p>
              </div>
            </div>
            <ul className="space-y-3 mb-7">
              {[
                '5-stage Kanban board for all ward tickets',
                'Emergency alert ticker for high-priority issues',
                'One-click crew dispatch with contact details',
                'Upload proof-of-work photos to resolve tickets',
                'Department workload charts and CSV export',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => { loginAsDemo('admin'); addToast('Signed in as Kavitha R. (Demo Official)', 'success'); }}
              className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
              Try Demo Official Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/5 bg-white/[0.02] py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Start using CivicFix today.
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Create a free account or jump straight in with a demo — no setup needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={openRegister}
              className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { loginAsDemo('citizen'); addToast('Signed in as Aarav Sharma (Demo Citizen)', 'success'); }}
              className="flex items-center gap-2 px-7 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer">
              <User className="w-4 h-4" /> Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-sm text-white">
              Civic<span className="text-blue-400">Fix</span>
            </span>
            <span className="text-slate-600 text-sm">· Bengaluru Municipal Redressal Platform</span>
          </div>
          <p className="text-xs text-slate-600">
            Bengaluru Civic Grievance Platform · React + Supabase + Leaflet
          </p>
        </div>
      </footer>

      <AuthModal />
      <ToastContainer />
    </div>
  );
}
