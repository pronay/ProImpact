import React from 'react';
import { User, Shield, HardHat, AlertCircle, PhoneCall, Mail, FileCheck } from 'lucide-react';

export default function RolePortalSwitcher({ activeRole, setActiveRole }) {
  const roles = [
    {
      id: 'citizen',
      label: 'Public (Citizen)',
      icon: User,
      badge: 'Public View',
      color: 'bg-white text-black',
      activeColor: 'bg-[#FFE600] text-black border-black',
      desc: 'Scan Road Passports, inspect plain-language rupee trails, submit inquiries.'
    },
    {
      id: 'officer',
      label: 'Government (Ward Officer)',
      icon: Shield,
      badge: 'Admin / Audit',
      color: 'bg-white text-black',
      activeColor: 'bg-[#00F0FF] text-black border-black',
      desc: 'Audit flagged work orders, inspect contractor watchlist, trigger 3-tier escalation.'
    },
    {
      id: 'contractor',
      label: 'Private (Contractor)',
      icon: HardHat,
      badge: 'Right of Response',
      color: 'bg-white text-black',
      activeColor: 'bg-[#FF8800] text-white border-black',
      desc: 'View context-adjusted scorecards, submit weather/traffic delay counter-evidence.'
    }
  ];

  return (
    <div className="bg-[#121316] border-b-2 border-black py-2 px-4 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
            Accountability Perspective:
          </span>
          <div className="flex rounded-md border-2 border-black overflow-hidden bg-gray-800">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`px-3 py-1 flex items-center gap-1.5 font-bold transition-all ${
                    isActive ? r.activeColor : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Context Banner based on Role */}
        <div className="flex items-center gap-2 text-[11px] text-gray-300 font-bold">
          {activeRole === 'citizen' && (
            <span className="text-[#FFE600] flex items-center gap-1">
              👁️ Complainant PII anonymized • Public transparency standard active
            </span>
          )}
          {activeRole === 'officer' && (
            <span className="text-[#00F0FF] flex items-center gap-1">
              ⚖️ Municipal Escalation Ladder Active: L1 Ward JE → L2 Asst. Comm. → L3 Central Vigilance
            </span>
          )}
          {activeRole === 'contractor' && (
            <span className="text-[#FF8800] flex items-center gap-1">
              📋 Right-of-Response Enabled: Delay justifications linked to IMD rainfall logs
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
