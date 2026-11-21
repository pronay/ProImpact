import React, { useState } from 'react';
import db from './data/rupeetrace_db.json';
import Header from './components/Header';
import GuidedStoryBanner from './components/GuidedStoryBanner';
import CitizenPortalView from './components/CitizenPortalView';
import WardOfficerPortalView from './components/WardOfficerPortalView';
import ContractorPortalView from './components/ContractorPortalView';
import FuturisticMapView from './components/FuturisticMapView';
import WardTrailView from './components/WardTrailView';
import WardTimelineView from './components/WardTimelineView';
import LifecycleAndGraphView from './components/LifecycleAndGraphView';
import RepairAuditorView from './components/RepairAuditorView';
import ContractorScorecardView from './components/ContractorScorecardView';
import NextRupeePlannerView from './components/NextRupeePlannerView';
import CitizenTrackerView from './components/CitizenTrackerView';
import WorkOrderModal from './components/WorkOrderModal';
import RoadPassportModal from './components/RoadPassportModal';

export default function App() {
  const [activeRole, setActiveRole] = useState('citizen'); // 'citizen' | 'officer' | 'contractor'
  const [activeTab, setActiveTab] = useState('citizen-portal');
  const [activeWorkOrderModal, setActiveWorkOrderModal] = useState(null);
  const [activeRoadPassportModal, setActiveRoadPassportModal] = useState(null);
  const [preselectedAuditorWard, setPreselectedAuditorWard] = useState('ALL');
  const [tourStep, setTourStep] = useState(0); // 0 = off, 1 = citizen, 2 = officer, 3 = contractor, 4 = next-rupee

  // Cross-Role Live Civic State (Connecting Citizen, Officer & Contractor)
  const [liveRelapses, setLiveRelapses] = useState([
    {
      complaint_id: 'BMC25-RELAPSE-9241',
      locality_text: 'S.V. Road, Near Andheri Station (Ward K/W)',
      ward_code: 'K/W',
      channel: 'Citizen Relapse Desk',
      received_at: '2025-07-11',
      description: 'Pothole patch completed in June broke open again after heavy weekend downpour. 2 scooters skidded today.',
      category_reported: 'Pothole (Repaired previously but broke again)',
      status: 'Urgent Dispatch',
      is_relapse: true,
      referenced_ticket: 'CMP-2025-0814'
    }
  ]);

  const [liveDisputes, setLiveDisputes] = useState({
    'WO25-00004': {
      category: 'weather',
      timestamp: '2025-07-09',
      refId: 'DISP-2025-WO25-00004',
      road_name: 'S.V. Road',
      contractor_id: 'CT01'
    }
  });

  const [escalatedOrders, setEscalatedOrders] = useState({
    'WO25-00005': { tier: 'L2', action: '20% Retention Withheld', date: '2025-07-10', notes: 'DLP warranty breach' },
    'WO25-00012': { tier: 'L3', action: 'Vigilance Show-Cause Notice', date: '2025-07-12', notes: 'Chronic paver collapse' }
  });

  const handleReportRelapse = (newRelapse) => {
    setLiveRelapses(prev => [newRelapse, ...prev]);
  };

  const handleSubmitDispute = (woId, disputeRecord) => {
    setLiveDisputes(prev => ({ ...prev, [woId]: disputeRecord }));
  };

  const handleEscalateOrder = (woId, escalationData) => {
    setEscalatedOrders(prev => ({ ...prev, [woId]: escalationData }));
  };

  // Role Switcher with auto-tab redirect
  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    if (newRole === 'citizen') {
      setActiveTab('citizen-portal');
    } else if (newRole === 'contractor') {
      setActiveTab('contractor-portal');
    } else {
      setActiveTab('officer-portal');
    }
  };

  // Navigation handlers
  const handleNavigateToAuditorWithWard = (wardCode) => {
    setPreselectedAuditorWard(wardCode);
    setActiveTab('auditor');
  };

  const handleFilterAuditsByContractor = (contractorId) => {
    setActiveTab('auditor');
  };

  const handleInspectWorkOrder = (workOrder) => {
    setActiveWorkOrderModal(workOrder);
  };

  const handleInspectWorkOrderById = (workOrderId) => {
    const found = db.audits.find(w => w.work_order_id === workOrderId);
    if (found) {
      setActiveWorkOrderModal(found);
    }
  };

  const handleOpenRoadPassport = (roadData) => {
    const fullPassport = db.roads.find(r => r.road_id === roadData.road_id) || roadData;
    setActiveRoadPassportModal(fullPassport);
  };

  const handleInspectComplaintFromModal = (complaintId) => {
    setActiveWorkOrderModal(null);
    if (activeRole === 'citizen') {
      setActiveTab('citizen-portal');
    } else {
      setActiveTab('citizen-tracker');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* Cupertino Liquid Glass Global Header with Role-Specific Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
        kpis={db.kpis}
        totalFlagged={db.kpis.total_flagged_work_orders}
      />

      {/* 4-Minute Interactive Guided Investigation Tour */}
      <GuidedStoryBanner
        currentStep={tourStep}
        setTourStep={setTourStep}
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ROLE 1: CITIZEN PORTAL */}
        {activeTab === 'citizen-portal' && (
          <CitizenPortalView
            complaints={db.complaints}
            roads={db.roads}
            wards={db.wards}
            onOpenRoadPassport={handleOpenRoadPassport}
            onReportRelapse={handleReportRelapse}
            liveRelapses={liveRelapses}
          />
        )}

        {/* ROLE 2: WARD OFFICER / GOV ADMIN PORTAL */}
        {activeTab === 'officer-portal' && (
          <WardOfficerPortalView
            db={db}
            onOpenRoadPassport={handleOpenRoadPassport}
            onInspectWorkOrder={handleInspectWorkOrder}
            liveRelapses={liveRelapses}
            liveDisputes={liveDisputes}
            escalatedOrders={escalatedOrders}
            onEscalateOrder={handleEscalateOrder}
          />
        )}

        {/* ROLE 3: CONTRACTOR PORTAL */}
        {activeTab === 'contractor-portal' && (
          <ContractorPortalView
            contractors={db.contractors}
            audits={db.audits}
            weatherTimeline={db.weather_timeline}
            onInspectWorkOrder={handleInspectWorkOrder}
            disputedOrders={liveDisputes}
            onSubmitDispute={handleSubmitDispute}
            escalatedOrders={escalatedOrders}
          />
        )}

        {/* SHARED VIEW: GIS COMMAND MAP */}
        {activeTab === 'futuristic-map' && (
          <FuturisticMapView
            geojson={db.geojson}
            wards={db.wards}
            roads={db.roads}
            floodHotspots={db.flood_hotspots}
            facilities={db.facilities}
            accidents={db.accidents}
            onOpenRoadPassport={handleOpenRoadPassport}
          />
        )}

        {/* SHARED VIEW: WARD MONEY TRAIL */}
        {activeTab === 'ward-trail' && (
          <WardTrailView
            wards={db.wards}
            onSelectWorkOrder={handleInspectWorkOrder}
            onNavigateToAuditor={handleNavigateToAuditorWithWard}
          />
        )}

        {/* SHARED VIEW: WARD PROJECT TIMELINE */}
        {activeTab === 'ward-timeline' && (
          <WardTimelineView
            wards={db.wards}
            weatherTimeline={db.weather_timeline}
            onInspectWorkOrder={handleInspectWorkOrder}
          />
        )}

        {/* SHARED VIEW: 4-STAGE LIFECYCLE & TRACE GRAPH */}
        {activeTab === 'lifecycle-graph' && (
          <LifecycleAndGraphView
            roads={db.roads}
            onOpenRoadPassport={handleOpenRoadPassport}
          />
        )}

        {/* SHARED VIEW: REPAIR AUDITOR */}
        {activeTab === 'auditor' && (
          <RepairAuditorView
            audits={db.audits}
            wards={db.wards}
            contractors={db.contractors}
            onInspectWorkOrder={handleInspectWorkOrder}
            preselectedWard={preselectedAuditorWard}
          />
        )}

        {/* SHARED VIEW: CONTRACTOR SCORECARDS */}
        {activeTab === 'scorecards' && (
          <ContractorScorecardView
            contractors={db.contractors}
            onFilterAuditsByContractor={handleFilterAuditsByContractor}
          />
        )}

        {/* SHARED VIEW: NEXT RUPEE PLANNER */}
        {activeTab === 'next-rupee' && (
          <NextRupeePlannerView
            recommendations={db.roads}
            wards={db.wards}
          />
        )}

        {/* SHARED VIEW: CITIZEN TRACKER */}
        {activeTab === 'citizen-tracker' && (
          <CitizenTrackerView
            complaints={db.complaints}
            onInspectWorkOrderById={handleInspectWorkOrderById}
          />
        )}
      </main>

      {/* Work Order Inspection Dossier Modal */}
      {activeWorkOrderModal && (
        <WorkOrderModal
          workOrder={activeWorkOrderModal}
          onClose={() => setActiveWorkOrderModal(null)}
          onInspectComplaint={handleInspectComplaintFromModal}
        />
      )}

      {/* Road Passport v2.0 Modal */}
      {activeRoadPassportModal && (
        <RoadPassportModal
          road={activeRoadPassportModal}
          onClose={() => setActiveRoadPassportModal(null)}
          onInspectWorkOrder={handleInspectWorkOrder}
        />
      )}

      {/* Neobrutal Footer */}
      <footer className="border-t-4 border-[#121316] bg-[#FFE600] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-mono font-black text-xl tracking-tight text-[#121316]">
                  RUPEETRACE v2.1
                </span>
                <span className="nb-badge nb-badge-black text-[10px]">ROLE-BASED CIVIC ARCHITECTURE</span>
              </div>
              <p className="text-xs font-bold text-gray-800">
                Follow the Rupee. Verify the Repair. Fund What Matters.
              </p>
            </div>

            <div className="text-center md:text-right space-y-1 text-xs">
              <div className="font-bold text-[#121316]">
                Built for <span className="underline decoration-2">Claude Impact Lab Mumbai</span> • ATLAS SkillTech University
              </div>
              <p className="text-[11px] font-mono font-medium text-gray-800 max-w-md">
                Public, Government, and Private stakeholders interacting on one shared, unforgeable evidence trail.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
