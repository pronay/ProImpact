import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, IndianRupee, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export default function EscrowSimulator({ totalSpend, wastedSpend, totalWorkOrders, reopenedCount }) {
  const [opbrcActive, setOpbrcActive] = useState(false);

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;
  const formatCr = (val) => `₹${((val || 0) / 10000000).toFixed(2)} Cr`;

  // OPBRC Math (World Bank Output- & Performance-Based Contracting):
  // 30% of every bill is placed in a 90-day Durability Escrow.
  // When a repair fails in <30 days, the entire 30% escrow is forfeited to the Ward Treasury!
  const totalEscrowPool = totalSpend * 0.30;
  const forfeitedEscrowSavings = wastedSpend * 0.30; // 30% of failed fixes reclaimed
  const netSavedINR = forfeitedEscrowSavings;

  return (
    <div className={`nb-card p-4 transition-all border-3 border-black ${opbrcActive ? 'bg-[#EBFBF5]' : 'bg-[#FAF8F5]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded border-2 border-black flex items-center justify-center font-mono font-black ${opbrcActive ? 'bg-[#00E599] text-black' : 'bg-gray-200 text-gray-700'}`}>
            WB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="nb-badge nb-badge-black text-[9px]">WORLD BANK OPBRC MODEL</span>
              <span className={`nb-badge text-[9px] ${opbrcActive ? 'nb-badge-mint text-black font-black' : 'nb-badge-gray'}`}>
                {opbrcActive ? 'ESCROW SIMULATION ACTIVE' : 'STANDARD INPUT BILLING'}
              </span>
            </div>
            <h4 className="font-black text-sm uppercase text-black mt-0.5">
              The "Pothole-Free Escrow" Fiscal Simulator
            </h4>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setOpbrcActive(!opbrcActive)}
          className={`nb-btn text-xs font-mono font-bold py-1.5 px-3 flex items-center gap-2 ${
            opbrcActive ? 'nb-btn-success' : 'nb-btn-white'
          }`}
        >
          <span>Outcome-Based 30% Escrow:</span>
          <strong className="uppercase">{opbrcActive ? 'ON' : 'OFF'}</strong>
        </button>
      </div>

      {/* Simulator Metrics Comparison */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-white border-2 border-black p-2.5 rounded">
          <span className="text-[10px] text-gray-500 font-bold uppercase block">Current Per-Repair Waste</span>
          <span className="font-black text-sm text-[#FF4757]">{formatCr(wastedSpend)}</span>
          <span className="text-[10px] text-gray-600 block">{reopenedCount} fixes failed & paid again</span>
        </div>

        <div className="bg-white border-2 border-black p-2.5 rounded">
          <span className="text-[10px] text-gray-500 font-bold uppercase block">
            {opbrcActive ? 'Public Treasury Reclaimed' : 'Potential Escrow Pool'}
          </span>
          <span className={`font-black text-sm ${opbrcActive ? 'text-green-700' : 'text-blue-900'}`}>
            {opbrcActive ? formatLakh(forfeitedEscrowSavings) : formatCr(totalEscrowPool)}
          </span>
          <span className="text-[10px] text-gray-600 block">
            {opbrcActive ? 'Forfeited by sloppy contractors' : '30% retention benchmark'}
          </span>
        </div>

        <div className={`border-2 border-black p-2.5 rounded ${opbrcActive ? 'bg-[#FFE600]' : 'bg-gray-100'}`}>
          <span className="text-[10px] text-gray-700 font-bold uppercase block">Impact on Contractor Profit</span>
          <span className="font-black text-sm text-black">
            {opbrcActive ? 'Durability-Aligned' : 'Repeat-Repair Rewarded'}
          </span>
          <span className="text-[10px] text-gray-800 block">
            {opbrcActive ? 'Profits drop if potholes reappear' : 'Paid twice for fixing same spot'}
          </span>
        </div>
      </div>

      {/* World Bank Rationale Explainer */}
      <p className="text-[11px] text-gray-700 font-medium mt-2 leading-relaxed">
        <strong>World Bank Evidence:</strong> Paying contractors per-pothole rewards quick failures. In OPBRC, 30% of every bill is held in a 90-day Durability Escrow. If a patch fails within 30 days, the contractor forfeits the escrow into the ward budget.
      </p>
    </div>
  );
}
