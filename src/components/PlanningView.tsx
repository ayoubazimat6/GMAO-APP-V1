import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { WorkOrder, WednesdayShutdownTask, ReadinessStatus } from '../types/cmms';
import * as XLSX from 'xlsx';
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface PlanningViewProps {
  onOpenExcelImport: () => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({ onOpenExcelImport }) => {
  const {
    workOrders,
    wednesdayTasks,
    teams,
    t,
    lang,
    updateShutdownTaskReadiness,
    addShutdownTask,
    updateWorkOrderStatus,
  } = useCMMS();

  const [activeTab, setActiveTab] = useState<'weekly' | 'daily' | 'wednesday'>('weekly');
  const [selectedWeek, setSelectedWeek] = useState<string>('Week 40');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [showAddShutdownModal, setShowAddShutdownModal] = useState<boolean>(false);

  // New shutdown task form state
  const [newShutdownTag, setNewShutdownTag] = useState<string>('G-SC-12');
  const [newShutdownDesc, setNewShutdownDesc] = useState<string>('');
  const [newShutdownDuration, setNewShutdownDuration] = useState<number>(4);
  const [newShutdownTeam, setNewShutdownTeam] = useState<string>('Mechanical Screening Team');

  // Filter tasks for selected week
  const weekTasks = workOrders.filter((w) => w.source_week === selectedWeek);
  const dayTasks = weekTasks.filter((w) => w.day_of_week === selectedDay);

  // Capacity calculations for Week 40
  const totalWeeklyCapacityHours = teams.reduce((acc, team) => acc + team.daily_capacity_hours * 6, 0); // 6 working days
  const totalPlannedHours = weekTasks.reduce((acc, w) => acc + w.duration_hours, 0);
  const capacityUtilization = Math.round((totalPlannedHours / totalWeeklyCapacityHours) * 100);
  const isOverCapacity = capacityUtilization > 100;

  // Wednesday shutdown metrics
  const availableShutdownHours = 8.0;
  const plannedShutdownHours = wednesdayTasks.reduce((acc, t) => acc + t.duration_hours, 0);
  const isShutdownOverloaded = plannedShutdownHours > availableShutdownHours * 3; // 3 concurrent crews max

  // Excel Weekly Plan Export compliant with Section 20
  const exportWeeklyPlanExcel = () => {
    const dataToExport = weekTasks.map((w) => ({
      'Task ID / N° Tâche': w.wo_number,
      'Date / Date': w.date,
      'Day / Jour': w.day_of_week,
      'Planning Type / Type de planification': w.type,
      'Area / Zone': w.area_id.replace('area-', '').toUpperCase(),
      'Sub-area / Sous-zone': w.sub_area_id ? w.sub_area_id.replace('sub-', '').toUpperCase() : 'PS',
      'System / Système': 'G-CONV-01',
      'Asset / Équipement': w.official_tag,
      'Work Type / Type de travail': w.type,
      'Task Code / Code tâche': w.task_code,
      'Work Description / Description du travail': lang === 'fr' ? w.description_fr : w.description_en,
      'Shutdown Required / Arrêt requis': w.shutdown_required ? 'YES / OUI' : 'NO / NON',
      'Duration / Durée (h)': w.duration_hours,
      'Team / Équipe': w.team,
      'Technician / Technicien': w.technician_name || 'TBD',
      'Priority / Priorité': w.priority,
      'Status / Statut': w.status,
      'Source Week / Semaine source': w.source_week,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedWeek);

    XLSX.writeFile(workbook, `TSP3_Maintenance_Plan_${selectedWeek.replace(' ', '_')}.xlsx`);
  };

  const handleCreateShutdownTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShutdownDesc.trim()) return;

    const newTask: WednesdayShutdownTask = {
      shutdown_id: `sht-${Date.now()}`,
      date: '2026-09-30',
      start_time: '08:00',
      end_time: '14:00',
      duration_hours: Number(newShutdownDuration),
      area_id: 'area-g',
      asset_id: 'asset-' + newShutdownTag.toLowerCase(),
      official_tag: newShutdownTag,
      task_description_en: newShutdownDesc,
      task_description_fr: newShutdownDesc,
      team: newShutdownTeam,
      owner: 'Maintenance Planner',
      preparation_status: 'READY',
      permit_status: 'READY',
      isolation_status: 'READY',
      spare_status: 'READY',
      tool_status: 'READY',
      team_status: 'READY',
      execution_readiness: 'READY',
      status: 'PLANNED',
    };

    addShutdownTask(newTask);
    setNewShutdownDesc('');
    setShowAddShutdownModal(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.planning.weeklyPlan}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ISO Week Schedule & Wednesday 8-Hour Shutdown Window Management (TSP3 Jorf Lasfar)
          </p>
        </div>

        {/* Excel Import / Export Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExcelImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.common.importExcel}</span>
          </button>
          <button
            onClick={exportWeeklyPlanExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.common.exportExcel}</span>
          </button>
        </div>
      </div>

      {/* Capacity Utilization & Conflict Banner */}
      <div
        className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isOverCapacity
            ? 'bg-rose-950/40 border-rose-800 text-rose-200'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded flex items-center justify-center font-bold text-sm shrink-0 ${
              isOverCapacity ? 'bg-rose-600 text-white' : 'bg-sky-600 text-white'
            }`}
          >
            {capacityUtilization}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-100">
                Weekly Crew Capacity Analysis ({selectedWeek})
              </span>
              {isOverCapacity && (
                <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                  OVER CAPACITY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Planned Workload: <strong className="text-slate-200 font-mono">{totalPlannedHours}h</strong> · Available
              Capacity: <strong className="text-slate-200 font-mono">{totalWeeklyCapacityHours}h</strong> across 6 teams
            </p>
          </div>
        </div>

        {/* Week Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">{t.planning.weekSelector}:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value="Week 39">Week 39 (2026-W39)</option>
            <option value="Week 40">Week 40 (2026-W40) — Active</option>
            <option value="Week 41">Week 41 (2026-W41)</option>
            <option value="Week 42">Week 42 (2026-W42)</option>
          </select>
        </div>
      </div>

      {/* Sub Tabs: Weekly Schedule / Daily View / Wednesday Shutdown */}
      <div className="flex items-center border-b border-slate-800 gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === 'weekly'
              ? 'border-sky-400 text-sky-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.planning.weeklyPlan} ({weekTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === 'daily'
              ? 'border-sky-400 text-sky-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.planning.dailyPlan}
        </button>
        <button
          onClick={() => setActiveTab('wednesday')}
          className={`px-4 py-2 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'wednesday'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.planning.wednesdayShutdown}</span>
          <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-1.5 rounded-full font-mono">
            {wednesdayTasks.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. WEEKLY PLAN TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'weekly' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Official Schedule for <strong className="text-slate-100">{selectedWeek}</strong> (All disciplines)
            </span>
            <span className="font-mono text-[11px]">Format matching Excel Export columns</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">WO #</th>
                  <th className="py-2.5 px-3">Day & Date</th>
                  <th className="py-2.5 px-3">Official Tag</th>
                  <th className="py-2.5 px-3">Work Description</th>
                  <th className="py-2.5 px-3">Shutdown</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Team / Tech</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {weekTasks.map((wo) => (
                  <tr key={wo.wo_number} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-sky-400">{wo.wo_number}</td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-medium text-slate-200">{wo.day_of_week}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{wo.date}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-100">{wo.official_tag}</td>
                    <td className="py-3 px-3 font-sans text-slate-200 max-w-xs truncate">
                      {lang === 'fr' ? wo.description_fr : wo.description_en}
                    </td>
                    <td className="py-3 px-3">
                      {wo.shutdown_required ? (
                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold font-sans">
                          SHUTDOWN
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Normal</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-200">{wo.duration_hours}h</td>
                    <td className="py-3 px-3 font-sans text-slate-300">
                      <div>{wo.team}</div>
                      <div className="text-[11px] text-slate-400">{wo.technician_name || 'Unassigned'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          wo.priority === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : wo.priority === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium ${
                          wo.status === 'COMPLETED' || wo.status === 'CLOSED'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : wo.status === 'IN_PROGRESS'
                            ? 'bg-sky-950/80 text-sky-400 border border-sky-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {wo.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {wo.status !== 'COMPLETED' && wo.status !== 'CLOSED' && (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.wo_number, 'COMPLETED')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition"
                        >
                          Sign-Off
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DAILY VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-xs">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded font-medium transition ${
                  selectedDay === d ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayTasks.map((t) => (
              <div key={t.wo_number} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-sky-400">{t.official_tag}</span>
                  <span className="text-slate-400">{t.duration_hours}h · {t.shift}</span>
                </div>
                <h3 className="font-semibold text-slate-100 text-sm">{lang === 'fr' ? t.description_fr : t.description_en}</h3>
                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Team: <strong className="text-slate-300 font-sans">{t.team}</strong></span>
                  <span className="font-mono text-emerald-400 font-medium">{t.status}</span>
                </div>
              </div>
            ))}
            {dayTasks.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
                No planned tasks scheduled for {selectedDay}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEDNESDAY SHUTDOWN WINDOW MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'wednesday' && (
        <div className="space-y-5">
          {/* Shutdown Window Capacity Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-100">Wednesday Shutdown Planning Window</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Fixed 8.0h Window (08:00 - 16:00)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Synchronized plant shutdown for critical screen media replacement, burner inspections, and dynamic weigher calibrations.
              </p>
            </div>

            <button
              onClick={() => setShowAddShutdownModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-sm transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shutdown Task</span>
            </button>
          </div>

          {/* Shutdown Readiness Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-800 text-xs font-semibold text-slate-200">
              Pre-Shutdown Readiness Checklist (Section 22 Governance)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Equipment</th>
                    <th className="py-2.5 px-3">Task Description</th>
                    <th className="py-2.5 px-3">Permit</th>
                    <th className="py-2.5 px-3">Isolation</th>
                    <th className="py-2.5 px-3">Spares</th>
                    <th className="py-2.5 px-3">Tools</th>
                    <th className="py-2.5 px-3">Readiness</th>
                    <th className="py-2.5 px-3">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {wednesdayTasks.map((t) => (
                    <tr key={t.shutdown_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold text-sky-400">{t.official_tag}</td>
                      <td className="py-3 px-3 font-sans text-slate-200 max-w-xs truncate">
                        {t.task_description_en}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={t.permit_status}
                          onChange={(e) =>
                            updateShutdownTaskReadiness(t.shutdown_id, 'permit_status', e.target.value as ReadinessStatus)
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="READY">READY</option>
                          <option value="WAITING_FOR_PERMIT">WAITING</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={t.isolation_status}
                          onChange={(e) =>
                            updateShutdownTaskReadiness(t.shutdown_id, 'isolation_status', e.target.value as ReadinessStatus)
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="READY">READY</option>
                          <option value="WAITING_FOR_ISOLATION">WAITING</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={t.spare_status}
                          onChange={(e) =>
                            updateShutdownTaskReadiness(t.shutdown_id, 'spare_status', e.target.value as ReadinessStatus)
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="READY">READY</option>
                          <option value="WAITING_FOR_PART">WAITING_PART</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={t.tool_status}
                          onChange={(e) =>
                            updateShutdownTaskReadiness(t.shutdown_id, 'tool_status', e.target.value as ReadinessStatus)
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="READY">READY</option>
                          <option value="NOT_READY">NOT_READY</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-sans font-bold ${
                            t.execution_readiness === 'READY'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {t.execution_readiness}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{t.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Shutdown Task Modal */}
      {showAddShutdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-5 text-slate-100 shadow-2xl">
            <h3 className="font-semibold text-base mb-3 text-amber-400 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Wednesday Shutdown Task
            </h3>
            <form onSubmit={handleCreateShutdownTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Equipment Official Tag</label>
                <input
                  type="text"
                  value={newShutdownTag}
                  onChange={(e) => setNewShutdownTag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Task Work Description</label>
                <textarea
                  value={newShutdownDesc}
                  onChange={(e) => setNewShutdownDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 h-20"
                  placeholder="Describe procedure, parts and isolation needed..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newShutdownDuration}
                    onChange={(e) => setNewShutdownDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Team</label>
                  <select
                    value={newShutdownTeam}
                    onChange={(e) => setNewShutdownTeam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    <option value="Mechanical Screening Team">Mechanical Screening Team</option>
                    <option value="Mechanical Team 1 (Pumps)">Mechanical Team 1 (Pumps)</option>
                    <option value="Electrical Team 1">Electrical Team 1</option>
                    <option value="Instrumentation Team">Instrumentation Team</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddShutdownModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium"
                >
                  Allocate to Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
