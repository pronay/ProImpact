import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, AlertTriangle, Hospital, Waves, Car, ShieldAlert, Sparkles, Sliders, ExternalLink, QrCode } from 'lucide-react';

export default function FuturisticMapView({ geojson, wards, roads, floodHotspots, facilities, accidents, onOpenRoadPassport }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojsonLayersRef = useRef({});

  // Layer toggles
  const [showWards, setShowWards] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAccidents, setShowAccidents] = useState(false);
  const [wardMetric, setWardMetric] = useState('wasted'); // 'wasted', 'utilization', 'low_lying'

  // Selected feature inspector
  const [selectedFeature, setSelectedFeature] = useState(null);

  const formatINR = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
  const formatLakh = (val) => `₹${((val || 0) / 100000).toFixed(1)} Lakhs`;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Check if Leaflet is loaded from window
    if (!window.L) {
      console.warn('Leaflet not loaded yet');
      return;
    }

    const L = window.L;

    // Initialize Map on Mumbai coordinates
    const map = L.map(mapContainerRef.current, {
      center: [19.0760, 72.8777],
      zoom: 11,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: false
    });

    // Add Zoom Control to Top-Right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // High-contrast clean CartoDB Dark Matter tiles for VisionOS Command Center
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update GeoJSON Layers when toggles or metrics change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;
    const L = window.L;

    // Clear previous layers
    if (geojsonLayersRef.current.wardsLayer) map.removeLayer(geojsonLayersRef.current.wardsLayer);
    if (geojsonLayersRef.current.roadsLayer) map.removeLayer(geojsonLayersRef.current.roadsLayer);
    if (geojsonLayersRef.current.hotspotsLayer) map.removeLayer(geojsonLayersRef.current.hotspotsLayer);
    if (geojsonLayersRef.current.facilitiesLayer) map.removeLayer(geojsonLayersRef.current.facilitiesLayer);
    if (geojsonLayersRef.current.accidentsLayer) map.removeLayer(geojsonLayersRef.current.accidentsLayer);

    // 1. Wards Layer
    if (showWards && geojson.wards) {
      const wardsLayer = L.geoJSON(geojson.wards, {
        style: (feature) => {
          const props = feature.properties;
          let fillColor = '#F59E0B';
          let fillOpacity = 0.25;

          if (wardMetric === 'wasted') {
            const wasted = props.wasted_spend_inr || 0;
            if (wasted > 2000000) { fillColor = '#FF4757'; fillOpacity = 0.45; }
            else if (wasted > 1000000) { fillColor = '#FF8800'; fillOpacity = 0.35; }
            else { fillColor = '#F59E0B'; fillOpacity = 0.2; }
          } else if (wardMetric === 'low_lying') {
            const index = props.low_lying_index || 0;
            if (index > 0.75) { fillColor = '#FF4757'; fillOpacity = 0.5; }
            else if (index > 0.5) { fillColor = '#00F0FF'; fillOpacity = 0.35; }
            else { fillColor = '#00E599'; fillOpacity = 0.2; }
          } else {
            const util = props.utilization_pct || 0;
            if (util > 100) { fillColor = '#FF4757'; fillOpacity = 0.45; }
            else { fillColor = '#00E599'; fillOpacity = 0.3; }
          }

          return {
            color: '#0F172A',
            weight: 2,
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            dashArray: '3, 3'
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: () => {
              layer.setStyle({ weight: 4, color: '#000000', fillOpacity: 0.6 });
            },
            mouseout: () => {
              wardsLayer.resetStyle(layer);
            },
            click: () => {
              setSelectedFeature({ type: 'WARD', data: feature.properties });
              map.fitBounds(layer.getBounds(), { padding: [20, 20] });
            }
          });
        }
      }).addTo(map);

      geojsonLayersRef.current.wardsLayer = wardsLayer;
    }

    // 2. Roads Layer
    if (showRoads && geojson.roads) {
      const roadsLayer = L.geoJSON(geojson.roads, {
        style: (feature) => {
          const props = feature.properties;
          let strokeColor = '#0F172A';
          let weight = 3.5;

          if (props.under_dlp === 'Y') {
            strokeColor = '#FF4757'; // Critical DLP
            weight = 5;
          } else if (props.total_repairs_count >= 2) {
            strokeColor = '#FF8800'; // Repeat Failure
            weight = 4.5;
          } else if (props.risk_score > 75) {
            strokeColor = '#B794F4'; // High Risk
            weight = 4;
          } else {
            strokeColor = '#059669'; // Clean
            weight = 3;
          }

          return {
            color: strokeColor,
            weight: weight,
            opacity: 0.95
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: () => {
              layer.setStyle({ weight: 7, color: '#F59E0B' });
            },
            mouseout: () => {
              roadsLayer.resetStyle(layer);
            },
            click: () => {
              const roadPassport = roads.find(r => r.road_id === feature.properties.road_id);
              setSelectedFeature({ type: 'ROAD', data: roadPassport || feature.properties });
            }
          });
        }
      }).addTo(map);

      geojsonLayersRef.current.roadsLayer = roadsLayer;
    }

    // 3. Flood Hotspots Layer (Pulsing Radar Rings)
    if (showHotspots && floodHotspots) {
      const hotspotGroup = L.layerGroup();
      floodHotspots.forEach(h => {
        const marker = L.circleMarker([h.lat, h.lon], {
          radius: 9,
          fillColor: '#00F0FF',
          color: '#0F172A',
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.85
        });

        marker.on('click', () => {
          setSelectedFeature({ type: 'HOTSPOT', data: h });
        });

        hotspotGroup.addLayer(marker);
      });
      hotspotGroup.addTo(map);
      geojsonLayersRef.current.hotspotsLayer = hotspotGroup;
    }

    // 4. Critical Facilities (Hospital Lifelines)
    if (showHospitals && facilities) {
      const facilityGroup = L.layerGroup();
      facilities.forEach(f => {
        if (f.type === 'Hospital') {
          const marker = L.circleMarker([f.lat, f.lon], {
            radius: 7,
            fillColor: '#FF4757',
            color: '#FFFFFF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          });

          marker.on('click', () => {
            setSelectedFeature({ type: 'HOSPITAL', data: f });
          });

          facilityGroup.addLayer(marker);
        }
      });
      facilityGroup.addTo(map);
      geojsonLayersRef.current.facilitiesLayer = facilityGroup;
    }

    // 5. Accidents Cluster
    if (showAccidents && accidents) {
      const accidentGroup = L.layerGroup();
      accidents.slice(0, 150).forEach(a => {
        const marker = L.circleMarker([a.lat, a.lon], {
          radius: 5,
          fillColor: '#FF8800',
          color: '#000000',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.85
        });

        marker.on('click', () => {
          setSelectedFeature({ type: 'ACCIDENT', data: a });
        });

        accidentGroup.addLayer(marker);
      });
      accidentGroup.addTo(map);
      geojsonLayersRef.current.accidentsLayer = accidentGroup;
    }

  }, [showWards, showRoads, showHotspots, showHospitals, showAccidents, wardMetric, geojson, roads, floodHotspots, facilities, accidents]);

  return (
    <div className="space-y-4">
      {/* Top Map Control HUD (VisionOS Obsidian Glass) */}
      <div className="liquid-glass p-5 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-cyan text-xs">CIVIC GIS COMMAND</span>
              <span className="nb-badge nb-badge-coral text-xs">GEOSPATIAL ANOMALY RADAR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display mt-1">
              Mumbai Infrastructure & Lifeline GIS Radar
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Geospatial correlation of 24 ward polygons, 291 road segments, chronic flood lock-points, and emergency hospital gates.
            </p>
          </div>

          {/* Layer Toggle Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowWards(!showWards)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                showWards ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Wards Polygons
            </button>
            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                showRoads ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              🛣️ Road Arterials ({roads.length})
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                showHotspots ? 'bg-blue-600/40 text-blue-200 border border-cyan-500/40/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              🌊 Flood Hotspots (28)
            </button>
            <button
              onClick={() => setShowHospitals(!showHospitals)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                showHospitals ? 'bg-rose-600/40 text-rose-200 border border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              🏥 Hospitals (160)
            </button>
            <button
              onClick={() => setShowAccidents(!showAccidents)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                showAccidents ? 'bg-amber-600/40 text-amber-200 border border-amber-400/50' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              ⚠️ Accidents
            </button>
          </div>
        </div>

        {/* Heatmap Metric Selector */}
        <div className="mt-2 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Ward Heatmap Metric:</span>
            {[
              { id: 'wasted', label: 'Wasted Spend (₹)' },
              { id: 'low_lying', label: 'Flood-Prone Index' },
              { id: 'utilization', label: 'Budget Utilization %' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setWardMetric(m.id)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  wardMetric === m.id ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-sans">
            <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-950/400 inline-block shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span> DLP Breach / High Risk</span>
            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-950/400 inline-block shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> Repeat Repair</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Resurfaced</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas & Side Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Container (VisionOS Obsidian Glass) */}
        <div className="lg:col-span-8 liquid-glass rounded-2xl overflow-hidden shadow-2xl relative h-[620px] border border-white/10">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick HUD Telemetry Box overlay (VisionOS Dark Glass) */}
          <div className="absolute bottom-4 left-4 z-20 liquid-glass-dark border border-white/20 p-3.5 rounded-xl shadow-2xl max-w-xs text-xs font-mono">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/15">
              <span className="font-bold uppercase text-[10px] text-cyan-400 tracking-wider">GIS Telemetry</span>
              <span className="nb-badge nb-badge-mint text-[9px]">LIVE VECTOR</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Road Assets:</span>
                <strong className="text-white font-mono">{roads.length} Segments</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DLP Warranty Breaches:</span>
                <strong className="text-rose-400 font-mono">{roads.filter(r => r.under_dlp === 'Y').length} Roads</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hospital Lifelines:</span>
                <strong className="text-cyan-400 font-mono">{facilities.filter(f => f.type === 'Hospital').length} Gates</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Feature Inspector Panel */}
        <div className="lg:col-span-4 liquid-glass p-5 rounded-2xl shadow-xl flex flex-col justify-between h-[620px] overflow-y-auto">
          {selectedFeature ? (
            <div className="space-y-4">
              {/* Type Badge */}
              <div className="flex items-center justify-between">
                <span className={`nb-badge ${
                  selectedFeature.type === 'ROAD' ? 'nb-badge-yellow text-amber-300' :
                  selectedFeature.type === 'WARD' ? 'nb-badge-cyan text-cyan-300' :
                  selectedFeature.type === 'HOTSPOT' ? 'nb-badge-coral text-rose-300' : 'nb-badge-black text-white'
                }`}>
                  {selectedFeature.type} INSPECTOR
                </span>
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="text-xs font-mono font-medium text-slate-400 hover:text-white"
                >
                  Clear Selection
                </button>
              </div>

              {/* ROAD INSPECTION */}
              {selectedFeature.type === 'ROAD' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-xs text-slate-400">{selectedFeature.data.road_id} • Ward {selectedFeature.data.ward_code}</span>
                    <h3 className="text-xl font-bold uppercase text-white mt-0.5">
                      {selectedFeature.data.road_name}
                    </h3>
                  </div>

                  {selectedFeature.data.under_dlp === 'Y' && (
                    <div className="bg-rose-950/40 border border-rose-500/40 p-2.5 rounded-xl text-xs text-rose-300 font-bold backdrop-blur-md">
                      ⚠️ DLP Road Warranty Breach: Repairs billed to BMC while road was under warranty!
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="liquid-glass-sub border border-white/10 p-2 rounded">
                      <span className="text-[10px] text-slate-400 font-mono block">Total Spent</span>
                      <strong className="font-mono text-sm text-white">{formatINR(selectedFeature.data.total_spent_inr)}</strong>
                    </div>
                    <div className="liquid-glass-sub border border-white/10 p-2 rounded">
                      <span className="text-[10px] text-slate-400 font-mono block">Rework Drain</span>
                      <strong className="font-mono text-sm text-rose-400">{formatINR(selectedFeature.data.direct_rework_spend_inr)}</strong>
                    </div>
                    <div className="liquid-glass-sub border border-white/10 p-2 rounded">
                      <span className="text-[10px] text-slate-400 font-mono block">Repair Count</span>
                      <strong className="font-mono text-sm text-white">{selectedFeature.data.total_repairs_count} Jobs</strong>
                    </div>
                    <div className="liquid-glass-sub border border-white/10 p-2 rounded">
                      <span className="text-[10px] text-slate-400 font-mono block">Durability Proxy</span>
                      <strong className="font-mono text-sm text-cyan-400">{selectedFeature.data.durability_proxy_days} Days</strong>
                    </div>
                  </div>

                  <div className="border border-white/10 p-3 rounded liquid-glass-sub text-xs space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Engineering Recommendation</span>
                    <strong className="font-extrabold text-sm block text-white">{selectedFeature.data.recommended_method}</strong>
                    <p className="text-slate-300 leading-relaxed font-medium">"{selectedFeature.data.recommendation_reason}"</p>
                  </div>

                  <button
                    onClick={() => onOpenRoadPassport(selectedFeature.data)}
                    className="nb-btn nb-btn-primary w-full text-xs font-extrabold uppercase py-2.5 flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open Road Passport v2.0</span>
                  </button>
                </div>
              )}

              {/* WARD INSPECTION */}
              {selectedFeature.type === 'WARD' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">Zone {selectedFeature.data.zone || '1'}</span>
                    <h3 className="text-2xl font-bold uppercase text-white mt-0.5">
                      Ward {selectedFeature.data.ward_code}
                    </h3>
                    <p className="text-xs text-slate-300 font-bold">{selectedFeature.data.ward_name}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="liquid-glass-sub border border-white/10 p-2 rounded flex justify-between">
                      <span className="text-slate-300 font-bold">Monsoon Budget:</span>
                      <strong className="font-mono">{formatLakh(selectedFeature.data.budget_inr)}</strong>
                    </div>
                    <div className="liquid-glass-sub border border-white/10 p-2 rounded flex justify-between">
                      <span className="text-slate-300 font-bold">Actual Spend:</span>
                      <strong className="font-mono">{formatLakh(selectedFeature.data.total_spend_inr)}</strong>
                    </div>
                    <div className="bg-rose-950/40 border border-rose-500/40 backdrop-blur-md border-2 border-[#FF4757] p-2 rounded flex justify-between text-rose-400">
                      <span className="font-bold">Wasted on Relapses:</span>
                      <strong className="font-mono">{formatLakh(selectedFeature.data.wasted_spend_inr)}</strong>
                    </div>
                    <div className="bg-white border border-white/10 p-2 rounded flex justify-between">
                      <span className="text-slate-300 font-bold">Flood Prone Index:</span>
                      <strong className="font-mono">{((selectedFeature.data.low_lying_index || 0) * 100).toFixed(0)}%</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* HOTSPOT INSPECTION */}
              {selectedFeature.type === 'HOTSPOT' && (
                <div className="space-y-3">
                  <div>
                    <span className="nb-badge nb-badge-coral text-[10px]">CHRONIC FLOOD SPOT</span>
                    <h3 className="text-lg font-bold uppercase text-white mt-1">
                      {selectedFeature.data.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-300">Ward {selectedFeature.data.ward_code}</span>
                  </div>

                  <div className="liquid-glass-sub border border-white/10 p-3 rounded text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-bold">Flood Threshold Rain:</span>
                      <strong className="font-mono">{selectedFeature.data.flood_threshold_mm_per_day} mm/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-bold">Avg. Water Depth:</span>
                      <strong className="font-mono text-rose-400">{selectedFeature.data.avg_water_depth_cm} cm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-bold">Recession Hours:</span>
                      <strong className="font-mono">{selectedFeature.data.avg_recession_hours} hrs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-bold">Tide Sensitive?</span>
                      <strong className="font-mono">{selectedFeature.data.tide_sensitive === 'Y' ? 'YES (Backflow Risk)' : 'NO'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* HOSPITAL INSPECTION */}
              {selectedFeature.type === 'HOSPITAL' && (
                <div className="space-y-3">
                  <div>
                    <span className="nb-badge nb-badge-coral text-[10px]">CRITICAL EMERGENCY LIFELINE</span>
                    <h3 className="text-lg font-bold uppercase text-white mt-1">
                      {selectedFeature.data.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-300">Ward {selectedFeature.data.ward_code} • {selectedFeature.data.beds_or_students} Beds</span>
                  </div>

                  <div className="bg-cyan-950/40 border-2 border-cyan-500/40 p-3 rounded text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-cyan-400 font-bold">Ambulance Route:</span>
                      <strong className="font-mono text-white">{selectedFeature.data.ambulance_entry_road}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400 font-bold">Emergency Services:</span>
                      <strong className="text-white">{selectedFeature.data.emergency_services}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <MapPin className="w-12 h-12 text-cyan-400 stroke-1" />
              <div>
                <h4 className="font-extrabold text-sm uppercase text-gray-800">No Asset Selected</h4>
                <p className="text-xs font-bold text-slate-300 mt-1 max-w-xs">
                  Click any Ward polygon, Road segment line, or pulsing Flood hotspot on the map to inspect its real-time telemetry.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Inspector Help */}
          <div className="pt-3 border-t-2 border-gray-200 text-[11px] font-mono text-slate-300">
            💡 <em>Tip: Roads colored in red signify DLP warranty violations or critical repeat failure stretches.</em>
          </div>
        </div>
      </div>
    </div>
  );
}
