import React, { useState, useMemo } from 'react';
import { Compass, AlertTriangle, ShieldCheck, CheckCircle2, IndianRupee, Hospital, Car, Waves, Sliders, ArrowRight, HeartHandshake, Sparkles } from 'lucide-react';

export default function NextRupeePlannerView({ recommendations, wards }) {
  const [selectedWard, setSelectedWard] = useState('F/N');
  const [filterFacilityOnly, setFilterFacilityOnly] = useState(false);
  const [budgetCapLakhs, setBudgetCapLakhs] = useState(15);
  const [sortBy, setSortBy] = useState('hroi'); // 'hroi', 'risk', 'cost'

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;

  // Filter recommendations by ward and compute Gates Foundation Human ROI Score
  const scoredRecommendations = useMemo(() => {
    return recommendations.map(road => {
      const costLakhs = Math.max(0.35, road.estimated_cost_inr / 100000);
      const hospitalCount = road.facilities_nearby?.filter(f => f.includes('Hospital')).length || 0;
      const schoolCount = road.facilities_nearby?.filter(f => f.includes('School')).length || 0;
      const accidentCount = road.accidents_count || 0;
      const trafficVolume = road.traffic_peak_hour || 1200;

      // Gates Foundation Outcome-Per-Dollar Human Return on Investment (H-ROI)
      // Weighs lives protected and congestion alleviated per rupee spent
      const humanOutcomes = (hospitalCount * 45) + (schoolCount * 25) + (accidentCount * 30) + (trafficVolume / 150);
      const hroiScore = Math.round((humanOutcomes / costLakhs) * 10) / 10;

      return {
        ...road,
        hospital_count: hospitalCount,
        school_count: schoolCount,
        hroi_score: hroiScore
      };
    }).filter(r => {
      if (selectedWard !== 'ALL' && r.ward_code !== selectedWard) return false;
      if (filterFacilityOnly && r.facilities_nearby?.length === 0) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'hroi') return b.hroi_score - a.hroi_score;
      if (sortBy === 'risk') return b.risk_score - a.risk_score;
      if (sortBy === 'cost') return a.estimated_cost_inr - b.estimated_cost_inr;
      return 0;
    });
  }, [recommendations, selectedWard, filterFacilityOnly, sortBy]);

  // Simulation: Which roads get funded under budgetCapLakhs?
  const simulation = useMemo(() => {
    const budgetInr = budgetCapLakhs * 100000;
    let accumulatedCost = 0;
    const funded = [];
    const unfunded = [];

    scoredRecommendations.forEach(road => {
      if (accumulatedCost + road.estimated_cost_inr <= budgetInr) {
        accumulatedCost += road.estimated_cost_inr;
        funded.push({ ...road, allocated: true });
      } else {
        unfunded.push({ ...road, allocated: false });
      }
    });

    const hospitalRoutesFunded = funded.filter(r => r.hospital_count > 0).length;
    const accidentsCovered = funded.reduce((acc, r) => acc + (r.accidents_count || 0), 0);

    return {
      budgetInr,
      allocatedCost: accumulatedCost,
      remainingSimBudget: budgetInr - accumulatedCost,
      funded,
      unfunded,
      hospitalRoutesFunded,
      accidentsCovered
    };
  }, [scoredRecommendations, budgetCapLakhs]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="nb-card p-5 bg-[#F59E0B] border border-slate-200/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">PREDICTIVE BUDGET ALLOCATION</span>
              <span className="nb-badge nb-badge-mint text-black font-bold">GATES FOUNDATION H-ROI MODEL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mt-1">
              Next Rupee Civic Planner
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
              Prioritize repairs by <strong>Human Return on Investment (H-ROI per ₹1 Lakh)</strong>: ambulance lifelines, school corridors, and past accidents.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1.5 rounded shadow-nb-sm text-xs font-mono">
              <span className="text-gray-500 font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="nb-input py-0.5 text-xs font-bold"
              >
                <option value="hroi">Highest Human ROI / ₹1L</option>
                <option value="risk">Composite Risk Score</option>
                <option value="cost">Lowest Cost First</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1.5 rounded shadow-nb-sm text-xs font-mono">
              <span className="text-gray-500 font-bold">Ward:</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="nb-input py-0.5 text-xs font-bold"
              >
                <option value="ALL">All City Arterials</option>
                {wards.map(w => (
                  <option key={w.ward_code} value={w.ward_code}>
                    Ward {w.ward_code} ({w.ward_name.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Budget Simulator Bar */}
      <div className="nb-card p-5 bg-white border border-slate-200/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-gray-200">
          <div>
            <h3 className="text-lg font-bold font-mono uppercase flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#F59E0B] fill-black" />
              Interactive Budget Allocation Simulator
            </h3>
            <p className="text-xs font-bold text-gray-600">
              Slide to test how much budget to release. The algorithm auto-funds highest human-return corridors first.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="facOnly"
              checked={filterFacilityOnly}
              onChange={(e) => setFilterFacilityOnly(e.target.checked)}
              className="w-4 h-4 border border-slate-200/80 rounded accent-[#F59E0B]"
            />
            <label htmlFor="facOnly" className="text-xs font-bold cursor-pointer font-mono">
              Hospital & School Lifelines Only
            </label>
          </div>
        </div>

        {/* Slider & Real-time Allocation Outcomes */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Slider input */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>Sprint Budget Released:</span>
              <span className="text-lg font-bold text-[#0F172A] bg-[#F59E0B] px-2 py-0.5 rounded border border-black">
                ₹{budgetCapLakhs} Lakhs
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={budgetCapLakhs}
              onChange={(e) => setBudgetCapLakhs(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 border border-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#0F172A]"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500 font-bold">
              <span>₹2L (Emergency Patch)</span>
              <span>₹25L (Major Lifelines)</span>
              <span>₹50L (Complete Overhaul)</span>
            </div>
          </div>

          {/* Allocation Result Counters */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Roads Funded</span>
              <span className="font-mono font-bold text-lg text-green-700">
                {simulation.funded.length} <span className="text-xs font-normal text-gray-500">of {scoredRecommendations.length}</span>
              </span>
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Budget Deployed</span>
              <span className="font-mono font-bold text-lg text-[#0F172A]">
                {formatLakh(simulation.allocatedCost)}
              </span>
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Hospitals Secured</span>
              <span className="font-mono font-bold text-lg text-[#00F0FF] text-blue-900">
                {simulation.hospitalRoutesFunded} Entries
              </span>
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Accidents Mitigated</span>
              <span className="font-mono font-bold text-lg text-[#FF4757]">
                {simulation.accidentsCovered} Past Sites
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized Road List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-700 px-1">
          <span>
            {simulation.funded.length} ROADS FUNDED IN SPRINT • {simulation.unfunded.length} DEFERRED
          </span>
          <span className="text-gray-500">Sorted by: {sortBy === 'hroi' ? 'Gates Foundation H-ROI' : 'Composite Risk'}</span>
        </div>

        <div className="space-y-3">
          {scoredRecommendations.map((road, idx) => {
            const isFunded = simulation.funded.some(f => f.road_id === road.road_id);

            return (
              <div
                key={road.road_id}
                className={`nb-card p-4 transition-all ${
                  isFunded 
                    ? 'bg-white border border-slate-200/90 shadow-nb' 
                    : 'bg-[#F9F9F9] border-2 border-gray-400 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Road & H-ROI Badge */}
                  <div className="flex items-start gap-3">
                    {/* Rank & H-ROI */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-md border border-slate-200/80 bg-[#0F172A] text-[#F59E0B] flex items-center justify-center font-mono font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-green-700 mt-1 bg-green-100 px-1 rounded border border-green-400">
                        H-ROI {road.hroi_score}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="nb-badge nb-badge-black text-[10px]">{road.ward_code}</span>
                        <h4 className="font-extrabold text-base text-gray-900 leading-none">
                          {road.road_name}
                        </h4>
                        <span className="text-xs font-mono text-gray-500 font-bold">({road.road_id})</span>
                        {isFunded ? (
                          <span className="nb-badge nb-badge-mint text-[10px]">✓ ALLOCATED IN SPRINT</span>
                        ) : (
                          <span className="nb-badge nb-badge-gray text-[10px]">DEFERRED</span>
                        )}
                        {road.bus_route === 'Y' && (
                          <span className="nb-badge nb-badge-cyan text-[10px]">BEST BUS ROUTE</span>
                        )}
                      </div>

                      {/* Human Return on Investment Impact Statement */}
                      <div className="mt-2 text-xs text-gray-800 font-medium bg-[#F8FAFC] border border-gray-300 p-2 rounded">
                        <strong>Gates Foundation Human Impact:</strong> Investing {formatINR(road.estimated_cost_inr)} safeguards{' '}
                        {road.hospital_count > 0 && <span className="text-blue-900 font-bold">{road.hospital_count} Hospital Ambulance Gates, </span>}
                        {road.school_count > 0 && <span className="text-purple-900 font-bold">{road.school_count} Municipal Schools, </span>}
                        {road.accidents_count > 0 && <span className="text-[#FF4757] font-bold">{road.accidents_count} Past Monsoon Accident Spots, </span>}
                        and <strong>{road.traffic_peak_hour} peak vehicles/hr</strong>.
                      </div>
                    </div>
                  </div>

                  {/* Right: Method Recommendation & Cost */}
                  <div className="lg:w-80 flex-shrink-0 bg-[#F8FAFC] border border-slate-200/80 p-3 rounded-md text-xs space-y-1">
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Recommended Method:</span>
                      <span className="font-bold text-sm text-[#0F172A]">{formatINR(road.estimated_cost_inr)}</span>
                    </div>
                    <div className="font-extrabold text-sm text-gray-900">
                      {road.recommended_method}
                    </div>
                    <div className="text-[10px] font-bold text-green-800">
                      Durability: {road.durability_rating}
                    </div>
                    <p className="text-[11px] text-gray-700 font-medium pt-1 border-t border-gray-200">
                      "{road.recommendation_reason}"
                    </p>
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
