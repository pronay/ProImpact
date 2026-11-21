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
      {/* Citizen Welcome Banner (Cupertino Liquid Glass Style) */}
      <div className="bg-gradient-to-br from-white/95 via-sky-50/40 to-white/95 backdrop-blur-xl border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-cyan text-xs">CITIZEN FIRST</span>
              <span className="nb-badge nb-badge-mint text-xs">PUBLIC AUDIT STANDARD</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display mt-1">
              Mumbai Public Road & Pothole Transparency
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
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
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Pothole / Repeat Failure</span>
            </button>
          </div>
        </div>

        {/* Citizen Navigation Sub-Tabs (Apple Segmented Bar) */}
        <div className="pt-2 border-t border-slate-200/70 flex gap-1.5 overflow-x-auto bg-slate-100/60 p-1 rounded-xl">
          {[
            { id: 'track', label: '🔍 Track Locality & Grievances' },
            { id: 'whatsapp', label: '💬 WhatsApp Signboard Scanner', badge: 'UNESCO Olavula' },
            { id: 'passport', label: '🪪 Search Road Passports' },
            { id: 'transparency', label: '💰 Ward Tax Expenditure' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSubTab === t.id 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
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
          {/* Quick Locality Search Bar */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 shadow-sm">
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
                    <option key={w.ward_code} value={w.ward_code}>
                      Ward {w.ward_code} ({w.ward_name.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language filter for citizens */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-slate-600">
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
                    selectedLanguage === l.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Cards List */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-slate-500 px-1 flex justify-between">
              <span>Showing {filteredComplaints.length} Public Grievances</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                World Bank GEMS 3-Citizen Consensus Active
              </span>
            </div>

            {/* Newly Submitted Citizen Relapses */}
            {liveRelapses.length > 0 && (
              <div className="space-y-2 mb-3">
                {liveRelapses.map(lr => (
                  <div key={lr.complaint_id} className="bg-rose-50/70 border border-rose-200/90 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="nb-badge nb-badge-coral text-[10px]">🚨 RECENTLY DISPATCHED BY YOU</span>
                      <span className="nb-badge nb-badge-black font-mono text-[10px]">{lr.complaint_id}</span>
                      <span className="nb-badge nb-badge-yellow text-[10px]">Ward {lr.ward_code}</span>
                      <span className="text-xs text-slate-500 font-medium">Forwarded to Ward Junior Engineer</span>
                    </div>
                    <div className="bg-white border border-rose-200/80 p-2.5 rounded-lg shadow-sm">
                      <p className="font-bold text-slate-900 text-sm">"{lr.description}"</p>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">📍 {lr.locality_text} • {lr.category_reported}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredComplaints.slice(0, 15).map(c => {
              const isVerified = verifiedComplaints[c.complaint_id];

              return (
                <div key={c.complaint_id} className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="nb-badge nb-badge-gray font-mono text-[10px]">{c.complaint_id}</span>
                        <span className="nb-badge nb-badge-yellow font-medium">Ward {c.ward_code}</span>
                        <span className="nb-badge nb-badge-cyan font-mono">{c.channel}</span>
                        <span className="text-xs font-mono text-slate-400">{c.received_at}</span>
                        
                        {/* 3-Citizen Consensus Status */}
                        {isVerified ? (
                          <span className="nb-badge nb-badge-mint text-[9px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Community Certified (3/3 Verified)
                          </span>
                        ) : (
                          <span className="nb-badge nb-badge-gray text-[9px] flex items-center gap-1">
                            Pending Community Check (2/3 Verified)
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50/80 border border-slate-200/70 p-2.5 rounded-lg text-xs font-medium">
                        <div className="font-semibold text-slate-500 uppercase text-[10px] mb-0.5">
                          {c.category_reported} • {c.locality_text}
                        </div>
                        <p className="font-bold text-slate-900 text-sm">"{c.description}"</p>
                      </div>

                      {c.photo_description && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-slate-600" />
                          <span><strong>Attached Evidence:</strong> {c.photo_description}</span>
                        </div>
                      )}

                      {/* Citizen Action Bar */}
                      <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                        {/* 1-Tap Community Verification */}
                        {!isVerified && c.status === 'Resolved' && (
                          <button
                            onClick={() => handleVerify(c.complaint_id)}
                            className="nb-btn text-[11px] py-1 px-2.5 font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                          >
                            ✓ Confirm Repair on Site (Cast 3rd Community Vote)
                          </button>
                        )}

                        {/* REFINEMENT 1: Contextual Report Relapse on This Spot for Ramesh */}
                        <button
                          onClick={() => handleReportRelapseOnSpot(c)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1 transition-all"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Pothole Is Back! (Report Relapse)</span>
                        </button>
                      </div>
                    </div>

                    {/* Public Money Trail Summary (Stripe style) */}
                    <div className="md:w-72 bg-slate-50/90 border border-slate-200/80 p-3 rounded-xl text-xs space-y-1.5 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                        <span className="font-mono uppercase font-semibold text-[10px] text-slate-500">Public Rupee Trail</span>
                        <span className={`nb-badge text-[9px] ${c.status === 'Resolved' ? 'nb-badge-mint' : 'nb-badge-yellow'}`}>
                          {c.status}
                        </span>
                      </div>

                      {c.has_work_order ? (
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Fixing Agency:</span>
                            <span className="font-extrabold text-black truncate max-w-[140px]">{c.contractor_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Tax Cost Paid:</span>
                            <span className="font-mono font-bold text-black">{formatINR(c.cost_inr)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Did Fix Last?:</span>
                            <span className={`font-mono font-bold ${c.reopened_within_30d === 'Y' ? 'text-[#FF4757]' : 'text-green-700'}`}>
                              {c.reopened_within_30d === 'Y' ? '❌ FAILED <30 DAYS' : '✓ HELD UP'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600 italic">
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
          <div className="nb-card p-4 bg-white border border-slate-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="font-mono font-bold text-sm uppercase">
                  Search Any Road to Inspect its Public Asset Passport
                </h3>
                <p className="text-xs text-gray-600 font-bold">
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
                    <option key={w.ward_code} value={w.ward_code}>Ward {w.ward_code}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRoads.slice(0, 18).map(road => (
                <div key={road.road_id} className="nb-card p-3 bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="nb-badge nb-badge-black font-mono text-[9px]">{road.road_id}</span>
                      <span className="nb-badge nb-badge-yellow text-black font-mono text-[9px]">Ward {road.ward_code}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-black truncate">{road.road_name}</h4>
                    <span className="text-[11px] text-gray-600 block mt-0.5">{road.surface} • {road.lanes} Lanes</span>
                    <div className="mt-2 text-xs font-mono text-gray-700">
                      Total Repairs: <strong>{road.total_repairs_count}</strong> • Reopened: <strong className="text-[#FF4757]">{road.reopened_count}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenRoadPassport(road)}
                    className="nb-btn nb-btn-white text-xs font-mono font-bold py-1 mt-3 w-full flex items-center justify-center gap-1 hover:bg-[#F59E0B]"
                  >
                    <QrCode className="w-3.5 h-3.5" />
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
          <div className="nb-card p-5 bg-white border border-slate-200/90 space-y-4">
            <div>
              <h3 className="font-mono font-bold text-lg uppercase text-black">
                Where Did My Ward Tax Money Go This Monsoon?
              </h3>
              <p className="text-xs font-bold text-gray-600">
                Transparent municipal breakdown of tax rupees spent on durable fixes vs. rupees sunk into failed patches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wards.slice(0, 12).map(w => {
                const wastedPct = ((w.wasted_spend_inr / w.total_spend_inr) * 100).toFixed(0);
                return (
                  <div key={w.ward_code} className="nb-card p-4 bg-[#F8FAFC] border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="nb-badge nb-badge-black font-mono text-xs">Ward {w.ward_code}</span>
                      <span className="text-xs font-bold text-gray-600 font-mono">{w.zone}</span>
                    </div>
                    <h4 className="font-bold text-base text-black truncate">{w.ward_name}</h4>
                    
                    <div className="space-y-1 text-xs font-mono pt-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Spent:</span>
                        <strong className="text-black">{formatLakh(w.total_spend_inr)}</strong>
                      </div>
                      <div className="flex justify-between text-[#FF4757]">
                        <span>Sunk in Failed Fixes:</span>
                        <strong>{formatLakh(w.wasted_spend_inr)} ({wastedPct}%)</strong>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 h-2 border border-black rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#FF4757]" style={{ width: `${Math.min(100, wastedPct)}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono block text-right">
                      {wastedPct}% money down the drain
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Report Pothole / Relapse Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="nb-card w-full max-w-lg bg-white p-5 border border-slate-200/90 shadow-nb-xl space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <div>
                <h3 className="font-mono font-bold text-base uppercase">Report Pothole / Relapse</h3>
                {reportForm.referencedId && (
                  <span className="nb-badge nb-badge-coral text-[9px]">Follow-up on Ticket {reportForm.referencedId}</span>
                )}
              </div>
              <button onClick={() => { setReportModalOpen(false); setReportedSuccess(false); }} className="font-mono font-bold">✕</button>
            </div>

            {reportedSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="font-bold text-sm text-green-900">Grievance Registered Successfully!</h4>
                <p className="text-xs text-green-800">
                  Tracking ID: <strong>BMC25-RELAPSE-{Math.floor(Math.random()*10000)}</strong>. Forwarded directly to Ward Executive Engineer for priority dispatch.
                </p>
                <button onClick={() => { setReportModalOpen(false); setReportedSuccess(false); }} className="nb-btn nb-btn-white text-xs mt-2">
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Locality / Street</label>
                  <input 
                    type="text" 
                    value={reportForm.locality}
                    onChange={(e) => setReportForm({ ...reportForm, locality: e.target.value })}
                    placeholder="e.g. Near Sion Hospital, King's Circle" 
                    className="nb-input w-full text-xs" 
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Problem Category</label>
                  <select 
                    value={reportForm.issueType}
                    onChange={(e) => setReportForm({ ...reportForm, issueType: e.target.value })}
                    className="nb-input w-full text-xs font-bold"
                  >
                    <option>Pothole (Repaired previously but broke again)</option>
                    <option>Open Manhole / Broken Grating</option>
                    <option>Severe Waterlogging on Road</option>
                    <option>Paver Block Collapse</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Citizen Observation Details</label>
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
                  className="nb-btn nb-btn-danger w-full py-2 font-mono font-bold text-xs"
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
