import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { WorkOrder, WorkOrderStatus } from '../types/cmms';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  Calendar,
  Plus,
} from 'lucide-react';

interface WorkOrdersViewProps {
  onOpenNewWOModal: () => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({ onOpenNewWOModal }) => {
  const { workOrders, updateWorkOrderStatus, t, lang } = useCMMS();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [closureNotesInput, setClosureNotesInput] = useState<string>('');

  const filteredWOs = workOrders.filter((wo) => {
    if (statusFilter !== 'ALL' && wo.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && wo.type !== typeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNum = wo.wo_number.toLowerCase().includes(q);
      const matchTag = wo.official_tag.toLowerCase().includes(q);
      const matchDesc = (wo.description_en + wo.description_fr).toLowerCase().includes(q);
      return matchNum || matchTag || matchDesc;
    }
    return true;
  });

  const handleStatusChange = (woNumber: string, newStatus: WorkOrderStatus) => {
    updateWorkOrderStatus(woNumber, newStatus, closureNotesInput);
    if (selectedWO && selectedWO.wo_number === woNumber) {
      setSelectedWO({ ...selectedWO, status: newStatus, closure_notes: closureNotesInput });
    }
    setClosureNotesInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.nav.workOrders}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central Work Order Execution Lifecycle & Multi-Discipline Labor Sign-Off
          </p>
        </div>

        <button
          onClick={onOpenNewWOModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search WO #, official tag, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PLANNED">Planned</option>
            <option value="RELEASED">Released</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="PREVENTIVE">Preventive</option>
            <option value="CORRECTIVE">Corrective</option>
            <option value="SHUTDOWN">Shutdown</option>
            <option value="INSPECTION">Inspection</option>
            <option value="CALIBRATION">Calibration</option>
          </select>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Displaying <strong className="text-slate-100 font-mono">{filteredWOs.length}</strong> work orders
          </span>
          <span className="font-mono text-[11px]">Strict Workflow State Machine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-4">WO Number</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Equipment Tag</th>
                <th className="py-2.5 px-4">Task Description</th>
                <th className="py-2.5 px-4">Schedule Date</th>
                <th className="py-2.5 px-4">Crew / Tech</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredWOs.map((wo) => (
                <tr key={wo.wo_number} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-sky-400">{wo.wo_number}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700">
                      {wo.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-100">{wo.official_tag}</td>
                  <td className="py-3 px-4 font-sans text-slate-200 max-w-sm truncate">
                    {lang === 'fr' ? wo.description_fr : wo.description_en}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {wo.date} ({wo.duration_hours}h)
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    <div>{wo.team}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{wo.technician_name || 'TBD'}</div>
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedWO(wo)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected WO Drawer / Modal */}
      {selectedWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-sky-400">{selectedWO.wo_number}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono font-bold text-sm text-slate-200">{selectedWO.official_tag}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 uppercase font-mono font-bold">
                    {selectedWO.type}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-100">
                  {lang === 'fr' ? selectedWO.description_fr : selectedWO.description_en}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWO(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-mono">Date</span>
                <span className="font-semibold text-slate-200">{selectedWO.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Planned Hours</span>
                <span className="font-semibold text-slate-200">{selectedWO.duration_hours} h</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Priority</span>
                <span className="font-semibold text-rose-400">{selectedWO.priority}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Current Status</span>
                <span className="font-semibold text-sky-400">{selectedWO.status}</span>
              </div>
            </div>

            {/* Findings & Notes */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-400 font-semibold block">Execution Findings & Measurements:</label>
              <p className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300 font-sans">
                {selectedWO.findings || 'No abnormal findings reported yet. Standard inspection executed.'}
              </p>
            </div>

            {/* Lifecycle Progression Buttons */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <label className="text-xs text-slate-400 font-semibold block">
                Update Status / Sign-Off Record:
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedWO.status !== 'IN_PROGRESS' && selectedWO.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleStatusChange(selectedWO.wo_number, 'IN_PROGRESS')}
                    className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium"
                  >
                    Set IN PROGRESS
                  </button>
                )}
                {selectedWO.status !== 'COMPLETED' && selectedWO.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleStatusChange(selectedWO.wo_number, 'COMPLETED')}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    Mark COMPLETED
                  </button>
                )}
                {selectedWO.status !== 'VERIFIED' && selectedWO.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleStatusChange(selectedWO.wo_number, 'VERIFIED')}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                  >
                    Supervisor Verification
                  </button>
                )}
                {selectedWO.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleStatusChange(selectedWO.wo_number, 'CLOSED')}
                    className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white font-medium"
                  >
                    Formal Closeout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
