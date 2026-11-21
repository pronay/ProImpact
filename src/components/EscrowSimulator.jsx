import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, IndianRupee, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className={`backdrop-blur-xl border rounded-2xl p-4 transition-all duration-200 shadow-sm ${
      opbrcActive 
        ? 'bg-gradient-to-br from-emerald-50/80 via-white/90 to-emerald-50/60 border-emerald-200/90' 
        : 'bg-white/80 border-slate-200/80'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs shadow-sm ${
            opbrcActive 
              ? 'bg-emerald-600 border-emerald-500 text-white' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            WB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="nb-badge nb-badge-black text-[9px]">WORLD BANK OPBRC MODEL</span>
              <span className={`nb-badge text-[9px] ${opbrcActive ? 'nb-badge-mint' : 'nb-badge-gray'}`}>
                {opbrcActive ? 'ESCROW SIMULATION ACTIVE' : 'STANDARD INPUT BILLING'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mt-0.5">
              The "Pothole-Free Escrow" Fiscal Simulator
            </h4>
          </div>
        </div>

        {/* Apple Style Toggle Button */}
        <button
          onClick={() => setOpbrcActive(!opbrcActive)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
            opbrcActive 
              ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Outcome-Based 30% Escrow:</span>
          <span className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] font-bold ${
            opbrcActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {opbrcActive ? 'ACTIVE' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Simulator Metrics Comparison (Stripe Style) */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="bg-white/90 border border-slate-200/80 p-3 rounded-xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Current Per-Repair Waste</span>
          <span className="font-bold text-sm text-rose-600">{formatCr(wastedSpend)}</span>
          <span className="text-[10px] text-slate-500 block font-sans">{reopenedCount} fixes failed & paid again</span>
        </div>

        <div className={`border p-3 rounded-xl shadow-sm transition-all ${
          opbrcActive ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' : 'bg-white/90 border-slate-200/80'
        }`}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            {opbrcActive ? 'Public Treasury Reclaimed' : 'Potential Escrow Pool'}
          </span>
          <span className={`font-bold text-sm ${opbrcActive ? 'text-emerald-700' : 'text-slate-900'}`}>
            {opbrcActive ? formatCr(netSavedINR) : formatCr(totalEscrowPool)}
          </span>
          <span className="text-[10px] text-slate-500 block font-sans">
            {opbrcActive ? '30% deducted automatically from repeat failures' : '30% retained for 90 days after fix'}
          </span>
        </div>

        <div className="bg-white/90 border border-slate-200/80 p-3 rounded-xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Fiscal Impact</span>
          <span className="font-bold text-sm text-sky-700">
            {opbrcActive ? 'High Contractor Alignment' : 'Pay Per Failure'}
          </span>
          <span className="text-[10px] text-slate-500 block font-sans">
            {opbrcActive ? 'Contractors incentivized for durability' : 'Rewards repeat patching volume'}
          </span>
        </div>
      </div>
    </div>
  );
}
