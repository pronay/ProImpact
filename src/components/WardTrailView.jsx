import React, { useState } from 'react';
import { Building2, AlertTriangle, CheckCircle2, TrendingUp, IndianRupee, Flame, ShieldAlert, ArrowRight, Filter } from 'lucide-react';
import EscrowSimulator from './EscrowSimulator';

export default function WardTrailView({ wards, onSelectWorkOrder, onNavigateToAuditor }) {
  const [selectedWardCode, setSelectedWardCode] = useState(wards[0]?.ward_code || 'F/N');
  const [selectedZone, setSelectedZone] = useState('ALL');

  const selectedWard = wards.find(w => w.ward_code === selectedWardCode) || wards[0];

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;
  const formatCr = (val) => `₹${((val || 0) / 10000000).toFixed(2)} Cr`;

  const zones = ['ALL', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'];

  const filteredWards = selectedZone === 'ALL' 
    ? wards 
    : wards.filter(w => w.zone === selectedZone);

  return (
    <div className="space-y-6">
      {/* Ward Selector Bar */}
      <div className="nb-card p-4 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl font-extrabold uppercase font-mono tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FFE600] fill-black" />
              Ward Money Trail Explorer
            </h2>
            <p className="text-xs font-bold text-gray-600">
              Select one of Mumbai's 24 municipal wards to inspect monsoon repair allocation, durability, and wasted funds.
            </p>
          </div>

          {/* Zone Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono font-bold text-gray-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Zone:
            </span>
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`nb-badge text-[11px] cursor-pointer transition-all ${
                  selectedZone === z 
                    ? 'nb-badge-black text-white' 
                    : 'nb-badge-gray hover:bg-[#FFE600]'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* 24 Wards Grid Selection */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {filteredWards.map((w) => {
            const isSelected = w.ward_code === selectedWardCode;
            const isOverspent = w.utilization_pct > 100;
            const hasHighWaste = w.failure_rate_pct > 25;
            return (
              <button
                key={w.ward_code}
                onClick={() => setSelectedWardCode(w.ward_code)}
                className={`p-2 rounded border-2 text-left transition-all relative ${
                  isSelected
                    ? 'bg-[#FFE600] border-[#121316] shadow-nb-sm -translate-y-1'
                    : 'bg-[#F8F5EE] border-gray-400 hover:border-black hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base leading-none">{w.ward_code}</span>
                  {hasHighWaste && (
                    <span className="w-2 h-2 rounded-full bg-[#FF4757]" title="High 30-day failure rate" />
                  )}
                </div>
                <div className="text-[10px] font-bold text-gray-600 truncate mt-1">
                  {w.zone}
                </div>
                <div className="text-[9px] font-mono text-gray-800 font-bold truncate">
                  {formatLakh(w.total_spend_inr)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Ward Profile Header */}
      <div className="nb-card p-5 bg-[#FFFDF7] border-4 border-[#121316]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-[#121316]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="nb-badge nb-badge-black text-sm px-2 py-0.5">WARD {selectedWard.ward_code}</span>
              <span className="nb-badge nb-badge-yellow">{selectedWard.zone}</span>
              <span className="text-xs font-bold text-gray-600 font-mono">
                {selectedWard.assistant_commissioner_office}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase mt-1">
              {selectedWard.ward_name}
            </h3>
            <p className="text-xs font-bold text-gray-600 mt-0.5">
              Localities: {selectedWard.localities.join(', ')}
            </p>
          </div>

          {/* Terrain & Vulnerability Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white border-2 border-[#121316] px-3 py-1.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Flood Prone Index</span>
              <span className={`font-mono font-extrabold text-sm ${selectedWard.low_lying_index > 0.6 ? 'text-[#FF4757]' : 'text-gray-800'}`}>
                {(selectedWard.low_lying_index * 100).toFixed(0)}% Vulnerable
              </span>
            </div>
            <div className="bg-white border-2 border-[#121316] px-3 py-1.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Hotspots</span>
              <span className="font-mono font-extrabold text-sm text-gray-800">{selectedWard.chronic_hotspots_count} Chronic</span>
            </div>
            <div className="bg-white border-2 border-[#121316] px-3 py-1.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Crews / Day</span>
              <span className="font-mono font-extrabold text-sm text-gray-800">{selectedWard.engineering_crews} Teams</span>
            </div>
          </div>
        </div>

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Card 1: Budget vs Spend */}
          <div className="nb-card p-4 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono text-gray-600">Monsoon Budget</span>
              <span className="nb-badge nb-badge-gray">{selectedWard.utilization_pct}% Used</span>
            </div>
            <div className="text-2xl font-black font-mono">{formatLakh(selectedWard.budget_inr)}</div>
            <div className="text-xs font-bold text-gray-600 mt-1">
              Spent: <span className="font-mono font-extrabold text-black">{formatLakh(selectedWard.total_spend_inr)}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-3 border-2 border-black rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full ${selectedWard.utilization_pct > 100 ? 'bg-[#FF4757]' : 'bg-[#00E599]'}`}
                style={{ width: `${Math.min(100, selectedWard.utilization_pct)}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-gray-500 mt-1 flex justify-between">
              <span>Remaining</span>
              <span className="font-bold text-black">{formatLakh(selectedWard.remaining_inr)}</span>
            </div>
          </div>

          {/* Card 2: Wasted Money */}
          <div className="nb-card p-4 bg-[#FFF0F2] border-[#FF4757]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono text-[#FF4757] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Wasted Rupees
              </span>
              <span className="nb-badge nb-badge-coral">{selectedWard.failure_rate_pct}% Failed</span>
            </div>
            <div className="text-2xl font-black font-mono text-[#FF4757]">
              {formatLakh(selectedWard.wasted_spend_inr)}
            </div>
            <div className="text-xs font-bold text-gray-700 mt-1">
              Failed within 30 days: <span className="font-mono font-extrabold">{selectedWard.reopened_count} of {selectedWard.total_work_orders} fixes</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-3 font-medium">
              Money paid for patches that broke down within a month of completion.
            </p>
          </div>

          {/* Card 3: DLP Warranty Breaches */}
          <div className="nb-card p-4 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono text-gray-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FF8800]" /> DLP Breach Cost
              </span>
              <span className="nb-badge nb-badge-orange">Warranty</span>
            </div>
            <div className="text-2xl font-black font-mono text-[#FF8800]">
              {formatLakh(selectedWard.dlp_violation_spend_inr)}
            </div>
            <div className="text-xs font-bold text-gray-600 mt-1">
              Overbilled Excess: <span className="font-mono font-bold">{formatLakh(selectedWard.overbilled_spend_inr)}</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-3 font-medium">
              Repairs on roads under active defect liability period that BMC paid for.
            </p>
          </div>

          {/* Card 4: SLA Reliability */}
          <div className="nb-card p-4 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono text-gray-600">SLA Speed Met</span>
              <span className={`nb-badge ${selectedWard.sla_compliance_pct >= 60 ? 'nb-badge-mint' : 'nb-badge-yellow'}`}>
                {selectedWard.sla_compliance_pct}% Met
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-gray-900">
              {selectedWard.total_work_orders}
            </div>
            <div className="text-xs font-bold text-gray-600 mt-1">
              Total repair orders executed this monsoon season.
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
              <span>Roads: {selectedWard.roads_count}</span> • 
              <span>Accidents: {selectedWard.accidents_count}</span>
            </div>
          </div>
        </div>

        {/* AI Plain-Language Audit Verdict */}
        <div className="mt-5 bg-[#FFE600] border-3 border-[#121316] p-4 rounded-md shadow-nb-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="nb-badge nb-badge-black text-[10px]">CLAUDE CIVIC AUDIT VERDICT</span>
            <span className="text-xs font-extrabold uppercase tracking-wide">PLAIN-LANGUAGE EXECUTIVE BRIEF</span>
          </div>
          <p className="text-sm font-bold text-[#121316] leading-relaxed">
            "{selectedWard.audit_verdict}"
          </p>
        </div>
      </div>

      {/* World Bank OPBRC Outcome-Based Escrow Simulator for this Ward */}
      <EscrowSimulator
        totalSpend={selectedWard.total_spend_inr}
        wastedSpend={selectedWard.wasted_spend_inr}
        totalWorkOrders={selectedWard.total_work_orders}
        reopenedCount={selectedWard.reopened_count}
      />

      {/* Spend Breakdown Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method Breakdown */}
        <div className="nb-card p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold font-mono text-base uppercase">
              Spend by Repair Method
            </h3>
            <span className="text-xs font-mono font-bold text-gray-500">
              {selectedWard.spend_by_method.length} Methods Deployed
            </span>
          </div>
          <div className="space-y-3">
            {selectedWard.spend_by_method.map((item, idx) => {
              const pct = ((item.amount / selectedWard.total_spend_inr) * 100).toFixed(1);
              return (
                <div key={idx} className="border-2 border-black p-2.5 rounded bg-[#FAF8F5]">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="truncate pr-2">{item.method}</span>
                    <span className="font-mono text-right">{formatLakh(item.amount)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 border border-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00F0FF]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contractor Allocation Breakdown */}
        <div className="nb-card p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold font-mono text-base uppercase">
              Spend by Contractor
            </h3>
            <span className="text-xs font-mono font-bold text-gray-500">
              {selectedWard.spend_by_contractor.length} Contractors
            </span>
          </div>
          <div className="space-y-3">
            {selectedWard.spend_by_contractor.map((item, idx) => {
              const pct = ((item.amount / selectedWard.total_spend_inr) * 100).toFixed(1);
              return (
                <div key={idx} className="border-2 border-black p-2.5 rounded bg-[#FAF8F5]">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="truncate pr-2">{item.contractor}</span>
                    <span className="font-mono text-right">{formatLakh(item.amount)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 border border-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FFE600]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ward Action Footer */}
      <div className="nb-card p-4 bg-[#F8F5EE] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-bold text-gray-700">
          Want to inspect flagged work orders for Ward <span className="font-mono font-black">{selectedWard.ward_code}</span>?
        </div>
        <button
          onClick={() => onNavigateToAuditor && onNavigateToAuditor(selectedWard.ward_code)}
          className="nb-btn nb-btn-primary text-xs font-extrabold uppercase py-2 px-4 flex items-center gap-2"
        >
          <span>Open Ward {selectedWard.ward_code} in Repair Auditor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
