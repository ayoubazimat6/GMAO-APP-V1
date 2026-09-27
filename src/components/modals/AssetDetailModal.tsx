import React, { useState } from 'react';
import { useCMMS } from '../../context/CMMSContext';
import { PlantAsset } from '../../types/cmms';
import {
  FileText,
  Clock,
  Wrench,
  Activity,
  QrCode,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: PlantAsset;
  onClose: () => void;
  onReportAnomaly: (tag: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onReportAnomaly,
}) => {
  const { workOrders, pmPlans, conditionMeasurements, lang, t } = useCMMS();
  const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'pm' | 'telemetry' | 'qr'>('specs');

  // Related data
  const assetWOs = workOrders.filter((w) => w.official_tag === asset.official_tag);
  const assetPMs = pmPlans.filter((p) => p.official_tag === asset.official_tag);
  const assetMeasurements = conditionMeasurements.filter((m) => m.official_tag === asset.official_tag);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-3xl w-full p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-sky-400">{asset.official_tag}</span>
              <span className="text-slate-500">·</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                  asset.criticality_class === 'A'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                Criticality Class {asset.criticality_class}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                {asset.verification_status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              {lang === 'fr' ? asset.name_fr : asset.name_en}
            </h2>
            <p className="text-xs text-slate-400 font-mono">Location: {asset.functional_location}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReportAnomaly(asset.official_tag)}
              className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Anomaly</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 text-base">
              ✕
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center border-b border-slate-800 text-xs font-medium gap-2">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.assets.specifications}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'history'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.assets.historyTab} ({assetWOs.length})
          </button>
          <button
            onClick={() => setActiveTab('pm')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'pm'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.assets.activePMTab} ({assetPMs.length})
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'telemetry'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.assets.measurementsTab} ({assetMeasurements.length})
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-2 border-b-2 transition flex items-center gap-1 ${
              activeTab === 'qr'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.assets.scanQr}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. TECHNICAL SPECIFICATIONS & DRAWINGS */}
        {/* ========================================================================= */}
        {activeTab === 'specs' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Manufacturer</span>
                <span className="font-bold text-slate-200">{asset.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Model</span>
                <span className="font-bold text-slate-200">{asset.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Serial Number</span>
                <span className="font-bold text-slate-200">{asset.serial_number}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Strategy</span>
                <span className="font-bold text-emerald-400">{asset.maintenance_strategy}</span>
              </div>
            </div>

            {/* Document References */}
            <div className="bg-slate-950/60 p-3 rounded border border-slate-800 space-y-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                Engineering Drawings & Source Traceability (Section 57):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                <div>• P&ID Reference: <strong className="text-sky-300">{asset.pid_reference}</strong></div>
                <div>• Mechanical Drawing: <strong className="text-sky-300">{asset.drawing_reference}</strong></div>
                <div>• Electrical Schematic: <strong className="text-sky-300">{asset.electrical_drawing_reference}</strong></div>
                <div>• Source Asset Register: <strong className="text-slate-200">{asset.source_document} (Rev {asset.source_revision})</strong></div>
              </div>
            </div>

            {/* Components & Sub-Devices */}
            {asset.components && asset.components.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                  Maintainable Component Hierarchy:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {asset.components.map((comp) => (
                    <div
                      key={comp.component_id}
                      className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{comp.name_en}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{comp.component_class} · {comp.discipline}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                        {comp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MAINTENANCE HISTORY */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-2 text-xs">
            {assetWOs.length === 0 ? (
              <p className="text-slate-400 py-6 text-center">No recorded maintenance history for this asset.</p>
            ) : (
              assetWOs.map((wo) => (
                <div key={wo.wo_number} className="p-3 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sky-400">{wo.wo_number}</span>
                    <span className="text-slate-400">{wo.date}</span>
                  </div>
                  <p className="text-slate-200 font-sans">{lang === 'fr' ? wo.description_fr : wo.description_en}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{wo.team} · {wo.duration_hours}h</span>
                    <span className="font-mono text-emerald-400">{wo.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ACTIVE PM PLANS */}
        {/* ========================================================================= */}
        {activeTab === 'pm' && (
          <div className="space-y-2 text-xs">
            {assetPMs.map((pm) => (
              <div key={pm.pm_id} className="p-3 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-sky-400">{pm.pm_id}</span>
                  <span className="text-slate-300">Due: {pm.next_due_date}</span>
                </div>
                <div className="text-slate-200">{pm.calendar_rule}</div>
                <div className="text-slate-400 text-[11px]">Required Crew: {pm.required_team} ({pm.duration_hours}h)</div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. CONDITION TELEMETRY */}
        {/* ========================================================================= */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3 text-xs">
            {assetMeasurements.map((m) => (
              <div key={m.id} className="p-3 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-200">{m.parameter}</span>
                  <span className="font-bold text-sky-400">
                    {m.current_value} {m.unit}
                  </span>
                </div>
                <p className="text-slate-400 font-mono text-[11px]">{m.measurement_point}</p>
                <div className="text-[11px] text-emerald-400">Status: {m.status} (Warning ≥ {m.warning_threshold})</div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. QR CODE BADGE */}
        {/* ========================================================================= */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded border border-slate-800 space-y-3">
            <div className="w-40 h-40 bg-white p-3 rounded shadow flex items-center justify-center">
              {/* Clean SVG Industrial QR representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z" fill="#0f172a" />
                <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z" fill="#0f172a" />
                <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z" fill="#0f172a" />
                <rect x="45" y="15" width="8" height="8" fill="#0f172a" />
                <rect x="45" y="30" width="8" height="15" fill="#0f172a" />
                <rect x="50" y="50" width="12" height="12" fill="#0f172a" />
                <rect x="70" y="60" width="16" height="8" fill="#0f172a" />
                <rect x="65" y="75" width="10" height="12" fill="#0f172a" />
                <rect x="45" y="75" width="8" height="8" fill="#0f172a" />
              </svg>
            </div>
            <div className="text-center font-mono">
              <span className="font-bold text-sm text-sky-400 block">{asset.official_tag}</span>
              <span className="text-[11px] text-slate-400">TSP3 OCP JORF LASFAR</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs text-center font-sans">
              Scan with mobile device camera to open immediate equipment condition passport and log work order findings in field.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
