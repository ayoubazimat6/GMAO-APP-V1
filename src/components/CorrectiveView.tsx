import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { CorrectiveMaintenance } from '../types/cmms';
import {
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  GitBranch,
  Search,
  Plus,
} from 'lucide-react';

interface CorrectiveViewProps {
  onOpenReportModal: () => void;
}

export const CorrectiveView: React.FC<CorrectiveViewProps> = ({ onOpenReportModal }) => {
  const { correctiveCases, t, lang, updateCorrectiveCase } = useCMMS();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    correctiveCases.length > 0 ? correctiveCases[0].cm_id : ''
  );
  const [activeRCATab, setActiveRCATab] = useState<'5why' | 'ishikawa'>('5why');

  const selectedCase = correctiveCases.find((c) => c.cm_id === selectedCaseId) || correctiveCases[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.corrective.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.corrective.subtitle}</p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.corrective.newReport}</span>
        </button>
      </div>

      {/* Corrective Incidents Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Failure Incidents Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
              Active Corrective Incidents ({correctiveCases.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Isolated Workflow</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {correctiveCases.map((cm) => {
              const isSelected = selectedCase?.cm_id === cm.cm_id;
              return (
                <div
                  key={cm.cm_id}
                  onClick={() => setSelectedCaseId(cm.cm_id)}
                  className={`p-3 rounded border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 text-slate-100 shadow'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sky-400">{cm.official_tag}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {cm.failure_date}
                    </span>
                  </div>

                  <div className="font-medium text-slate-200 line-clamp-1">
                    {lang === 'fr' ? cm.problem_description_fr : cm.problem_description_en}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="text-rose-400 font-semibold">{cm.failure_mode}</span>
                    <span
                      className={`font-semibold ${
                        cm.root_cause_status === 'IDENTIFIED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      RCA: {cm.root_cause_status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Diagnosis & Root Cause Analysis (5-Why & Ishikawa) */}
        {selectedCase && (
          <div className="lg:col-span-2 space-y-5">
            {/* Case Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base font-bold text-sky-400">{selectedCase.official_tag}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-xs text-slate-300">{selectedCase.wo_number}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold uppercase">
                      {selectedCase.failure_category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {lang === 'fr' ? selectedCase.problem_description_fr : selectedCase.problem_description_en}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Downtime</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{selectedCase.downtime_hours} hrs</span>
                </div>
              </div>

              {/* Technical Failure Classification (Section 24) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono">Failure Symptom</span>
                  <span className="font-semibold text-slate-200">{selectedCase.failure_symptom}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Failure Mode</span>
                  <span className="font-semibold text-rose-400">{selectedCase.failure_mode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Identified Cause</span>
                  <span className="font-semibold text-slate-200">{selectedCase.failure_cause}</span>
                </div>
              </div>

              {/* Diagnosis & Immediate Action */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Engineering Diagnosis:</span>
                  <p className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300">
                    {selectedCase.diagnosis}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Executed Corrective Action:</span>
                  <p className="bg-slate-950 p-2.5 rounded border border-slate-800 text-emerald-300">
                    {selectedCase.corrective_action}
                  </p>
                </div>
              </div>
            </div>

            {/* Root Cause Analysis Module (5-Why & Ishikawa) */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-sm text-slate-100">{t.corrective.rootCauseTitle}</h3>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center bg-slate-950 rounded p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveRCATab('5why')}
                    className={`px-3 py-1 rounded transition font-medium ${
                      activeRCATab === '5why' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    5-Why Analysis
                  </button>
                  <button
                    onClick={() => setActiveRCATab('ishikawa')}
                    className={`px-3 py-1 rounded transition font-medium ${
                      activeRCATab === 'ishikawa' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ishikawa (6M)
                  </button>
                </div>
              </div>

              {/* 5-Why Methodology */}
              {activeRCATab === '5why' && selectedCase.five_why && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 mb-2">
                    Sequential root-cause deduction answering "Why" until the systemic failure mechanism is reached:
                  </div>
                  {selectedCase.five_why.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800 rounded p-3 text-xs flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                        W{idx + 1}
                      </span>
                      <span className="text-slate-200 leading-relaxed font-sans">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ishikawa / Fishbone 6M Methodology */}
              {activeRCATab === 'ishikawa' && selectedCase.ishikawa && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {Object.entries(selectedCase.ishikawa).map(([category, items]) => (
                    <div key={category} className="bg-slate-950/70 border border-slate-800 rounded p-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase font-mono block">
                        {category}
                      </span>
                      <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                        {items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Permanent Corrective Action Plan */}
              {selectedCase.permanent_corrective_action && (
                <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 space-y-1">
                  <span className="font-bold font-mono uppercase text-emerald-400 block">
                    Permanent Corrective / Preventive Action (CAPA):
                  </span>
                  <p>{selectedCase.permanent_corrective_action}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
