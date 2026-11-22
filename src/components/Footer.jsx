import React from 'react';
import { Phone, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-14 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">CivicFix</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              CivicFix is an online municipal grievance reporting and public works monitoring system designed to bridge citizens and ward engineers with transparent real-time tracking.
            </p>
            <p className="text-slate-500 text-[11px]">
              Built with React 19, Tailwind CSS v4, Leaflet Maps, and Supabase.
            </p>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Bengaluru Municipal Helplines</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>Emergency Police / Ambulance:</span>
                <span className="font-bold text-rose-400">112</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>BBMP Grievance Control Room:</span>
                <span className="font-semibold text-blue-300">1533 / 080-22660000</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>BWSSB Water &amp; Sewage Helpline:</span>
                <span className="font-semibold text-blue-300">1916</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>BESCOM Electricity Helpline:</span>
                <span className="font-semibold text-amber-300">1912</span>
              </li>
              <li className="flex items-center justify-between py-1">
                <span>Bengaluru Traffic Police (BTP):</span>
                <span className="font-semibold text-blue-300">1095</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} CivicFix · Bengaluru Municipal Grievance Redressal System</p>
          <p>Powered by Supabase · Leaflet · React</p>
        </div>
      </div>
    </footer>
  );
}
