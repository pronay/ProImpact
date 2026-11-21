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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div 
          className="nb-card w-full max-w-4xl bg-white shadow-nb-xl my-6 relative max-h-[92vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Passport Header */}
          <div className="bg-[#121316] text-white border-b-4 border-black p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFE600] text-black border-2 border-white flex flex-col items-center justify-center font-mono font-black">
                <span className="text-xs uppercase">ROAD</span>
                <span className="text-sm leading-none">{road.road_id.substring(2)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="nb-badge nb-badge-yellow text-black font-mono">{road.road_id}</span>
                  <span className="nb-badge nb-badge-cyan text-black">Ward {road.ward_code}</span>
                  {road.under_dlp === 'Y' && (
                    <span className="nb-badge nb-badge-coral text-white">UNDER WARRANTY (DLP)</span>
                  )}
                  {road.bus_route === 'Y' && (
                    <span className="nb-badge nb-badge-mint text-black">BEST BUS ARTERIAL</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  {road.road_name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* 1-Click RTI Brief */}
              {primaryWO && (
                <button
                  onClick={() => handleOpenRti(primaryWO)}
                  className="nb-btn nb-btn-white text-xs font-mono font-bold py-1 px-2.5 flex items-center gap-1 hover:bg-[#FFE600]"
                  title="Generate Statutory RTI Brief"
                >
                  <Scale className="w-3.5 h-3.5 text-[#FF4757]" />
                  <span>1-Click RTI</span>
                </button>
              )}

              {/* Demo QR Badge */}
              <div className="bg-white text-black border-2 border-black px-2 py-1 rounded flex items-center gap-1 text-xs font-mono font-bold shadow-nb-sm">
                <QrCode className="w-3.5 h-3.5 text-black" />
                <span>/passport/{road.road_id}</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 nb-btn nb-btn-white p-0 flex items-center justify-center hover:bg-[#FF4757] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Passport Navigation Tabs */}
          <div className="bg-[#FFE600] border-b-2 border-black px-4 py-1.5 flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Road Dossier & Wear' },
              { id: 'lifecycle', label: '4-Stage Lifecycle' },
              { id: 'graph', label: 'Visual Money Trace Graph' },
              { id: 'whatsapp', label: '💬 Low-Tech WhatsApp Scanner', badge: 'UNESCO' },
              { id: 'history', label: `Repair History (${road.total_repairs_count})` }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`nb-btn text-xs font-mono font-bold py-1 px-3 flex items-center gap-1 ${
                  activeTab === t.id 
                    ? 'bg-[#121316] text-white shadow-none translate-y-0.5' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                <span>{t.label}</span>
                {t.badge && <span className="nb-badge nb-badge-mint text-[9px] py-0 px-1 ml-1">{t.badge}</span>}
              </button>
            ))}
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Repair Cycle & Rework Header Counter */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#FAF8F5] border-3 border-black p-3 rounded-lg shadow-nb-sm">
                    <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block">Monsoon Repair Frequency</span>
                    <div className="text-xl font-black font-mono text-gray-900 mt-0.5">
                      {road.total_repairs_count} Work Orders
                    </div>
                    <span className="text-xs font-bold text-[#FF4757] block mt-1">
                      {road.reopened_count} Reopened in &lt;30 days
                    </span>
                  </div>

                  <div className="bg-[#FFF0F2] border-3 border-[#FF4757] p-3 rounded-lg shadow-nb-sm">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#FF4757] block">Direct Rework Spend ("Cost of To & Fro")</span>
                    <div className="text-xl font-black font-mono text-[#FF4757] mt-0.5">
                      {formatINR(road.direct_rework_spend_inr)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 block mt-1">
                      Total Spent: {formatINR(road.total_spent_inr)}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border-3 border-black p-3 rounded-lg shadow-nb-sm">
                    <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block">Observed Durability Proxy</span>
                    <div className="text-xl font-black font-mono text-blue-900 mt-0.5">
                      {road.durability_proxy_days} Days
                    </div>
                    <span className="text-xs font-bold text-gray-600 block mt-1">
                      Avg. time to next complaint
                    </span>
                  </div>
                </div>

                {/* Wear-and-Tear Strip */}
                <div className="nb-card p-4 bg-[#F8F5EE]">
                  <h4 className="text-xs font-mono font-black uppercase text-gray-700 mb-2.5 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-black" />
                    Traffic Load & Environmental Wear-and-Tear Strip
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-bold block">Peak Traffic Volume</span>
                      <span className="font-mono font-black text-sm">{road.traffic_peak_hour} vehicles/hr</span>
                    </div>
                    <div className="bg-white border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-bold block">Congestion Index</span>
                      <span className="font-mono font-black text-sm">{road.congestion_index} / 10</span>
                    </div>
                    <div className="bg-white border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-bold block">Surface & Lanes</span>
                      <span className="font-mono font-bold text-xs">{road.surface} • {road.lanes} Lanes</span>
                    </div>
                    <div className="bg-white border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-bold block">Past Accidents</span>
                      <span className="font-mono font-black text-sm text-[#FF4757]">{road.accidents_count} Casualties</span>
                    </div>
                  </div>

                  {/* Facilities Lifeline Warning */}
                  {road.facilities_nearby.length > 0 && (
                    <div className="mt-3 bg-blue-50 border-2 border-blue-400 p-2.5 rounded text-xs flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-blue-700 flex-shrink-0" />
                      <div>
                        <strong className="text-blue-900">Critical Lifeline Corridor:</strong>{' '}
                        <span className="text-blue-800">{road.facilities_nearby.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Smart Repair Recommendation */}
                <div className="nb-card p-4 bg-[#FFFDF0] border-3 border-black">
                  <div className="flex justify-between items-center mb-1">
                    <span className="nb-badge nb-badge-black text-[10px]">ENGINEERING RECOMMENDATION</span>
                    <span className="font-mono font-black text-sm text-[#121316]">Est: {formatINR(road.estimated_cost_inr)}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-black mt-1">
                    {road.recommended_method}
                  </h4>
                  <p className="text-xs text-gray-800 font-medium mt-1 leading-relaxed">
                    "{road.recommendation_reason}"
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-green-800 flex items-center gap-1">
                    <span>Expected Durability:</span>
                    <span className="bg-[#00E599] text-black px-1.5 py-0.5 rounded border border-black">
                      {road.durability_rating}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 4-STAGE LIFECYCLE */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#121316] text-white rounded-md text-xs font-mono">
                  <span className="text-[#FFE600] font-bold">4-Stage Civic Lifecycle & Evidence Gap Standard:</span>{' '}
                  Pre-award tender records are transparently badged as <em>Unavailable in Supplied Dataset</em> to prevent synthetic fabrication.
                </div>

                {/* 4-Stage Ribbon */}
                <div className="space-y-3">
                  {/* Stage 1: Start */}
                  <div className="border-3 border-black p-3.5 rounded-lg bg-[#FAF8F5] relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#FFE600] text-black border-2 border-black flex items-center justify-center font-mono font-black text-xs">1</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 1: START (Citizen Intake)</h4>
                      </div>
                      <span className="nb-badge nb-badge-mint text-[10px]">{road.lifecycle.start.evidence_label}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-2">
                      Complaints routed from MyBMC App, 1916 Helpline and Ward Walk-ins. Average intake-to-dispatch lag: <strong>{road.lifecycle.start.intake_lag_days} days</strong>.
                    </p>
                  </div>

                  {/* Stage 2: Tender (Transparent Gap) */}
                  <div className="border-3 border-dashed border-gray-400 p-3.5 rounded-lg bg-gray-50 opacity-90 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 border-2 border-gray-500 flex items-center justify-center font-mono font-black text-xs">2</span>
                        <h4 className="font-extrabold text-sm uppercase text-gray-600">STAGE 2: TENDER & PROCUREMENT</h4>
                      </div>
                      <span className="nb-badge nb-badge-gray text-[10px] text-gray-700">
                        Unavailable in Supplied Dataset
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      ⚠️ {road.lifecycle.tender.note} (Pre-award RFPs, bid evaluation minutes, and material itemization splits will link here in production).
                    </p>
                  </div>

                  {/* Stage 3: Build */}
                  <div className="border-3 border-black p-3.5 rounded-lg bg-[#FAF8F5] relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#00F0FF] text-black border-2 border-black flex items-center justify-center font-mono font-black text-xs">3</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 3: BUILD & EXECUTION</h4>
                      </div>
                      <span className="nb-badge nb-badge-mint text-[10px]">{road.lifecycle.build.evidence_label}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-2">
                      Contractors: <strong>{road.lifecycle.build.active_contractors.join(', ') || 'N/A'}</strong>. Methods: <strong>{road.lifecycle.build.methods_used.join(', ') || 'N/A'}</strong>. Benchmarked against official BMC rate card.
                    </p>
                  </div>

                  {/* Stage 4: Complete */}
                  <div className="border-3 border-black p-3.5 rounded-lg bg-[#FAF8F5] relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#00E599] text-black border-2 border-black flex items-center justify-center font-mono font-black text-xs">4</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 4: COMPLETE & SIGNOFF</h4>
                      </div>
                      <span className="nb-badge nb-badge-mint text-[10px]">{road.lifecycle.complete.evidence_label}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-2">
                      Completed work orders: <strong>{road.lifecycle.complete.total_work_orders}</strong>. SLAs met: <strong>{road.lifecycle.complete.sla_met_count} of {road.lifecycle.complete.total_work_orders}</strong>.
                    </p>
                  </div>

                  {/* Stage 5: Durability (After the End) */}
                  <div className={`border-3 border-black p-3.5 rounded-lg relative ${road.reopened_count > 0 ? 'bg-[#FFF0F2] border-[#FF4757]' : 'bg-[#E6FBF2]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#FF4757] text-white border-2 border-black flex items-center justify-center font-mono font-black text-xs">5</span>
                        <h4 className="font-extrabold text-sm uppercase">STAGE 5: POST-COMPLETION DURABILITY</h4>
                      </div>
                      <span className="nb-badge nb-badge-coral text-[10px]">{road.lifecycle.durability.evidence_label}</span>
                    </div>
                    <p className="text-xs text-gray-800 mt-2 font-medium">
                      {road.reopened_count > 0 ? (
                        <span className="text-[#FF4757] font-bold">
                          ⚠️ High Durability Failure: {road.reopened_count} patches broke down in &lt;30 days. Attributed to {road.lifecycle.durability.wear_attribution}.
                        </span>
                      ) : (
                        <span className="text-green-800 font-bold">
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
                <div className="text-xs font-mono font-bold text-gray-600 mb-2">
                  Bounded Node-Edge Rupee Trace with Environmental Context Nodes:
                </div>

                <div className="bg-[#FAF8F5] border-3 border-black p-4 rounded-lg overflow-x-auto">
                  <div className="flex items-center justify-between gap-3 min-w-[700px] text-xs font-mono font-bold">
                    <div className="nb-card p-3 bg-[#FFE600] text-center border-2 border-black w-32 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-gray-700 block">Source</span>
                      <span className="font-black text-sm">Ward {road.ward_code}</span>
                      <span className="text-[10px] text-gray-800 block">Monsoon Budget</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0" />

                    <div className="nb-card p-3 bg-white text-center border-2 border-black w-36 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-gray-500 block">Asset</span>
                      <span className="font-black text-sm text-black">{road.road_id}</span>
                      <span className="text-[10px] text-gray-600 truncate block">{road.road_name.split(' ')[0]}</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0" />

                    <div className="nb-card p-3 bg-white text-center border-2 border-black w-36 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-gray-500 block">Jobs Executed</span>
                      <span className="font-black text-sm text-black">{road.total_repairs_count} Orders</span>
                      <span className="text-[10px] text-gray-600 block">{road.surface}</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0" />

                    <div className="nb-card p-3 bg-[#00F0FF] text-center border-2 border-black w-36 shadow-nb-sm">
                      <span className="text-[9px] uppercase text-gray-700 block">Billed Spend</span>
                      <span className="font-black text-sm text-black">{formatINR(road.total_spent_inr)}</span>
                      <span className="text-[10px] text-gray-800 block">Recorded Cost</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0" />

                    <div className={`nb-card p-3 text-center border-2 border-black w-36 shadow-nb-sm ${road.reopened_count > 0 ? 'bg-[#FF4757] text-white' : 'bg-[#00E599] text-black'}`}>
                      <span className="text-[9px] uppercase block opacity-80">Durability</span>
                      <span className="font-black text-sm">{road.reopened_count > 0 ? 'Relapsed' : 'Durable'}</span>
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
                    <div key={wo.work_order_id} className="nb-card p-3.5 bg-white border-2 border-black">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="nb-badge nb-badge-black font-mono text-[10px]">{wo.work_order_id}</span>
                          <span className="font-extrabold text-sm">{wo.repair_method}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenRti(wo)}
                            className="nb-btn nb-btn-white text-[10px] font-mono py-0.5 px-2 flex items-center gap-1 hover:bg-[#FFE600]"
                          >
                            <Scale className="w-3 h-3 text-[#FF4757]" />
                            <span>RTI Brief</span>
                          </button>
                          <span className="font-mono font-black text-sm">{formatINR(wo.cost_inr)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700 font-mono">
                        <div>Contractor: <strong className="text-black">{wo.contractor_name}</strong></div>
                        <div>Completed: <strong className="text-black">{wo.completed_at?.split(' ')[0]}</strong></div>
                        <div>SLA: <strong className={wo.sla_met === 'Y' ? 'text-green-700' : 'text-[#FF4757]'}>{wo.sla_met === 'Y' ? '✓ Met' : '✗ Breached'}</strong></div>
                        <div>Durability: <strong className={wo.reopened_within_30d === 'Y' ? 'text-[#FF4757]' : 'text-green-700'}>{wo.reopened_within_30d === 'Y' ? 'Failed <30d' : 'Held Up'}</strong></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 font-bold">
                    No repair records logged for this segment during the monsoon.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-[#FAF8F5] border-t-2 border-black p-3 flex justify-between items-center text-xs font-mono">
            <span className="text-gray-600 font-bold">Evidence Standard: Bounded Public Road Dossier v2.1</span>
            <button 
              onClick={onClose}
              className="nb-btn nb-btn-white text-xs font-bold py-1.5 px-4"
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
