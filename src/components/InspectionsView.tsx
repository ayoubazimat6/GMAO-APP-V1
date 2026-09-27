import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { Inspection, InspectionChecklistItem } from '../types/cmms';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const InspectionsView: React.FC = () => {
  const {
    inspections,
    t,
    lang,
    updateInspectionChecklist,
    convertNokToWorkOrder,
  } = useCMMS();

  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(
    inspections.length > 0 ? inspections[0].inspection_id : ''
  );
  const [convertedNotice, setConvertedNotice] = useState<string | null>(null);

  const activeInspection = inspections.find((i) => i.inspection_id === selectedInspectionId) || inspections[0];

  const handleConvertNok = (itemId: string) => {
    if (!activeInspection) return;
    const woNum = convertNokToWorkOrder(activeInspection.inspection_id, itemId);
    setConvertedNotice(`Anomalie convertie avec succès en Ordre de Travail Correctif : ${woNum}`);
    setTimeout(() => setConvertedNotice(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.inspections.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.inspections.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Rule: Inspection ≠ Work Order · NOK automatically escalates</span>
        </div>
      </div>

      {convertedNotice && (
        <div className="p-3 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{convertedNotice}</span>
          </div>
          <button onClick={() => setConvertedNotice(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Grid: Left Inspections List + Right Checklist & NOK Escalation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
              Inspection Routines ({inspections.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Field Checklists</span>
          </div>

          <div className="space-y-2">
            {inspections.map((ins) => {
              const isSelected = activeInspection?.inspection_id === ins.inspection_id;
              const nokCount = ins.checklist.filter((c) => c.result === 'NOK').length;
              return (
                <div
                  key={ins.inspection_id}
                  onClick={() => setSelectedInspectionId(ins.inspection_id)}
                  className={`p-3 rounded border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 text-slate-100 shadow'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sky-400">{ins.official_tag}</span>
                    <span className="text-[10px] text-slate-400">{ins.date}</span>
                  </div>
                  <div className="font-medium text-slate-200 line-clamp-1">
                    {lang === 'fr' ? ins.title_fr : ins.title_en}
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 font-sans">{ins.inspector_name}</span>
                    {nokCount > 0 ? (
                      <span className="text-rose-400 font-bold font-mono bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-900">
                        {nokCount} NOK Finding(s)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold font-mono">ALL OK</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Checklist & Findings Execution */}
        {activeInspection && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base font-bold text-sky-400">{activeInspection.official_tag}</span>
                    <span className="text-slate-400 font-mono">· {activeInspection.inspection_id}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {lang === 'fr' ? activeInspection.title_fr : activeInspection.title_en}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Inspector</span>
                  <span className="text-xs font-semibold text-slate-200">{activeInspection.inspector_name}</span>
                </div>
              </div>

              {/* Checklist Items Table */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-mono font-semibold text-slate-400 block">
                  Standard Inspection Points (OK / NOK / N/A Discipline):
                </span>

                <div className="space-y-2">
                  {activeInspection.checklist.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded border text-xs space-y-2 transition ${
                        item.result === 'NOK'
                          ? 'bg-rose-950/20 border-rose-800/80'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-200 font-medium font-sans">
                          {idx + 1}. {lang === 'fr' ? item.item_fr : item.item_en}
                        </span>

                        {/* Interactive OK / NOK / N/A segmented toggle */}
                        <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800 text-[11px] font-mono shrink-0">
                          <button
                            onClick={() => updateInspectionChecklist(activeInspection.inspection_id, item.id, 'OK')}
                            className={`px-2 py-1 rounded transition font-bold ${
                              item.result === 'OK'
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            OK
                          </button>
                          <button
                            onClick={() => updateInspectionChecklist(activeInspection.inspection_id, item.id, 'NOK')}
                            className={`px-2 py-1 rounded transition font-bold ${
                              item.result === 'NOK'
                                ? 'bg-rose-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            NOK
                          </button>
                          <button
                            onClick={() => updateInspectionChecklist(activeInspection.inspection_id, item.id, 'N/A')}
                            className={`px-2 py-1 rounded transition font-bold ${
                              item.result === 'N/A'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            N/A
                          </button>
                        </div>
                      </div>

                      {/* NOK Observation & Action Escalation Banner */}
                      {item.result === 'NOK' && (
                        <div className="pt-2 border-t border-rose-900/60 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-rose-400 font-semibold block">Observation:</span>
                              <span className="text-slate-300 font-sans">{item.observation}</span>
                            </div>
                            <div>
                              <span className="text-amber-400 font-semibold block">Recommendation:</span>
                              <span className="text-slate-300 font-sans">{item.recommendation}</span>
                            </div>
                          </div>

                          {/* Conversion Button */}
                          <div className="flex items-center justify-between pt-1">
                            {item.action_created ? (
                              <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Escalated to Corrective WO: {item.converted_wo_number}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleConvertNok(item.id)}
                                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] transition flex items-center gap-1 shadow-sm"
                              >
                                <span>Convert NOK to Corrective Work Order</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
