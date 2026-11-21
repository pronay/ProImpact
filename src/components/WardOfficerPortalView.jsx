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
      {/* Officer Header Banner with Ward Scoping Selector for Vinod Patil */}
      <div className="nb-card p-5 bg-[#FFE600] border-4 border-[#121316]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">MUNICIPAL COMMAND</span>
              <span className="nb-badge nb-badge-cyan text-black">ADMINISTRATIVE AUDIT ROLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase mt-1">
              BMC Executive Audit & Escalation Center
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
              Assistant Commissioner & Executive Engineer console for rate auditing, DLP recoveries, and debarment oversight.
            </p>
          </div>

          {/* REFINEMENT 3: Ward Scoping Selector */}
          <div className="flex items-center gap-2 bg-white border-2 border-black p-2 rounded shadow-nb-sm">
            <span className="text-xs font-mono font-bold text-gray-700">Scope Ward Console:</span>
            <select
              value={scopedWard}
              onChange={(e) => setScopedWard(e.target.value)}
              className="nb-input text-xs py-1 font-bold"
            >
              <option value="ALL">All City Wards (City-Wide)</option>
              {db.wards.map(w => (
                <option key={w.ward_code} value={w.ward_code}>
                  Ward {w.ward_code} — {w.ward_name.split(',')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Scoped KPIs based on Vinod's Selected Ward */}
        <div className="mt-4 pt-3 border-t-2 border-black grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-white border-2 border-black p-2.5 rounded shadow-nb-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Monsoon Budget</span>
            <strong className="text-sm font-black text-black">{formatLakh(displayedBudget)}</strong>
            <span className="text-[10px] text-gray-600 block">Spent: {formatLakh(displayedSpend)}</span>
          </div>

          <div className="bg-white border-2 border-black p-2.5 rounded shadow-nb-sm">
            <span className="text-[10px] font-bold text-[#FF4757] uppercase block">DLP Recoverable Leak</span>
            <strong className="text-sm font-black text-[#FF4757]">{formatLakh(displayedDlp)}</strong>
            <span className="text-[10px] text-gray-600 block">Billed on Warranty Roads</span>
          </div>

          <div className="bg-white border-2 border-black p-2.5 rounded shadow-nb-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Wasted in Relapses</span>
            <strong className="text-sm font-black text-black">{formatLakh(displayedWasted)}</strong>
            <span className="text-[10px] text-gray-600 block">Failed in &lt;30 days</span>
          </div>

          <div className="bg-white border-2 border-black p-2.5 rounded shadow-nb-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Watchlist Agencies</span>
            <strong className="text-sm font-black text-[#FF8800]">{watchlistContractors.length} Empanelled</strong>
            <span className="text-[10px] text-gray-600 block">Under Formal Review</span>
          </div>
        </div>

        {/* 3-Tier Escalation Ladder Overview */}
        <div className="mt-3 pt-3 border-t-2 border-black grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-white/90 border-2 border-black p-2 rounded">
            <span className="font-black text-black block">LEVEL 1: WARD JUNIOR ENGINEER</span>
            <span className="text-[10px] text-gray-700">Physical site verification, measurement sheet validation.</span>
          </div>
          <div className="bg-white/90 border-2 border-black p-2 rounded">
            <span className="font-black text-blue-900 block">LEVEL 2: ASST. COMMISSIONER (WARD)</span>
            <span className="text-[10px] text-gray-700">Payment sanction, 20% DLP penalty deduction, rate approval.</span>
          </div>
          <div className="bg-white/90 border-2 border-black p-2 rounded">
            <span className="font-black text-[#FF4757] block">LEVEL 3: CENTRAL VIGILANCE / CHIEF ENGINEER</span>
            <span className="text-[10px] text-gray-700">Formal debarment hearing, MMC Act legal notice.</span>
          </div>
        </div>

        {/* Navigation Tabs for Officer */}
        <div className="mt-4 pt-3 border-t-2 border-black flex gap-2 overflow-x-auto">
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
              className={`nb-btn text-xs font-mono font-bold py-1.5 px-3 flex items-center gap-1.5 ${
                officerTab === t.id 
                  ? 'bg-black text-white shadow-none translate-y-0.5' 
                  : 'bg-white text-black hover:bg-gray-100'
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
        <div className="nb-card p-4 bg-[#FFF0F2] border-3 border-[#FF4757] shadow-nb-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-coral text-white font-mono text-[10px]">🚨 INCOMING CITIZEN DISPATCH</span>
              <h4 className="font-mono font-black text-xs uppercase text-red-900">
                {liveRelapses.length} Citizen-Reported Pothole Relapse(s) Awaiting Engineering Triage
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-700">Live Feedback Loop Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {liveRelapses.map((relapse, idx) => (
              <div key={idx} className="bg-white border-2 border-black p-2.5 rounded text-xs flex justify-between items-start gap-2">
                <div>
                  <div className="font-bold text-black flex items-center gap-1.5">
                    <span>{relapse.locality_text}</span>
                    <span className="nb-badge nb-badge-yellow text-[9px]">Ward {relapse.ward_code}</span>
                  </div>
                  <p className="text-[11px] text-gray-700 italic mt-0.5">"{relapse.description}"</p>
                  <span className="text-[10px] font-mono text-gray-500 block mt-1">Ticket: {relapse.complaint_id}</span>
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
        <div className="nb-card p-4 bg-[#FFFDF0] border-3 border-[#FFE600] shadow-nb-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-orange text-white font-mono text-[10px]">⚠️ CONTRACTOR DISPUTE FILED</span>
              <h4 className="font-mono font-black text-xs uppercase text-black">
                {Object.keys(liveDisputes).length} Formal Force Majeure Defense(s) Submitted with IMD Weather Logs
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-600">Right of Response Desk</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {Object.entries(liveDisputes).map(([woId, disp]) => (
              <div key={woId} className="bg-white border-2 border-black p-2.5 rounded text-xs flex justify-between items-center gap-2">
                <div>
                  <span className="font-mono font-bold text-black">{woId} — {disp.category?.toUpperCase()} CLAIM</span>
                  <span className="text-[10px] text-gray-600 block">Ref: {disp.refId} • Attached IMD 112mm Deluge Proof</span>
                </div>
                <span className="nb-badge nb-badge-cyan text-black text-[9px] font-bold">EVIDENCE ATTACHED</span>
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
          <div className="nb-card p-4 bg-white border-3 border-black">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-base font-black font-mono uppercase">
                  Pending Work Order Audit Decisions {scopedWard !== 'ALL' ? `(Ward ${scopedWard})` : '(City-Wide)'}
                </h3>
                <p className="text-xs font-bold text-gray-600">
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
          <div className="nb-card p-4 bg-white border-3 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="nb-badge nb-badge-mint text-black font-mono text-[10px]">MUNICIPAL SANCTION AUTHORITY</span>
              <h4 className="font-black text-sm uppercase text-black mt-0.5">
                Execute Administrative Sanction for Next Monsoon Sprint
              </h4>
              <p className="text-xs text-gray-600 font-bold">
                Lock in allocation for top-ranked human lifeline corridors (H-ROI) within Ward {scopedWard} budget limits.
              </p>
            </div>

            {sprintSanctioned ? (
              <div className="bg-green-100 border-2 border-green-600 text-green-900 px-3 py-1.5 rounded font-mono font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Sprint Sanction Order #BMC/2025/SPRINT-04 Signed</span>
              </div>
            ) : (
              <button
                onClick={() => setSprintSanctioned(true)}
                className="nb-btn nb-btn-primary text-xs font-mono font-bold py-2 px-4 flex items-center gap-1.5"
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
        <div className="nb-card p-5 bg-white border-3 border-black space-y-4">
          <div className="border-b-2 border-black pb-3">
            <h3 className="text-lg font-black font-mono uppercase flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#FF4757]" />
              Threshold-Based Contractor Debarment Watchlist
            </h3>
            <p className="text-xs font-bold text-gray-600">
              Contractors crossing statistical review thresholds (Jobs ≥10, Reopening &gt;25%, Rate Overcharge &gt;20%, DLP Violations).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchlistContractors.map(c => (
              <div key={c.contractor_id} className="nb-card p-4 bg-[#FFF5F6] border-3 border-[#FF4757] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="nb-badge nb-badge-coral text-[10px] font-mono">FORMAL REVIEW TRIGGERED</span>
                    <h4 className="font-black text-lg text-black mt-1">{c.contractor_name}</h4>
                    <span className="text-xs font-mono text-gray-600">Empanelled: {c.empanelled_since} • {c.active_wards.length} Wards</span>
                  </div>
                  <div className="w-12 h-12 rounded border-2 border-black bg-white flex flex-col items-center justify-center font-mono">
                    <span className="font-black text-base">{c.grade}</span>
                    <span className="text-[9px]">{c.composite_score}/100</span>
                  </div>
                </div>

                <div className="bg-white border-2 border-black p-2.5 rounded text-xs space-y-1 font-mono">
                  <div className="font-bold text-red-900 uppercase text-[10px]">Threshold Violation Reasons:</div>
                  {c.watchlist_reasons.map((r, i) => (
                    <div key={i} className="text-gray-800 flex items-center gap-1">
                      <span>•</span> {r}
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
                    className="nb-btn nb-btn-white text-xs font-mono font-bold py-1 px-3 w-full"
                  >
                    Withhold Payments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escalation Action Modal */}
      {escalationModalWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="nb-card w-full max-w-lg bg-white p-5 border-4 border-black shadow-nb-xl space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h3 className="font-mono font-black text-base uppercase">Administrative Escalation Memo</h3>
              <button onClick={() => setEscalationModalWO(null)} className="font-mono font-bold">✕</button>
            </div>

            {escalationSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="font-black text-sm text-green-900">Escalation Order Logged to Municipal Dispatch!</h4>
                <p className="text-xs text-green-800">
                  Case reference <strong>ESC-2025-{escalationModalWO.work_order_id}</strong> forwarded to {escalationTier} authority. Status badge updated in audit records.
                </p>
                <button onClick={() => setEscalationModalWO(null)} className="nb-btn nb-btn-white text-xs mt-2">
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-[#FAF8F5] border-2 border-black p-2.5 rounded font-mono">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Work Order Under Review</span>
                  <strong className="text-sm text-black">{escalationModalWO.work_order_id} — {escalationModalWO.road_name}</strong>
                  <div className="text-[11px] text-gray-600 mt-1">Contractor: {escalationModalWO.contractor_name} • Billed: {formatINR(escalationModalWO.cost_inr)}</div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Escalation Authority Tier & Action</label>
                  <select 
                    value={escalationTier} 
                    onChange={(e) => setEscalationTier(e.target.value)} 
                    className="nb-input w-full text-xs font-mono font-bold"
                  >
                    <option value="L1">Level 1: Ward Junior Engineer (Site Re-inspection)</option>
                    <option value="L2">Level 2: Ward Assistant Commissioner (20% DLP Penalty Deduction)</option>
                    <option value="L3">Level 3: Central Vigilance / Chief Engineer Roads (Debarment Hearing)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Official Municipal Action Notes</label>
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
                    className="nb-btn nb-btn-white w-full py-2 font-mono font-bold text-xs"
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
