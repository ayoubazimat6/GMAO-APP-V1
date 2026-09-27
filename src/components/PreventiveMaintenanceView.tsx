import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { TaskTemplate, JobPlan, PMPlan } from '../types/cmms';
import {
  CalendarCheck,
  FileText,
  ListOrdered,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const PreventiveMaintenanceView: React.FC = () => {
  const { taskTemplates, jobPlans, pmPlans, t, lang } = useCMMS();
  const [activeTab, setActiveTab] = useState<'plans' | 'library' | 'jobPlans'>('plans');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobPlanId, setSelectedJobPlanId] = useState<string>(
    jobPlans.length > 0 ? jobPlans[0].job_plan_id : ''
  );
  const [expandedTaskCode, setExpandedTaskCode] = useState<string | null>('PM-MOT-001');

  const selectedJobPlan = jobPlans.find((j) => j.job_plan_id === selectedJobPlanId) || jobPlans[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.nav.preventive}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintenance Strategies, Reusable Task Library, Job Plans & Preventive Scheduling Engine
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 rounded p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'plans' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Active PM Plans ({pmPlans.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'library' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Task Library ({taskTemplates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('jobPlans')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'jobPlans' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Job Plans ({jobPlans.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ACTIVE PM SCHEDULE PLANS */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Preventive maintenance frequencies and next due dates per asset
            </span>
            <span className="font-mono text-[11px]">Calendar & Tolerance Engine</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">PM Code</th>
                  <th className="py-2.5 px-4">Equipment Tag</th>
                  <th className="py-2.5 px-4">Task Template</th>
                  <th className="py-2.5 px-4">Frequency</th>
                  <th className="py-2.5 px-4">Next Due Date</th>
                  <th className="py-2.5 px-4">Tolerance</th>
                  <th className="py-2.5 px-4">Required Team</th>
                  <th className="py-2.5 px-4">Shutdown?</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {pmPlans.map((pm) => {
                  const isOverdue = new Date(pm.next_due_date) < new Date();
                  return (
                    <tr key={pm.pm_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-sky-400">{pm.pm_id}</td>
                      <td className="py-3 px-4 font-bold text-slate-100">{pm.official_tag}</td>
                      <td className="py-3 px-4 font-sans text-slate-200">{pm.task_template_id}</td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        {pm.frequency_value} {pm.frequency_unit.toLowerCase()} ({pm.calendar_rule})
                      </td>
                      <td className="py-3 px-4">
                        <span className={isOverdue ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                          {pm.next_due_date}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">±{pm.tolerance_days} days</td>
                      <td className="py-3 px-4 font-sans text-slate-300">{pm.required_team}</td>
                      <td className="py-3 px-4 font-sans">
                        {pm.shutdown_required ? (
                          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold font-mono">
                            YES
                          </span>
                        ) : (
                          <span className="text-slate-500">NO</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {pm.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REUSABLE TASK LIBRARY */}
      {/* ========================================================================= */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Standard Maintenance Task Definitions (Section 14 & 15). Descriptions are actionable and executable by field technicians.
          </div>

          <div className="space-y-3">
            {taskTemplates.map((task) => {
              const isExpanded = expandedTaskCode === task.task_code;
              return (
                <div
                  key={task.task_template_id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 transition"
                >
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedTaskCode(isExpanded ? null : task.task_code)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-sky-400">{task.task_code}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                          {task.discipline}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                          {task.equipment_class}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Rev {task.revision} ({task.procedure_reference})
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-100 text-sm">
                        {lang === 'fr' ? task.task_name_fr : task.task_name_en}
                      </h3>
                    </div>

                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Executable Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded border border-slate-800/80">
                    {lang === 'fr' ? task.description_fr : task.description_en}
                  </p>

                  {/* Expanded Task Details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                        <span className="font-bold text-slate-400 font-mono uppercase text-[10px] block">
                          Safety & LOTO
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                          {task.safety_requirements.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                        <span className="font-bold text-slate-400 font-mono uppercase text-[10px] block">
                          Special Tools
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                          {task.tools.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                        <span className="font-bold text-slate-400 font-mono uppercase text-[10px] block">
                          Acceptance Criteria
                        </span>
                        <p className="text-emerald-300 text-[11px] leading-tight">{task.acceptance_criteria}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DETAILED JOB PLANS (PROCEDURAL STEPS) */}
      {/* ========================================================================= */}
      {activeTab === 'jobPlans' && selectedJobPlan && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-base font-bold text-sky-400">{selectedJobPlan.task_code}</span>
                <span className="text-slate-400 font-mono">· {selectedJobPlan.job_plan_id}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                {lang === 'fr' ? selectedJobPlan.title_fr : selectedJobPlan.title_en}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{selectedJobPlan.steps.length} Sequenced Steps</span>
          </div>

          <div className="space-y-2">
            {selectedJobPlan.steps.map((step) => (
              <div
                key={step.step_number}
                className="bg-slate-950/70 border border-slate-800 rounded p-3 flex items-start gap-3 text-xs"
              >
                <span className="w-6 h-6 rounded bg-slate-800 text-sky-400 font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                  {step.step_number}
                </span>

                <div className="flex-1 space-y-1">
                  <p className="text-slate-200 font-sans font-medium">
                    {lang === 'fr' ? step.instruction_fr : step.instruction_en}
                  </p>

                  {step.safety_note && (
                    <div className="text-amber-400 text-[11px] font-mono flex items-center gap-1">
                      <span>⚠️ Safety: {step.safety_note}</span>
                    </div>
                  )}

                  {step.acceptance_criteria && (
                    <div className="text-emerald-400 text-[11px] font-mono">
                      Acceptance: {step.acceptance_criteria}
                    </div>
                  )}
                </div>

                <span className="font-mono text-slate-400 text-[11px] shrink-0">
                  {step.estimated_duration} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
