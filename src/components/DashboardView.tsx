import React from 'react';
import { useCMMS } from '../context/CMMSContext';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  Activity,
  Boxes,
  Wrench,
  AlertOctagon,
  ArrowRight,
  UserCheck,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    perspective,
    t,
    kpis,
    assets,
    workOrders,
    pmPlans,
    wednesdayTasks,
    correctiveCases,
    spareParts,
    setCurrentTab,
    setSelectedAssetForDetail,
    updateWorkOrderStatus,
  } = useCMMS();

  // Metrics
  const criticalAssets = assets.filter((a) => a.criticality_class === 'A');
  const openWOs = workOrders.filter((w) => w.status !== 'CLOSED' && w.status !== 'CANCELLED');
  const overduePMs = pmPlans.filter((p) => p.status === 'ACTIVE' && new Date(p.next_due_date) < new Date());
  const readyShutdownTasks = wednesdayTasks.filter((w) => w.execution_readiness === 'READY');
  const totalShutdownHours = wednesdayTasks.reduce((acc, curr) => acc + curr.duration_hours, 0);

  // Technician perspective specific: today's assigned tasks
  const todayTasks = workOrders.filter((w) => w.date === '2026-09-28' || w.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* Top Banner with Industrial Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              {perspective.toUpperCase()} VIEW
            </span>
            <span className="text-xs text-slate-400">
              TSP3 Plant · Granulation (G), Solubilization (S), Utilities (Q, U), Stabilizer (MT)
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight mt-1">
            {perspective === 'manager' && t.views.manager}
            {perspective === 'planner' && t.views.planner}
            {perspective === 'technician' && t.views.technician}
            {perspective === 'supervisor' && t.views.supervisor}
          </h1>
        </div>

        {/* Global Quick KPI summary */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Plant Availability</span>
            <span className="text-lg font-bold font-mono text-emerald-400">96.8%</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">PM Compliance</span>
            <span className="text-lg font-bold font-mono text-sky-400">94.2%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MANAGER PERSPECTIVE */}
      {/* ========================================================================= */}
      {perspective === 'manager' && (
        <>
          {/* Executive Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Critical Assets (A)</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-100">{criticalAssets.length}</span>
                <span className="text-xs text-slate-400">of {assets.length} monitored</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                <span>● 100% monitored under RCM</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Active Work Orders</span>
                <Wrench className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-100">{openWOs.length}</span>
                <span className="text-xs text-sky-400 font-mono">
                  {openWOs.filter((w) => w.type === 'PREVENTIVE').length} PM / {openWOs.filter((w) => w.type === 'CORRECTIVE').length} CM
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Backlog: <span className="font-mono text-slate-200">14.2 days</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Overdue PM</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-amber-400">{overduePMs.length}</span>
                <span className="text-xs text-slate-400 font-mono">Tolerance ±2d</span>
              </div>
              <div className="mt-2 text-[11px] text-amber-400">
                1 task pending parts arrival
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Wednesday Shutdown</span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-100">{readyShutdownTasks.length} / {wednesdayTasks.length}</span>
                <span className="text-xs font-mono text-slate-300">{totalShutdownHours}h load</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                <span>Capacity OK (8h window)</span>
              </div>
            </div>
          </div>

          {/* Plant Critical Assets Condition Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">Critical Equipment Condition Matrix (TSP3 Class A)</h3>
                <p className="text-xs text-slate-400">Primary bottleneck equipment across Granulation, Screening and Solubilization</p>
              </div>
              <button
                onClick={() => setCurrentTab('assets')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                View Full Register <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Official Tag</th>
                    <th className="py-2.5 px-4">Asset Description</th>
                    <th className="py-2.5 px-4">Area / Sub-Area</th>
                    <th className="py-2.5 px-4">Strategy</th>
                    <th className="py-2.5 px-4">Operating Status</th>
                    <th className="py-2.5 px-4">Criticality</th>
                    <th className="py-2.5 px-4 text-right">Passport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {criticalAssets.map((asset) => (
                    <tr key={asset.asset_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-sky-400">{asset.official_tag}</td>
                      <td className="py-3 px-4 font-sans text-slate-200">{asset.name_en}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {asset.area_id.replace('area-', '').toUpperCase()} · {asset.sub_area_id.replace('sub-', '').toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{asset.maintenance_strategy}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-sans font-medium ${
                            asset.operating_status === 'OPERATIONAL'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : asset.operating_status === 'DEGRADED'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {asset.operating_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900">
                          Class {asset.criticality_class} ({asset.criticality_score})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAssetForDetail(asset)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition"
                        >
                          Passport
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. PLANNER PERSPECTIVE */}
      {/* ========================================================================= */}
      {perspective === 'planner' && (
        <div className="space-y-6">
          {/* Capacity and Conflict Banner */}
          <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <CalendarCheck className="w-4 h-4" />
                <span>Week 40 Scheduling Horizon · Capacity Utilization: 88.5%</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Available crew capacity: 160h · Planned workload: 141.5h · Zero asset time conflict detected.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('planning')}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition"
              >
                Open Weekly Planner
              </button>
            </div>
          </div>

          {/* Wednesday 8-Hour Shutdown Preparation Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Upcoming Wednesday Shutdown Readiness (2026-09-30)
                </h3>
                <p className="text-xs text-slate-400">Total Planned Window: 8.0 Hours · Planned Workload: 16.0 Man-Hours</p>
              </div>
              <button
                onClick={() => setCurrentTab('planning')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Manage Window Tasks →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {wednesdayTasks.map((task) => (
                <div key={task.shutdown_id} className="bg-slate-950/60 border border-slate-800 rounded p-3 text-xs">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="font-bold text-sky-400">{task.official_tag}</span>
                    <span className="text-slate-400">{task.start_time} - {task.end_time} ({task.duration_hours}h)</span>
                  </div>
                  <p className="text-slate-200 line-clamp-2 mb-2 font-sans">{task.task_description_en}</p>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">{task.team}</span>
                    <span
                      className={`font-semibold ${
                        task.execution_readiness === 'READY' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {task.execution_readiness}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FIELD TECHNICIAN PERSPECTIVE (Mobile / Action-Oriented) */}
      {/* ========================================================================= */}
      {perspective === 'technician' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100">My Assigned Interventions (Today)</h2>
              <p className="text-xs text-slate-400">Field work list for active shift · Click to execute checklist & enter measurements</p>
            </div>
            <span className="font-mono text-xs text-sky-400 font-semibold px-2 py-1 rounded bg-sky-950 border border-sky-800">
              Shift: 07:00 - 15:00
            </span>
          </div>

          <div className="space-y-3">
            {todayTasks.map((wo) => (
              <div
                key={wo.wo_number}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-4 transition shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-sky-400">{wo.official_tag}</span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="font-mono text-xs text-slate-400">{wo.wo_number}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase font-mono ${
                          wo.priority === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm">{wo.description_en}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold shrink-0 ${
                      wo.status === 'IN_PROGRESS'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : wo.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {wo.status}
                  </span>
                </div>

                {/* Safety & Permit Checklist */}
                {wo.safety_permits && wo.safety_permits.length > 0 && (
                  <div className="bg-slate-950/60 rounded p-2.5 border border-slate-800/80 text-xs">
                    <span className="text-[11px] font-semibold text-amber-400 uppercase font-mono block mb-1">
                      Mandatory Safety Requirements:
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {wo.safety_permits.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Execution Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="text-slate-400">
                    Est. Duration: <span className="font-mono text-slate-200">{wo.duration_hours}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {wo.status !== 'IN_PROGRESS' && wo.status !== 'COMPLETED' && (
                      <button
                        onClick={() => updateWorkOrderStatus(wo.wo_number, 'IN_PROGRESS')}
                        className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition"
                      >
                        Start Task
                      </button>
                    )}
                    {wo.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateWorkOrderStatus(wo.wo_number, 'COMPLETED', 'Executed per SOP')}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete & Sign-Off
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentTab('workOrders')}
                      className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUPERVISOR PERSPECTIVE */}
      {/* ========================================================================= */}
      {perspective === 'supervisor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Electrical Team Workload</span>
              <span className="text-xl font-bold font-mono text-slate-100">22 / 24 hrs</span>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '91%' }} />
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Mechanical Conveyors Team</span>
              <span className="text-xl font-bold font-mono text-slate-100">28 / 32 hrs</span>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87.5%' }} />
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Screening & Vibrating Team</span>
              <span className="text-xl font-bold font-mono text-slate-100">18 / 24 hrs</span>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          {/* Corrective Queue Awaiting Supervisor Sign-off */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="font-semibold text-sm text-slate-100 mb-3">Corrective Interventions Awaiting Functional Verification</h3>
            <div className="space-y-2">
              {correctiveCases.map((cm) => (
                <div
                  key={cm.cm_id}
                  className="bg-slate-950/60 border border-slate-800 rounded p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sky-400 font-mono">{cm.official_tag}</span>
                      <span className="text-slate-400 font-mono">({cm.wo_number})</span>
                      <span className="text-rose-400 font-semibold">{cm.failure_mode}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{cm.problem_description_en}</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('corrective')}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    Review RCA & Sign Off
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
