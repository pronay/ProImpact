import React from 'react';
import { Play, ArrowRight, User, Shield, HardHat, Compass, X, Sparkles } from 'lucide-react';

export default function GuidedStoryBanner({ currentStep, setTourStep, activeRole, setActiveRole, setActiveTab }) {
  if (currentStep === 0) {
    return (
      <div className="bg-gradient-to-r from-sky-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-md text-white py-2 px-4 border-b border-sky-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full font-semibold text-[10px] tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              GUIDED WALKTHROUGH
            </span>
            <span className="font-medium text-slate-200">
              New to RupeeTrace? Experience the complete 4-minute Mumbai road repair investigation:
            </span>
          </div>

          <button
            onClick={() => setTourStep(1)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-sm transition-all duration-150"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Start 4-Step Interactive Story</span>
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
      actionLabel: 'Advance to Act 2: Ward Officer Triage →'
    },
    {
      num: 2,
      role: 'officer',
      tab: 'officer-portal',
      title: 'Act 2: Ward Officer Vinod Audits & Penalizes',
      desc: 'Vinod (K/West Ward) receives Ramesh\'s relapse dispatch. He discovers the road was under a 2-year DLP warranty and withholds 20% milestone payment.',
      actionLabel: 'Advance to Act 3: Contractor Defense →'
    },
    {
      num: 3,
      role: 'contractor',
      tab: 'contractor-portal',
      title: 'Act 3: Contractor Rajesh Contests with Weather Data',
      desc: 'Rajesh (Eagle Infra) defends the delay by pulling official IMD rain records (112mm rain) and coastal tide locks to prove climatic force majeure.',
      actionLabel: 'Advance to Act 4: Next Rupee Allocation →'
    },
    {
      num: 4,
      role: 'officer',
      tab: 'next-rupee',
      title: 'Act 4: High-ROI Next Rupee Sanctioning',
      desc: 'Rather than wasteful repeat paving, BMC uses the Gates Foundation H-ROI model to fund a critical hospital ambulance route saving 12 lives/lakh.',
      actionLabel: 'Complete Story ✓'
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
    <div className="backdrop-blur-xl bg-sky-50/90 border-b border-sky-200/80 p-3.5 shadow-sm sticky top-[110px] z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Step Progress Indicators */}
            <div className="flex items-center gap-1.5 mr-1">
              {[1, 2, 3, 4].map(s => (
                <span
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${
                    s === currentStep
                      ? 'bg-sky-600 ring-4 ring-sky-200 w-4'
                      : s < currentStep
                      ? 'bg-sky-400'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <span className="bg-sky-600 text-white px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
              STEP {currentStep} OF 4
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
              {activeStepData.role.toUpperCase()} PERSPECTIVE
            </span>
            <span className="font-bold text-sm text-slate-900">
              {activeStepData.title}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium max-w-3xl">
            {activeStepData.desc}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              ← Prev
            </button>
          )}

          <button
            onClick={handleNextStep}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{activeStepData.actionLabel}</span>
          </button>

          <button
            onClick={() => setTourStep(0)}
            title="Exit Walkthrough"
            className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
