import React from 'react';
import { useCMMS } from '../context/CMMSContext';
import { ShieldCheck, Lock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const SafetyView: React.FC = () => {
  const { t } = useCMMS();

  const permits = [
    {
      id: 'LOTO-2026-093',
      type: 'LOTO / Electrical Isolation',
      asset_tag: 'G-SC-12',
      issuer: 'R. Kettani (Electrical Supervisor)',
      holder: 'A. Mansouri (Screening Lead)',
      valid_from: '2026-09-30 08:00',
      valid_to: '2026-09-30 16:00',
      status: 'APPROVED',
      points: ['Feeder Breaker Q01 Padlocked in MCC-05', 'Control Circuit Key Switch in Safe Pos', 'Zero Energy Test Verified with Fluke 179'],
    },
    {
      id: 'CS-2026-412',
      type: 'Confined Space Entry',
      asset_tag: 'G-DRY-01',
      issuer: 'H. Naciri (Mechanical Supervisor)',
      holder: 'Heavy Mechanical Crew',
      valid_from: '2026-09-30 10:00',
      valid_to: '2026-09-30 16:00',
      status: 'APPROVED',
      points: ['Atmospheric Gas Testing (O2 > 20.9%, CO < 5ppm)', 'Continuous Forced Ventilation', 'Standby Sentry Guard Assigned'],
    },
    {
      id: 'HW-2026-118',
      type: 'Hot Work / Welding Permit',
      asset_tag: 'G-BC-41',
      issuer: 'Safety Department TSP3',
      holder: 'M. Benjelloun',
      valid_from: '2026-09-28 13:00',
      valid_to: '2026-09-28 17:00',
      status: 'ACTIVE',
      points: ['2x 50kg Powder Fire Extinguishers on Site', 'Flammable Fertilizer Cake Cleared 15m Radius', 'Fire Watch for 2h Post Welding'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.nav.safety}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Lockout-Tagout (LOTO), Electrical / Mechanical Isolations & High-Risk Work Permits
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Industrial Safety Compliance: Zero Energy Verification Mandatory</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {permits.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-sky-400 text-sm">{p.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {p.status}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-100 block">{p.type}</span>
              <span className="text-xs text-amber-400 font-mono font-bold">Equipment: {p.asset_tag}</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded border border-slate-800/80 space-y-1.5 text-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase block font-semibold">
                Critical Safety Protocols:
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                {p.points.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>Holder: {p.holder.split(' ')[0]}</span>
              <span>Valid: {p.valid_to.substring(11)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
