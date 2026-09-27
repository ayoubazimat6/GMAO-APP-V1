import React from 'react';
import { useCMMS } from '../context/CMMSContext';
import {
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  HelpCircle,
  BarChart3,
  Layers,
} from 'lucide-react';

export const ReliabilityView: React.FC = () => {
  const { kpis, t, lang } = useCMMS();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.nav.reliability}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Reliability Engineering (RCM), Plant Availability Metrics & KPI Formulations
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-300">
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <span>Section 43 Rule: Strict Mathematical Definitions · No Invented Values</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-sky-400">{kpi.code}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  kpi.status === 'GOOD'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                TARGET: {kpi.target} {kpi.unit}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold text-sm text-slate-100">{lang === 'fr' ? kpi.name_fr : kpi.name_en}</h3>
              <div className="font-mono text-2xl font-bold text-slate-100">
                {kpi.value} <span className="text-sm font-normal text-slate-400">{kpi.unit}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {lang === 'fr' ? kpi.definition_fr : kpi.definition_en}
            </p>

            <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80 space-y-1 text-[11px] font-mono">
              <div className="text-sky-300 truncate">
                <span className="text-slate-500">Formula:</span> {kpi.formula}
              </div>
              <div className="text-slate-400 truncate">
                <span className="text-slate-500">Source:</span> {kpi.dataSource}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RCM (Reliability-Centered Maintenance) Table Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-semibold text-sm text-slate-100">RCM Analysis Matrix (Section 71)</h3>
            <p className="text-xs text-slate-400">Functions, Functional Failures, Failure Modes & Maintenance Interval Justifications</p>
          </div>
          <span className="text-xs font-mono text-sky-400">ISO 55000 / SAE JA1011</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Equipment</th>
                <th className="py-2.5 px-3">System Function</th>
                <th className="py-2.5 px-3">Functional Failure</th>
                <th className="py-2.5 px-3">Failure Mode</th>
                <th className="py-2.5 px-3">Maintenance Task</th>
                <th className="py-2.5 px-3">Interval Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-sky-400">G-BC-41</td>
                <td className="py-3 px-3 font-sans text-slate-200">Continuous feed of 350 t/h granulated TSP to screening deck</td>
                <td className="py-3 px-3 font-sans text-rose-300">Failure to convey / belt slip / drive stall</td>
                <td className="py-3 px-3 font-sans text-amber-300">Drive pulley bearing seizure or belt tear</td>
                <td className="py-3 px-3 font-sans text-slate-200">PM-MOT-001 & PM-CV-001</td>
                <td className="py-3 px-3 font-sans text-emerald-400">Weekly inspection covers bearing degradation prior to thermal trip</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-sky-400">G-SC-12</td>
                <td className="py-3 px-3 font-sans text-slate-200">Classify product between 2.0mm and 4.75mm granule sizes</td>
                <td className="py-3 px-3 font-sans text-rose-300">Off-spec size distribution / screen deck blinding</td>
                <td className="py-3 px-3 font-sans text-amber-300">Polyurethane panel wear or spring nest collapse</td>
                <td className="py-3 px-3 font-sans text-slate-200">PM-SCR-001 (Wednesday Shutdown)</td>
                <td className="py-3 px-3 font-sans text-emerald-400">Aligned with 8h Wednesday outage to prevent plant stoppage</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-sky-400">G-WS-02</td>
                <td className="py-3 px-3 font-sans text-slate-200">Accurate mass flow telemetry for granulation recycle loop (±0.25%)</td>
                <td className="py-3 px-3 font-sans text-rose-300">Mass flow measurement drift &gt; 0.5% causing recipe unbalance</td>
                <td className="py-3 px-3 font-sans text-amber-300">Load cell bridge zero shift or mechanical dust binding</td>
                <td className="py-3 px-3 font-sans text-slate-200">PM-WGH-001 Calibration</td>
                <td className="py-3 px-3 font-sans text-emerald-400">Monthly traceable standard weight verification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
