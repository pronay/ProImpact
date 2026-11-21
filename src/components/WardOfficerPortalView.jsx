import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Sliders, ExternalLink, Scale, FileText, ArrowRight, Gavel, Building2, Map, Calendar, CheckSquare } from 'lucide-react';
import FuturisticMapView from './FuturisticMapView';
import WardTimelineView from './WardTimelineView';
import NextRupeePlannerView from './NextRupeePlannerView';
import RepairAuditorView from './RepairAuditorView';
import EscrowSimulator from './EscrowSimulator';

export default function WardOfficerPortalView({ 
  db, 
  onOpenRoadPassport, 
  onInspectWorkOrder,
  liveRelapses = [],
  liveDisputes = {},
  escalatedOrders = {},
  onEscalateOrder,
  scopedWard: controlledScopedWard,
  setScopedWard: controlledSetScopedWard
}) {
  const [officerTab, setOfficerTab] = useState('audit-queue');
  const [internalScopedWard, setInternalScopedWard] = useState('K/W'); // Ward Scoping Selector for Vinod Patil
  const scopedWard = controlledScopedWard || internalScopedWard;
  const setScopedWard = controlledSetScopedWard || setInternalScopedWard;
  const [escalationModalWO, setEscalationModalWO] = useState(null);
  const [escalationSuccess, setEscalationSuccess] = useState(false);
  const [escalationTier, setEscalationTier] = useState('L2');
  const [officerActionNotes, setOfficerActionNotes] = useState('');

  const [sprintSanctioned, setSprintSanctioned] = useState(false);

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;
  const formatCr = (val) => `₹${((val || 0) / 10000000).toFixed(2)} Cr`;

  // Compute scoped KPIs based on selected ward
  const activeWardData = db.wards.find(w => w.ward_code === scopedWard);
  const isCityWide = scopedWard === 'ALL';

  const displayedBudget = isCityWide ? db.kpis.total_budget_inr : activeWardData?.budget_inr || 0;
  const displayedSpend = isCityWide ? db.kpis.total_spend_inr : activeWardData?.total_spend_inr || 0;
  const displayedWasted = isCityWide ? db.kpis.total_wasted_inr : activeWardData?.wasted_spend_inr || 0;
  const displayedDlp = isCityWide ? db.kpis.total_dlp_breach_inr : activeWardData?.dlp_violation_spend_inr || 0;
  const displayedJobsCount = isCityWide ? db.kpis.total_work_orders : activeWardData?.total_work_orders || 0;

  const watchlistContractors = db.contractors.filter(c => c.on_watchlist);

  const handleEscalate = (wo) => {
    setEscalationModalWO(wo);
    setEscalationSuccess(false);
    setOfficerActionNotes(`Discrepancy noted in ${wo.work_order_id} on ${wo.road_name}. Withholding contractor milestone payment pending physical site audit.`);
  };

  const handleConfirmEscalation = () => {
    let actionDesc = '20% Retention Withheld';
    if (escalationTier === 'L1') actionDesc = 'Site Re-inspection Ordered';
    if (escalationTier === 'L3') actionDesc = 'Vigilance Debarment Hearing';

    const escalationData = {
      tier: escalationTier,
      action: actionDesc,
      notes: officerActionNotes,
      date: new Date().toISOString().split('T')[0]
    };

    if (onEscalateOrder && escalationModalWO) {
      onEscalateOrder(escalationModalWO.work_order_id, escalationData);
    }
    setEscalationSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Officer Header Banner with Ward Scoping Selector (VisionOS Obsidian Glass) */}
      <div className="liquid-glass p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-cyan text-xs">MUNICIPAL COMMAND</span>
              <span className="nb-badge nb-badge-black text-xs">ADMINISTRATIVE AUDIT CONSOLE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display mt-1">
              BMC Executive Audit & Escalation Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Assistant Commissioner & Executive Engineer console for rate auditing, DLP warranty recoveries, and contractor accountability.
            </p>
          </div>

          {/* REFINEMENT 3: Ward Scoping Selector */}
          <div className="flex items-center gap-2 liquid-glass-sub px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-sm">
            <span className="text-xs font-semibold text-slate-300">Scope Ward:</span>
            <select
              value={scopedWard}
              onChange={(e) => setScopedWard(e.target.value)}
              className="nb-input text-xs py-1 font-bold"
            >
              <option value="ALL" className="bg-slate-900 text-white">All City Wards (City-Wide)</option>
              {db.wards.map(w => (
                <option key={w.ward_code} value={w.ward_code} className="bg-slate-900 text-white">
                  Ward {w.ward_code} — {w.ward_name.split(',')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Scoped KPIs based on Vinod's Selected Ward (VisionOS Obsidian Glass) */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="liquid-glass-sub p-3.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Monsoon Budget</span>
            <strong className="text-sm font-bold text-white">{formatLakh(displayedBudget)}</strong>
            <span className="text-[10px] text-slate-400 block">Spent: {formatLakh(displayedSpend)}</span>
          </div>

          <div className="bg-rose-950/40 backdrop-blur-md border border-rose-500/30 p-3.5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block">DLP Warranty Leak</span>
            <strong className="text-sm font-bold text-rose-300">{formatLakh(displayedDlp)}</strong>
            <span className="text-[10px] text-rose-400/80 block">Billed on Warranty Roads</span>
          </div>

          <div className="liquid-glass-sub p-3.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Wasted in Relapses</span>
            <strong className="text-sm font-bold text-amber-400">{formatLakh(displayedWasted)}</strong>
            <span className="text-[10px] text-slate-400 block">Failed in &lt;30 days</span>
          </div>

          <div className="bg-amber-950/40 backdrop-blur-md border border-amber-500/30 p-3.5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">Watchlist Agencies</span>
            <strong className="text-sm font-bold text-amber-300">{watchlistContractors.length} Empanelled</strong>
            <span className="text-[10px] text-amber-400/80 block">Under Formal Review</span>
          </div>
        </div>

        {/* 3-Tier Escalation Ladder Overview */}
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="liquid-glass-sub p-3">
            <span className="font-bold text-white block text-[11px] tracking-wide">LEVEL 1: WARD JUNIOR ENGINEER</span>
            <span className="text-[10px] text-slate-400">Physical site verification, measurement sheet validation.</span>
          </div>
          <div className="bg-cyan-950/40 backdrop-blur-md border border-cyan-500/30 p-3 rounded-2xl shadow-sm">
            <span className="font-bold text-cyan-300 block text-[11px] tracking-wide">LEVEL 2: ASST. COMMISSIONER (WARD)</span>
            <span className="text-[10px] text-cyan-200/80">Payment sanction, 20% DLP penalty deduction, rate approval.</span>
          </div>
          <div className="bg-rose-950/40 backdrop-blur-md border border-rose-500/30 p-3 rounded-2xl shadow-sm">
            <span className="font-bold text-rose-300 block text-[11px] tracking-wide">LEVEL 3: CENTRAL VIGILANCE COMMITTEE</span>
            <span className="text-[10px] text-rose-200/80">Formal debarment hearing, MMC Act legal notice.</span>
          </div>
        </div>

        {/* Navigation Tabs for Officer (VisionOS Segmented Pill Dock) */}
        <div className="pt-2 border-t border-white/10 flex gap-1.5 overflow-x-auto bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          {[
            { id: 'audit-queue', label: '🚨 Forensic Audit Queue', badge: `${displayedJobsCount} Orders` },
            { id: 'gis-command', label: '🗺️ GIS Command Map' },
            { id: 'timeline', label: '📅 Ward Timelines (Gantt)' },
            { id: 'budget-allocator', label: '🧭 Next Rupee Allocator' },
            { id: 'watchlist', label: `⚖️ Debarment Watchlist (${watchlistContractors.length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setOfficerTab(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                officerTab === t.id 
                  ? 'bg-white/15 text-white shadow-lg border border-white/20 ring-1 ring-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t.label}</span>
              {t.badge && <span className="nb-badge nb-badge-coral text-[9px] py-0 px-1 ml-1">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Live Incoming Citizen Relapses Alert Box */}
      {liveRelapses.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 shadow-lg backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-coral font-mono text-[10px]">🚨 INCOMING CITIZEN DISPATCH</span>
              <h4 className="font-mono font-bold text-xs uppercase text-rose-300 tracking-wide">
                {liveRelapses.length} Citizen-Reported Pothole Relapse(s) Awaiting Engineering Triage
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400">Live Feedback Loop Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {liveRelapses.map((relapse, idx) => (
              <div key={idx} className="liquid-glass-sub p-3 rounded-xl border border-rose-500/20 text-xs flex justify-between items-start gap-2">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{relapse.locality_text}</span>
                    <span className="nb-badge nb-badge-yellow text-[9px]">Ward {relapse.ward_code}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic mt-0.5">"{relapse.description}"</p>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1">Ticket: {relapse.complaint_id}</span>
                </div>
                <button
                  onClick={() => {
                    const matchingWO = db.audits.find(a => a.ward_code === relapse.ward_code && a.flags.length > 0) || db.audits[0];
                    handleEscalate(matchingWO);
                  }}
                  className="nb-btn nb-btn-danger text-[10px] py-1 px-2 font-mono whitespace-nowrap flex-shrink-0"
                >
                  ⚡ Review & Deduct
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Contractor Force Majeure Disputes */}
      {Object.keys(liveDisputes).length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 shadow-lg backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-orange font-mono text-[10px]">⚠️ CONTRACTOR DISPUTE FILED</span>
              <h4 className="font-mono font-bold text-xs uppercase text-amber-300 tracking-wide">
                {Object.keys(liveDisputes).length} Formal Force Majeure Defense(s) Submitted with IMD Weather Logs
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400">Right of Response Desk</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {Object.entries(liveDisputes).map(([woId, disp]) => (
              <div key={woId} className="liquid-glass-sub p-3 rounded-xl border border-amber-500/20 text-xs flex justify-between items-center gap-2">
                <div>
                  <span className="font-mono font-bold text-white">{woId} — {disp.category?.toUpperCase()} CLAIM</span>
                  <span className="text-[10px] text-slate-400 block">Ref: {disp.refId} • Attached IMD 112mm Deluge Proof</span>
                </div>
                <span className="nb-badge nb-badge-cyan text-[9px] font-bold">EVIDENCE ATTACHED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* World Bank OPBRC Outcome-Based Escrow Simulator */}
      <EscrowSimulator
        totalSpend={displayedSpend}
        wastedSpend={displayedWasted}
        totalWorkOrders={displayedJobsCount}
        reopenedCount={activeWardData?.reopened_count || 12}
      />

      {/* TAB 1: FORENSIC AUDIT QUEUE WITH REFINEMENT 4 ESCALATION STATUS BADGES */}
      {officerTab === 'audit-queue' && (
        <div className="space-y-4">
          <div className="liquid-glass p-5 space-y-4">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-base font-bold font-mono uppercase text-white tracking-wide">
                  Pending Work Order Audit Decisions {scopedWard !== 'ALL' ? `(Ward ${scopedWard})` : '(City-Wide)'}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Select any flagged repair to trigger official action: Approve, Withhold Retention, or Escalate to Central Vigilance.
                </p>
              </div>
            </div>

            <RepairAuditorView
              audits={db.audits}
              wards={db.wards}
              contractors={db.contractors}
              preselectedWard={scopedWard}
              escalatedOrders={escalatedOrders}
              onInspectWorkOrder={(wo) => handleEscalate(wo)}
            />
          </div>
        </div>
      )}

      {/* TAB 2: GIS COMMAND MAP */}
      {officerTab === 'gis-command' && (
        <FuturisticMapView
          geojson={db.geojson}
          wards={db.wards}
          roads={db.roads}
          floodHotspots={db.flood_hotspots}
          facilities={db.facilities}
          accidents={db.accidents}
          onOpenRoadPassport={onOpenRoadPassport}
        />
      )}

      {/* TAB 3: WARD TIMELINES */}
      {officerTab === 'timeline' && (
        <WardTimelineView
          wards={db.wards}
          weatherTimeline={db.weather_timeline}
          onInspectWorkOrder={onInspectWorkOrder}
        />
      )}

      {/* TAB 4: NEXT RUPEE ALLOCATOR WITH OFFICIAL SPRINT SANCTION ACTION */}
      {officerTab === 'budget-allocator' && (
        <div className="space-y-4">
          {/* Sanction Banner */}
          <div className="liquid-glass p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="nb-badge nb-badge-mint font-mono text-[10px]">MUNICIPAL SANCTION AUTHORITY</span>
              <h4 className="font-bold text-sm uppercase text-white mt-1">
                Execute Administrative Sanction for Next Monsoon Sprint
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                Lock in allocation for top-ranked human lifeline corridors (H-ROI) within Ward {scopedWard} budget limits.
              </p>
            </div>

            {sprintSanctioned ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sprint Sanction Order #BMC/2025/SPRINT-04 Signed</span>
              </div>
            ) : (
              <button
                onClick={() => setSprintSanctioned(true)}
                className="nb-btn nb-btn-primary text-xs font-mono font-bold py-2 px-4 flex items-center gap-2 shadow-lg"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Sanction & Approve Sprint Allocation</span>
              </button>
            )}
          </div>

          <NextRupeePlannerView
            recommendations={db.roads}
            wards={db.wards}
          />
        </div>
      )}

      {/* TAB 5: CONTRACTOR DEBARMENT WATCHLIST */}
      {officerTab === 'watchlist' && (
        <div className="liquid-glass p-5 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold font-mono uppercase text-white flex items-center gap-2 tracking-wide">
              <Scale className="w-5 h-5 text-rose-400" />
              Threshold-Based Contractor Debarment Watchlist
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Contractors crossing statistical review thresholds (Jobs ≥10, Reopening &gt;25%, Rate Overcharge &gt;20%, DLP Violations).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchlistContractors.map(c => (
              <div key={c.contractor_id} className="liquid-glass-interactive p-4 border border-rose-500/30 bg-rose-950/20 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="nb-badge nb-badge-coral text-[10px] font-mono">FORMAL REVIEW TRIGGERED</span>
                    <h4 className="font-bold text-lg text-white mt-1">{c.contractor_name}</h4>
                    <span className="text-xs font-mono text-slate-400">Empanelled: {c.empanelled_since} • {c.active_wards.length} Wards</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex flex-col items-center justify-center font-mono">
                    <span className="font-bold text-base text-white">{c.grade}</span>
                    <span className="text-[9px] text-slate-400">{c.composite_score}/100</span>
                  </div>
                </div>

                <div className="liquid-glass-sub p-3 rounded-xl text-xs space-y-1 font-mono border border-rose-500/20">
                  <div className="font-bold text-rose-300 uppercase text-[10px]">Threshold Violation Reasons:</div>
                  {c.watchlist_reasons.map((r, i) => (
                    <div key={i} className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-rose-400">•</span> {r}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => alert(`Official Show-Cause notice prepared for ${c.contractor_name} under Section 69 of the MMC Act.`)}
                    className="nb-btn nb-btn-danger text-xs font-mono font-bold py-1 px-3 w-full"
                  >
                    Issue Show-Cause Notice
                  </button>
                  <button 
                    onClick={() => alert(`Payment retention of 25% placed on all active work orders for ${c.contractor_name}.`)}
                    className="nb-btn text-xs font-mono font-bold py-1 px-3 w-full"
                  >
                    Withhold Payments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escalation Action Modal (VisionOS Dark Glass) */}
      {escalationModalWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="liquid-glass-dark w-full max-w-lg p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <h3 className="font-mono font-bold text-base uppercase text-white tracking-wide">Administrative Escalation Memo</h3>
              <button onClick={() => setEscalationModalWO(null)} className="font-mono text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            {escalationSuccess ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-center space-y-2 backdrop-blur-md">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-300">Escalation Order Logged to Municipal Dispatch!</h4>
                <p className="text-xs text-emerald-200/90 font-mono">
                  Case reference <strong>ESC-2025-{escalationModalWO.work_order_id}</strong> forwarded to {escalationTier} authority. Status badge updated in audit records.
                </p>
                <button onClick={() => setEscalationModalWO(null)} className="nb-btn text-xs mt-2 px-4">
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="liquid-glass-sub p-3 rounded-xl font-mono border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Work Order Under Review</span>
                  <strong className="text-sm text-white">{escalationModalWO.work_order_id} — {escalationModalWO.road_name}</strong>
                  <div className="text-[11px] text-slate-300 mt-1">Contractor: {escalationModalWO.contractor_name} • Billed: {formatINR(escalationModalWO.cost_inr)}</div>
                </div>

                <div>
                  <label className="font-medium text-slate-300 block mb-1">Escalation Authority Tier & Action</label>
                  <select 
                    value={escalationTier} 
                    onChange={(e) => setEscalationTier(e.target.value)} 
                    className="nb-input w-full text-xs font-mono font-bold"
                  >
                    <option value="L1" className="bg-slate-900 text-white">Level 1: Ward Junior Engineer (Site Re-inspection)</option>
                    <option value="L2" className="bg-slate-900 text-white">Level 2: Ward Assistant Commissioner (20% DLP Penalty Deduction)</option>
                    <option value="L3" className="bg-slate-900 text-white">Level 3: Central Vigilance / Chief Engineer Roads (Debarment Hearing)</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-300 block mb-1">Official Municipal Action Notes</label>
                  <textarea 
                    rows="3" 
                    value={officerActionNotes}
                    onChange={(e) => setOfficerActionNotes(e.target.value)}
                    className="nb-input w-full text-xs" 
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmEscalation}
                    className="nb-btn nb-btn-danger w-full py-2 font-mono font-bold text-xs"
                  >
                    Issue Administrative Escalation
                  </button>
                  <button
                    onClick={() => { alert('Billing approved for payment.'); setEscalationModalWO(null); }}
                    className="nb-btn w-full py-2 font-mono font-bold text-xs"
                  >
                    Approve Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
