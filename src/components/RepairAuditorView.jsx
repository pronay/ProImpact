import React, { useState, useMemo } from 'react';
import { ShieldAlert, AlertTriangle, Search, Filter, ArrowUpDown, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight, FileSpreadsheet, Scale, FileText } from 'lucide-react';
import RTIBriefModal from './RTIBriefModal';

export default function RepairAuditorView({ audits, wards, contractors, onInspectWorkOrder, preselectedWard, escalatedOrders = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlagType, setSelectedFlagType] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState(preselectedWard || 'ALL');
  const [selectedContractor, setSelectedContractor] = useState('ALL');
  const [sortBy, setSortBy] = useState('cost_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRtiWO, setSelectedRtiWO] = useState(null);
  const pageSize = 20;

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  // Filter & Sort Logic
  const filteredAudits = useMemo(() => {
    return audits.filter(wo => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchId = wo.work_order_id.toLowerCase().includes(term);
        const matchRoad = wo.road_name.toLowerCase().includes(term);
        const matchContractor = wo.contractor_name.toLowerCase().includes(term);
        const matchMethod = wo.repair_method.toLowerCase().includes(term);
        if (!matchId && !matchRoad && !matchContractor && !matchMethod) return false;
      }

      if (selectedWard !== 'ALL' && wo.ward_code !== selectedWard) return false;
      if (selectedContractor !== 'ALL' && wo.contractor_id !== selectedContractor) return false;

      if (selectedFlagType === 'DLP') return wo.flags.some(f => f.code === 'DLP_VIOLATION');
      if (selectedFlagType === 'OVERCHARGE') return wo.flags.some(f => f.code === 'RATE_OVERCHARGE');
      if (selectedFlagType === 'FAILED') return wo.flags.some(f => f.code === 'FAILED_REPAIR');
      if (selectedFlagType === 'SLA') return wo.flags.some(f => f.code === 'SLA_BREACH');
      if (selectedFlagType === 'UNLINKED') return wo.flags.some(f => f.code === 'UNLINKED_ORDER');
      if (selectedFlagType === 'ANY_FLAG') return wo.flags.length > 0;
      if (selectedFlagType === 'CLEAN') return wo.flags.length === 0;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'cost_desc') return b.cost_inr - a.cost_inr;
      if (sortBy === 'cost_asc') return a.cost_inr - b.cost_inr;
      if (sortBy === 'variance_desc') return b.variance_pct - a.variance_pct;
      if (sortBy === 'flags_count') return b.flags.length - a.flags.length;
      return 0;
    });
  }, [audits, searchTerm, selectedFlagType, selectedWard, selectedContractor, sortBy]);

  const totalPages = Math.ceil(filteredAudits.length / pageSize) || 1;
  const paginatedAudits = filteredAudits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Flag counts
  const flagCounts = useMemo(() => {
    let dlp = 0, overcharge = 0, failed = 0, sla = 0, unlinked = 0;
    audits.forEach(wo => {
      wo.flags.forEach(f => {
        if (f.code === 'DLP_VIOLATION') dlp++;
        if (f.code === 'RATE_OVERCHARGE') overcharge++;
        if (f.code === 'FAILED_REPAIR') failed++;
        if (f.code === 'SLA_BREACH') sla++;
        if (f.code === 'UNLINKED_ORDER') unlinked++;
      });
    });
    return { dlp, overcharge, failed, sla, unlinked };
  }, [audits]);

  return (
    <div className="space-y-6">
      {/* Top Audit Banner */}
      <div className="nb-card p-5 bg-[#F59E0B] border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">FORENSIC ENGINE</span>
              <span className="nb-badge nb-badge-coral">AUTOMATED SLA & RATE AUDIT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mt-1">
              Monsoon Repair Auditor
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              Automated cross-check of 2,499 work orders against official rate cards, road warranty periods (DLP), and 30-day durability logs.
            </p>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-white border border-white/10 px-3 py-1.5 rounded shadow-nb-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-300 block">DLP Road Breaches</span>
              <span className="font-mono font-bold text-base text-rose-400">{flagCounts.dlp} Jobs</span>
            </div>
            <div className="bg-white border border-white/10 px-3 py-1.5 rounded shadow-nb-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-300 block">Rate Card Overcharges</span>
              <span className="font-mono font-bold text-base text-amber-400">{flagCounts.overcharge} Jobs</span>
            </div>
            <div className="bg-white border border-white/10 px-3 py-1.5 rounded shadow-nb-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-300 block">Failed in &lt;30 Days</span>
              <span className="font-mono font-bold text-base text-cyan-400">{flagCounts.failed} Jobs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="nb-card p-4 bg-white space-y-3">
        {/* Search & Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search WO ID, Road, Contractor..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="nb-input w-full pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedWard}
              onChange={(e) => { setSelectedWard(e.target.value); setCurrentPage(1); }}
              className="nb-input w-full text-xs"
            >
              <option value="ALL">All Wards (24 Wards)</option>
              {wards.map(w => (
                <option key={w.ward_code} value={w.ward_code}>
                  Ward {w.ward_code} — {w.ward_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedContractor}
              onChange={(e) => { setSelectedContractor(e.target.value); setCurrentPage(1); }}
              className="nb-input w-full text-xs"
            >
              <option value="ALL">All Contractors (8 Empanelled)</option>
              {contractors.map(c => (
                <option key={c.contractor_id} value={c.contractor_id}>
                  {c.contractor_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="nb-input w-full text-xs"
            >
              <option value="cost_desc">Sort: Highest Cost (₹)</option>
              <option value="cost_asc">Sort: Lowest Cost (₹)</option>
              <option value="variance_desc">Sort: Highest Rate Variance (%)</option>
              <option value="flags_count">Sort: Most Audit Flags</option>
            </select>
          </div>
        </div>

        {/* Flag Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-mono font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Flag:
          </span>
          {[
            { id: 'ALL', label: 'All Jobs', count: audits.length, color: 'nb-badge-gray' },
            { id: 'ANY_FLAG', label: 'Flagged Only', count: audits.filter(a => a.flags.length > 0).length, color: 'nb-badge-coral' },
            { id: 'DLP', label: 'DLP Breach (Warranty)', count: flagCounts.dlp, color: 'nb-badge-coral' },
            { id: 'OVERCHARGE', label: 'Rate Overcharge', count: flagCounts.overcharge, color: 'nb-badge-orange' },
            { id: 'FAILED', label: 'Failed < 30d', count: flagCounts.failed, color: 'nb-badge-yellow' },
            { id: 'SLA', label: 'SLA Breached', count: flagCounts.sla, color: 'nb-badge-gray' },
            { id: 'UNLINKED', label: 'No Complaint Link', count: flagCounts.unlinked, color: 'nb-badge-cyan' },
            { id: 'CLEAN', label: 'Clean Jobs', count: audits.filter(a => a.flags.length === 0).length, color: 'nb-badge-mint' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setSelectedFlagType(item.id); setCurrentPage(1); }}
              className={`nb-badge text-[11px] cursor-pointer whitespace-nowrap transition-all ${
                selectedFlagType === item.id 
                  ? 'nb-badge-black text-white' 
                  : `${item.color} hover:opacity-80`
              }`}
            >
              <span>{item.label}</span>
              <span className="ml-1 opacity-80">({item.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 px-1">
        <span>Showing {filteredAudits.length} matching work orders (Page {currentPage} of {totalPages})</span>
        {selectedWard !== 'ALL' && (
          <button 
            onClick={() => setSelectedWard('ALL')}
            className="text-rose-400 hover:underline"
          >
            Clear Ward filter
          </button>
        )}
      </div>

      {/* Forensic Table with Direct 1-Click RTI Brief Action */}
      <div className="nb-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-white font-mono uppercase font-extrabold text-[11px]">
                <th className="p-3 border-r border-gray-700">Order ID</th>
                <th className="p-3 border-r border-gray-700">Ward & Road</th>
                <th className="p-3 border-r border-gray-700">Method & Area</th>
                <th className="p-3 border-r border-gray-700">Contractor</th>
                <th className="p-3 border-r border-gray-700 text-right">Billed / Rate</th>
                <th className="p-3 border-r border-gray-700">Audit Flags & Status</th>
                <th className="p-3 text-center">Legal & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {paginatedAudits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-bold">
                    No work orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAudits.map((wo) => {
                  const hasCritical = wo.flags.some(f => f.severity === 'CRITICAL');
                  const isClean = wo.flags.length === 0;
                  const escalationInfo = escalatedOrders[wo.work_order_id];

                  return (
                    <tr 
                      key={wo.work_order_id}
                      className={`hover:liquid-glass-sub transition-colors cursor-pointer ${
                        hasCritical ? 'bg-rose-950/30 border border-rose-500/30' : ''
                      }`}
                      onClick={() => onInspectWorkOrder(wo)}
                    >
                      {/* ID */}
                      <td className="p-3 border-r border-gray-200 font-mono font-bold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-cyan-400">{wo.work_order_id}</span>
                          {wo.under_dlp === 'Y' && (
                            <span className="nb-badge nb-badge-coral text-[9px] px-1 py-0">DLP</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block">{wo.completed_at?.split(' ')[0]}</span>
                      </td>

                      {/* Ward & Road */}
                      <td className="p-3 border-r border-gray-200">
                        <div className="font-extrabold text-white flex items-center gap-1">
                          <span className="nb-badge nb-badge-yellow text-[9px] px-1 py-0">{wo.ward_code}</span>
                          <span className="truncate max-w-[150px]">{wo.road_name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{wo.road_id} ({wo.road_surface})</span>
                      </td>

                      {/* Method & Area */}
                      <td className="p-3 border-r border-gray-200">
                        <div className="font-bold text-gray-800">{wo.repair_method}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{wo.area_sqm} sq.m</span>
                      </td>

                      {/* Contractor */}
                      <td className="p-3 border-r border-gray-200">
                        <div className="font-bold truncate max-w-[140px] text-gray-800">{wo.contractor_name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{wo.contractor_id}</span>
                      </td>

                      {/* Billed / Expected Rate */}
                      <td className="p-3 border-r border-gray-200 text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-white">{formatINR(wo.cost_inr)}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          std: {formatINR(wo.expected_cost)}
                          {wo.variance_pct > 20 && (
                            <span className="text-rose-400 font-bold ml-1">+{wo.variance_pct}%</span>
                          )}
                        </div>
                      </td>

                      {/* Flags & Escalation Confirmation Status */}
                      <td className="p-3 border-r border-gray-200">
                        {escalationInfo ? (
                          <div className="mb-1">
                            <span className="nb-badge nb-badge-orange text-[9px] px-1.5 py-0.5 font-bold flex items-center gap-1">
                              <Scale className="w-3 h-3 text-white" />
                              <span>{escalationInfo.tier}: {escalationInfo.action}</span>
                            </span>
                          </div>
                        ) : null}

                        {isClean ? (
                          <span className="nb-badge nb-badge-mint text-[10px]">CLEAN</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-[260px]">
                            {wo.flags.map((flag, idx) => (
                              <span 
                                key={idx} 
                                className={`nb-badge text-[9px] px-1.5 py-0 ${
                                  flag.severity === 'CRITICAL' ? 'nb-badge-coral' :
                                  flag.severity === 'HIGH' ? 'nb-badge-orange' :
                                  flag.severity === 'MEDIUM' ? 'nb-badge-yellow' : 'nb-badge-gray'
                                }`}
                                title={flag.summary}
                              >
                                {flag.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Direct RTI Action + Inspect */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Direct RTI Brief Button for Priya Mehta */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRtiWO(wo); }}
                            className="nb-btn nb-btn-primary text-[10px] font-mono py-1 px-2 flex items-center gap-1 hover:bg-black hover:text-white"
                            title="Generate 1-Click RTI Brief"
                          >
                            <Scale className="w-3 h-3" />
                            <span>RTI Brief</span>
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); onInspectWorkOrder(wo); }}
                            className="nb-btn nb-btn text-[10px] font-mono py-1 px-2 hover:bg-[#F59E0B]"
                          >
                            Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 bg-[#F8F5EE] border-t-2 border-[#0F172A] flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-slate-300">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="nb-btn nb-btn text-xs py-1 px-3 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="nb-btn nb-btn text-xs py-1 px-3 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Direct RTI Brief Modal */}
      {selectedRtiWO && (
        <RTIBriefModal
          workOrder={selectedRtiWO}
          onClose={() => setSelectedRtiWO(null)}
        />
      )}
    </div>
  );
}
