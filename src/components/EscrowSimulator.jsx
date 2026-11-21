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
    <div className={`backdrop-blur-2xl border rounded-2xl p-4 transition-all duration-300 shadow-lg ${
      opbrcActive 
        ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/70 to-emerald-950/30 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]' 
        : 'liquid-glass'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs shadow-sm ${
            opbrcActive 
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
              : 'bg-white/5 border-white/10 text-slate-300'
          }`}>
            WB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="nb-badge nb-badge-black text-[9px] font-mono">WORLD BANK OPBRC MODEL</span>
              <span className={`nb-badge text-[9px] ${opbrcActive ? 'nb-badge-mint' : 'nb-badge-gray'}`}>
                {opbrcActive ? 'ESCROW SIMULATION ACTIVE' : 'STANDARD INPUT BILLING'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-white mt-0.5">
              The "Pothole-Free Escrow" Fiscal Simulator
            </h4>
          </div>
        </div>

        {/* Apple Style Toggle Button */}
        <button
          onClick={() => setOpbrcActive(!opbrcActive)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
            opbrcActive 
              ? 'bg-emerald-500/30 border border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'bg-white/10 border border-white/15 text-slate-300 hover:bg-white/15'
          }`}
        >
          <span>Outcome-Based 30% Escrow:</span>
          <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
            opbrcActive ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/10 text-slate-400'
          }`}>
            {opbrcActive ? 'ACTIVE' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Simulator Metrics Comparison (Stripe / Bloomberg Style) */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="liquid-glass-sub p-3.5 rounded-xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Current Per-Repair Waste</span>
          <span className="font-bold text-sm text-rose-400">{formatCr(wastedSpend)}</span>
          <span className="text-[10px] text-slate-400 block font-sans mt-0.5">{reopenedCount} fixes failed & paid again</span>
        </div>

        <div className={`p-3.5 rounded-xl border transition-all ${
          opbrcActive ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'liquid-glass-sub'
        }`}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            {opbrcActive ? 'Public Treasury Reclaimed' : 'Potential Escrow Pool'}
          </span>
          <span className={`font-bold text-sm ${opbrcActive ? 'text-emerald-300' : 'text-white'}`}>
            {opbrcActive ? formatCr(netSavedINR) : formatCr(totalEscrowPool)}
          </span>
          <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
            {opbrcActive ? '30% deducted automatically from repeat failures' : '30% retained for 90 days after fix'}
          </span>
        </div>

        <div className="liquid-glass-sub p-3.5 rounded-xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Fiscal Impact</span>
          <span className="font-bold text-sm text-cyan-400">
            {opbrcActive ? 'High Contractor Alignment' : 'Pay Per Failure'}
          </span>
          <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
            {opbrcActive ? 'Contractors incentivized for durability' : 'Rewards repeat patching volume'}
          </span>
        </div>
      </div>
    </div>
  );
}
