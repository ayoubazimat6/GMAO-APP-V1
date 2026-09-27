import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { PlantAsset, PlantArea, SubArea } from '../types/cmms';
import {
  Layers,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  QrCode,
  FileText,
  Clock,
  Wrench,
  Activity,
  Plus,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const AssetRegisterView: React.FC = () => {
  const {
    assets,
    areas,
    subAreas,
    systems,
    workOrders,
    pmPlans,
    conditionMeasurements,
    t,
    setSelectedAssetForDetail,
  } = useCMMS();

  const [selectedAreaId, setSelectedAreaId] = useState<string>('all');
  const [selectedSubAreaId, setSelectedSubAreaId] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hierarchyExpanded, setHierarchyExpanded] = useState<Record<string, boolean>>({
    'area-g': true,
    'sub-ps': true,
  });

  const toggleHierarchy = (id: string) => {
    setHierarchyExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    if (selectedAreaId !== 'all' && asset.area_id !== selectedAreaId) return false;
    if (selectedSubAreaId !== 'all' && asset.sub_area_id !== selectedSubAreaId) return false;
    if (selectedDiscipline !== 'all' && asset.discipline !== selectedDiscipline) return false;
    if (selectedCriticality !== 'all' && asset.criticality_class !== selectedCriticality) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTag = asset.official_tag.toLowerCase().includes(q);
      const matchNameEn = asset.name_en.toLowerCase().includes(q);
      const matchNameFr = asset.name_fr.toLowerCase().includes(q);
      const matchModel = asset.model.toLowerCase().includes(q);
      return matchTag || matchNameEn || matchNameFr || matchModel;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Hierarchy Governance Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.assets.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            TSP3 Multi-Level Functional Plant Hierarchy (SITE → AREA → SUB-AREA → SYSTEM → ASSET)
          </p>
        </div>

        {/* Tag & Source Integrity Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-slate-300">
            Official Controlled Tags Preserved · Area Q & U Distinct
          </span>
        </div>
      </div>

      {/* Main Grid: Left Hierarchy Tree (1 col) + Right Assets Table & Card (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Interactive Plant Functional Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Functional Tree
            </h2>
            <button
              onClick={() => {
                setSelectedAreaId('all');
                setSelectedSubAreaId('all');
              }}
              className="text-[10px] text-sky-400 hover:text-sky-300"
            >
              Reset Filter
            </button>
          </div>

          {/* Plant Node */}
          <div className="text-xs font-mono">
            <div className="flex items-center gap-1.5 py-1 text-slate-200 font-bold">
              <span>🏭 TSP3 (Jorf Lasfar)</span>
            </div>

            {/* Areas */}
            <div className="pl-3 border-l border-slate-800 space-y-1 mt-1">
              {areas.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const isExpanded = hierarchyExpanded[area.id];
                const areaSubs = subAreas.filter((s) => s.area_id === area.id);

                return (
                  <div key={area.id} className="space-y-1">
                    <div
                      className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition ${
                        isSelected ? 'bg-sky-950 text-sky-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      onClick={() => {
                        setSelectedAreaId(isSelected ? 'all' : area.id);
                        setSelectedSubAreaId('all');
                      }}
                    >
                      <div className="flex items-center gap-1 truncate">
                        {areaSubs.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHierarchy(area.id);
                            }}
                            className="p-0.5 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        )}
                        <span className="font-bold text-sky-400">{area.code}</span>
                        <span className="truncate">· {area.name_en}</span>
                      </div>
                      {area.verification_status === 'TO_BE_VERIFIED' && (
                        <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1 rounded uppercase">
                          TBD
                        </span>
                      )}
                    </div>

                    {/* Sub Areas if expanded */}
                    {isExpanded && areaSubs.length > 0 && (
                      <div className="pl-4 border-l border-slate-800 space-y-0.5">
                        {areaSubs.map((sub) => {
                          const isSubSelected = selectedSubAreaId === sub.id;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => {
                                setSelectedAreaId(area.id);
                                setSelectedSubAreaId(isSubSelected ? 'all' : sub.id);
                              }}
                              className={`py-1 px-2 rounded cursor-pointer transition flex items-center justify-between text-[11px] ${
                                isSubSelected
                                  ? 'bg-sky-900/60 text-sky-300 font-semibold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                              }`}
                            >
                              <span className="truncate">
                                <span className="text-slate-300 font-mono font-medium">{sub.code}</span> · {sub.name_en}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Filters, Asset Register Table and Quick Passport */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none"
              >
                <option value="all">All Disciplines</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Instrumentation">Instrumentation</option>
                <option value="Utilities">Utilities</option>
              </select>

              <select
                value={selectedCriticality}
                onChange={(e) => setSelectedCriticality(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none"
              >
                <option value="all">All Criticality</option>
                <option value="A">Class A (Critical)</option>
                <option value="B">Class B (Important)</option>
                <option value="C">Class C (Normal)</option>
              </select>
            </div>
          </div>

          {/* Asset Register Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing <strong className="text-slate-100 font-mono">{filteredAssets.length}</strong> maintainable assets
              </span>
              <span className="font-mono text-[11px]">TSP3 Master Asset Hierarchy</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Official Tag</th>
                    <th className="py-2.5 px-4">Asset Name</th>
                    <th className="py-2.5 px-4">Class & Type</th>
                    <th className="py-2.5 px-4">Discipline</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Criticality</th>
                    <th className="py-2.5 px-4">Verification</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.asset_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-sky-400">
                        {asset.official_tag}
                        {asset.legacy_tag && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Legacy: {asset.legacy_tag}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-200">
                        <div className="font-medium">{asset.name_en}</div>
                        <div className="text-[11px] text-slate-400">{asset.name_fr}</div>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        <div>{asset.asset_class}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{asset.equipment_type}</div>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">{asset.discipline}</td>
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
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            asset.criticality_class === 'A'
                              ? 'bg-rose-950 text-rose-300 border border-rose-900'
                              : asset.criticality_class === 'B'
                              ? 'bg-amber-950 text-amber-300 border border-amber-900'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {asset.criticality_class} ({asset.criticality_score})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-semibold uppercase ${
                            asset.verification_status === 'VERIFIED'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
                          }`}
                        >
                          {asset.verification_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAssetForDetail(asset)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          Passport
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
