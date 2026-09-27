import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { ConditionMeasurement } from '../types/cmms';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Plus,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export const ConditionMonitoringView: React.FC = () => {
  const { conditionMeasurements, t, addConditionReading } = useCMMS();
  const [selectedId, setSelectedId] = useState<string>(
    conditionMeasurements.length > 0 ? conditionMeasurements[0].id : ''
  );
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [newReadingVal, setNewReadingVal] = useState<number>(3.5);

  const selectedMeasurement =
    conditionMeasurements.find((m) => m.id === selectedId) || conditionMeasurements[0];

  const handleLogReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeasurement) return;
    addConditionReading(selectedMeasurement.id, Number(newReadingVal));
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.condition.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.condition.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-slate-300">
            Read-Only Telemetry (OPC UA / Gateway compliant)
          </span>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Telemetry Reading</span>
          </button>
        </div>
      </div>

      {/* Grid: Measurement Points + Detailed Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Measurement Points List */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
              Telemetry Channels ({conditionMeasurements.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">ISO 10816 / VDI</span>
          </div>

          <div className="space-y-2">
            {conditionMeasurements.map((cm) => {
              const isSelected = selectedMeasurement?.id === cm.id;
              return (
                <div
                  key={cm.id}
                  onClick={() => setSelectedId(cm.id)}
                  className={`p-3 rounded border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 text-slate-100 shadow'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sky-400">{cm.official_tag}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        cm.status === 'NORMAL'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : cm.status === 'WARNING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {cm.status}
                    </span>
                  </div>

                  <div className="text-slate-200 font-medium">{cm.parameter}</div>
                  <div className="text-[11px] text-slate-400 truncate">{cm.measurement_point}</div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-slate-500 text-[10px] font-mono">{cm.last_measured}</span>
                    <span className="font-mono text-sm font-bold text-slate-100">
                      {cm.current_value} {cm.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Channel Trend Graph & Thresholds */}
        {selectedMeasurement && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base font-bold text-sky-400">
                      {selectedMeasurement.official_tag}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-sm text-slate-200">{selectedMeasurement.parameter}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{selectedMeasurement.measurement_point}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Current Reading</span>
                  <span className="text-2xl font-bold font-mono text-slate-100">
                    {selectedMeasurement.current_value}{' '}
                    <span className="text-sm text-slate-400 font-normal">{selectedMeasurement.unit}</span>
                  </span>
                </div>
              </div>

              {/* Threshold Bars */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono">Warning Threshold</span>
                  <span className="font-mono font-bold text-amber-400">
                    ≥ {selectedMeasurement.warning_threshold} {selectedMeasurement.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Alarm Threshold</span>
                  <span className="font-mono font-bold text-orange-400">
                    ≥ {selectedMeasurement.alarm_threshold} {selectedMeasurement.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Critical Shutdown</span>
                  <span className="font-mono font-bold text-rose-400">
                    ≥ {selectedMeasurement.critical_threshold} {selectedMeasurement.unit}
                  </span>
                </div>
              </div>

              {/* Simplified Visual Trend Chart */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono font-semibold text-slate-400 block">
                  Historical Telemetry Trend (Last Readings):
                </span>

                <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                  <div className="h-40 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-800">
                    {selectedMeasurement.history.map((point, idx) => {
                      const maxVal = selectedMeasurement.critical_threshold * 1.2;
                      const heightPercent = Math.min(100, Math.round((point.value / maxVal) * 100));
                      const isHigh = point.value >= selectedMeasurement.warning_threshold;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[10px] font-mono text-slate-300 font-bold">{point.value}</span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[36px] rounded-t transition-all ${
                              isHigh ? 'bg-amber-500 shadow-sm' : 'bg-sky-500'
                            }`}
                          />
                          <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">
                            {point.timestamp.substring(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Baseline Normal Zone</span>
                    <span className="text-amber-400">Warning Zone (≥ {selectedMeasurement.warning_threshold})</span>
                    <span className="text-rose-400">Critical Zone (≥ {selectedMeasurement.critical_threshold})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-sm w-full p-5 text-slate-100 shadow-2xl">
            <h3 className="font-semibold text-base mb-3 text-sky-400 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Log Field Telemetry Reading
            </h3>
            <form onSubmit={handleLogReading} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Channel / Asset</label>
                <div className="font-mono text-slate-200 bg-slate-950 p-2 rounded border border-slate-800">
                  {selectedMeasurement?.official_tag} — {selectedMeasurement?.parameter}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  New Value ({selectedMeasurement?.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newReadingVal}
                  onChange={(e) => setNewReadingVal(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium"
                >
                  Record Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
