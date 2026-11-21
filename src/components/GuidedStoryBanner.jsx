import React from 'react';
import { Play, CheckCircle2, ArrowRight, User, Shield, HardHat, Compass, X } from 'lucide-react';

export default function GuidedStoryBanner({ currentStep, setTourStep, activeRole, setActiveRole, setActiveTab }) {
  if (currentStep === 0) {
    return (
      <div className="bg-[#121316] text-white border-b-2 border-black py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE600] text-black px-2 py-0.5 rounded font-black font-mono text-[10px]">
              QUICK WALKTHROUGH
            </span>
            <span className="font-bold">
              New to RupeeTrace? Experience the complete 4-minute Mumbai road repair investigation:
            </span>
          </div>

          <button
            onClick={() => setTourStep(1)}
            className="nb-btn nb-btn-primary text-xs py-1 px-3 font-mono font-bold flex items-center gap-1.5 shadow-none"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Launch Interactive Story (4 Steps)</span>
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    {
      num: 1,
      role: 'citizen',
      tab: 'citizen-portal',
      title: 'Act 1: Citizen Ramesh Spots Relapse',
      desc: 'Ramesh hits a repeat pothole on S.V. Road. He scans the Road Passport, discovers ₹14.2L was spent twice in 90 days, and files a relapse grievance.',
      actionLabel: 'Go to Act 2: Ward Officer Triage →'
    },
    {
      num: 2,
      role: 'officer',
      tab: 'officer-portal',
      title: 'Act 2: Ward Officer Vinod Audits & Penalizes',
      desc: 'Vinod (K/West Ward) receives Ramesh\'s relapse dispatch. He discovers the road was under a 2-year DLP warranty and withholds 20% milestone payment.',
      actionLabel: 'Go to Act 3: Contractor Defense →'
    },
    {
      num: 3,
      role: 'contractor',
      tab: 'contractor-portal',
      title: 'Act 3: Contractor Rajesh Contests with Weather Data',
      desc: 'Rajesh (Eagle Infra) defends the delay by pulling official IMD rain records (112mm rain) and coastal tide locks to prove climatic force majeure.',
      actionLabel: 'Go to Act 4: Next Rupee Allocation →'
    },
    {
      num: 4,
      role: 'officer',
      tab: 'next-rupee',
      title: 'Act 4: High-ROI Next Rupee Sanctioning',
      desc: 'Rather than wasteful repeat paving, BMC uses the Gates Foundation H-ROI model to fund a critical hospital ambulance route saving 12 lives/lakh.',
      actionLabel: 'Finish Walkthrough ✓'
    }
  ];

  const activeStepData = steps[currentStep - 1];

  const handleNextStep = () => {
    if (currentStep < 4) {
      const next = currentStep + 1;
      setTourStep(next);
      setActiveRole(steps[next - 1].role);
      setActiveTab(steps[next - 1].tab);
    } else {
      setTourStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setTourStep(prev);
      setActiveRole(steps[prev - 1].role);
      setActiveTab(steps[prev - 1].tab);
    }
  };

  return (
    <div className="bg-[#FFE600] border-b-4 border-black p-3.5 shadow-md sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-black text-[#FFE600] px-2 py-0.5 rounded font-mono font-black text-xs">
              INTERACTIVE STORY: STEP {currentStep} OF 4
            </span>
            <span className="nb-badge nb-badge-white text-black font-mono text-[10px] font-bold">
              {activeStepData.role.toUpperCase()} PERSPECTIVE
            </span>
            <span className="font-black text-sm text-black">
              {activeStepData.title}
            </span>
          </div>
          <p className="text-xs font-bold text-gray-900 max-w-3xl">
            {activeStepData.desc}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="nb-btn nb-btn-white text-xs py-1.5 px-3 font-mono font-bold"
            >
              ← Prev
            </button>
          )}

          <button
            onClick={handleNextStep}
            className="nb-btn nb-btn-black text-xs py-1.5 px-4 font-mono font-bold flex items-center gap-1.5 bg-black text-[#FFE600] border-black"
          >
            <span>{activeStepData.actionLabel}</span>
          </button>

          <button
            onClick={() => setTourStep(0)}
            title="Exit Walkthrough"
            className="w-7 h-7 bg-white border-2 border-black rounded flex items-center justify-center font-bold text-xs hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
