import React, { useState } from 'react';
import { useCMMS } from '../../context/CMMSContext';
import { CorrectiveMaintenance } from '../../types/cmms';
import { AlertTriangle, Plus, ShieldAlert } from 'lucide-react';

interface ReportAnomalyModalProps {
  onClose: () => void;
  preselectedTag?: string;
}

export const ReportAnomalyModal: React.FC<ReportAnomalyModalProps> = ({
  onClose,
  preselectedTag,
}) => {
  const { assets, addCorrectiveCase } = useCMMS();

  const [officialTag, setOfficialTag] = useState<string>(preselectedTag || 'G-BC-41');
  const [description, setDescription] = useState<string>('');
  const [symptom, setSymptom] = useState<string>('High Vibration');
  const [failureCategory, setFailureCategory] = useState<CorrectiveMaintenance['failure_category']>('Mechanical');
  const [productionImpact, setProductionImpact] = useState<CorrectiveMaintenance['production_impact']>('REDUCED_RATE');
  const [safetyImpact, setSafetyImpact] = useState<boolean>(false);
  const [reporterName, setReporterName] = useState<string>('Field Operator');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const matchedAsset = assets.find((a) => a.official_tag === officialTag);
    const cmId = `cm-2026-${Date.now().toString().slice(-6)}`;
    const woNum = `WO-2026-${Date.now().toString().slice(-6)}`;

    const newCase: CorrectiveMaintenance = {
      cm_id: cmId,
      wo_number: woNum,
      asset_id: matchedAsset ? matchedAsset.asset_id : 'asset-generic',
      official_tag: officialTag,
      area_id: matchedAsset ? matchedAsset.area_id : 'area-g',
      failure_date: new Date().toISOString().substring(0, 10),
      failure_time: new Date().toTimeString().substring(0, 5),
      problem_description_en: description,
      problem_description_fr: description,
      failure_symptom: symptom,
      failure_mode: symptom,
      failure_cause: 'Pending Engineering Diagnosis',
      failure_category: failureCategory,
      diagnosis: 'Initial field observation logged. Awaiting technician triage and root cause investigation.',
      corrective_action: 'Triage in progress.',
      downtime_hours: productionImpact === 'CRITICAL_STOP' ? 4 : 0,
      production_impact: productionImpact,
      safety_impact: safetyImpact,
      root_cause_status: 'NOT_YET_IDENTIFIED',
      five_why: [
        '1. Why did the equipment malfunction? -> Under Investigation',
        '2. Why? -> TBD',
        '3. Why? -> TBD',
        '4. Why? -> TBD',
        '5. Why? -> TBD',
      ],
      technician: reporterName,
      status: 'REPORTED',
    };

    addCorrectiveCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base text-slate-100">Log Equipment Failure / Anomaly</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Equipment Official Tag</label>
            <select
              value={officialTag}
              onChange={(e) => setOfficialTag(e.target.value)}
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
              <label className="block text-slate-400 mb-1">Observed Symptom</label>
              <select
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              >
                <option value="High Vibration">High Vibration / Excessive Oscillation</option>
                <option value="Overheating">Overheating / High Bearing Temp</option>
                <option value="Abnormal Noise">Abnormal Noise / Chattering</option>
                <option value="Leakage">Liquid / Slurry / Oil Leakage</option>
                <option value="No Start">Motor Trip / Will Not Start</option>
                <option value="Belt Misalignment">Belt Tracking Misalignment</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Failure Category</label>
              <select
                value={failureCategory}
                onChange={(e) =>
                  setFailureCategory(e.target.value as CorrectiveMaintenance['failure_category'])
                }
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              >
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Instrumentation">Instrumentation</option>
                <option value="Automation">Automation</option>
                <option value="Lubrication">Lubrication</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Problem Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State clear operational facts (e.g. bearing temp reached 82°C, smell of burning rubber)..."
              className="w-full h-20 bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Production Impact</label>
              <select
                value={productionImpact}
                onChange={(e) =>
                  setProductionImpact(e.target.value as CorrectiveMaintenance['production_impact'])
                }
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              >
                <option value="CRITICAL_STOP">CRITICAL STOP (Plant Line Down)</option>
                <option value="REDUCED_RATE">REDUCED RATE</option>
                <option value="NO_IMPACT">NO IMMEDIATE PRODUCTION IMPACT</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Reporter Name & Role</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="safetyCheck"
              checked={safetyImpact}
              onChange={(e) => setSafetyImpact(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800"
            />
            <label htmlFor="safetyCheck" className="text-slate-300 font-medium">
              Immediate Safety Hazard / LOTO Required
            </label>
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
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium"
            >
              Log Incident & Initiate Triage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
