import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { CalibrationRecord } from '../types/cmms';
import {
  Gauge,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Calendar,
  Search,
  Plus,
  ShieldCheck,
} from 'lucide-react';

export const CalibrationView: React.FC = () => {
  const { calibrations, t, lang, addCalibrationRecord } = useCMMS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCal, setSelectedCal] = useState<CalibrationRecord | null>(
    calibrations.length > 0 ? calibrations[0] : null
  );

  const filteredCals = calibrations.filter((c) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        c.instrument_tag.toLowerCase().includes(q) ||
        c.certificate_number.toLowerCase().includes(q) ||
        c.reference_standard.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.calibration.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.calibration.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Metrology: Distinction between Verification, Calibration & Adjustment</span>
        </div>
      </div>

      {/* Grid: Calibration Records Register + Certificate Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
              Traceable Instruments ({calibrations.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">ISO 17025 Traceable</span>
          </div>

          <div className="space-y-2">
            {filteredCals.map((cal) => {
              const isSelected = selectedCal?.cal_id === cal.cal_id;
              const isDueSoon = new Date(cal.due_date).getTime() - new Date().getTime() < 14 * 86400000;
              return (
                <div
                  key={cal.cal_id}
                  onClick={() => setSelectedCal(cal)}
                  className={`p-3 rounded border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 text-slate-100 shadow'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sky-400">{cal.instrument_tag}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        cal.result === 'PASSED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {cal.result}
                    </span>
                  </div>

                  <div className="text-slate-300 font-mono text-[11px]">
                    Range: {cal.range_min} to {cal.range_max} {cal.unit}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                    <span>Due: {cal.due_date}</span>
                    <span className="text-slate-400 font-sans">{cal.technician.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details / Certificate Dossier */}
        {selectedCal && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base font-bold text-sky-400">{selectedCal.instrument_tag}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-xs text-slate-300">SN: {selectedCal.serial_number}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                      CERT: {selectedCal.certificate_number}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Calibration Dossier & Traceable Metrological Certificate
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Next Calibration Due</span>
                  <span className="text-sm font-bold font-mono text-amber-400">{selectedCal.due_date}</span>
                </div>
              </div>

              {/* As-Found vs As-Left Matrix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded p-4 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
                    As-Found State (Avant Réglage)
                  </span>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Measured Value:</span>
                    <span className="font-mono font-bold text-slate-100">
                      {selectedCal.as_found_value} {selectedCal.unit}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Calculated Error:</span>
                    <span className="font-mono font-bold text-amber-400">±{selectedCal.error_found}%</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded p-4 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                    As-Left State (Après Étalonnage / Réglage)
                  </span>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Calibrated Value:</span>
                    <span className="font-mono font-bold text-slate-100">
                      {selectedCal.as_left_value} {selectedCal.unit}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Residual Error:</span>
                    <span className="font-mono font-bold text-emerald-400">±{selectedCal.error_left}%</span>
                  </div>
                </div>
              </div>

              {/* Metrology Traceability Details */}
              <div className="bg-slate-950/60 p-4 rounded border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 uppercase font-mono text-[11px] block">
                  Metrology Standard & Traceability Chain:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Reference Standard Instrument:</span>
                    <span className="font-medium text-slate-200">{selectedCal.reference_standard}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">National Traceability Record:</span>
                    <span className="font-medium text-slate-200">{selectedCal.traceability}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Approved SOP Reference:</span>
                    <span className="font-medium text-slate-200 font-mono">{selectedCal.procedure_ref}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Acceptance Criteria:</span>
                    <span className="font-medium text-slate-200">{selectedCal.acceptance_criteria}</span>
                  </div>
                </div>
              </div>

              {/* Metrologist Sign-off */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span>Certified Metrologist: <strong className="text-slate-200 font-sans">{selectedCal.technician}</strong></span>
                <span>Cal Date: <strong className="text-slate-200 font-mono">{selectedCal.calibration_date}</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
