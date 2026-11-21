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

    // High-contrast clean CartoDB Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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
          let fillColor = '#FFE600';
          let fillOpacity = 0.25;

          if (wardMetric === 'wasted') {
            const wasted = props.wasted_spend_inr || 0;
            if (wasted > 2000000) { fillColor = '#FF4757'; fillOpacity = 0.45; }
            else if (wasted > 1000000) { fillColor = '#FF8800'; fillOpacity = 0.35; }
            else { fillColor = '#FFE600'; fillOpacity = 0.2; }
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
            color: '#121316',
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
          let strokeColor = '#121316';
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
              layer.setStyle({ weight: 7, color: '#FFE600' });
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
          color: '#121316',
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
      {/* Top Map Control HUD */}
      <div className="nb-card p-4 bg-[#FFE600] border-4 border-[#121316]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="nb-badge nb-badge-black text-xs">CYBER-NEOBRUTAL GIS</span>
              <span className="nb-badge nb-badge-coral">GEOSPATIAL ANOMALY RADAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase mt-1">
              Mumbai Civic GIS Command Center
            </h2>
            <p className="text-xs font-bold text-gray-900 mt-0.5">
              Geospatial correlation of 24 ward polygons, 291 road segments, chronic flood lock-points, and emergency hospital lifelines.
            </p>
          </div>

          {/* Layer Toggle Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowWards(!showWards)}
              className={`nb-btn text-xs py-1 px-2.5 font-mono ${showWards ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              🏛️ Wards Polygons
            </button>
            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`nb-btn text-xs py-1 px-2.5 font-mono ${showRoads ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              🛣️ Road Arterials ({roads.length})
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`nb-btn text-xs py-1 px-2.5 font-mono ${showHotspots ? 'bg-[#00F0FF] text-black' : 'bg-white text-black'}`}
            >
              🌊 Flood Hotspots (28)
            </button>
            <button
              onClick={() => setShowHospitals(!showHospitals)}
              className={`nb-btn text-xs py-1 px-2.5 font-mono ${showHospitals ? 'bg-[#FF4757] text-white' : 'bg-white text-black'}`}
            >
              🏥 Hospitals (160)
            </button>
            <button
              onClick={() => setShowAccidents(!showAccidents)}
              className={`nb-btn text-xs py-1 px-2.5 font-mono ${showAccidents ? 'bg-[#FF8800] text-black' : 'bg-white text-black'}`}
            >
              ⚠️ Accidents
            </button>
          </div>
        </div>

        {/* Heatmap Metric Selector */}
        <div className="mt-3 pt-3 border-t-2 border-black flex flex-wrap items-center justify-between text-xs font-mono font-bold">
          <div className="flex items-center gap-2">
            <span>Ward Polygon Heatmap Metric:</span>
            {[
              { id: 'wasted', label: 'Wasted Spend (₹)' },
              { id: 'low_lying', label: 'Flood-Prone Index' },
              { id: 'utilization', label: 'Budget Utilization %' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setWardMetric(m.id)}
                className={`nb-badge text-[11px] cursor-pointer ${wardMetric === m.id ? 'nb-badge-black text-white' : 'nb-badge-gray hover:bg-white'}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#FF4757] border border-black inline-block"></span> DLP Breach / High Risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#FF8800] border border-black inline-block"></span> Repeat Repair</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#059669] border border-black inline-block"></span> Resurfaced</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas & Side Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-8 nb-card overflow-hidden border-4 border-[#121316] relative bg-gray-100 shadow-nb-lg h-[620px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick HUD Telemetry Box overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 border-3 border-black p-3 rounded-md shadow-nb-md max-w-xs text-xs font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold uppercase text-[10px] text-gray-600">GIS Telemetry</span>
              <span className="nb-badge nb-badge-mint text-[9px]">LIVE VECTOR</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Active Road Assets:</span>
                <strong className="text-black">{roads.length} Segments</strong>
              </div>
              <div className="flex justify-between">
                <span>DLP Warranty Breaches:</span>
                <strong className="text-[#FF4757]">{roads.filter(r => r.under_dlp === 'Y').length} Roads</strong>
              </div>
              <div className="flex justify-between">
                <span>Hospital Lifelines:</span>
                <strong className="text-blue-900">{facilities.filter(f => f.type === 'Hospital').length} Gates</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Feature Inspector Panel */}
        <div className="lg:col-span-4 nb-card p-4 bg-white border-4 border-[#121316] shadow-nb-lg flex flex-col justify-between h-[620px] overflow-y-auto">
          {selectedFeature ? (
            <div className="space-y-4">
              {/* Type Badge */}
              <div className="flex items-center justify-between">
                <span className={`nb-badge ${
                  selectedFeature.type === 'ROAD' ? 'nb-badge-yellow text-black' :
                  selectedFeature.type === 'WARD' ? 'nb-badge-cyan text-black' :
                  selectedFeature.type === 'HOTSPOT' ? 'nb-badge-coral text-white' : 'nb-badge-black text-white'
                }`}>
                  {selectedFeature.type} INSPECTOR
                </span>
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="text-xs font-mono font-bold text-gray-500 hover:text-black"
                >
                  Clear Selection
                </button>
              </div>

              {/* ROAD INSPECTION */}
              {selectedFeature.type === 'ROAD' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-500">{selectedFeature.data.road_id} • Ward {selectedFeature.data.ward_code}</span>
                    <h3 className="text-xl font-black uppercase text-gray-900 mt-0.5">
                      {selectedFeature.data.road_name}
                    </h3>
                  </div>

                  {selectedFeature.data.under_dlp === 'Y' && (
                    <div className="bg-[#FFF0F2] border-2 border-[#FF4757] p-2.5 rounded text-xs text-[#FF4757] font-bold">
                      ⚠️ DLP Road Warranty Breach: Repairs billed to BMC while road was under warranty!
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-mono block">Total Spent</span>
                      <strong className="font-mono text-sm text-black">{formatINR(selectedFeature.data.total_spent_inr)}</strong>
                    </div>
                    <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-mono block">Rework Drain</span>
                      <strong className="font-mono text-sm text-[#FF4757]">{formatINR(selectedFeature.data.direct_rework_spend_inr)}</strong>
                    </div>
                    <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-mono block">Repair Count</span>
                      <strong className="font-mono text-sm text-black">{selectedFeature.data.total_repairs_count} Jobs</strong>
                    </div>
                    <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-mono block">Durability Proxy</span>
                      <strong className="font-mono text-sm text-blue-900">{selectedFeature.data.durability_proxy_days} Days</strong>
                    </div>
                  </div>

                  <div className="border-2 border-black p-3 rounded bg-[#FFFDF0] text-xs space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">Engineering Recommendation</span>
                    <strong className="font-extrabold text-sm block text-black">{selectedFeature.data.recommended_method}</strong>
                    <p className="text-gray-700 leading-relaxed font-medium">"{selectedFeature.data.recommendation_reason}"</p>
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
                    <span className="font-mono text-xs font-bold text-gray-500">Zone {selectedFeature.data.zone || '1'}</span>
                    <h3 className="text-2xl font-black uppercase text-gray-900 mt-0.5">
                      Ward {selectedFeature.data.ward_code}
                    </h3>
                    <p className="text-xs text-gray-700 font-bold">{selectedFeature.data.ward_name}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded flex justify-between">
                      <span className="text-gray-600 font-bold">Monsoon Budget:</span>
                      <strong className="font-mono">{formatLakh(selectedFeature.data.budget_inr)}</strong>
                    </div>
                    <div className="bg-[#FAF8F5] border-2 border-black p-2 rounded flex justify-between">
                      <span className="text-gray-600 font-bold">Actual Spend:</span>
                      <strong className="font-mono">{formatLakh(selectedFeature.data.total_spend_inr)}</strong>
                    </div>
                    <div className="bg-[#FFF0F2] border-2 border-[#FF4757] p-2 rounded flex justify-between text-[#FF4757]">
                      <span className="font-bold">Wasted on Relapses:</span>
                      <strong className="font-mono">{formatLakh(selectedFeature.data.wasted_spend_inr)}</strong>
                    </div>
                    <div className="bg-white border-2 border-black p-2 rounded flex justify-between">
                      <span className="text-gray-600 font-bold">Flood Prone Index:</span>
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
                    <h3 className="text-lg font-black uppercase text-gray-900 mt-1">
                      {selectedFeature.data.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-gray-600">Ward {selectedFeature.data.ward_code}</span>
                  </div>

                  <div className="bg-[#FAF8F5] border-2 border-black p-3 rounded text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">Flood Threshold Rain:</span>
                      <strong className="font-mono">{selectedFeature.data.flood_threshold_mm_per_day} mm/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">Avg. Water Depth:</span>
                      <strong className="font-mono text-[#FF4757]">{selectedFeature.data.avg_water_depth_cm} cm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">Recession Hours:</span>
                      <strong className="font-mono">{selectedFeature.data.avg_recession_hours} hrs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">Tide Sensitive?</span>
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
                    <h3 className="text-lg font-black uppercase text-gray-900 mt-1">
                      {selectedFeature.data.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-gray-600">Ward {selectedFeature.data.ward_code} • {selectedFeature.data.beds_or_students} Beds</span>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-400 p-3 rounded text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-900 font-bold">Ambulance Route:</span>
                      <strong className="font-mono text-black">{selectedFeature.data.ambulance_entry_road}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-900 font-bold">Emergency Services:</span>
                      <strong className="text-black">{selectedFeature.data.emergency_services}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-500">
              <MapPin className="w-12 h-12 text-[#121316] stroke-1" />
              <div>
                <h4 className="font-extrabold text-sm uppercase text-gray-800">No Asset Selected</h4>
                <p className="text-xs font-bold text-gray-600 mt-1 max-w-xs">
                  Click any Ward polygon, Road segment line, or pulsing Flood hotspot on the map to inspect its real-time telemetry.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Inspector Help */}
          <div className="pt-3 border-t-2 border-gray-200 text-[11px] font-mono text-gray-600">
            💡 <em>Tip: Roads colored in red signify DLP warranty violations or critical repeat failure stretches.</em>
          </div>
        </div>
      </div>
    </div>
  );
}
