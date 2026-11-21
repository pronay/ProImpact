import React from 'react';
import { User, Shield, HardHat, Sparkles } from 'lucide-react';

export default function RolePortalSwitcher({ activeRole, setActiveRole }) {
  const roles = [
    {
      id: 'citizen',
      label: 'Citizen & Public',
      icon: User,
      badge: 'Public View',
      activeClass: 'bg-white text-slate-900 shadow-sm border border-slate-200/80',
      dotColor: 'bg-emerald-500'
    },
    {
      id: 'officer',
      label: 'Ward Officer (BMC)',
      icon: Shield,
      badge: 'Admin Console',
      activeClass: 'bg-white text-slate-900 shadow-sm border border-slate-200/80',
      dotColor: 'bg-sky-500'
    },
    {
      id: 'contractor',
      label: 'Empanelled Agency',
      icon: HardHat,
      badge: 'Extranet',
      activeClass: 'bg-white text-slate-900 shadow-sm border border-slate-200/80',
      dotColor: 'bg-amber-500'
    }
  ];

  return (
    <div className="bg-slate-950/75 backdrop-blur-2xl text-white py-1.5 px-4 text-xs border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-semibold text-[11px] tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Perspective:
          </span>

          {/* Apple Segmented Control Liquid Pill Container */}
          <div className="flex items-center bg-white/10 backdrop-blur-xl p-0.5 rounded-xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/95 text-slate-950 shadow-md border border-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${r.dotColor} ${isActive ? 'opacity-100 ring-2 ring-slate-900/30' : 'opacity-40'}`}></span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Context Banner based on Role */}
        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
          {activeRole === 'citizen' && (
            <span className="text-emerald-300 flex items-center gap-1.5">
              <span>🔒 Citizen PII Anonymized</span>
              <span className="text-slate-500">•</span>
              <span>Public Civic Transparency Active</span>
            </span>
          )}
          {activeRole === 'officer' && (
            <span className="text-sky-300 flex items-center gap-1.5">
              <span>⚖️ Municipal Escalation Console</span>
              <span className="text-slate-500">•</span>
              <span>L1 JE → L2 Asst. Commissioner → L3 Central Vigilance</span>
            </span>
          )}
          {activeRole === 'contractor' && (
            <span className="text-amber-300 flex items-center gap-1.5">
              <span>📋 Empanelled Right-of-Response</span>
              <span className="text-slate-500">•</span>
              <span>IMD Weather Deluge Counter-Evidence Sync</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
