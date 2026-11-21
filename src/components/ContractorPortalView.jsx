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
      {/* Contractor Header Banner */}
      <div className="nb-card p-5 bg-[#FFE600] border-4 border-[#121316]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">CONTRACTOR EXTRANET</span>
              <span className="nb-badge nb-badge-orange text-white">RIGHT OF RESPONSE ACTIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase mt-1">
              Empanelled Agency Performance & Dispute Portal
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
              Review your context-adjusted scorecard, inspect flagged audits, and submit formal weather/traffic delay justifications.
            </p>
          </div>

          {/* Company Selector Switcher */}
          <div className="flex items-center gap-2 bg-white border-2 border-black p-2 rounded shadow-nb-sm">
            <span className="text-xs font-mono font-bold text-gray-700">Contractor Login:</span>
            <select
              value={selectedContractorId}
              onChange={(e) => setSelectedContractorId(e.target.value)}
              className="nb-input text-xs py-1"
            >
              {contractors.map(c => (
                <option key={c.contractor_id} value={c.contractor_id}>
                  {c.contractor_name} ({c.contractor_id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Company Scorecard & Telemetry with Download Certificate Action */}
      <div className="nb-card p-5 bg-white border-3 border-black space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black font-mono">{currentContractor.contractor_id}</span>
              <span className="text-xs font-mono font-bold text-gray-600">Empanelled Since {currentContractor.empanelled_since}</span>
              {currentContractor.on_watchlist ? (
                <span className="nb-badge nb-badge-coral text-white">UNDER WATCHLIST REVIEW</span>
              ) : (
                <span className="nb-badge nb-badge-mint text-black">GOOD STANDING</span>
              )}
            </div>
            <h3 className="text-2xl font-black uppercase text-black mt-1">
              {currentContractor.contractor_name}
            </h3>
            <p className="text-xs font-bold text-gray-600">
              Active Municipal Wards: {currentContractor.active_wards.join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert(`Official Empanelled Performance Certificate generated for ${currentContractor.contractor_name} (Composite Grade: ${currentContractor.grade}, Score: ${currentContractor.composite_score}/100 with ${(currentContractor.avg_terrain_difficulty*100).toFixed(0)}% Flood Stress adjustment).`)}
              className="nb-btn nb-btn-white text-xs font-mono font-bold py-1.5 px-3 flex items-center gap-1.5 hover:bg-[#FFE600]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Scorecard Certificate</span>
            </button>

            <div className={`w-14 h-14 rounded-lg border-3 border-black shadow-nb-sm flex items-center justify-center font-mono font-black text-2xl ${
              currentContractor.grade === 'A' ? 'bg-[#00E599] text-black' :
              currentContractor.grade === 'B+' ? 'bg-[#FFE600] text-black' :
              currentContractor.grade === 'B' ? 'bg-[#00F0FF] text-black' :
              currentContractor.grade === 'C' ? 'bg-[#FF8800] text-white' : 'bg-[#FF4757] text-white'
            }`}>
              {currentContractor.grade}
            </div>
          </div>
        </div>

        {/* 4 Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#FAF8F5] border-2 border-black p-3 rounded">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Billed</span>
            <strong className="text-base font-black text-black">{formatCr(currentContractor.total_billed_inr)}</strong>
            <span className="text-[10px] text-gray-600 block">{currentContractor.jobs_count} Jobs Executed</span>
          </div>
          <div className="bg-[#FAF8F5] border-2 border-black p-3 rounded">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">SLA Turnaround</span>
            <strong className={`text-base font-black ${currentContractor.sla_compliance_pct >= 55 ? 'text-green-700' : 'text-[#FF4757]'}`}>
              {currentContractor.sla_compliance_pct}% Met
            </strong>
            <span className="text-[10px] text-gray-600 block">Contractual SLA</span>
          </div>
          <div className="bg-[#FAF8F5] border-2 border-black p-3 rounded">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">30d Failure Rate</span>
            <strong className={`text-base font-black ${currentContractor.reopen_rate_pct > 25 ? 'text-[#FF4757]' : 'text-green-700'}`}>
              {currentContractor.reopen_rate_pct}% Relapsed
            </strong>
            <span className="text-[10px] text-gray-600 block">Durability Benchmark</span>
          </div>
          <div className="bg-[#FAF8F5] border-2 border-black p-3 rounded">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Terrain Stress Defense</span>
            <strong className="text-base font-black text-blue-900">
              {(currentContractor.avg_terrain_difficulty * 100).toFixed(0)}%
            </strong>
            <span className="text-[10px] text-gray-600 block">Operating Flood Index</span>
          </div>
        </div>
      </div>

      {/* Flagged Work Orders & Right of Response Desk */}
      <div className="nb-card p-5 bg-white border-3 border-black space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
          <div>
            <h3 className="text-lg font-black font-mono uppercase flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FF8800]" />
              Audit Flag & Dispute Response Desk
            </h3>
            <p className="text-xs font-bold text-gray-600">
              You have <strong className="text-[#FF4757] font-mono">{flaggedWOs.length}</strong> work orders flagged for review. Submit evidence to contest penalties.
            </p>
          </div>

          <span className="nb-badge nb-badge-orange text-white text-xs">
            {flaggedWOs.length} DISPUTABLE ORDERS
          </span>
        </div>

        {/* Flagged Table with Visual Dispute Receipts */}
        <div className="space-y-3">
          {flaggedWOs.slice(0, 10).map((wo) => {
            const disputeReceipt = disputedOrders[wo.work_order_id];
            const officerEscalation = escalatedOrders[wo.work_order_id];

            return (
              <div key={wo.work_order_id} className="border-3 border-black p-3.5 rounded-lg bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="nb-badge nb-badge-black font-mono text-[10px]">{wo.work_order_id}</span>
                    <span className="font-extrabold text-sm">{wo.road_name}</span>
                    <span className="text-xs font-mono text-gray-500 font-bold">({wo.road_id} • Ward {wo.ward_code})</span>
                    {wo.under_dlp === 'Y' && (
                      <span className="nb-badge nb-badge-coral text-[9px]">DLP Road</span>
                    )}

                    {/* Officer Escalation Badge */}
                    {officerEscalation && (
                      <span className="nb-badge nb-badge-black text-[#FFE600] text-[9px] font-bold">
                        ⚖️ BMC SANCTION: {officerEscalation.action?.toUpperCase()} ({officerEscalation.tier})
                      </span>
                    )}

                    {/* REFINEMENT 5: Visual Dispute Receipt */}
                    {disputeReceipt && (
                      <span className="nb-badge nb-badge-yellow text-black text-[9px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Dispute Logged: {disputeReceipt.refId}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-700 font-mono">
                    Billed: <strong>{formatINR(wo.cost_inr)}</strong> • Method: <strong>{wo.repair_method}</strong> • SLA: <strong className={wo.sla_met === 'Y' ? 'text-green-700' : 'text-[#FF4757]'}>{wo.sla_met === 'Y' ? 'Met' : 'Missed'}</strong>
                  </div>

                  {/* Active Flags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {wo.flags.map((f, i) => (
                      <span key={i} className="nb-badge nb-badge-coral text-[9px] px-1 py-0">{f.title}</span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectWorkOrder(wo)}
                    className="nb-btn nb-btn-white text-xs py-1 px-2.5 font-mono"
                  >
                    Inspect
                  </button>

                  {disputeReceipt ? (
                    <span className="bg-yellow-100 border border-yellow-500 text-black px-2.5 py-1 rounded font-mono font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                      <span>Evidence Under Review</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenDispute(wo)}
                      className="nb-btn nb-btn-primary text-xs py-1 px-3 font-mono font-bold flex items-center gap-1"
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

      {/* Dispute Modal */}
      {disputeModalWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="nb-card w-full max-w-lg bg-white p-5 border-4 border-black shadow-nb-xl space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h3 className="font-mono font-black text-base uppercase">Submit Audit Dispute</h3>
              <button onClick={() => setDisputeModalWO(null)} className="font-mono font-bold">✕</button>
            </div>

            {disputeSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="font-black text-sm text-green-900">Dispute Submitted to Ward Executive Engineer!</h4>
                <p className="text-xs text-green-800">
                  Case reference <strong>DISP-2025-{disputeModalWO.work_order_id}</strong> registered. Official IMD rainfall & tidal logs attached to dispute package.
                </p>
                <button onClick={() => setDisputeModalWO(null)} className="nb-btn nb-btn-white text-xs mt-2">
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-[#FAF8F5] border-2 border-black p-2.5 rounded font-mono">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Work Order Contested</span>
                  <strong className="text-sm text-black">{disputeModalWO.work_order_id} — {disputeModalWO.road_name}</strong>
                  <div className="text-[11px] text-gray-600 mt-1">Billed: {formatINR(disputeModalWO.cost_inr)} • Completed: {disputeModalWO.completed_at}</div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Select Dispute Category</label>
                  <select 
                    value={disputeReason} 
                    onChange={(e) => setDisputeReason(e.target.value)} 
                    className="nb-input w-full text-xs font-bold"
                  >
                    <option value="weather">Climatic Force Majeure (Heavy IMD Rain / High Tide Lockout)</option>
                    <option value="traffic">Traffic Police Night-Only NOC Restriction</option>
                    <option value="utility">Utility Trench Sub-base Failure (MGL / MTNL / Adani)</option>
                    <option value="rate">Rate Card Non-Standard Site Condition Justification</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Contractor Justification & Evidence</label>
                  <textarea 
                    rows="4" 
                    value={disputeNote}
                    onChange={(e) => setDisputeNote(e.target.value)}
                    className="nb-input w-full text-xs" 
                  />
                </div>

                <div className="bg-blue-50 border border-blue-300 p-2 rounded text-[11px] text-blue-900 font-mono">
                  ℹ️ System will automatically append IMD Santacruz/Colaba rainfall data and tide height for this window.
                </div>

                <button
                  onClick={handleConfirmDispute}
                  className="nb-btn nb-btn-primary w-full py-2 font-mono font-bold text-xs"
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
