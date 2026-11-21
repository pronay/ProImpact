import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Clock, IndianRupee, MapPin, Wrench, Shield, FileText, Scale, Printer } from 'lucide-react';
import RTIBriefModal from './RTIBriefModal';

export default function WorkOrderModal({ workOrder, onClose, onInspectComplaint }) {
  const [showRtiModal, setShowRtiModal] = useState(false);
  const [citizenVotes, setCitizenVotes] = useState(2); // Initial 2 of 3 votes
  const [hasVoted, setHasVoted] = useState(false);

  if (!workOrder) return null;

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const handleCastVerificationVote = () => {
    if (!hasVoted) {
      setCitizenVotes(3);
      setHasVoted(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div 
          className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl my-8 relative max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header (Cupertino Style) */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-md">
                WO
              </div>
              <div>
                <h3 className="font-bold text-lg sm:text-xl font-mono leading-none text-white">
                  {workOrder.work_order_id}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Ward {workOrder.ward_code} • {workOrder.road_name} ({workOrder.road_id})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 1-Click RTI Button */}
              <button
                onClick={() => setShowRtiModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-all shadow-sm"
                title="Generate 1-Click RTI Information Application Brief"
              >
                <Scale className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">1-Click RTI Brief</span>
              </button>

              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* World Bank GEMS 3-Citizen Consensus Verification Banner */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="nb-badge nb-badge-black text-[9px]">WORLD BANK GEMS MODEL</span>
                  <span className="font-mono font-bold text-gray-600">3-Citizen Consensus Field Check</span>
                </div>
                <div className="font-bold text-sm text-black mt-1 flex items-center gap-1.5">
                  {citizenVotes >= 3 ? (
                    <span className="text-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Community Certified ({citizenVotes}/3 Citizens Verified)
                    </span>
                  ) : (
                    <span className="text-orange-700 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Pending Community Check ({citizenVotes}/3 Citizens Verified)
                    </span>
                  )}
                </div>
              </div>

              {citizenVotes < 3 && (
                <button
                  onClick={handleCastVerificationVote}
                  className="nb-btn nb-btn-primary text-xs font-mono font-bold py-1 px-3 whitespace-nowrap"
                >
                  ✓ Verify Road Quality (1-Tap Check)
                </button>
              )}
            </div>

            {/* Audit Flags Banner */}
            {workOrder.flags && workOrder.flags.length > 0 ? (
              <div className="bg-[#FFF0F2] border-3 border-[#FF4757] p-3 rounded-md shadow-nb-sm">
                <div className="flex items-center justify-between text-[#FF4757] font-extrabold text-sm uppercase mb-2">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Forensic Findings ({workOrder.flags.length} Flagged)
                  </span>
                  <button
                    onClick={() => setShowRtiModal(true)}
                    className="text-[11px] underline font-mono font-bold"
                  >
                    Export Legal RTI Brief →
                  </button>
                </div>
                <div className="space-y-2">
                  {workOrder.flags.map((flag, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 p-2.5 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`nb-badge ${
                          flag.severity === 'CRITICAL' ? 'nb-badge-coral' :
                          flag.severity === 'HIGH' ? 'nb-badge-orange' :
                          flag.severity === 'MEDIUM' ? 'nb-badge-yellow' : 'nb-badge-gray'
                        }`}>
                          {flag.title}
                        </span>
                        {flag.excess_inr > 0 && (
                          <span className="font-mono font-bold text-[#FF4757]">
                            Impact: {formatINR(flag.excess_inr)}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-800">{flag.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#E6FBF2] border-3 border-[#00E599] p-3 rounded-md shadow-nb-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00E599]" />
                <span className="font-bold text-sm text-green-900">
                  Audit Status: Clean — Billed within rate card and complied with SLA guidelines.
                </span>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F8F5EE] border border-slate-200/80 p-2.5 rounded">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">Billed Cost</span>
                <p className="text-base font-extrabold font-mono text-[#0F172A]">{formatINR(workOrder.cost_inr)}</p>
              </div>
              <div className="bg-[#F8F5EE] border border-slate-200/80 p-2.5 rounded">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">Rate Card Benchmark</span>
                <p className="text-base font-extrabold font-mono text-gray-700">{formatINR(workOrder.expected_cost)}</p>
              </div>
              <div className="bg-[#F8F5EE] border border-slate-200/80 p-2.5 rounded">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">SLA Target</span>
                <p className="text-base font-extrabold font-mono flex items-center gap-1">
                  {workOrder.sla_hours}h
                  {workOrder.sla_met === 'Y' ? (
                    <span className="text-[#00E599] text-xs">✓ Met</span>
                  ) : (
                    <span className="text-[#FF4757] text-xs">✗ Breached</span>
                  )}
                </p>
              </div>
              <div className="bg-[#F8F5EE] border border-slate-200/80 p-2.5 rounded">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">30-Day Durability</span>
                <p className="text-base font-extrabold font-mono">
                  {workOrder.reopened_within_30d === 'Y' ? (
                    <span className="text-[#FF4757]">FAILED (Relapsed)</span>
                  ) : (
                    <span className="text-green-700">HELD UP</span>
                  )}
                </p>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="border border-slate-200/80 rounded-md p-3.5 space-y-2 text-xs">
              <h4 className="font-extrabold uppercase font-mono tracking-wider text-gray-600 mb-2">Repair Specifications</h4>
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-gray-500 font-bold">Repair Method:</span>{' '}
                  <span className="font-extrabold">{workOrder.repair_method}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Work Category:</span>{' '}
                  <span className="font-extrabold">{workOrder.work_type}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Contractor:</span>{' '}
                  <span className="font-extrabold">{workOrder.contractor_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Area Patched:</span>{' '}
                  <span className="font-extrabold">{workOrder.area_sqm} sq.m</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Road Surface:</span>{' '}
                  <span className="font-extrabold">{workOrder.road_surface}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Under Warranty (DLP):</span>{' '}
                  <span className={`font-bold font-mono px-1 rounded ${workOrder.under_dlp === 'Y' ? 'bg-[#FF4757] text-white' : 'bg-gray-200'}`}>
                    {workOrder.under_dlp === 'Y' ? 'YES (Breach)' : 'NO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Engineer Remark */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-3 rounded-md text-xs">
              <span className="font-bold text-gray-500 uppercase font-mono block mb-1">Site Engineer Log / Remark</span>
              <p className="italic text-gray-800 font-medium">"{workOrder.engineer_remark}"</p>
            </div>

            {/* Linked Complaints */}
            <div>
              <h4 className="font-extrabold uppercase font-mono text-xs tracking-wider text-gray-600 mb-2">
                Linked Citizen Complaints ({workOrder.linked_complaint_ids.length})
              </h4>
              {workOrder.linked_complaint_ids.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {workOrder.linked_complaint_ids.map((cid) => (
                    <button
                      key={cid}
                      onClick={() => onInspectComplaint && onInspectComplaint(cid)}
                      className="nb-badge nb-badge-cyan hover:bg-[#F59E0B] cursor-pointer"
                    >
                      <span>{cid}</span>
                      <span className="text-[10px] ml-1">→ Inspect</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#FF4757] font-bold">
                  ⚠️ No citizen complaints linked. Initiated without public ticket trace.
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-[#F8F5EE] border-t-2 border-[#0F172A] p-3 flex justify-between items-center text-xs font-mono">
            <button
              onClick={() => setShowRtiModal(true)}
              className="nb-btn nb-btn-primary text-xs py-1 px-3 flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>1-Click RTI Brief</span>
            </button>
            <button 
              onClick={onClose}
              className="nb-btn nb-btn-white text-xs font-bold py-1.5 px-4"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Embedded 1-Click RTI Brief Modal */}
      {showRtiModal && (
        <RTIBriefModal
          workOrder={workOrder}
          onClose={() => setShowRtiModal(false)}
        />
      )}
    </>
  );
}
