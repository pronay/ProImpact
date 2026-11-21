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
    <div className="bg-slate-900/95 backdrop-blur-md text-white py-1.5 px-4 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-semibold text-[11px] tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Perspective:
          </span>

          {/* Apple Segmented Control Pill Container */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 shadow-inner">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? r.activeClass
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${r.dotColor} ${isActive ? 'opacity-100 ring-2 ring-slate-200/40' : 'opacity-40'}`}></span>
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
