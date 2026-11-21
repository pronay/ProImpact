import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldAlert, Scale } from 'lucide-react';

export default function RTIBriefModal({ workOrder, onClose }) {
  if (!workOrder) return null;

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl border border-white/10 shadow-2xl my-6 relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Cupertino Style) */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/400 text-white flex items-center justify-center font-bold text-lg shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">SECTION 6 RTI ACT 2005</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 font-mono text-[10px] border border-rose-700/50">MMC ACT SEC 69</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Statutory Civic Audit & RTI Information Request Brief
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print / PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Legal RTI Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-white font-sans leading-relaxed">
          {/* Official Letterhead */}
          <div className="text-center border-b border-white/15 pb-4 space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              FORM A — APPLICATION FOR OBTAINING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
            </h4>
            <p className="text-[11px] font-mono text-slate-300 font-bold">
              Before the Public Information Officer (PIO) & Assistant Municipal Commissioner, Ward {workOrder.ward_code}, Municipal Corporation of Greater Mumbai (MCGM / BMC)
            </p>
          </div>

          {/* Applicant & Subject Reference */}
          <div className="liquid-glass-sub border border-white/10 p-3 rounded font-mono space-y-1">
            <div><strong>SUBJECT:</strong> Information regarding public expenditure, rate card benchmark deviation, and warranty status for monsoon road repair order <strong>{workOrder.work_order_id}</strong> on <strong>{workOrder.road_name} ({workOrder.road_id})</strong>.</div>
            <div><strong>COMPLAINT LINKAGE:</strong> {workOrder.linked_complaint_ids?.length > 0 ? workOrder.linked_complaint_ids.join(', ') : 'Unsolicited Order (No public complaint ticket)'}.</div>
          </div>

          {/* Forensic Audit Evidence Schedule */}
          <div>
            <h5 className="font-extrabold uppercase font-mono text-xs text-white mb-2">
              SCHEDULE OF RECORDED AUDIT EVIDENCE & DISCREPANCIES
            </h5>
            <div className="border border-white/10 rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <tbody>
                  <tr className="border-b border-black bg-gray-100">
                    <td className="p-2 font-bold w-1/3 border-r border-black">Work Order ID</td>
                    <td className="p-2 font-bold">{workOrder.work_order_id}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">Asset Location</td>
                    <td className="p-2">{workOrder.road_name} ({workOrder.road_id}), Ward {workOrder.ward_code}</td>
                  </tr>
                  <tr className="border-b border-black bg-gray-50">
                    <td className="p-2 font-bold border-r border-black">Empanelled Contractor</td>
                    <td className="p-2 font-bold">{workOrder.contractor_name} ({workOrder.contractor_id})</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">Repair Method & Area</td>
                    <td className="p-2">{workOrder.repair_method} ({workOrder.area_sqm} sq.m)</td>
                  </tr>
                  <tr className="border-b border-black bg-gray-50">
                    <td className="p-2 font-bold border-r border-black">Billed Cost (Recorded)</td>
                    <td className="p-2 font-bold text-rose-400">{formatINR(workOrder.cost_inr)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">Standard Rate Card Benchmark</td>
                    <td className="p-2 font-bold text-slate-300">{formatINR(workOrder.expected_cost)}</td>
                  </tr>
                  <tr className="border-b border-black bg-gray-50">
                    <td className="p-2 font-bold border-r border-black">Variance / Potential Overcharge</td>
                    <td className="p-2 font-bold text-rose-400">
                      +{workOrder.variance_pct}% ({formatINR(Math.max(0, workOrder.cost_inr - workOrder.expected_cost))})
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">Defect Liability Period (DLP)</td>
                    <td className="p-2 font-bold">
                      {workOrder.under_dlp === 'Y' ? (
                        <span className="text-rose-400">CRITICAL BREACH: Road under active warranty; contractor was obligated to repair at ₹0 cost.</span>
                      ) : 'Normal Maintenance Asset'}
                    </td>
                  </tr>
                  <tr className="border-b border-black bg-gray-50">
                    <td className="p-2 font-bold border-r border-black">Execution Timeline</td>
                    <td className="p-2">Assigned: {workOrder.assigned_at} → Completed: {workOrder.completed_at}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border-r border-black">30-Day Durability Outcome</td>
                    <td className="p-2 font-bold">
                      {workOrder.reopened_within_30d === 'Y' ? 'FAILED: Patch reopened within 30 days of signoff.' : 'Held Up'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Specific Information Demanded */}
          <div className="space-y-2">
            <h5 className="font-extrabold uppercase font-mono text-xs text-white">
              PARTICULARS OF INFORMATION REQUIRED UNDER RTI ACT SEC 6(1):
            </h5>
            <ol className="list-decimal pl-5 space-y-1 font-mono text-[11px] text-gray-800">
              <li>Certified copy of the Site Measurement Sheet signed by the Junior Engineer (Roads) for <strong>{workOrder.work_order_id}</strong>.</li>
              <li>Justification for sanctioning payment of <strong>{formatINR(workOrder.cost_inr)}</strong> against the standard rate card expectation of <strong>{formatINR(workOrder.expected_cost)}</strong>.</li>
              <li>Whether recovery or 20% milestone penalty has been initiated for premature pothole failure recorded within 30 days.</li>
              {workOrder.under_dlp === 'Y' && (
                <li>Whether recovery of the full billed amount has been ordered against the original road contractor holding Defect Liability warranty.</li>
              )}
            </ol>
          </div>

          {/* Declaration */}
          <div className="pt-3 border-t-2 border-black flex justify-between items-end text-[11px] font-mono">
            <div>
              <span>Generated via: <strong>ProTrace v2.1 Evidence Standard</strong></span>
              <div className="text-slate-400 text-[10px]">Independent Assurance & Open Contracting Standards (CoST & IDB Framework)</div>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-black mb-1"></div>
              <span>Signature of Citizen / Ward Auditor</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="liquid-glass-sub border-t-2 border-black p-3 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300 font-bold">Statutory Brief Ready for Legal Filing</span>
          <button 
            onClick={onClose}
            className="nb-btn nb-btn text-xs font-bold py-1.5 px-4"
          >
            Close RTI Brief
          </button>
        </div>
      </div>
    </div>
  );
}
