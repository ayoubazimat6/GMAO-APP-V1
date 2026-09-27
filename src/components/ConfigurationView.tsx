import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import {
  Settings,
  Database,
  FileCode,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  RotateCcw,
} from 'lucide-react';

export const ConfigurationView: React.FC = () => {
  const {
    exportConfigJson,
    importConfigJson,
    auditLogs,
    resetAllData,
    t,
  } = useCMMS();

  const [activeTab, setActiveTab] = useState<'audit' | 'json'>('audit');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [auditSearch, setAuditSearch] = useState<string>('');

  const handleExportJson = () => {
    const jsonStr = exportConfigJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TSP3_CMMS_Configuration_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;
    const res = importConfigJson(jsonInput);
    setImportStatus(res);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (auditSearch.trim() !== '') {
      const q = auditSearch.toLowerCase();
      return (
        log.entity.toLowerCase().includes(q) ||
        log.entity_id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.nav.configuration}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System Master Data JSON Import/Export & Immutable Audit Trail (ISO 55000 / CFR 21 Compliance)
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 rounded p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'json' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON Master Configuration</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AUDIT TRAIL LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3 text-xs">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail by user, entity, tag, reason..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Immutable Transaction Ledger</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">User & Role</th>
                    <th className="py-2.5 px-3">Entity</th>
                    <th className="py-2.5 px-3">Target ID</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Modification Details</th>
                    <th className="py-2.5 px-3">Engineering Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.log_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-slate-200">{log.user}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{log.role}</div>
                      </td>
                      <td className="py-3 px-3 text-sky-400 font-semibold">{log.entity}</td>
                      <td className="py-3 px-3 text-slate-100 font-bold">{log.entity_id}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans max-w-xs truncate">
                        {log.new_value}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. JSON CONFIGURATION IMPORT / EXPORT */}
      {/* ========================================================================= */}
      {activeTab === 'json' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-semibold text-sm text-slate-100">
                  Export / Ingest TSP3 System JSON Configuration (Section 47 & 48)
                </h3>
                <p className="text-xs text-slate-400">
                  Exports complete plant schema, area breakdowns, task templates, and teams in portable JSON.
                </p>
              </div>

              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Configuration JSON</span>
              </button>
            </div>

            <form onSubmit={handleImportJson} className="space-y-3 text-xs">
              <label className="block text-slate-300 font-semibold">
                Paste JSON Configuration Payload for Validation & Ingestion:
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{\n  "schema_version": "1.0",\n  "plant": { "code": "TSP3", ... },\n  "areas": [ ... ]\n}'
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />

              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-mono">
                  Schema Validator: Checks Area Q vs U separation and prevents orphan sub-areas.
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Validate & Commit JSON</span>
                </button>
              </div>
            </form>

            {importStatus && (
              <div
                className={`p-4 rounded border text-xs space-y-2 ${
                  importStatus.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {importStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {importStatus.success
                      ? 'Master Configuration Successfully Validated and Committed!'
                      : 'Validation Failed: Payload Errors Detected'}
                  </span>
                </div>

                {importStatus.errors.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-rose-300 font-mono">
                    {importStatus.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}

                {importStatus.warnings.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-amber-300 font-mono">
                    {importStatus.warnings.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
