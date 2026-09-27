import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import {
  BookOpen,
  FileCode,
  Layers,
  Database,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Workflow,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const EngineeringDossierView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('all');

  const sections = [
    { id: 'A', title: 'A. TSP3 Plant Functional Hierarchy', icon: Layers },
    { id: 'B', title: 'B. Area Structure (S, Q, G, U, MT)', icon: Layers },
    { id: 'C', title: 'C. Granulation Sub-Area Structure', icon: Layers },
    { id: 'D', title: 'D. Equipment Classification & Taxonomy', icon: FileCode },
    { id: 'E', title: 'E. Master Asset Data Model', icon: Database },
    { id: 'F', title: 'F. Maintenance Taxonomy Separation', icon: Workflow },
    { id: 'G', title: 'G. Preventive Maintenance Engine & Job Plans', icon: Workflow },
    { id: 'H', title: 'H. Corrective Maintenance & Failure Taxonomy', icon: GitBranch },
    { id: 'I', title: 'I. Field Inspection & OK/NOK Escalation Model', icon: ShieldCheck },
    { id: 'J', title: 'J. Traceable Calibration & Metrology Model', icon: ShieldCheck },
    { id: 'K', title: 'K. Daily & Weekly Planning Engine Algorithm', icon: Workflow },
    { id: 'L', title: 'L. Wednesday Shutdown Management Window', icon: Workflow },
    { id: 'M', title: 'M. MRO Inventory & Special Tools Model', icon: Database },
    { id: 'N', title: 'N. Role-Based Access Control (RBAC) Matrix', icon: ShieldCheck },
    { id: 'O', title: 'O. Relational PostgreSQL Database ERD', icon: Database },
    { id: 'P', title: 'P. JSON Schema Configuration Specification', icon: FileCode },
    { id: 'Q', title: 'Q. REST & OpenAPI Architecture', icon: FileCode },
    { id: 'R', title: 'R. UI Sitemap & Navigation Architecture', icon: Layers },
    { id: 'S', title: 'S. Reliability KPI Formulas & Standards', icon: ShieldCheck },
    { id: 'T', title: 'T. Data Migration & Excel Ingestion Strategy', icon: Database },
    { id: 'U', title: 'U. Missing-Information Register (TBDs)', icon: AlertTriangle },
    { id: 'V', title: 'V. Conflicting Information Register (Area Q vs U)', icon: AlertTriangle },
    { id: 'W', title: 'W. Industrial Risk Register & Mitigation', icon: ShieldCheck },
    { id: 'X', title: 'X. Phased Implementation Roadmap (Phases 0–6)', icon: Workflow },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              PHASE 0 ARCHITECTURE REPORT
            </span>
            <span className="text-xs text-slate-400">Master Prompt Section 90 Verification Dossier</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight mt-1">
            System Engineering Dossier (Sections A through X)
          </h1>
        </div>

        <div className="text-xs text-slate-300 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          TSP Factory 3 · Jorf Lasfar, Morocco · OCP S.A.
        </div>
      </div>

      {/* Grid: Left Navigation index + Right Full Text Report */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Table of Contents */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase p-2 border-b border-slate-800">
            Dossier Index (24 Sections)
          </div>
          <div className="space-y-0.5 max-h-[650px] overflow-y-auto">
            <button
              onClick={() => setActiveSection('all')}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition ${
                activeSection === 'all' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Sections (Continuous View)
            </button>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs truncate transition ${
                  activeSection === s.id ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Dossier Content */}
        <div className="lg:col-span-3 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {/* SECTION A & B */}
          {(activeSection === 'all' || activeSection === 'A' || activeSection === 'B') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>A & B. TSP3 Plant Hierarchy & Distinct Area Governance</span>
              </h2>
              <div className="space-y-2">
                <p>
                  The industrial asset tree follows the standardized multi-level model:
                  <code className="text-sky-300 font-mono ml-1 font-semibold">SITE → AREA → SUB-AREA → SYSTEM → SUBSYSTEM → ASSET → COMPONENT → DEVICE</code>.
                </p>
                <div className="bg-slate-950 p-3 rounded font-mono text-[11px] text-slate-200 border border-slate-800 space-y-1">
                  <div>TSP3 (TSP Factory 3, Jorf Lasfar, Morocco)</div>
                  <div className="pl-4">├── S — Solubilization / Solubilisation (Reaction & Acid Feed)</div>
                  <div className="pl-4">├── Q — Utilities Q (Compressed Air 7 bar, Utility Distribution)</div>
                  <div className="pl-4">├── G — Granulation / Granulation (Dryers, Screening, Granulator, Coolers)</div>
                  <div className="pl-4">├── U — Utilities U (Secondary Utilities — Distinct Scope, TO BE VERIFIED)</div>
                  <div className="pl-4">└── MT — Stabilizer / Stabilisation (Product Curing & Reversible Conveyors)</div>
                </div>
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/80 text-amber-300 text-[11px]">
                  <strong>Critical Directive (Section 3):</strong> Areas Q and U are both utility-related areas. They MUST NOT be merged, renamed, or assumed identical. They remain distinct configurable entities until official P&ID boundary documentation confirms their relationship.
                </div>
              </div>
            </div>
          )}

          {/* SECTION C & D */}
          {(activeSection === 'all' || activeSection === 'C' || activeSection === 'D') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>C & D. Granulation Sub-Areas & Controlled Equipment Taxonomy</span>
              </h2>
              <p>
                Area G (Granulation) contains 9 confirmed sub-areas:
                <strong> Granulator (GRAN)</strong>, <strong>Primary Screening (PS)</strong>, <strong>Secondary Screening (SS)</strong>, <strong>Filter (FLT)</strong>, <strong>Dryer 1 (DRY1)</strong>, <strong>Dryer 2 (DRY2)</strong>, <strong>Cooler 1 (COL1)</strong>, <strong>Cooler 2 (COL2)</strong>, and <strong>Conditioner (COND)</strong>.
              </p>
              <p>
                Equipment tags are strictly controlled industrial identifiers (e.g. <code>G-BC-41</code>, <code>G-SC-12</code>, <code>G-DRY-01</code>, <code>G-PT-104</code>, <code>G-WS-02</code>). Tags must never be invented, reformatted, or normalized by AI algorithms. Missing engineering data is systematically assigned the label <code>TBD / TO BE VERIFIED</code>.
              </p>
            </div>
          )}

          {/* SECTION E & F */}
          {(activeSection === 'all' || activeSection === 'E' || activeSection === 'F') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>E & F. Master Asset Model & Maintenance Taxonomy Separation</span>
              </h2>
              <p>
                The master asset register incorporates 32 mandatory attributes including official tag, bilingual names/descriptions, discipline, criticality score (A, B, C), operating status, functional location, drawing references, P&ID revision, and verification state.
              </p>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-sky-300 font-bold">Strictly Isolated Maintenance Categories:</div>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 font-sans">
                  <li><strong>Preventive Maintenance:</strong> Time, meter, and calendar-based recurring servicing.</li>
                  <li><strong>Corrective / Curative Maintenance:</strong> Triaged failure restorations with root-cause tracking.</li>
                  <li><strong>Field Inspections:</strong> OK / NOK / N/A condition assessments with defect escalation.</li>
                  <li><strong>Calibration / Metrology:</strong> Traceable physical adjustments with As-Found/As-Left records.</li>
                  <li><strong>Condition Monitoring:</strong> Telemetry thresholds (Vibration, Temp, Current, Pressure).</li>
                  <li><strong>Shutdown Maintenance:</strong> Window-constrained outages (Wednesday 8h window).</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION G & H */}
          {(activeSection === 'all' || activeSection === 'G' || activeSection === 'H') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>G & H. Preventive Engine & Corrective RCA (5-Why & Ishikawa)</span>
              </h2>
              <p>
                Task descriptions adhere to the structured action sequence: <code>INSPECT → CLEAN → VERIFY → MEASURE/TEST → RECORD → ESCALATE IF NOK</code>. Vague phrasing like "check motor" is strictly prohibited.
              </p>
              <p>
                The corrective workflow requires immediate failure classification (Symptom, Mode, Cause) and enforces Root Cause Analysis (RCA) using interactive <strong>5-Why chains</strong> and <strong>6M Ishikawa diagrams</strong> (Manpower, Machine, Method, Material, Measurement, Environment).
              </p>
            </div>
          )}

          {/* SECTION K & L */}
          {(activeSection === 'all' || activeSection === 'K' || activeSection === 'L') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>K & L. Planning Engine & Wednesday Shutdown Window</span>
              </h2>
              <p>
                The planning engine automatically computes ISO weekly schedules (Mon–Sat, 6-day work week) and detects technician conflicts, skill mismatches, and team over-capacity.
              </p>
              <p>
                The <strong>Wednesday Shutdown Window (8.0 Hours)</strong> features a dedicated readiness gate verifying six critical prerequisites: <em>Preparation, Permit, Electrical/Mechanical Isolation, Spare Parts availability, Tool calibration, and Team availability</em>.
              </p>
            </div>
          )}

          {/* SECTION O, P, Q */}
          {(activeSection === 'all' || activeSection === 'O' || activeSection === 'P' || activeSection === 'Q') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>O, P & Q. Relational Database ERD, JSON Schema & REST API</span>
              </h2>
              <p>
                Normalized PostgreSQL design utilizing UUID keys, foreign key constraints, and selective JSONB fields for flexible telemetry attributes.
              </p>
              <div className="bg-slate-950 p-3 rounded font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
                <div className="text-emerald-400">Core REST Endpoints:</div>
                <div>GET /api/assets · POST /api/assets · PATCH /api/assets/:id</div>
                <div>GET /api/asset-hierarchy · GET /api/task-templates</div>
                <div>GET /api/planning/week/:year/:week · POST /api/planning/generate</div>
                <div>GET /api/work-orders · POST /api/work-orders · PATCH /api/work-orders/:id</div>
                <div>GET /api/calibration/due · GET /api/inspections/open-actions</div>
                <div>GET /api/kpis · POST /api/configuration/import</div>
              </div>
            </div>
          )}

          {/* SECTION U, V, W, X */}
          {(activeSection === 'all' || activeSection === 'U' || activeSection === 'V' || activeSection === 'W' || activeSection === 'X') && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold text-sky-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>U, V, W & X. Missing Info, Conflicting Data & Roadmap</span>
              </h2>
              <div className="space-y-2">
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold font-mono block mb-1">
                    Missing Information Register (TBDs):
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    <li>MT-CV-01 manufacturer and motor electrical serial number (Awaiting plant drawings)</li>
                    <li>Area U boundary confirmation against Area Q compressed air manifolds</li>
                    <li>Secondary Screening screen mesh size specifications for Granulation Line 2</li>
                  </ul>
                </div>

                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold font-mono block mb-1">
                    Phased Implementation Roadmap:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div><strong>Phase 0:</strong> Architecture, Data Taxonomy & Dossier</div>
                    <div><strong>Phase 1:</strong> Hierarchy, Asset Register & RBAC</div>
                    <div><strong>Phase 2:</strong> PM Engine, Task Library, Weekly Schedule</div>
                    <div><strong>Phase 3:</strong> Corrective, RCA (5-Why, 6M), Inspections</div>
                    <div><strong>Phase 4:</strong> Metrology, Condition Monitoring, MRO Parts</div>
                    <div><strong>Phase 5:</strong> Dashboards, KPIs, Excel Import/Export, PWA</div>
                    <div><strong>Phase 6:</strong> OPC UA Gateway & SCADA Integration</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
