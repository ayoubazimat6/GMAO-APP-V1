import React, { useState } from 'react';
import { useCMMS } from '../../context/CMMSContext';
import { WorkOrder } from '../../types/cmms';
import { Wrench, Plus, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface NewWorkOrderModalProps {
  onClose: () => void;
}

export const NewWorkOrderModal: React.FC<NewWorkOrderModalProps> = ({ onClose }) => {
  const { assets, addWorkOrder } = useCMMS();

  const [selectedTag, setSelectedTag] = useState<string>('G-BC-41');
  const [type, setType] = useState<WorkOrder['type']>('PREVENTIVE');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('2026-09-30');
  const [duration, setDuration] = useState<number>(4);
  const [team, setTeam] = useState<string>('Mechanical Team 1 (Pumps & Rotating)');
  const [priority, setPriority] = useState<WorkOrder['priority']>('MEDIUM');
  const [shutdownRequired, setShutdownRequired] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const matchedAsset = assets.find((a) => a.official_tag === selectedTag);
    const newWoNumber = `WO-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newWO: WorkOrder = {
      wo_number: newWoNumber,
      type,
      asset_id: matchedAsset ? matchedAsset.asset_id : 'asset-generic',
      official_tag: selectedTag,
      area_id: matchedAsset ? matchedAsset.area_id : 'area-g',
      sub_area_id: matchedAsset?.sub_area_id,
      task_code: 'STD-TASK',
      description_en: description,
      description_fr: description,
      date,
      day_of_week: 'Wednesday',
      shift: 'Morning Shift',
      duration_hours: Number(duration),
      team,
      priority,
      status: 'PLANNED',
      shutdown_required: shutdownRequired,
      source_week: 'Week 40',
      safety_permits: ['Standard Industrial Safety Authorization'],
      created_at: new Date().toISOString(),
    };

    addWorkOrder(newWO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base text-slate-100">Create New Maintenance Work Order</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Equipment Official Tag</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
            >
              {assets.map((a) => (
                <option key={a.asset_id} value={a.official_tag}>
                  {a.official_tag} — {a.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Maintenance Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkOrder['type'])}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              >
                <option value="PREVENTIVE">PREVENTIVE</option>
                <option value="CORRECTIVE">CORRECTIVE</option>
                <option value="INSPECTION">INSPECTION</option>
                <option value="CALIBRATION">CALIBRATION</option>
                <option value="SHUTDOWN">SHUTDOWN</option>
                <option value="EMERGENCY">EMERGENCY</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkOrder['priority'])}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Work Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Structured task instructions (Inspect, Clean, Verify, Measure)..."
              className="w-full h-20 bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Duration (Hours)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Shutdown Required?</label>
              <select
                value={shutdownRequired ? 'yes' : 'no'}
                onChange={(e) => setShutdownRequired(e.target.value === 'yes')}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              >
                <option value="no">NO</option>
                <option value="yes">YES (Shutdown)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Assigned Maintenance Team</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
            >
              <option value="Mechanical Team 1 (Pumps & Rotating)">Mechanical Team 1 (Pumps & Rotating)</option>
              <option value="Mechanical Team 2 (Conveyors & Handling)">Mechanical Team 2 (Conveyors & Handling)</option>
              <option value="Mechanical Screening Team">Mechanical Screening Team</option>
              <option value="Electrical Team 1">Electrical Team 1</option>
              <option value="Instrumentation Team">Instrumentation Team</option>
              <option value="Automation Team">Automation Team</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium"
            >
              Schedule Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
