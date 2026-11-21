import React, { useState } from 'react';
import { X, QrCode, AlertTriangle, ShieldCheck, Clock, MapPin, IndianRupee, Hospital, Car, Waves, ExternalLink, ArrowRight, Scale, MessageSquare } from 'lucide-react';
import RTIBriefModal from './RTIBriefModal';
import WhatsAppSimulator from './WhatsAppSimulator';

export default function RoadPassportModal({ road, onClose, onInspectWorkOrder }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, lifecycle, graph, whatsapp, history
  const [showRtiModal, setShowRtiModal] = useState(false);
  const [selectedWOForRti, setSelectedWOForRti] = useState(null);

  if (!road) return null;

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;

  const primaryWO = road.work_orders && road.work_orders.length > 0 ? road.work_orders[0] : null;

  const handleOpenRti = (wo) => {
    setSelectedWOForRti(wo || primaryWO);
    setShowRtiModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div 
          className="w-full max-w-4xl liquid-glass backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl my-6 relative max-h-[92vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Passport Header (Cupertino Style) */}
          <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-950/400 text-white flex flex-col items-center justify-center font-mono font-bold shadow-md">
                <span className="text-[10px] uppercase opacity-80">ROAD</span>
                <span className="text-sm font-bold leading-none">{road.road_id.substring(2)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">{road.road_id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-900/60 text-sky-300 text-[10px] font-semibold border border-sky-700/50">Ward {road.ward_code}</span>
                  {road.under_dlp === 'Y' && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 text-[10px] font-semibold border border-rose-700/50">UNDER WARRANTY (DLP)</span>
                  )}
                  {road.bus_route === 'Y' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold border border-emerald-700/50">BEST BUS ARTERIAL</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  {road.road_name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* 1-Click RTI Brief */}
              {primaryWO && (
                <button
                  onClick={() => handleOpenRti(primaryWO)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-all shadow-sm"
                  title="Generate Statutory RTI Brief"
                >
                  <Scale className="w-3.5 h-3.5 text-sky-400" />
                  <span>1-Click RTI</span>
                </button>
              )}

              {/* Demo QR Badge */}
              <div className="bg-slate-800/90 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-mono font-medium">
                <QrCode className="w-3.5 h-3.5 text-sky-400" />
                <span>/passport/{road.road_id}</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Passport Navigation Tabs (Apple Segmented Bar) */}
          <div className="liquid-glass-sub border-b border-white/10 px-5 py-2 flex gap-1.5 overflow-x-auto">
            {[
              { id: 'overview', label: 'Road Dossier & Wear' },
              { id: 'lifecycle', label: '4-Stage Lifecycle' },
              { id: 'graph', label: 'Visual Money Trace Graph' },
              { id: 'whatsapp', label: '💬 WhatsApp Scanner', badge: 'UNESCO' },
              { id: 'history', label: `Repair History (${road.total_repairs_count})` }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === t.id 
                    ? 'bg-white text-white shadow-sm border border-white/10' 
                    : 'text-slate-300 hover:text-white hover:bg-white/50'
                }`}
              >
                <span>{t.label}</span>
                {t.badge && <span className="nb-badge nb-badge-mint text-[9px] py-0 px-1 ml-1">{t.badge}</span>}
              </button>
            ))}
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Repair Cycle & Rework Header Counter (Stripe Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-white/10 p-3.5 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Monsoon Repair Frequency</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">
                      {road.total_repairs_count} Work Orders
                    </div>
                    <span className="text-xs font-semibold text-rose-400 block mt-1">
                      {road.reopened_count} Reopened in &lt;30 days
                    </span>
                  </div>

                  <div className="bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 block">Direct Rework Spend ("Cost of To & Fro")</span>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                      {formatINR(road.direct_rework_spend_inr)}
                    </div>
                    <span className="text-xs font-medium text-rose-400/80 block mt-1">
                      Total Spent: {formatINR(road.total_spent_inr)}
                    </span>
                  </div>

                  <div className="bg-white border border-white/10 p-3.5 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Observed Durability Proxy</span>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                      {road.durability_proxy_days} Days
                    </div>
                    <span className="text-xs font-medium text-slate-400 block mt-1">
                      Avg. time to next complaint
                    </span>
                  </div>
                </div>

                {/* Wear-and-Tear Strip */}
                <div className="liquid-glass-sub border border-white/10 rounded-2xl p-4 shadow-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-slate-700" />
                    Traffic Load & Environmental Wear-and-Tear Strip
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white border border-white/10 p-2.5 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-medium block">Peak Traffic Volume</span>
                      <span className="font-mono font-bold text-sm text-slate-800">{road.traffic_peak_hour} veh/hr</span>
                    </div>
                    <div className="bg-white border border-white/10 p-2.5 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-medium block">Congestion Index</span>
                      <span className="font-mono font-bold text-sm text-slate-800">{road.congestion_index} / 10</span>
                    </div>
                    <div className="bg-white border border-white/10 p-2.5 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-medium block">Surface & Lanes</span>
                      <span className="font-mono font-semibold text-xs text-slate-800">{road.surface} • {road.lanes} Lanes</span>
                    </div>
                    <div className="bg-white border border-white/10 p-2.5 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-medium block">Past Accidents</span>
                      <span className="font-mono font-bold text-sm text-rose-400">{road.accidents_count} Casualties</span>
                    </div>
                  </div>

                  {/* Facilities Lifeline Warning */}
                  {road.facilities_nearby.length > 0 && (
                    <div className="mt-3 bg-cyan-950/40 border-2 border-cyan-500/40 p-2.5 rounded text-xs flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-blue-700 flex-shrink-0" />
                      <div>
                        <strong className="text-cyan-400">Critical Lifeline Corridor:</strong>{' '}
                        <span className="text-blue-800">{road.facilities_nearby.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Smart Repair Recommendation */}
                <div className="nb-card p-4 liquid-glass-sub border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="nb-badge nb-badge-black text-[10px]">ENGINEERING RECOMMENDATION</span>
                    <span className="font-mono font-bold text-sm text-cyan-400">Est: {formatINR(road.estimated_cost_inr)}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {road.recommended_method}
                  </h4>
                  <p className="text-xs text-gray-800 font-medium mt-1 leading-relaxed">
                    "{road.recommendation_reason}"
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <span>Expected Durability:</span>
                    <span className="bg-[#00E599] text-white px-1.5 py-0.5 rounded border border-black">
                      {road.durability_rating}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 4-STAGE LIFECYCLE */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#0F172A] text-white rounded-md text-xs font-mono">
                  <span className="text-[#F59E0B] font-bold">4-Stage Civic Lifecycle & Evidence Gap Standard:</span>{' '}
                  Pre-award tender records are transparently badged as <em>Unavailable in Supplied Dataset</em> to prevent synthetic fabrication.
                </div>

                {/* 4-Stage Ribbon */}
                <div className="space-y-3">
                  {/* Stage 1: Start */}
                  <div className="border border-white/10 p-3.5 rounded-lg liquid-glass-sub relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">1</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 1: START (Citizen Intake)</h4>
                      </div>
                      <span className="nb-badge nb-badge-mint text-[10px]">{road.lifecycle.start.evidence_label}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      Complaints routed from MyBMC App, 1916 Helpline and Ward Walk-ins. Average intake-to-dispatch lag: <strong>{road.lifecycle.start.intake_lag_days} days</strong>.
                    </p>
                  </div>

                  {/* Stage 2: Tender (Transparent Gap) */}
                  <div className="border-3 border-dashed border-gray-400 p-3.5 rounded-lg bg-gray-50 opacity-90 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-300 text-slate-300 border-2 border-gray-500 flex items-center justify-center font-mono font-bold text-xs">2</span>
                        <h4 className="font-extrabold text-sm uppercase text-slate-300">STAGE 2: TENDER & PROCUREMENT</h4>
                      </div>
                      <span className="nb-badge nb-badge-gray text-[10px] text-slate-300">
                        Unavailable in Supplied Dataset
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic">
                      ⚠️ {road.lifecycle.tender.note} (Pre-award RFPs, bid evaluation minutes, and material itemization splits will link here in production).
                    </p>
                  </div>

                  {/* Stage 3: Build */}
                  <div className="border border-white/10 p-3.5 rounded-lg liquid-glass-sub relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#00F0FF] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">3</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 3: BUILD & EXECUTION</h4>
                      </div>
                      <span className="nb-badge nb-badge-mint text-[10px]">{road.lifecycle.build.evidence_label}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      Contractors: <strong>{road.lifecycle.build.active_contractors.join(', ') || 'N/A'}</strong>. Methods: <strong>{road.lifecycle.build.methods_used.join(', ') || 'N/A'}</strong>. Benchmarked against official BMC rate card.
                    </p>
                  </div>

                  {/* Stage 4: Complete */}
                  <div className="border border-white/10 p-3.5 rounded-lg liquid-glass-sub relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#00E599] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">4</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 4: COMPLETE & SIGNOFF</h4>
                      </div>
                      <span className="nb-badge nb-badge-mint text-[10px]">{road.lifecycle.complete.evidence_label}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      Completed work orders: <strong>{road.lifecycle.complete.total_work_orders}</strong>. SLAs met: <strong>{road.lifecycle.complete.sla_met_count} of {road.lifecycle.complete.total_work_orders}</strong>.
                    </p>
                  </div>

                  {/* Stage 5: Durability (After the End) */}
                  <div className={`border border-white/10 p-3.5 rounded-lg relative ${road.reopened_count > 0 ? 'bg-rose-950/40 border border-rose-500/40 backdrop-blur-md border-[#FF4757]' : 'bg-[#E6FBF2]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#FF4757] text-white border border-white/10 flex items-center justify-center font-mono font-bold text-xs">5</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 5: POST-COMPLETION DURABILITY</h4>
                      </div>
                      <span className="nb-badge nb-badge-coral text-[10px]">{road.lifecycle.durability.evidence_label}</span>
                    </div>
                    <p className="text-xs text-gray-800 mt-2 font-medium">
                      {road.reopened_count > 0 ? (
                        <span className="text-rose-400 font-bold">
                          ⚠️ High Durability Failure: {road.reopened_count} patches broke down in &lt;30 days. Attributed to {road.lifecycle.durability.wear_attribution}.
                        </span>
                      ) : (
                        <span className="text-emerald-300 font-bold">
                          ✓ Repairs maintained durability across monsoon season. Observed durability proxy: {road.durability_proxy_days} days.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VISUAL MONEY TRACE GRAPH */}
            {activeTab === 'graph' && (
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold text-slate-300 mb-2">
                  Bounded Node-Edge Rupee Trace with Environmental Context Nodes:
                </div>

                <div className="liquid-glass-sub border border-white/10 p-4 rounded-lg overflow-x-auto">
                  <div className="flex items-center justify-between gap-3 min-w-[700px] text-xs font-mono font-bold">
                    <div className="nb-card p-3 bg-[#F59E0B] text-center border border-white/10 w-32 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-slate-300 block">Source</span>
                      <span className="font-bold text-sm">Ward {road.ward_code}</span>
                      <span className="text-[10px] text-gray-800 block">Monsoon Budget</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

                    <div className="nb-card p-3 bg-white text-center border border-white/10 w-36 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-slate-400 block">Asset</span>
                      <span className="font-bold text-sm text-white">{road.road_id}</span>
                      <span className="text-[10px] text-slate-300 truncate block">{road.road_name.split(' ')[0]}</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

                    <div className="nb-card p-3 bg-white text-center border border-white/10 w-36 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-slate-400 block">Jobs Executed</span>
                      <span className="font-bold text-sm text-white">{road.total_repairs_count} Orders</span>
                      <span className="text-[10px] text-slate-300 block">{road.surface}</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

                    <div className="nb-card p-3 bg-[#00F0FF] text-center border border-white/10 w-36 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-slate-300 block">Billed Spend</span>
                      <span className="font-bold text-sm text-white">{formatINR(road.total_spent_inr)}</span>
                      <span className="text-[10px] text-gray-800 block">Recorded Cost</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

                    <div className={`nb-card p-3 text-center border border-white/10 w-36 shadow-nb-sm ${road.reopened_count > 0 ? 'bg-[#FF4757] text-white' : 'bg-[#00E599] text-white'}`}>
                      <span className="text-[9px] uppercase block opacity-80">Durability</span>
                      <span className="font-bold text-sm">{road.reopened_count > 0 ? 'Relapsed' : 'Durable'}</span>
                      <span className="text-[10px] block">{road.reopened_count > 0 ? `${formatINR(road.direct_rework_spend_inr)} Wasted` : 'Held Up'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: WHATSAPP SCANNER (UNESCO) */}
            {activeTab === 'whatsapp' && (
              <WhatsAppSimulator
                roadId={road.road_id}
                roadName={road.road_name}
                wardCode={road.ward_code}
                contractorName={primaryWO ? primaryWO.contractor_name : 'Municipal Agency'}
                underDlp={road.under_dlp}
              />
            )}

            {/* TAB 5: REPAIR HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {road.work_orders && road.work_orders.length > 0 ? (
                  road.work_orders.map((wo) => (
                    <div key={wo.work_order_id} className="nb-card p-3.5 bg-white border border-white/10">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="nb-badge nb-badge-black font-mono text-[10px]">{wo.work_order_id}</span>
                          <span className="font-extrabold text-sm">{wo.repair_method}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenRti(wo)}
                            className="nb-btn nb-btn text-[10px] font-mono py-0.5 px-2 flex items-center gap-1 hover:bg-[#F59E0B]"
                          >
                            <Scale className="w-3 h-3 text-rose-400" />
                            <span>RTI Brief</span>
                          </button>
                          <span className="font-mono font-bold text-sm">{formatINR(wo.cost_inr)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 font-mono">
                        <div>Contractor: <strong className="text-white">{wo.contractor_name}</strong></div>
                        <div>Completed: <strong className="text-white">{wo.completed_at?.split(' ')[0]}</strong></div>
                        <div>SLA: <strong className={wo.sla_met === 'Y' ? 'text-emerald-400' : 'text-rose-400'}>{wo.sla_met === 'Y' ? '✓ Met' : '✗ Breached'}</strong></div>
                        <div>Durability: <strong className={wo.reopened_within_30d === 'Y' ? 'text-rose-400' : 'text-emerald-400'}>{wo.reopened_within_30d === 'Y' ? 'Failed <30d' : 'Held Up'}</strong></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 font-bold">
                    No repair records logged for this segment during the monsoon.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="liquid-glass-sub border-t-2 border-black p-3 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-bold">Evidence Standard: Bounded Public Road Dossier v2.1</span>
            <button 
              onClick={onClose}
              className="nb-btn nb-btn text-xs font-bold py-1.5 px-4"
            >
              Close Passport
            </button>
          </div>
        </div>
      </div>

      {/* Embedded 1-Click RTI Brief Modal */}
      {showRtiModal && (
        <RTIBriefModal
          workOrder={selectedWOForRti || primaryWO}
          onClose={() => setShowRtiModal(false)}
        />
      )}
    </>
  );
}
