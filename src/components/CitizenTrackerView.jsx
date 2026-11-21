import React, { useState, useMemo } from 'react';
import { Search, MessageSquare, ThumbsUp, Camera, ExternalLink, Filter, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CitizenTrackerView({ complaints, onInspectWorkOrderById }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const languages = [
    { id: 'ALL', label: 'All Languages' },
    { id: 'en', label: 'English' },
    { id: 'hi-en', label: 'Hinglish (Hindi-English)' },
    { id: 'mr', label: 'Marathi (मराठी)' },
    { id: 'hi', label: 'Hindi (हिंदी)' }
  ];

  const channels = ['ALL', 'MyBMC App', '1916 Helpline', 'MyBMC Web Portal', 'Ward Office Walk-in'];

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchText = c.description.toLowerCase().includes(term);
        const matchLoc = c.locality_text.toLowerCase().includes(term);
        const matchId = c.complaint_id.toLowerCase().includes(term);
        const matchCat = c.category_reported.toLowerCase().includes(term);
        if (!matchText && !matchLoc && !matchId && !matchCat) return false;
      }

      if (selectedLanguage !== 'ALL' && c.language !== selectedLanguage) return false;
      if (selectedChannel !== 'ALL' && c.channel !== selectedChannel) return false;
      if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;

      return true;
    });
  }, [complaints, searchTerm, selectedLanguage, selectedChannel, selectedStatus]);

  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1;
  const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="nb-card p-5 bg-[#F59E0B] border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">CITIZEN FIRST</span>
              <span className="nb-badge nb-badge-cyan">MULTILINGUAL RESOLUTION ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mt-1">
              Citizen Complaint & Repair Tracker
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              Follow real Mumbai citizen complaints across MyBMC App, 1916 Helpline, Marathi and Hinglish logs directly to the public rupee spent.
            </p>
          </div>

          <div className="bg-white border border-white/10 px-3 py-1.5 rounded shadow-nb-sm text-center">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-300 block">Sample Batch</span>
            <span className="font-mono font-bold text-base text-cyan-400">200 Monsoon Peak Logs</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="nb-card p-4 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by locality, complaint text, ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="nb-input w-full pl-9 text-xs"
            />
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={selectedChannel}
              onChange={(e) => { setSelectedChannel(e.target.value); setCurrentPage(1); }}
              className="nb-input w-full text-xs"
            >
              {channels.map(ch => (
                <option key={ch} value={ch}>
                  {ch === 'ALL' ? 'All Channels' : ch}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="nb-input w-full text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Resolved">Resolved</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed - Duplicate">Closed - Duplicate</option>
            </select>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-mono font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Language:
          </span>
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => { setSelectedLanguage(l.id); setCurrentPage(1); }}
              className={`nb-badge text-[11px] cursor-pointer transition-all ${
                selectedLanguage === l.id 
                  ? 'nb-badge-black text-white' 
                  : 'nb-badge-gray hover:bg-[#F59E0B]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 px-1">
          <span>Showing {filteredComplaints.length} citizen tickets</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {paginatedComplaints.length === 0 ? (
          <div className="nb-card p-8 text-center text-slate-400 font-bold bg-white">
            No complaints found matching current filters.
          </div>
        ) : (
          paginatedComplaints.map((c) => (
            <div 
              key={c.complaint_id}
              className="nb-card p-4 sm:p-5 bg-white border border-white/10 shadow-nb hover:shadow-nb-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left: Citizen Issue */}
                <div className="space-y-2 flex-1">
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="nb-badge nb-badge-black font-mono">{c.complaint_id}</span>
                    <span className="nb-badge nb-badge-yellow">Ward {c.ward_code}</span>
                    <span className="nb-badge nb-badge-gray">{c.channel}</span>
                    <span className="nb-badge nb-badge-cyan">{c.language}</span>
                    <span className="text-slate-400 font-mono font-bold">{c.received_at}</span>
                    {c.upvotes > 0 && (
                      <span className="nb-badge nb-badge-coral flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {c.upvotes} Citizens
                      </span>
                    )}
                  </div>

                  {/* Citizen Text */}
                  <div className="liquid-glass-sub border border-white/10 p-3 rounded-md">
                    <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                      Reported Issue: <span className="text-white">{c.category_reported}</span> • Locality: <span className="text-white">{c.locality_text}</span>
                    </div>
                    <p className="text-sm font-extrabold text-cyan-400 leading-relaxed">
                      "{c.description}"
                    </p>
                  </div>

                  {/* Photo Description (Computer Vision Stand-in) */}
                  {c.photo_description && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-300 bg-gray-50 p-2 rounded border border-gray-300">
                      <Camera className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-mono text-white">Visual Sensor Description:</strong> {c.photo_description}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: The Rupee Trail (Linked Work Order) */}
                <div className="lg:w-80 flex-shrink-0 liquid-glass-sub border border-white/10 p-3.5 rounded-md text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-300 pb-1">
                    <span className="font-extrabold uppercase font-mono text-[10px] text-slate-300">The Rupee Trail</span>
                    <span className={`nb-badge text-[10px] ${
                      c.status === 'Resolved' ? 'nb-badge-mint' : 'nb-badge-yellow'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  {c.has_work_order ? (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-bold">Linked Work Order:</span>
                          <span className="font-mono font-bold text-white">{c.linked_work_order_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-bold">Contractor:</span>
                          <span className="font-bold text-white truncate max-w-[140px]">{c.contractor_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-bold">Repair Cost:</span>
                          <span className="font-mono font-bold text-white">{formatINR(c.cost_inr)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-bold">SLA Turnaround:</span>
                          <span className={`font-bold font-mono ${c.sla_met === 'Y' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {c.sla_met === 'Y' ? '✓ Met Target' : '✗ Breached'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-bold">30d Fix Held Up?:</span>
                          <span className={`font-bold font-mono ${c.reopened_within_30d === 'Y' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {c.reopened_within_30d === 'Y' ? 'FAILED / RELAPSED' : '✓ HELD UP'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onInspectWorkOrderById(c.linked_work_order_id)}
                        className="nb-btn nb-btn w-full text-xs py-1.5 mt-2 hover:bg-[#F59E0B] flex items-center justify-center gap-1 font-bold"
                      >
                        <span>Audit Work Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="py-2 text-center text-slate-400 font-bold">
                      <p className="text-xs text-rose-400">No work order linked.</p>
                      <span className="text-[10px] text-slate-300">Ticket was resolved through administrative routine or pending dispatch.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="nb-card p-3 bg-[#F8F5EE] flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-slate-300">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="nb-btn nb-btn text-xs py-1 px-3 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="nb-btn nb-btn text-xs py-1 px-3 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
