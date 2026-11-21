import React from 'react';
import { ShieldAlert, IndianRupee, MapPin, Building2, Compass, Search, AlertTriangle, CheckCircle2, Map, Calendar, GitCommit, User, Shield, HardHat, FileText, QrCode } from 'lucide-react';
import RolePortalSwitcher from './RolePortalSwitcher';

export default function Header({ activeTab, setActiveTab, activeRole, setActiveRole, kpis, totalFlagged }) {
  // Define role-specific navigation tabs
  const getTabsForRole = () => {
    if (activeRole === 'citizen') {
      return [
        { id: 'citizen-portal', label: 'Citizen Grievance & Locality', icon: Search, badge: 'Public Transparency', badgeColor: 'nb-badge-yellow' },
        { id: 'futuristic-map', label: 'Citizen Safety & Flood Map', icon: Map, badge: 'Hotspots & Lifelines', badgeColor: 'nb-badge-cyan' },
        { id: 'lifecycle-graph', label: 'Public Rupee Trace & Lifecycle', icon: GitCommit, badge: '4-Stage Story' }
      ];
    } else if (activeRole === 'contractor') {
      return [
        { id: 'contractor-portal', label: 'Agency Extranet & Dispute Desk', icon: HardHat, badge: 'Right of Response', badgeColor: 'nb-badge-orange' },
        { id: 'scorecards', label: 'Performance Scorecards', icon: CheckCircle2, badge: 'Context Normalized' },
        { id: 'ward-timeline', label: 'Weather Delay Proofs (Gantt)', icon: Calendar, badge: 'IMD Rain & Tides', badgeColor: 'nb-badge-cyan' },
        { id: 'lifecycle-graph', label: 'Lifecycle Evidence Gap', icon: GitCommit }
      ];
    } else {
      // Government / Ward Officer
      return [
        { id: 'officer-portal', label: 'Executive Audit & Escalation', icon: Shield, badge: 'Admin Console', badgeColor: 'nb-badge-cyan' },
        { id: 'futuristic-map', label: 'GIS Operational Command Map', icon: Map, badge: 'Full Layers' },
        { id: 'ward-trail', label: 'Ward Money Trail', icon: Building2, badge: '24 Wards' },
        { id: 'ward-timeline', label: 'Ward Timelines (Gantt)', icon: Calendar, badge: 'Weather Sync' },
        { id: 'auditor', label: 'Forensic Repair Auditor', icon: ShieldAlert, badge: `${totalFlagged} Flags`, badgeColor: 'nb-badge-coral' },
        { id: 'next-rupee', label: 'Next Rupee Allocator', icon: Compass, badge: 'Predictive ROI' },
        { id: 'scorecards', label: 'Debarment Watchlist', icon: CheckCircle2, badge: `${kpis.contractors_on_watchlist} Active`, badgeColor: 'nb-badge-orange' }
      ];
    }
  };

  const tabs = getTabsForRole();
  const formatCr = (num) => `₹${(num / 10000000).toFixed(2)} Cr`;

  return (
    <header className="border-b-4 border-[#121316] bg-[#FFE600] sticky top-0 z-40">
      {/* 3-Role Perspective Switcher Bar */}
      <RolePortalSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />

      {/* Marquee Ticker */}
      <div className="bg-[#121316] text-white py-1.5 px-4 overflow-hidden border-b-2 border-black flex items-center text-xs font-mono font-bold tracking-wide">
        <div className="flex-shrink-0 flex items-center gap-2 bg-[#FF4757] text-white px-2 py-0.5 rounded mr-3 z-10 border border-white">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>AUDIT DISPATCH</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee flex gap-10">
            <span className="text-[#FFE600]">🌧️ MONSOON SPEND: {formatCr(kpis.total_spend_inr)} of {formatCr(kpis.total_budget_inr)}</span>
            <span className="text-[#FF4757]">🚨 WASTED ON 30-DAY RELAPSES: {formatCr(kpis.total_wasted_inr)} ({kpis.overall_reopened_pct}% relapsed)</span>
            <span className="text-[#00F0FF]">⚠️ DLP WARRANTY BREACHES: {formatCr(kpis.total_dlp_breach_inr)} billed to BMC</span>
            <span className="text-[#00E599]">⏱️ CITY-WIDE SLA MET: {kpis.overall_sla_met_pct}%</span>
            <span className="text-[#B794F4]">👥 WATCHLIST CONTRACTORS: {kpis.contractors_on_watchlist} Under Formal Review</span>
            <span className="text-[#FFE600]">🔍 1,790 OF 2,499 WORK ORDERS FLAGGED</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white border-3 border-[#121316] shadow-nb-sm rounded-lg flex items-center justify-center font-mono font-black text-2xl text-[#121316]">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#121316] uppercase leading-none">
                RUPEETRACE <span className="bg-[#121316] text-[#FFE600] px-1.5 py-0.5 rounded text-lg font-mono">v2.1</span>
              </h1>
              <span className={`nb-badge text-[10px] ${
                activeRole === 'citizen' ? 'nb-badge-yellow text-black' :
                activeRole === 'officer' ? 'nb-badge-cyan text-black' : 'nb-badge-orange text-white'
              }`}>
                {activeRole.toUpperCase()} ROLE ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#121316] mt-0.5">
              {activeRole === 'citizen' && "Public Civic Transparency & Road Health Portal"}
              {activeRole === 'officer' && "Municipal Audit & Administrative Escalation Console"}
              {activeRole === 'contractor' && "Empanelled Civil Agency Extranet & Right-of-Response Desk"}
            </p>
          </div>
        </div>

        {/* Global Stats Snapshot */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0">
          <div className="bg-white border-2 border-[#121316] shadow-nb-sm px-2.5 py-1 rounded flex flex-col">
            <span className="text-[9px] font-mono uppercase font-bold text-gray-600">Total Spend</span>
            <span className="font-extrabold text-xs sm:text-sm font-mono leading-none">{formatCr(kpis.total_spend_inr)}</span>
          </div>
          <div className="bg-[#FF4757] text-white border-2 border-[#121316] shadow-nb-sm px-2.5 py-1 rounded flex flex-col">
            <span className="text-[9px] font-mono uppercase font-bold text-yellow-200">Wasted Rupees</span>
            <span className="font-extrabold text-xs sm:text-sm font-mono leading-none">{formatCr(kpis.total_wasted_inr)}</span>
          </div>
          <div className="bg-white border-2 border-[#121316] shadow-nb-sm px-2.5 py-1 rounded flex flex-col">
            <span className="text-[9px] font-mono uppercase font-bold text-gray-600">Audit Flags</span>
            <span className="font-extrabold text-xs sm:text-sm font-mono text-[#FF4757] leading-none">{kpis.total_flagged_work_orders}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-[3px]">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nb-btn text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#121316] text-white border-[#121316] shadow-none translate-y-1'
                    : 'bg-white text-[#121316] hover:bg-[#FFF9E6]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFE600]' : 'text-gray-700'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`nb-badge text-[9px] py-0 px-1 ml-1 ${
                    isActive ? 'nb-badge-yellow text-black' : (tab.badgeColor || 'nb-badge-gray')
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
