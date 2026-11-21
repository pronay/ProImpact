import React, { useState } from 'react';
import { HardHat, Award, ShieldAlert, CloudRain, CheckCircle2, AlertTriangle, FileText, Send, Clock, ExternalLink, Download } from 'lucide-react';

export default function ContractorPortalView({ 
  contractors, 
  audits, 
  weatherTimeline, 
  onInspectWorkOrder,
  disputedOrders: controlledDisputes = {},
  onSubmitDispute,
  escalatedOrders = {}
}) {
  const [selectedContractorId, setSelectedContractorId] = useState(contractors[0]?.contractor_id || 'CT01');
  const [disputeModalWO, setDisputeModalWO] = useState(null);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [disputeReason, setDisputeReason] = useState('weather');
  const [disputeNote, setDisputeNote] = useState('');

  // Local fallback merged with controlled disputes
  const [localDisputedOrders, setLocalDisputedOrders] = useState({
    'WO25-00004': { category: 'weather', timestamp: '2025-07-09', refId: 'DISP-2025-WO25-00004' }
  });
  const disputedOrders = { ...localDisputedOrders, ...controlledDisputes };

  const currentContractor = contractors.find(c => c.contractor_id === selectedContractorId) || contractors[0];
  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatCr = (val) => `₹${((val || 0) / 10000000).toFixed(2)} Cr`;

  // Filter only this contractor's work orders
  const contractorWorkOrders = audits.filter(a => a.contractor_id === selectedContractorId);
  const flaggedWOs = contractorWorkOrders.filter(w => w.flags.length > 0);

  const handleOpenDispute = (wo) => {
    setDisputeModalWO(wo);
    setDisputeSuccess(false);
    setDisputeNote(`Work on ${wo.road_name} faced adverse weather conditions (112mm rain recorded). Requesting review under clause 14.2 of BMC Monsoon Emergency Works.`);
  };

  const handleConfirmDispute = () => {
    const disputeRecord = {
      category: disputeReason,
      timestamp: new Date().toISOString().split('T')[0],
      refId: `DISP-2025-${disputeModalWO.work_order_id}`,
      road_name: disputeModalWO.road_name,
      contractor_id: selectedContractorId
    };

    if (onSubmitDispute) {
      onSubmitDispute(disputeModalWO.work_order_id, disputeRecord);
    } else {
      setLocalDisputedOrders(prev => ({
        ...prev,
        [disputeModalWO.work_order_id]: disputeRecord
      }));
    }
    setDisputeSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Contractor Header Banner (VisionOS Obsidian Glass) */}
      <div className="liquid-glass p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-orange text-xs">CONTRACTOR EXTRANET</span>
              <span className="nb-badge nb-badge-cyan text-xs">RIGHT OF RESPONSE ACTIVE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display mt-1">
              Empanelled Agency Performance & Dispute Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Review your context-adjusted scorecard, inspect flagged audits, and submit formal weather/traffic delay justifications.
            </p>
          </div>

          {/* Company Selector Switcher */}
          <div className="flex items-center gap-2 liquid-glass-sub px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-sm">
            <span className="text-xs font-semibold text-slate-300">Agency:</span>
            <select
              value={selectedContractorId}
              onChange={(e) => setSelectedContractorId(e.target.value)}
              className="nb-input text-xs py-1 font-bold"
            >
              {contractors.map(c => (
                <option key={c.contractor_id} value={c.contractor_id} className="bg-slate-900 text-white">
                  {c.contractor_name} ({c.contractor_id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Company Scorecard & Telemetry with Download Certificate Action */}
      <div className="liquid-glass p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black font-mono">{currentContractor.contractor_id}</span>
              <span className="text-xs font-medium text-slate-400">Empanelled Since {currentContractor.empanelled_since}</span>
              {currentContractor.on_watchlist ? (
                <span className="nb-badge nb-badge-coral">UNDER WATCHLIST REVIEW</span>
              ) : (
                <span className="nb-badge nb-badge-mint">GOOD STANDING</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5">
              {currentContractor.contractor_name}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Active Municipal Wards: {currentContractor.active_wards.join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert(`Official Empanelled Performance Certificate generated for ${currentContractor.contractor_name} (Composite Grade: ${currentContractor.grade}, Score: ${currentContractor.composite_score}/100 with ${(currentContractor.avg_terrain_difficulty*100).toFixed(0)}% Flood Stress adjustment).`)}
              className="nb-btn text-xs font-semibold py-2 px-3.5 flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Scorecard Certificate</span>
            </button>

            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-bold text-2xl shadow-lg ${
              currentContractor.grade === 'A' ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
              currentContractor.grade === 'B+' ? 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
              currentContractor.grade === 'B' ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]' :
              'bg-rose-950/50 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            }`}>
              {currentContractor.grade}
            </div>
          </div>
        </div>

        {/* 4 Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="liquid-glass-sub p-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Total Billed</span>
            <strong className="text-base font-bold text-white">{formatCr(currentContractor.total_billed_inr)}</strong>
            <span className="text-[10px] text-slate-400 block">{currentContractor.jobs_count} Jobs Executed</span>
          </div>
          <div className="liquid-glass-sub p-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">SLA Turnaround</span>
            <strong className={`text-base font-bold ${currentContractor.sla_compliance_pct >= 55 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentContractor.sla_compliance_pct}% Met
            </strong>
            <span className="text-[10px] text-slate-400 block">Contractual SLA</span>
          </div>
          <div className="liquid-glass-sub p-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">30d Failure Rate</span>
            <strong className={`text-base font-bold ${currentContractor.reopen_rate_pct > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentContractor.reopen_rate_pct}% Relapsed
            </strong>
            <span className="text-[10px] text-slate-400 block">Durability Benchmark</span>
          </div>
          <div className="liquid-glass-sub p-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Terrain Stress Defense</span>
            <strong className="text-base font-bold text-cyan-400">
              {(currentContractor.avg_terrain_difficulty * 100).toFixed(0)}%
            </strong>
            <span className="text-[10px] text-slate-400 block">Operating Flood Index</span>
          </div>
        </div>
      </div>

      {/* Flagged Work Orders & Right of Response Desk */}
      <div className="liquid-glass p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-lg font-bold font-mono uppercase text-white flex items-center gap-2 tracking-wide">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Audit Flag & Dispute Response Desk
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              You have <strong className="text-rose-400 font-mono">{flaggedWOs.length}</strong> work orders flagged for review. Submit evidence to contest penalties.
            </p>
          </div>

          <span className="nb-badge nb-badge-orange text-xs font-mono">
            {flaggedWOs.length} DISPUTABLE ORDERS
          </span>
        </div>

        {/* Flagged Table with Visual Dispute Receipts */}
        <div className="space-y-3">
          {flaggedWOs.slice(0, 10).map((wo) => {
            const disputeReceipt = disputedOrders[wo.work_order_id];
            const officerEscalation = escalatedOrders[wo.work_order_id];

            return (
              <div key={wo.work_order_id} className="liquid-glass-interactive p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="nb-badge nb-badge-black font-mono text-[10px]">{wo.work_order_id}</span>
                    <span className="font-bold text-sm text-white">{wo.road_name}</span>
                    <span className="text-xs font-mono text-slate-400">({wo.road_id} • Ward {wo.ward_code})</span>
                    {wo.under_dlp === 'Y' && (
                      <span className="nb-badge nb-badge-coral text-[9px]">DLP Road</span>
                    )}

                    {/* Officer Escalation Badge */}
                    {officerEscalation && (
                      <span className="nb-badge nb-badge-yellow text-[9px] font-bold">
                        ⚖️ BMC SANCTION: {officerEscalation.action?.toUpperCase()} ({officerEscalation.tier})
                      </span>
                    )}

                    {/* REFINEMENT 5: Visual Dispute Receipt */}
                    {disputeReceipt && (
                      <span className="nb-badge nb-badge-mint text-[9px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Dispute Logged: {disputeReceipt.refId}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 font-mono">
                    Billed: <strong className="text-cyan-400">{formatINR(wo.cost_inr)}</strong> • Method: <strong className="text-white">{wo.repair_method}</strong> • SLA: <strong className={wo.sla_met === 'Y' ? 'text-emerald-400' : 'text-rose-400'}>{wo.sla_met === 'Y' ? 'Met' : 'Missed'}</strong>
                  </div>

                  {/* Active Flags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {wo.flags.map((f, i) => (
                      <span key={i} className="nb-badge nb-badge-coral text-[9px] px-1 py-0">{f.title}</span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onInspectWorkOrder(wo)}
                    className="nb-btn text-xs py-1.5 px-3 font-mono"
                  >
                    Inspect
                  </button>

                  {disputeReceipt ? (
                    <span className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Evidence Under Review</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenDispute(wo)}
                      className="nb-btn nb-btn-primary text-xs py-1.5 px-3.5 font-mono font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Dispute / Evidence</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispute Modal (VisionOS Dark Glass) */}
      {disputeModalWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="liquid-glass-dark w-full max-w-lg p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <h3 className="font-mono font-bold text-base uppercase text-white tracking-wide">Submit Audit Dispute</h3>
              <button onClick={() => setDisputeModalWO(null)} className="font-mono text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            {disputeSuccess ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-center space-y-2 backdrop-blur-md">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-300">Dispute Submitted to Ward Executive Engineer!</h4>
                <p className="text-xs text-emerald-200/90 font-mono">
                  Case reference <strong>DISP-2025-{disputeModalWO.work_order_id}</strong> registered. Official IMD rainfall & tidal logs attached to dispute package.
                </p>
                <button onClick={() => setDisputeModalWO(null)} className="nb-btn text-xs mt-2 px-4">
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="liquid-glass-sub p-3 rounded-xl font-mono border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Work Order Contested</span>
                  <strong className="text-sm text-white">{disputeModalWO.work_order_id} — {disputeModalWO.road_name}</strong>
                  <div className="text-[11px] text-slate-300 mt-1">Billed: {formatINR(disputeModalWO.cost_inr)} • Completed: {disputeModalWO.completed_at}</div>
                </div>

                <div>
                  <label className="font-medium text-slate-300 block mb-1">Select Dispute Category</label>
                  <select 
                    value={disputeReason} 
                    onChange={(e) => setDisputeReason(e.target.value)} 
                    className="nb-input w-full text-xs"
                  >
                    <option value="weather" className="bg-slate-900 text-white">Climatic Force Majeure (Heavy IMD Rain / High Tide Lockout)</option>
                    <option value="traffic" className="bg-slate-900 text-white">Traffic Police Night-Only NOC Restriction</option>
                    <option value="utility" className="bg-slate-900 text-white">Utility Trench Sub-base Failure (MGL / MTNL / Adani)</option>
                    <option value="rate" className="bg-slate-900 text-white">Rate Card Non-Standard Site Condition Justification</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-300 block mb-1">Contractor Justification & Evidence</label>
                  <textarea 
                    rows="4" 
                    value={disputeNote}
                    onChange={(e) => setDisputeNote(e.target.value)}
                    className="nb-input w-full text-xs" 
                  />
                </div>

                <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 rounded-xl text-[11px] text-cyan-200 font-mono">
                  ℹ️ System will automatically append IMD Santacruz/Colaba rainfall data and tide height for this window.
                </div>

                <button
                  onClick={handleConfirmDispute}
                  className="nb-btn nb-btn-primary w-full py-2 font-mono font-bold text-xs shadow-lg"
                >
                  Submit Official Right-of-Response
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
