import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldAlert, Scale } from 'lucide-react';

export default function RTIBriefModal({ workOrder, onClose }) {
  if (!workOrder) return null;

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="nb-card w-full max-w-3xl bg-white shadow-nb-xl my-6 relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#121316] text-white border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded bg-[#FFE600] text-black border-2 border-white flex items-center justify-center font-mono font-black text-lg">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="nb-badge nb-badge-yellow text-black font-mono text-[10px]">SECTION 6 RTI ACT 2005</span>
                <span className="nb-badge nb-badge-coral text-white font-mono text-[10px]">MMC ACT SEC 69</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white mt-0.5">
                Statutory Civic Audit & RTI Information Request Brief
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="nb-btn nb-btn-white text-xs font-mono font-bold py-1 px-3 flex items-center gap-1 hover:bg-[#FFE600]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 nb-btn nb-btn-white p-0 flex items-center justify-center hover:bg-[#FF4757] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Legal RTI Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-900 font-sans leading-relaxed">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-black pb-4 space-y-1">
            <h4 className="text-sm font-black uppercase tracking-wider">
              FORM A — APPLICATION FOR OBTAINING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
            </h4>
            <p className="text-[11px] font-mono text-gray-600 font-bold">
              Before the Public Information Officer (PIO) & Assistant Municipal Commissioner, Ward {workOrder.ward_code}, Municipal Corporation of Greater Mumbai (MCGM / BMC)
            </p>
          </div>

          {/* Applicant & Subject Reference */}
          <div className="bg-[#FAF8F5] border-2 border-black p-3 rounded font-mono space-y-1">
            <div><strong>SUBJECT:</strong> Information regarding public expenditure, rate card benchmark deviation, and warranty status for monsoon road repair order <strong>{workOrder.work_order_id}</strong> on <strong>{workOrder.road_name} ({workOrder.road_id})</strong>.</div>
            <div><strong>COMPLAINT LINKAGE:</strong> {workOrder.linked_complaint_ids?.length > 0 ? workOrder.linked_complaint_ids.join(', ') : 'Unsolicited Order (No public complaint ticket)'}.</div>
          </div>

          {/* Forensic Audit Evidence Schedule */}
          <div>
            <h5 className="font-extrabold uppercase font-mono text-xs text-black mb-2">
              SCHEDULE OF RECORDED AUDIT EVIDENCE & DISCREPANCIES
            </h5>
            <div className="border-2 border-black rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <tbody>
                  <tr className="border-b border-black bg-gray-100">
                    <td className="p-2 font-bold w-1/3 border-r border-black">Work Order ID</td>
                    <td className="p-2 font-black">{workOrder.work_order_id}</td>
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
                    <td className="p-2 font-black text-[#FF4757]">{formatINR(workOrder.cost_inr)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">Standard Rate Card Benchmark</td>
                    <td className="p-2 font-bold text-gray-700">{formatINR(workOrder.expected_cost)}</td>
                  </tr>
                  <tr className="border-b border-black bg-gray-50">
                    <td className="p-2 font-bold border-r border-black">Variance / Potential Overcharge</td>
                    <td className="p-2 font-black text-red-700">
                      +{workOrder.variance_pct}% ({formatINR(Math.max(0, workOrder.cost_inr - workOrder.expected_cost))})
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">Defect Liability Period (DLP)</td>
                    <td className="p-2 font-bold">
                      {workOrder.under_dlp === 'Y' ? (
                        <span className="text-[#FF4757]">CRITICAL BREACH: Road under active warranty; contractor was obligated to repair at ₹0 cost.</span>
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
            <h5 className="font-extrabold uppercase font-mono text-xs text-black">
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
              <span>Generated via: <strong>RupeeTrace v2.1 Evidence Standard</strong></span>
              <div className="text-gray-500 text-[10px]">Independent Assurance & Open Contracting Standards (CoST & IDB Framework)</div>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-black mb-1"></div>
              <span>Signature of Citizen / Ward Auditor</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F5] border-t-2 border-black p-3 flex justify-between items-center text-xs font-mono">
          <span className="text-gray-600 font-bold">Statutory Brief Ready for Legal Filing</span>
          <button 
            onClick={onClose}
            className="nb-btn nb-btn-white text-xs font-bold py-1.5 px-4"
          >
            Close RTI Brief
          </button>
        </div>
      </div>
    </div>
  );
}
