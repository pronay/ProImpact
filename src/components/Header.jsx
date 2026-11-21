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
    <header className="backdrop-blur-xl bg-white/85 border-b border-slate-200/80 sticky top-0 z-40 shadow-sm transition-all">
      {/* 3-Role Perspective Switcher Bar */}
      <RolePortalSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />

      {/* Executive Telemetry Ribbon (Stripe Precision Style) */}
      <div className="bg-slate-50/90 border-b border-slate-200/60 py-1 px-4 overflow-hidden text-xs font-mono text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 flex-shrink-0 font-bold text-[11px] text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="uppercase tracking-wider">Monsoon Telemetry:</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium whitespace-nowrap">
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
              <span className="text-slate-400">Total Spend</span>
              <span className="font-bold text-slate-900">{formatCr(kpis.total_spend_inr)}</span>
              <span className="text-slate-400 text-[10px]">/ {formatCr(kpis.total_budget_inr)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-rose-800 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Relapse Waste</span>
              <span className="font-bold">{formatCr(kpis.total_wasted_inr)}</span>
              <span className="text-[10px] opacity-80">({kpis.overall_reopened_pct}%)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-amber-800 shadow-sm">
              <span>DLP Warranty Breaches</span>
              <span className="font-bold">{formatCr(kpis.total_dlp_breach_inr)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 text-sky-800 shadow-sm">
              <span>City SLA Met</span>
              <span className="font-bold">{kpis.overall_sla_met_pct}%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300 text-slate-700 shadow-sm">
              <span>Watchlist</span>
              <span className="font-bold text-slate-900">{kpis.contractors_on_watchlist} Firms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Apple Squircle Rupee Logo */}
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl shadow-md flex items-center justify-center font-sans font-bold text-xl ring-1 ring-white/20">
            <span className="text-sky-400">₹</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
                ProTrace
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-bold border border-sky-200">
                v2.1
              </span>
              <span className={`nb-badge text-[10px] ${
                activeRole === 'citizen' ? 'nb-badge-mint' :
                activeRole === 'officer' ? 'nb-badge-cyan' : 'nb-badge-orange'
              }`}>
                {activeRole.toUpperCase()} CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {activeRole === 'citizen' && "Public civic road health, QR passport verification, and legal transparency"}
              {activeRole === 'officer' && "Municipal audit triage, rate card compliance, and DLP warranty recoveries"}
              {activeRole === 'contractor' && "Empanelled agency scorecard, right-of-response, and IMD force majeure proofs"}
            </p>
          </div>
        </div>

        {/* Global Stats Snapshot Pills */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-0.5">
          <div className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-3 py-1.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Total Monsoon Spend</span>
            <span className="font-bold text-xs sm:text-sm font-mono text-slate-900">{formatCr(kpis.total_spend_inr)}</span>
          </div>
          <div className="bg-rose-50/80 border border-rose-200 shadow-sm px-3 py-1.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-medium text-rose-600 uppercase tracking-wider">Relapse Drain</span>
            <span className="font-bold text-xs sm:text-sm font-mono text-rose-700">{formatCr(kpis.total_wasted_inr)}</span>
          </div>
          <div className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-3 py-1.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Audit Flags</span>
            <span className="font-bold text-xs sm:text-sm font-mono text-amber-600">{kpis.total_flagged_work_orders}</span>
          </div>
        </div>
      </div>

      {/* Modern Cupertino Segmented Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/60 text-slate-600'
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
