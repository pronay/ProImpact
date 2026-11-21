import React, { useState } from 'react';
import { Search, MapPin, AlertCircle, ThumbsUp, QrCode, ArrowRight, ShieldCheck, Heart, Camera, CheckCircle2, MessageSquare, PhoneCall, Repeat } from 'lucide-react';
import WhatsAppSimulator from './WhatsAppSimulator';

export default function CitizenPortalView({ complaints, roads, wards, onOpenRoadPassport, onReportRelapse, liveRelapses = [] }) {
  const [localitySearch, setLocalitySearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [activeSubTab, setActiveSubTab] = useState('track'); // 'track', 'passport', 'transparency', 'whatsapp'
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedSuccess, setReportedSuccess] = useState(false);
  const [verifiedComplaints, setVerifiedComplaints] = useState({});

  // Contextual relapse report state
  const [reportForm, setReportForm] = useState({
    locality: '',
    issueType: 'Pothole (Repaired previously but broke again)',
    description: '',
    referencedId: ''
  });

  // Road Passport sub-tab filters
  const [roadSearch, setRoadSearch] = useState('');
  const [roadWardFilter, setRoadWardFilter] = useState('ALL');

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (localitySearch) {
      const term = localitySearch.toLowerCase();
      const matchLoc = c.locality_text?.toLowerCase().includes(term);
      const matchDesc = c.description?.toLowerCase().includes(term);
      const matchId = c.complaint_id?.toLowerCase().includes(term);
      if (!matchLoc && !matchDesc && !matchId) return false;
    }
    if (selectedWard !== 'ALL' && c.ward_code !== selectedWard) return false;
    if (selectedLanguage !== 'ALL' && c.language !== selectedLanguage) return false;
    return true;
  });

  // Filter roads for passport subtab
  const filteredRoads = roads.filter(r => {
    if (roadSearch) {
      const term = roadSearch.toLowerCase();
      const matchName = r.road_name.toLowerCase().includes(term);
      const matchId = r.road_id.toLowerCase().includes(term);
      if (!matchName && !matchId) return false;
    }
    if (roadWardFilter !== 'ALL' && r.ward_code !== roadWardFilter) return false;
    return true;
  });

  const handleVerify = (id) => {
    setVerifiedComplaints(prev => ({ ...prev, [id]: true }));
  };

  const handleReportRelapseOnSpot = (c) => {
    setReportForm({
      locality: `${c.locality_text} (Ward ${c.ward_code})`,
      issueType: 'Pothole (Repaired previously but broke again)',
      description: `Follow-up report on ticket ${c.complaint_id}: Patch completed under work order ${c.linked_work_order_id || 'previous repair'} has reopened again. Hazard for two-wheelers.`,
      referencedId: c.complaint_id
    });
    setReportedSuccess(false);
    setReportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Citizen Welcome Banner (VisionOS Obsidian Glass) */}
      <div className="liquid-glass p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-cyan text-xs">CITIZEN FIRST</span>
              <span className="nb-badge nb-badge-mint text-xs">PUBLIC AUDIT STANDARD</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display mt-1">
              Mumbai Public Road & Pothole Transparency
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Check what happened to your complaint, scan your street's Road Passport, and verify if repairs actually held up.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setReportForm({
                  locality: '',
                  issueType: 'Pothole (Repaired previously but broke again)',
                  description: '',
                  referencedId: ''
                });
                setReportedSuccess(false);
                setReportModalOpen(true);
              }}
              className="nb-btn nb-btn-danger text-xs px-3.5 py-2 font-semibold shadow-md flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Pothole / Repeat Failure</span>
            </button>
          </div>
        </div>

        {/* Citizen Navigation Sub-Tabs (VisionOS Floating Glass Pill Dock) */}
        <div className="pt-2 border-t border-white/10 flex gap-1.5 overflow-x-auto bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          {[
            { id: 'track', label: '🔍 Track Locality & Grievances' },
            { id: 'whatsapp', label: '💬 WhatsApp Signboard Scanner', badge: 'UNESCO Olavula' },
            { id: 'passport', label: '🪪 Search Road Passports' },
            { id: 'transparency', label: '💰 Ward Tax Expenditure' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                activeSubTab === t.id 
                  ? 'bg-white/15 text-white shadow-lg border border-white/20 ring-1 ring-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t.label}</span>
              {t.badge && <span className="nb-badge nb-badge-mint text-[9px] py-0 px-1 ml-1">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: TRACK COMPLAINTS & CONTEXTUAL RELAPSE ACTION */}
      {activeSubTab === 'track' && (
        <div className="space-y-4">
          {/* Quick Locality Search Bar (VisionOS Liquid Glass) */}
          <div className="liquid-glass p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your street or locality (e.g., Dadar, Sion, Andheri, Link Road)..."
                  value={localitySearch}
                  onChange={(e) => setLocalitySearch(e.target.value)}
                  className="nb-input w-full pl-9 text-xs"
                />
              </div>

              <div>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="nb-input w-full text-xs"
                >
                  <option value="ALL">All Mumbai Wards</option>
                  {wards.map(w => (
                    <option key={w.ward_code} value={w.ward_code} className="bg-slate-900 text-white">
                      Ward {w.ward_code} ({w.ward_name.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language filter for citizens */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-slate-400">
              <span>Language:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'mr', label: 'मराठी (Marathi)' },
                { id: 'hi-en', label: 'Hinglish' },
                { id: 'hi', label: 'हिंदी (Hindi)' },
                { id: 'en', label: 'English' }
              ].map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLanguage(l.id)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                    selectedLanguage === l.id 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Cards List */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-slate-400 px-1 flex justify-between">
              <span>Showing {filteredComplaints.length} Public Grievances</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                World Bank GEMS 3-Citizen Consensus Active
              </span>
            </div>

            {/* Newly Submitted Citizen Relapses */}
            {liveRelapses.length > 0 && (
              <div className="space-y-2 mb-3">
                {liveRelapses.map(lr => (
                  <div key={lr.complaint_id} className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="nb-badge nb-badge-coral text-[10px]">🚨 RECENTLY DISPATCHED BY YOU</span>
                      <span className="nb-badge nb-badge-black font-mono text-[10px]">{lr.complaint_id}</span>
                      <span className="nb-badge nb-badge-yellow text-[10px]">Ward {lr.ward_code}</span>
                      <span className="text-xs text-slate-400 font-medium">Forwarded to Ward Junior Engineer</span>
                    </div>
                    <div className="liquid-glass-sub p-2.5 rounded-lg border border-rose-500/20">
                      <p className="font-bold text-white text-sm">"{lr.description}"</p>
                      <p className="text-[11px] text-slate-300 mt-1 font-medium">📍 {lr.locality_text} • {lr.category_reported}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredComplaints.slice(0, 15).map(c => {
              const isVerified = verifiedComplaints[c.complaint_id];

              return (
                <div key={c.complaint_id} className="liquid-glass-interactive p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="nb-badge nb-badge-gray font-mono text-[10px]">{c.complaint_id}</span>
                        <span className="nb-badge nb-badge-yellow font-medium">Ward {c.ward_code}</span>
                        <span className="nb-badge nb-badge-cyan font-mono">{c.channel}</span>
                        <span className="text-xs font-mono text-slate-400">{c.received_at}</span>
                        
                        {/* 3-Citizen Consensus Status */}
                        {isVerified ? (
                          <span className="nb-badge nb-badge-mint text-[9px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Community Certified (3/3 Verified)
                          </span>
                        ) : (
                          <span className="nb-badge nb-badge-gray text-[9px] flex items-center gap-1">
                            Pending Community Check (2/3 Verified)
                          </span>
                        )}
                      </div>

                      <div className="liquid-glass-sub p-3 rounded-xl text-xs font-medium space-y-1">
                        <div className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                          {c.category_reported} • {c.locality_text}
                        </div>
                        <p className="font-bold text-white text-sm">"{c.description}"</p>
                      </div>

                      {c.photo_description && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                          <Camera className="w-3.5 h-3.5 text-cyan-400" />
                          <span><strong className="text-slate-300">Attached Evidence:</strong> {c.photo_description}</span>
                        </div>
                      )}

                      {/* Citizen Action Bar */}
                      <div className="pt-2 flex items-center gap-2 flex-wrap">
                        {/* 1-Tap Community Verification */}
                        {!isVerified && c.status === 'Resolved' && (
                          <button
                            onClick={() => handleVerify(c.complaint_id)}
                            className="nb-btn text-[11px] py-1 px-2.5 font-medium hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                          >
                            ✓ Confirm Repair on Site (Cast 3rd Community Vote)
                          </button>
                        )}

                        {/* REFINEMENT 1: Contextual Report Relapse on This Spot for Ramesh */}
                        <button
                          onClick={() => handleReportRelapseOnSpot(c)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Repeat className="w-3.5 h-3.5 text-rose-400" />
                          <span>Pothole Is Back! (Report Relapse)</span>
                        </button>
                      </div>
                    </div>

                    {/* Public Money Trail Summary (Stripe / Bloomberg Financial Precision) */}
                    <div className="md:w-72 liquid-glass-sub p-3.5 rounded-xl text-xs space-y-2 border border-white/10 shadow-md">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                        <span className="font-mono uppercase font-semibold text-[10px] text-slate-400 tracking-wider">Public Rupee Trail</span>
                        <span className={`nb-badge text-[9px] ${c.status === 'Resolved' ? 'nb-badge-mint' : 'nb-badge-yellow'}`}>
                          {c.status}
                        </span>
                      </div>

                      {c.has_work_order ? (
                        <div className="space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-sans">Fixing Agency:</span>
                            <span className="font-semibold text-white truncate max-w-[140px]">{c.contractor_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-sans">Tax Cost Paid:</span>
                            <span className="font-bold text-cyan-400">{formatINR(c.cost_inr)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-sans">Did Fix Last?:</span>
                            <span className={`font-bold ${c.reopened_within_30d === 'Y' ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {c.reopened_within_30d === 'Y' ? '❌ FAILED <30 DAYS' : '✓ HELD UP'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Ticket in queue for municipal dispatch.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WHATSAPP SIMULATOR (UNESCO OLAVULA) */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-4">
          <WhatsAppSimulator />
        </div>
      )}

      {/* SUB-TAB 3: SEARCH ROAD PASSPORTS (WITH WARD FILTER FOR RAMESH) */}
      {activeSubTab === 'passport' && (
        <div className="space-y-4">
          <div className="liquid-glass p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-mono font-bold text-sm uppercase text-white tracking-wider">
                  Search Any Road to Inspect its Public Asset Passport
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Every road segment in Mumbai has a digital passport documenting its repair frequency, repair history, and warranty.
                </p>
              </div>

              {/* Road Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by road name or ID..."
                  value={roadSearch}
                  onChange={(e) => setRoadSearch(e.target.value)}
                  className="nb-input text-xs py-1"
                />
                <select
                  value={roadWardFilter}
                  onChange={(e) => setRoadWardFilter(e.target.value)}
                  className="nb-input text-xs py-1"
                >
                  <option value="ALL">All Wards</option>
                  {wards.map(w => (
                    <option key={w.ward_code} value={w.ward_code} className="bg-slate-900 text-white">Ward {w.ward_code}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRoads.slice(0, 18).map(road => (
                <div key={road.road_id} className="liquid-glass-interactive p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="nb-badge nb-badge-black font-mono text-[9px]">{road.road_id}</span>
                      <span className="nb-badge nb-badge-yellow font-mono text-[9px]">Ward {road.ward_code}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate">{road.road_name}</h4>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{road.surface} • {road.lanes} Lanes</span>
                    <div className="mt-2 text-xs font-mono text-slate-300">
                      Total Repairs: <strong className="text-white">{road.total_repairs_count}</strong> • Reopened: <strong className="text-rose-400">{road.reopened_count}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenRoadPassport(road)}
                    className="nb-btn text-xs font-mono font-medium py-1 mt-3 w-full flex items-center justify-center gap-1.5 hover:text-cyan-400 hover:border-cyan-400/40"
                  >
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Road Passport</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: WHERE DID MY TAX GO? */}
      {activeSubTab === 'transparency' && (
        <div className="space-y-4">
          <div className="liquid-glass p-5 space-y-4">
            <div>
              <h3 className="font-mono font-bold text-lg uppercase text-white tracking-wider">
                Where Did My Ward Tax Money Go This Monsoon?
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Transparent municipal breakdown of tax rupees spent on durable fixes vs. rupees sunk into failed patches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wards.slice(0, 12).map(w => {
                const wastedPct = ((w.wasted_spend_inr / w.total_spend_inr) * 100).toFixed(0);
                return (
                  <div key={w.ward_code} className="liquid-glass-sub p-4 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="nb-badge nb-badge-cyan font-mono text-xs">Ward {w.ward_code}</span>
                      <span className="text-xs font-mono text-slate-400">{w.zone}</span>
                    </div>
                    <h4 className="font-bold text-base text-white truncate">{w.ward_name}</h4>
                    
                    <div className="space-y-1 text-xs font-mono pt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Total Spent:</span>
                        <strong className="text-white">{formatLakh(w.total_spend_inr)}</strong>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span className="font-sans">Sunk in Failed Fixes:</span>
                        <strong>{formatLakh(w.wasted_spend_inr)} ({wastedPct}%)</strong>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800/80 h-2 border border-white/10 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
                        style={{ width: `${Math.min(100, wastedPct)}%` }} 
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block text-right">
                      {wastedPct}% money down the drain
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Report Pothole / Relapse Modal (VisionOS Dark Glass) */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="liquid-glass-dark w-full max-w-lg p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <div>
                <h3 className="font-mono font-bold text-base uppercase text-white tracking-wide">Report Pothole / Relapse</h3>
                {reportForm.referencedId && (
                  <span className="nb-badge nb-badge-coral text-[9px] mt-1">Follow-up on Ticket {reportForm.referencedId}</span>
                )}
              </div>
              <button onClick={() => { setReportModalOpen(false); setReportedSuccess(false); }} className="font-mono text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            {reportedSuccess ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-center space-y-2 backdrop-blur-md">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-300">Grievance Registered Successfully!</h4>
                <p className="text-xs text-emerald-200/90 font-mono">
                  Tracking ID: <strong>BMC25-RELAPSE-{Math.floor(Math.random()*10000)}</strong>. Forwarded directly to Ward Executive Engineer for priority dispatch.
                </p>
                <button onClick={() => { setReportModalOpen(false); setReportedSuccess(false); }} className="nb-btn text-xs mt-2 px-4">
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Locality / Street</label>
                  <input 
                    type="text" 
                    value={reportForm.locality}
                    onChange={(e) => setReportForm({ ...reportForm, locality: e.target.value })}
                    placeholder="e.g. Near Sion Hospital, King's Circle" 
                    className="nb-input w-full text-xs" 
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Problem Category</label>
                  <select 
                    value={reportForm.issueType}
                    onChange={(e) => setReportForm({ ...reportForm, issueType: e.target.value })}
                    className="nb-input w-full text-xs"
                  >
                    <option className="bg-slate-900 text-white">Pothole (Repaired previously but broke again)</option>
                    <option className="bg-slate-900 text-white">Open Manhole / Broken Grating</option>
                    <option className="bg-slate-900 text-white">Severe Waterlogging on Road</option>
                    <option className="bg-slate-900 text-white">Paver Block Collapse</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Citizen Observation Details</label>
                  <textarea 
                    rows="3" 
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    placeholder="Describe how long it has been broken, skidding hazard, or water depth..." 
                    className="nb-input w-full text-xs" 
                  />
                </div>
                <button
                  onClick={() => {
                    const trackingId = `BMC25-RELAPSE-${Math.floor(Math.random()*9000 + 1000)}`;
                    if (onReportRelapse) {
                      onReportRelapse({
                        complaint_id: trackingId,
                        locality_text: reportForm.locality || 'S.V. Road (Andheri West)',
                        ward_code: reportForm.locality?.includes('K/W') ? 'K/W' : (reportForm.locality?.includes('F/N') ? 'F/N' : 'K/W'),
                        channel: 'Citizen Portal (Relapse)',
                        received_at: new Date().toISOString().split('T')[0],
                        description: reportForm.description || 'Pothole patch broke open again after recent rains.',
                        category_reported: reportForm.issueType,
                        status: 'Urgent Dispatch',
                        is_relapse: true,
                        referenced_ticket: reportForm.referencedId
                      });
                    }
                    setReportedSuccess(true);
                  }}
                  className="nb-btn nb-btn-danger w-full py-2 font-mono font-bold text-xs shadow-lg"
                >
                  Confirm & Dispatch to Ward Engineer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
