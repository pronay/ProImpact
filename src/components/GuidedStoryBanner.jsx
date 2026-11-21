import React from 'react';
import { Play, ArrowRight, User, Shield, HardHat, Compass, X, Sparkles } from 'lucide-react';

export default function GuidedStoryBanner({ currentStep, setTourStep, activeRole, setActiveRole, setActiveTab }) {
  if (currentStep === 0) {
    return (
      <div className="backdrop-blur-2xl bg-slate-950/80 border-b border-white/10 text-white py-2 px-4 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full font-semibold text-[10px] tracking-wide flex items-center gap-1 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <Sparkles className="w-3 h-3 text-sky-400" />
              GUIDED WALKTHROUGH
            </span>
            <span className="font-medium text-slate-200">
              New to ProTrace? Experience the complete 4-minute Mumbai road repair investigation:
            </span>
          </div>

          <button
            onClick={() => setTourStep(1)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-md transition-all duration-150 border border-white/20"
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
    <div className="backdrop-blur-3xl bg-slate-900/80 border-b border-white/10 p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.5)] sticky top-[115px] z-30 transition-all text-white">
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
                      ? 'bg-cyan-400 ring-4 ring-cyan-500/30 w-4 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : s < currentStep
                      ? 'bg-cyan-500/60'
                      : 'bg-white/15'
                  }`}
                />
              ))}
            </div>

            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
              STEP {currentStep} OF 4
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-slate-200 text-[10px] font-semibold">
              {activeStepData.role.toUpperCase()} PERSPECTIVE
            </span>
            <span className="font-bold text-sm text-white">
              {activeStepData.title}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium max-w-3xl">
            {activeStepData.desc}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-slate-200 hover:bg-white/20 transition-all shadow-sm"
            >
              ← Prev
            </button>
          )}

          <button
            onClick={handleNextStep}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-md flex items-center gap-1.5 border border-white/20"
          >
            <span>{activeStepData.actionLabel}</span>
          </button>

          <button
            onClick={() => setTourStep(0)}
            title="Exit Walkthrough"
            className="w-7 h-7 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
