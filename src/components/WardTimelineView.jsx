import React, { useState } from 'react';
import { Calendar, CloudRain, Waves, Clock, AlertTriangle, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

export default function WardTimelineView({ wards, weatherTimeline, onInspectWorkOrder }) {
  const [selectedWardCode, setSelectedWardCode] = useState('F/N');
  const [filterDelayOnly, setFilterDelayOnly] = useState(false);

  const selectedWard = wards.find(w => w.ward_code === selectedWardCode) || wards[0];
  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  // Filter ward work orders
  const workOrders = (selectedWard.timeline_work_orders || []).filter(wo => {
    if (filterDelayOnly && wo.sla_met === 'Y') return false;
    return true;
  });

  // Calculate extreme weather days
  const extremeRainDays = weatherTimeline.filter(w => w.rainfall_mm >= 64.5);
  const bigTideDays = weatherTimeline.filter(w => w.big_tide_flag === 'Y');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="nb-card p-5 bg-[#FFE600] border-4 border-[#121316]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">CHRONOLOGICAL MATRIX</span>
              <span className="nb-badge nb-badge-coral">WEATHER CORRELATION GANTT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase mt-1">
              Ward Project Timeline & Weather Matrix
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
              Chronological tracking of repair execution windows cross-referenced against daily IMD monsoon rainfall and 4.5m tidal backflow locks.
            </p>
          </div>

          {/* Ward Switcher */}
          <div className="flex items-center gap-2 bg-white border-2 border-black p-2 rounded shadow-nb-sm">
            <span className="text-xs font-mono font-bold text-gray-700">Select Ward:</span>
            <select
              value={selectedWardCode}
              onChange={(e) => setSelectedWardCode(e.target.value)}
              className="nb-input text-xs py-1"
            >
              {wards.map(w => (
                <option key={w.ward_code} value={w.ward_code}>
                  Ward {w.ward_code} — {w.ward_name.split(',')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Weather Telemetry Overview Strip */}
      <div className="nb-card p-4 bg-white border-3 border-black">
        <h3 className="text-xs font-mono font-black uppercase text-gray-700 mb-3 flex items-center justify-between">
          <span>Monsoon 2025 Climatic Telemetry (June – October)</span>
          <span className="text-gray-500 font-normal">122 Days Recorded</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FAF8F5] border-2 border-black p-2.5 rounded">
            <span className="text-[10px] text-gray-500 font-mono block">Extreme Rain Days (≥64.5mm)</span>
            <strong className="font-mono text-base text-[#FF4757]">{extremeRainDays.length} Days (Orange/Red)</strong>
          </div>
          <div className="bg-[#FAF8F5] border-2 border-black p-2.5 rounded">
            <span className="text-[10px] text-gray-500 font-mono block">High Tide Lockouts (≥4.5m)</span>
            <strong className="font-mono text-base text-blue-900">{bigTideDays.length} Tidal Spikes</strong>
          </div>
          <div className="bg-[#FAF8F5] border-2 border-black p-2.5 rounded">
            <span className="text-[10px] text-gray-500 font-mono block">Total Ward Repairs</span>
            <strong className="font-mono text-base text-black">{selectedWard.total_work_orders} Orders</strong>
          </div>
          <div className="bg-[#FAF8F5] border-2 border-black p-2.5 rounded">
            <span className="text-[10px] text-gray-500 font-mono block">30d Failure Relapse</span>
            <strong className="font-mono text-base text-[#FF8800]">{selectedWard.reopened_count} Relapses ({selectedWard.failure_rate_pct}%)</strong>
          </div>
        </div>
      </div>

      {/* Ward Project Timeline List */}
      <div className="nb-card p-5 bg-white border-3 border-black space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
          <div>
            <h3 className="text-lg font-black font-mono uppercase">
              Chronological Repair Window Log — Ward {selectedWard.ward_code}
            </h3>
            <p className="text-xs font-bold text-gray-600">
              Correlating execution timelines (`assigned_at` → `completed_at`) with weather anomalies to identify force-majeure delays.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-bold font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={filterDelayOnly}
                onChange={(e) => setFilterDelayOnly(e.target.checked)}
                className="w-4 h-4 border-2 border-black rounded accent-[#FFE600]"
              />
              <span>Delayed Repairs Only</span>
            </label>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {workOrders.map((wo) => {
            const isDelayed = wo.sla_met === 'N';
            const isWeatherDelay = wo.delay_attribution === 'CLIMATIC_FORCE_MAJEURE';
            const hasReopened = wo.reopened_within_30d === 'Y';

            return (
              <div
                key={wo.work_order_id}
                onClick={() => onInspectWorkOrder(wo)}
                className={`border-3 border-black p-4 rounded-lg shadow-nb-sm transition-all hover:-translate-y-0.5 cursor-pointer ${
                  hasReopened ? 'bg-[#FFF5F6]' : 'bg-[#FAF8F5]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Timestamps & Road */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="nb-badge nb-badge-black font-mono text-[10px]">{wo.work_order_id}</span>
                      <span className="font-extrabold text-sm text-black">{wo.road_name}</span>
                      <span className="text-xs font-mono text-gray-500">({wo.road_id})</span>
                      {hasReopened && (
                        <span className="nb-badge nb-badge-coral text-[9px]">FAILED &lt; 30d</span>
                      )}
                      {wo.under_dlp === 'Y' && (
                        <span className="nb-badge nb-badge-coral text-[9px]">DLP BREACH</span>
                      )}
                    </div>

                    <div className="text-xs text-gray-700 font-mono">
                      <span>Assigned: <strong>{wo.assigned_at}</strong></span>
                      <span className="mx-2">→</span>
                      <span>Completed: <strong>{wo.completed_at}</strong></span>
                      <span className="ml-3 font-bold text-gray-500">({wo.repair_method})</span>
                    </div>
                  </div>

                  {/* Middle: Weather & Delay Attribution */}
                  <div className="flex items-center gap-3">
                    {isDelayed ? (
                      isWeatherDelay ? (
                        <div className="bg-blue-50 border-2 border-blue-400 p-2 rounded text-xs">
                          <span className="font-bold text-blue-900 flex items-center gap-1">
                            <CloudRain className="w-3.5 h-3.5 text-blue-700" /> Climatic Weather Delay
                          </span>
                          <span className="text-[10px] text-blue-800 block">
                            Peak Rain: {wo.max_rain_window_mm}mm • Tide: {wo.max_tide_window_m}m
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#FFF0F2] border-2 border-[#FF4757] p-2 rounded text-xs">
                          <span className="font-bold text-[#FF4757] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Contractor Inaction Delay
                          </span>
                          <span className="text-[10px] text-gray-600 block">Normal weather; SLA breached</span>
                        </div>
                      )
                    ) : (
                      <div className="bg-green-50 border-2 border-green-500 p-2 rounded text-xs text-green-900 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                        <span>SLA Met ({wo.sla_hours}h window)</span>
                      </div>
                    )}

                    {/* Cost */}
                    <div className="text-right font-mono min-w-[100px]">
                      <span className="font-black text-sm text-black block">{formatINR(wo.cost_inr)}</span>
                      <span className="text-[10px] text-gray-500">{wo.contractor_name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
