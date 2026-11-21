import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, IndianRupee, Layers, ExternalLink } from 'lucide-react';

export default function ContractorScorecardView({ contractors, onFilterAuditsByContractor }) {
  const [selectedSort, setSelectedSort] = useState('grade');

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatCr = (val) => `₹${((val || 0) / 10000000).toFixed(2)} Cr`;

  const sortedContractors = [...contractors].sort((a, b) => {
    if (selectedSort === 'grade') return b.composite_score - a.composite_score;
    if (selectedSort === 'spend') return b.total_billed_inr - a.total_billed_inr;
    if (selectedSort === 'sla') return b.sla_compliance_pct - a.sla_compliance_pct;
    if (selectedSort === 'durability') return a.reopen_rate_pct - b.reopen_rate_pct; // lower failure is better
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="nb-card p-5 bg-[#FFE600] border-4 border-[#121316]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">CIVIC ACCOUNTABILITY</span>
              <span className="nb-badge nb-badge-mint">TERRAIN-NORMALIZED FAIR AUDIT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase mt-1">
              Contractor Performance Scorecards
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
              Evaluating speed, durability (30-day failure rate), rate card integrity, and accounting for terrain difficulty in low-lying monsoon zones.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gray-800">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="nb-input text-xs py-1.5"
            >
              <option value="grade">Overall Composite Grade</option>
              <option value="spend">Total Spend Billed (₹)</option>
              <option value="sla">SLA Speed Compliance (%)</option>
              <option value="durability">Durability (Lowest Relapse)</option>
            </select>
          </div>
        </div>

        {/* Fairness Guarantee Notice */}
        <div className="mt-4 bg-white/90 border-2 border-black p-3 rounded text-xs font-bold text-gray-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Fair Accountability Standard:</strong> Contractors working in chronic low-lying flood wards (e.g. F/N, F/S, G/N) receive an environmental stress correction factor. We do not punish contractors simply for operating in waterlogged terrain or taking on heavy job volume.
          </span>
        </div>
      </div>

      {/* Contractor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedContractors.map((c) => {
          const isTopTier = c.grade === 'A' || c.grade === 'B+';
          const hasDlpBreach = c.dlp_violations_count > 0;

          return (
            <div 
              key={c.contractor_id}
              className="nb-card p-5 bg-white border-3 border-[#121316] shadow-nb flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Row: Name, ID, Grade */}
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-black">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="nb-badge nb-badge-black text-[10px]">{c.contractor_id}</span>
                      <span className="text-xs font-mono font-bold text-gray-500">
                        Empanelled {c.empanelled_since}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#121316] mt-1">
                      {c.contractor_name}
                    </h3>
                  </div>

                  {/* Big Grade Badge */}
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-lg border-3 border-black shadow-nb-sm flex flex-col items-center justify-center font-mono ${
                      c.grade === 'A' ? 'bg-[#00E599] text-black' :
                      c.grade === 'B+' ? 'bg-[#FFE600] text-black' :
                      c.grade === 'B' ? 'bg-[#00F0FF] text-black' :
                      c.grade === 'C' ? 'bg-[#FF8800] text-white' : 'bg-[#FF4757] text-white'
                    }`}>
                      <span className="text-xl font-black leading-none">{c.grade}</span>
                      <span className="text-[9px] font-bold mt-0.5">{c.composite_score}/100</span>
                    </div>
                  </div>
                </div>

                {/* 4 Performance Metric Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
                  {/* Total Billed */}
                  <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Total Billed</span>
                    <span className="font-mono font-black text-sm text-gray-900">{formatCr(c.total_billed_inr)}</span>
                    <span className="text-[10px] text-gray-500 block">{c.jobs_count} Jobs</span>
                  </div>

                  {/* SLA Speed */}
                  <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">SLA Met</span>
                    <span className={`font-mono font-black text-sm ${c.sla_compliance_pct >= 55 ? 'text-green-700' : 'text-[#FF4757]'}`}>
                      {c.sla_compliance_pct}%
                    </span>
                    <span className="text-[10px] text-gray-500 block">Turnaround</span>
                  </div>

                  {/* Durability / Failure Rate */}
                  <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">30d Failure</span>
                    <span className={`font-mono font-black text-sm ${c.reopen_rate_pct > 25 ? 'text-[#FF4757]' : 'text-green-700'}`}>
                      {c.reopen_rate_pct}%
                    </span>
                    <span className="text-[10px] text-gray-500 block">Relapse</span>
                  </div>

                  {/* Terrain Factor */}
                  <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Terrain Stress</span>
                    <span className="font-mono font-black text-sm text-gray-900">
                      {(c.avg_terrain_difficulty * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-gray-500 block">Flood Index</span>
                  </div>
                </div>

                {/* Active Wards */}
                <div className="mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-gray-500 block mb-1">
                    Operating Wards ({c.active_wards.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.active_wards.map((w) => (
                      <span key={w} className="nb-badge nb-badge-gray text-[10px] px-1.5 py-0">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Plain-Language Citizen Scorecard */}
                <div className="bg-[#FFFDF0] border-2 border-[#121316] p-3 rounded-md text-xs">
                  <div className="flex items-center gap-1.5 font-mono font-extrabold text-[10px] uppercase text-gray-600 mb-1">
                    <Award className="w-3.5 h-3.5 text-[#FF8800]" />
                    <span>Plain-Language Audit Verdict (Citizen & Corporator)</span>
                  </div>
                  <p className="font-medium text-gray-800 leading-relaxed italic">
                    "{c.plain_summary}"
                  </p>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="mt-4 pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasDlpBreach ? (
                    <span className="nb-badge nb-badge-coral text-[10px]">
                      {c.dlp_violations_count} DLP Violations
                    </span>
                  ) : (
                    <span className="nb-badge nb-badge-mint text-[10px]">
                      0 DLP Violations
                    </span>
                  )}
                  {c.overbill_rate_pct > 25 && (
                    <span className="nb-badge nb-badge-orange text-[10px]">
                      High Rate Variance
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onFilterAuditsByContractor && onFilterAuditsByContractor(c.contractor_id)}
                  className="nb-btn nb-btn-white text-xs py-1 px-3 hover:bg-[#FFE600] flex items-center gap-1"
                >
                  <span>View All Jobs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
