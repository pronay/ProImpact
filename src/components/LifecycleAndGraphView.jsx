import React, { useState } from 'react';
import { ArrowRight, Layers, ShieldCheck, AlertTriangle, CloudRain, Car, IndianRupee, QrCode } from 'lucide-react';

export default function LifecycleAndGraphView({ roads, onOpenRoadPassport }) {
  const [selectedRoadId, setSelectedRoadId] = useState(roads[0]?.road_id || 'RD0001');
  const selectedRoad = roads.find(r => r.road_id === selectedRoadId) || roads[0];

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="nb-card p-5 bg-[#F59E0B] border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">LIFECYCLE INTELLIGENCE</span>
              <span className="nb-badge nb-badge-cyan">EVIDENCE-GAP TRANSPARENCY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mt-1">
              4-Stage Lifecycle & Visual Rupee Trace Graph
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              Tracing projects from citizen complaint intake, across execution and signoff, to post-completion durability reality.
            </p>
          </div>

          {/* Road Segment Selector */}
          <div className="flex items-center gap-2 bg-white border border-white/10 p-2 rounded shadow-nb-sm">
            <span className="text-xs font-mono font-bold text-slate-300">Inspect Road:</span>
            <select
              value={selectedRoadId}
              onChange={(e) => setSelectedRoadId(e.target.value)}
              className="nb-input text-xs py-1"
            >
              {roads.slice(0, 40).map(r => (
                <option key={r.road_id} value={r.road_id}>
                  {r.road_id} — {r.road_name.split(' ')[0]} (Ward {r.ward_code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4-Stage Lifecycle Flowchart Section */}
      <div className="nb-card p-5 bg-white border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div>
            <h3 className="text-lg font-bold font-mono uppercase">
              End-to-End Civic Project Lifecycle Flowchart
            </h3>
            <p className="text-xs font-bold text-slate-300">
              Shows start-to-end and what happens <em>after the end</em> (post-completion durability and rework).
            </p>
          </div>
          <span className="nb-badge nb-badge-yellow text-xs">EVIDENCE CONFIDENCE STANDARD</span>
        </div>

        {/* The 5 Horizontal Flowchart Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1: Start (Intake) */}
          <div className="nb-card p-3.5 liquid-glass-sub border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">1</span>
                <span className="nb-badge nb-badge-mint text-[9px]">DOCUMENTED</span>
              </div>
              <h4 className="font-extrabold text-xs uppercase text-white">START (Citizen Intake)</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Citizen tickets logged via MyBMC App, 1916 Helpline, or walk-ins with multilingual text and location tags.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-300 text-[10px] font-mono text-slate-300">
              Intake-to-dispatch lag: ~1.5 days
            </div>
          </div>

          {/* Step 2: Tender (Gap) */}
          <div className="nb-card p-3.5 bg-gray-50 border-2 border-dashed border-gray-400 flex flex-col justify-between opacity-90">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-gray-300 text-slate-300 border-2 border-gray-500 flex items-center justify-center font-mono font-bold text-xs">2</span>
                <span className="nb-badge nb-badge-gray text-[9px] text-slate-300">DATA GAP</span>
              </div>
              <h4 className="font-extrabold text-xs uppercase text-slate-300">TENDER & PROCUREMENT</h4>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                Pre-award RFPs, bid evaluation minutes, and material procurement splits are <strong>Unavailable in Supplied Dataset</strong>.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-300 text-[10px] font-mono text-slate-400">
              Phase 2 Registry Standard
            </div>
          </div>

          {/* Step 3: Build */}
          <div className="nb-card p-3.5 liquid-glass-sub border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00F0FF] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">3</span>
                <span className="nb-badge nb-badge-mint text-[9px]">DOCUMENTED</span>
              </div>
              <h4 className="font-extrabold text-xs uppercase text-white">BUILD (Execution)</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Contractor deployed with specific repair method (Cold/Hot mix, Mastic, Dewatering). Benchmarked to rate card.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-300 text-[10px] font-mono text-slate-300">
              Weather delay cross-check active
            </div>
          </div>

          {/* Step 4: Complete */}
          <div className="nb-card p-3.5 liquid-glass-sub border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00E599] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">4</span>
                <span className="nb-badge nb-badge-mint text-[9px]">CROSS-VERIFIED</span>
              </div>
              <h4 className="font-extrabold text-xs uppercase text-white">COMPLETE (Signoff)</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Site completion logged, engineer remark recorded, SLA compliance checked against target hours.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-300 text-[10px] font-mono text-slate-300">
              Billed cost recorded to BMC
            </div>
          </div>

          {/* Step 5: Durability (What happens after) */}
          <div className="nb-card p-3.5 bg-rose-950/40 border border-rose-500/40 backdrop-blur-md border-2 border-[#FF4757] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#FF4757] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">5</span>
                <span className="nb-badge nb-badge-coral text-[9px]">OBSERVED OUTCOME</span>
              </div>
              <h4 className="font-extrabold text-xs uppercase text-rose-400">POST-COMPLETION DURABILITY</h4>
              <p className="text-[11px] text-gray-800 mt-1">
                Monitors <strong>time-to-next-complaint</strong> and 30-day failure relapses. Flags recurring rework costs.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-red-200 text-[10px] font-mono text-rose-400 font-bold">
              "Cost of To & Fro" Tracked
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Money Trace Graph */}
      <div className="nb-card p-5 bg-white border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
          <div>
            <h3 className="text-lg font-bold font-mono uppercase">
              Visual Money Trace Graph — {selectedRoad.road_name} ({selectedRoad.road_id})
            </h3>
            <p className="text-xs font-bold text-slate-300">
              Interactive node-edge flow showing how public monsoon rupees flow from ward budget through work orders to durability outcomes.
            </p>
          </div>

          <button
            onClick={() => onOpenRoadPassport(selectedRoad)}
            className="nb-btn nb-btn-primary text-xs font-mono font-bold py-1.5 px-3 flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Road Passport</span>
          </button>
        </div>

        {/* Node Edge Graph Container */}
        <div className="liquid-glass-sub border border-white/10 p-5 rounded-lg overflow-x-auto space-y-6">
          {/* Main Horizontal Rupee Trace Stream */}
          <div className="flex items-center justify-between gap-3 min-w-[850px] text-xs font-mono font-bold">
            {/* Node 1: Ward Budget */}
            <div className="nb-card p-3 bg-[#F59E0B] text-center border border-white/10 w-36 shadow-nb-sm">
              <span className="text-[9px] uppercase text-slate-300 block">Monsoon Budget</span>
              <span className="font-bold text-base text-white">Ward {selectedRoad.ward_code}</span>
              <span className="text-[10px] text-gray-800 block">Public Source</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

            {/* Node 2: Road Asset */}
            <div className="nb-card p-3 bg-white text-center border border-white/10 w-40 shadow-nb-sm">
              <span className="text-[9px] uppercase text-slate-400 block">Asset Identity</span>
              <span className="font-bold text-base text-white">{selectedRoad.road_id}</span>
              <span className="text-[10px] text-slate-300 truncate block">{selectedRoad.road_name}</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

            {/* Node 3: Work Orders Executed */}
            <div className="nb-card p-3 bg-white text-center border border-white/10 w-40 shadow-nb-sm">
              <span className="text-[9px] uppercase text-slate-400 block">Repairs Executed</span>
              <span className="font-bold text-base text-white">{selectedRoad.total_repairs_count} Orders</span>
              <span className="text-[10px] text-slate-300 block">{selectedRoad.surface} ({selectedRoad.lanes}L)</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

            {/* Node 4: Billed Spend */}
            <div className="nb-card p-3 bg-[#00F0FF] text-center border border-white/10 w-40 shadow-nb-sm">
              <span className="text-[9px] uppercase text-slate-300 block">Recorded Spend</span>
              <span className="font-bold text-base text-white">{formatINR(selectedRoad.total_spent_inr)}</span>
              <span className="text-[10px] text-gray-800 block">Billed to BMC</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

            {/* Node 5: Durability Outcome */}
            <div className={`nb-card p-3 text-center border border-white/10 w-44 shadow-nb-sm ${selectedRoad.reopened_count > 0 ? 'bg-[#FF4757] text-white' : 'bg-[#00E599] text-white'}`}>
              <span className="text-[9px] uppercase block opacity-80">Durability Outcome</span>
              <span className="font-bold text-base">{selectedRoad.reopened_count > 0 ? 'Relapsed <30d' : 'Durable Fix'}</span>
              <span className="text-[10px] block">{selectedRoad.reopened_count > 0 ? `${formatINR(selectedRoad.direct_rework_spend_inr)} Rework` : 'Held Up Through Rain'}</span>
            </div>
          </div>

          {/* Sub-node Row: Attached Environmental & Traffic Load Context */}
          <div className="border-t-2 border-gray-300 pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-white/10 p-3 rounded text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Attached Traffic Load Node</span>
              <div className="font-bold text-white">
                Peak: <strong>{selectedRoad.traffic_peak_hour} vehicles/hr</strong> • Congestion: <strong>{selectedRoad.congestion_index}/10</strong>
              </div>
            </div>

            <div className="bg-white border border-white/10 p-3 rounded text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Observed Durability Interval</span>
              <div className="font-bold text-cyan-400">
                Average Time to Next Complaint: <strong>{selectedRoad.durability_proxy_days} Days</strong>
              </div>
            </div>

            <div className="bg-white border border-white/10 p-3 rounded text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Warranty & Safety Context</span>
              <div className="font-bold">
                {selectedRoad.under_dlp === 'Y' ? (
                  <span className="text-rose-400">⚠️ Under DLP Warranty (Billed in Error)</span>
                ) : (
                  <span className="text-emerald-400">✓ Legitimate BMC Maintenance Road</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
