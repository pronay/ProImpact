import React from 'react';
import { ShieldAlert, IndianRupee, MapPin, Building2, Compass, Search, AlertTriangle, CheckCircle2, Map, Calendar, GitCommit, User, Shield, HardHat, FileText, QrCode } from 'lucide-react';
import RolePortalSwitcher from './RolePortalSwitcher';

export default function Header({ activeTab, setActiveTab, activeRole, setActiveRole, kpis, totalFlagged }) {
  // Define role-specific navigation tabs
  const getTabsForRole = () => {
    if (activeRole === 'citizen') {
      return [
        { id: 'citizen-portal', label: 'Citizen Grievance & Locality', icon: Search, badge: 'Public', badgeColor: 'nb-badge-mint' },
        { id: 'futuristic-map', label: 'Safety & Flood Lifelines', icon: Map, badge: 'GIS Map', badgeColor: 'nb-badge-cyan' },
        { id: 'lifecycle-graph', label: 'Rupee Trace & 4-Stage Lifecycle', icon: GitCommit, badge: 'Audit Trail' }
      ];
    } else if (activeRole === 'contractor') {
      return [
        { id: 'contractor-portal', label: 'Agency Extranet & Dispute Desk', icon: HardHat, badge: 'Right of Response', badgeColor: 'nb-badge-orange' },
        { id: 'scorecards', label: 'Performance Scorecards', icon: CheckCircle2, badge: 'Context-Normalized' },
        { id: 'ward-timeline', label: 'Weather Delay Proofs (Gantt)', icon: Calendar, badge: 'IMD Rain Sync', badgeColor: 'nb-badge-cyan' },
        { id: 'lifecycle-graph', label: 'Lifecycle Evidence Gap', icon: GitCommit }
      ];
    } else {
      // Government / Ward Officer
      return [
        { id: 'officer-portal', label: 'Executive Audit & Escalation', icon: Shield, badge: 'Admin Console', badgeColor: 'nb-badge-cyan' },
        { id: 'futuristic-map', label: 'GIS Operations Command', icon: Map, badge: 'Full Layers' },
        { id: 'ward-trail', label: 'Ward Money Trail', icon: Building2, badge: '24 Wards' },
        { id: 'ward-timeline', label: 'Ward Weather Timelines', icon: Calendar, badge: 'Weather Sync' },
        { id: 'auditor', label: 'Forensic Repair Auditor', icon: ShieldAlert, badge: `${totalFlagged} Flags`, badgeColor: 'nb-badge-coral' },
        { id: 'next-rupee', label: 'Next Rupee Allocator', icon: Compass, badge: 'H-ROI' },
        { id: 'scorecards', label: 'Debarment Watchlist', icon: CheckCircle2, badge: `${kpis.contractors_on_watchlist} Active`, badgeColor: 'nb-badge-orange' }
      ];
    }
  };

  const tabs = getTabsForRole();
  const formatCr = (num) => `₹${(num / 10000000).toFixed(2)} Cr`;

  return (
    <header className="backdrop-blur-3xl bg-slate-950/80 border-b border-white/10 sticky top-0 z-40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all">
      {/* 3-Role Perspective Switcher Bar */}
      <RolePortalSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />

      {/* Executive Telemetry Ribbon (Obsidian Liquid Glass) */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 py-1.5 px-4 overflow-hidden text-xs font-mono text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 flex-shrink-0 font-bold text-[11px] text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ring-2 ring-cyan-500/30"></span>
            <span className="uppercase tracking-wider">Monsoon Telemetry:</span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-medium whitespace-nowrap">
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
              <span className="text-slate-400">Total Spend</span>
              <span className="font-bold text-white font-mono">{formatCr(kpis.total_spend_inr)}</span>
              <span className="text-slate-500 text-[10px]">/ {formatCr(kpis.total_budget_inr)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-rose-950/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-rose-500/30 text-rose-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Relapse Waste</span>
              <span className="font-bold font-mono text-rose-400">{formatCr(kpis.total_wasted_inr)}</span>
              <span className="text-[10px] text-rose-400/70">({kpis.overall_reopened_pct}%)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-950/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/30 text-amber-300 shadow-sm">
              <span>DLP Breaches</span>
              <span className="font-bold font-mono text-amber-400">{formatCr(kpis.total_dlp_breach_inr)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-cyan-950/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-cyan-500/30 text-cyan-300 shadow-sm">
              <span>City SLA Met</span>
              <span className="font-bold font-mono text-cyan-400">{kpis.overall_sla_met_pct}%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-slate-300 shadow-sm">
              <span>Watchlist</span>
              <span className="font-bold font-mono text-white">{kpis.contractors_on_watchlist} Firms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Apple Squircle Rupee Logo with Cyan Specular Glow */}
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 text-white rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center font-sans font-bold text-xl border border-cyan-400/40">
            <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">₹</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                ProTrace
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 backdrop-blur text-cyan-300 text-[10px] font-mono font-bold border border-cyan-400/30">
                v2.1
              </span>
              <span className={`nb-badge text-[10px] ${
                activeRole === 'citizen' ? 'nb-badge-mint' :
                activeRole === 'officer' ? 'nb-badge-cyan' : 'nb-badge-orange'
              }`}>
                {activeRole.toUpperCase()} CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {activeRole === 'citizen' && "Public civic road health, QR passport verification, and legal transparency"}
              {activeRole === 'officer' && "Municipal audit triage, rate card compliance, and DLP warranty recoveries"}
              {activeRole === 'contractor' && "Empanelled agency scorecard, right-of-response, and IMD force majeure proofs"}
            </p>
          </div>
        </div>

        {/* Global Stats Snapshot Pills (VisionOS Obsidian Glass) */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-0.5">
          <div className="liquid-glass-sub px-3 py-1.5 rounded-2xl flex flex-col">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Monsoon Spend</span>
            <span className="font-bold text-xs sm:text-sm font-mono text-white">{formatCr(kpis.total_spend_inr)}</span>
          </div>
          <div className="bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 shadow-[0_4px_16px_rgba(239,68,68,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] px-3 py-1.5 rounded-2xl flex flex-col">
            <span className="text-[10px] font-medium text-rose-400 uppercase tracking-wider">Relapse Drain</span>
            <span className="font-bold text-xs sm:text-sm font-mono text-rose-300">{formatCr(kpis.total_wasted_inr)}</span>
          </div>
          <div className="liquid-glass-sub px-3 py-1.5 rounded-2xl flex flex-col">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Audit Flags</span>
            <span className="font-bold text-xs sm:text-sm font-mono text-amber-400">{kpis.total_flagged_work_orders}</span>
          </div>
        </div>
      </div>

      {/* VisionOS Segmented Navigation Dock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5">
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none bg-slate-900/60 backdrop-blur-3xl p-1.5 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.5)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg border border-white/20 ring-1 ring-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-white/5 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
