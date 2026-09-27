import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  PlantSite,
  PlantArea,
  SubArea,
  PlantSystem,
  PlantAsset,
  TaskTemplate,
  JobPlan,
  PMPlan,
  WorkOrder,
  WorkOrderStatus,
  WednesdayShutdownTask,
  ReadinessStatus,
  CorrectiveMaintenance,
  Inspection,
  CalibrationRecord,
  ConditionMeasurement,
  SparePart,
  MaintenanceTool,
  AuditLogEntry,
  KPIMetric,
  MaintenanceTeam,
} from '../types/cmms';
import {
  initialSite,
  initialAreas,
  initialSubAreas,
  initialSystems,
  initialAssets,
  initialTaskTemplates,
  initialJobPlans,
  initialPMPlans,
  initialWorkOrders,
  initialWednesdayShutdownTasks,
  initialCorrectiveMaintenance,
  initialInspections,
  initialCalibrations,
  initialConditionMeasurements,
  initialSpareParts,
  initialTools,
  initialAuditLogs,
  initialTeams,
  initialKPIs,
} from '../data/initialData';
import { translations } from '../i18n/translations';

export type NavTab =
  | 'dashboard'
  | 'assets'
  | 'preventive'
  | 'planning'
  | 'workOrders'
  | 'corrective'
  | 'inspections'
  | 'calibration'
  | 'condition'
  | 'inventory'
  | 'safety'
  | 'reliability'
  | 'engineeringDossier'
  | 'configuration';

export type DashboardPerspective = 'manager' | 'planner' | 'technician' | 'supervisor';

interface CMMSContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  role: UserRole;
  setRole: (role: UserRole) => void;
  perspective: DashboardPerspective;
  setPerspective: (perspective: DashboardPerspective) => void;
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  site: PlantSite;
  areas: PlantArea[];
  subAreas: SubArea[];
  systems: PlantSystem[];
  assets: PlantAsset[];
  taskTemplates: TaskTemplate[];
  jobPlans: JobPlan[];
  pmPlans: PMPlan[];
  workOrders: WorkOrder[];
  wednesdayTasks: WednesdayShutdownTask[];
  correctiveCases: CorrectiveMaintenance[];
  inspections: Inspection[];
  calibrations: CalibrationRecord[];
  conditionMeasurements: ConditionMeasurement[];
  spareParts: SparePart[];
  tools: MaintenanceTool[];
  auditLogs: AuditLogEntry[];
  teams: MaintenanceTeam[];
  kpis: KPIMetric[];

  // Action methods
  addAsset: (asset: PlantAsset) => void;
  updateAsset: (asset: PlantAsset) => void;
  addWorkOrder: (wo: WorkOrder) => void;
  updateWorkOrderStatus: (wo_number: string, status: WorkOrderStatus, notes?: string) => void;
  updateShutdownTaskReadiness: (
    shutdown_id: string,
    field: 'preparation_status' | 'permit_status' | 'isolation_status' | 'spare_status' | 'tool_status' | 'team_status',
    val: ReadinessStatus
  ) => void;
  addShutdownTask: (task: WednesdayShutdownTask) => void;
  addCorrectiveCase: (cm: CorrectiveMaintenance) => void;
  updateCorrectiveCase: (cm: CorrectiveMaintenance) => void;
  updateInspectionChecklist: (
    inspection_id: string,
    itemId: string,
    result: 'OK' | 'NOK' | 'N/A',
    observation?: string
  ) => void;
  convertNokToWorkOrder: (inspection_id: string, itemId: string) => string;
  addCalibrationRecord: (cal: CalibrationRecord) => void;
  addConditionReading: (measurementId: string, value: number) => void;
  reserveSparePart: (partId: string, quantity: number, wo_number: string) => boolean;
  addAuditLog: (entry: Omit<AuditLogEntry, 'log_id' | 'timestamp'>) => void;
  resetAllData: () => void;
  exportConfigJson: () => string;
  importConfigJson: (jsonStr: string) => { success: boolean; errors: string[]; warnings: string[] };

  // Quick state
  selectedAssetForDetail: PlantAsset | null;
  setSelectedAssetForDetail: (asset: PlantAsset | null) => void;
  quickSearchQuery: string;
  setQuickSearchQuery: (query: string) => void;
}

const CMMSContext = createContext<CMMSContextType | undefined>(undefined);

const STORAGE_PREFIX = 'TSP3_CMMS_V1_';

function loadOr<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const CMMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => loadOr('LANG', 'fr'));
  const [role, setRole] = useState<UserRole>(() => loadOr('ROLE', 'MAINTENANCE_MANAGER'));
  const [perspective, setPerspective] = useState<DashboardPerspective>(() => loadOr('PERSPECTIVE', 'manager'));
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<PlantAsset | null>(null);
  const [quickSearchQuery, setQuickSearchQuery] = useState<string>('');

  const [site] = useState<PlantSite>(initialSite);
  const [areas, setAreas] = useState<PlantArea[]>(() => loadOr('AREAS', initialAreas));
  const [subAreas, setSubAreas] = useState<SubArea[]>(() => loadOr('SUBAREAS', initialSubAreas));
  const [systems, setSystems] = useState<PlantSystem[]>(() => loadOr('SYSTEMS', initialSystems));
  const [assets, setAssets] = useState<PlantAsset[]>(() => loadOr('ASSETS', initialAssets));
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(() => loadOr('TEMPLATES', initialTaskTemplates));
  const [jobPlans, setJobPlans] = useState<JobPlan[]>(() => loadOr('JOBPLANS', initialJobPlans));
  const [pmPlans, setPmPlans] = useState<PMPlan[]>(() => loadOr('PMPLANS', initialPMPlans));
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => loadOr('WORKORDERS', initialWorkOrders));
  const [wednesdayTasks, setWednesdayTasks] = useState<WednesdayShutdownTask[]>(() =>
    loadOr('SHUTDOWN_TASKS', initialWednesdayShutdownTasks)
  );
  const [correctiveCases, setCorrectiveCases] = useState<CorrectiveMaintenance[]>(() =>
    loadOr('CORRECTIVE', initialCorrectiveMaintenance)
  );
  const [inspections, setInspections] = useState<Inspection[]>(() => loadOr('INSPECTIONS', initialInspections));
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>(() => loadOr('CALIBRATIONS', initialCalibrations));
  const [conditionMeasurements, setConditionMeasurements] = useState<ConditionMeasurement[]>(() =>
    loadOr('CONDITION', initialConditionMeasurements)
  );
  const [spareParts, setSpareParts] = useState<SparePart[]>(() => loadOr('PARTS', initialSpareParts));
  const [tools, setTools] = useState<MaintenanceTool[]>(() => loadOr('TOOLS', initialTools));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadOr('AUDIT', initialAuditLogs));
  const [teams, setTeams] = useState<MaintenanceTeam[]>(() => loadOr('TEAMS', initialTeams));
  const [kpis, setKpis] = useState<KPIMetric[]>(() => loadOr('KPIS', initialKPIs));

  useEffect(() => save('LANG', lang), [lang]);
  useEffect(() => save('ROLE', role), [role]);
  useEffect(() => save('PERSPECTIVE', perspective), [perspective]);
  useEffect(() => save('AREAS', areas), [areas]);
  useEffect(() => save('SUBAREAS', subAreas), [subAreas]);
  useEffect(() => save('SYSTEMS', systems), [systems]);
  useEffect(() => save('ASSETS', assets), [assets]);
  useEffect(() => save('TEMPLATES', taskTemplates), [taskTemplates]);
  useEffect(() => save('JOBPLANS', jobPlans), [jobPlans]);
  useEffect(() => save('PMPLANS', pmPlans), [pmPlans]);
  useEffect(() => save('WORKORDERS', workOrders), [workOrders]);
  useEffect(() => save('SHUTDOWN_TASKS', wednesdayTasks), [wednesdayTasks]);
  useEffect(() => save('CORRECTIVE', correctiveCases), [correctiveCases]);
  useEffect(() => save('INSPECTIONS', inspections), [inspections]);
  useEffect(() => save('CALIBRATIONS', calibrations), [calibrations]);
  useEffect(() => save('CONDITION', conditionMeasurements), [conditionMeasurements]);
  useEffect(() => save('PARTS', spareParts), [spareParts]);
  useEffect(() => save('TOOLS', tools), [tools]);
  useEffect(() => save('AUDIT', auditLogs), [auditLogs]);
  useEffect(() => save('TEAMS', teams), [teams]);
  useEffect(() => save('KPIS', kpis), [kpis]);

  const addAuditLog = (entry: Omit<AuditLogEntry, 'log_id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      log_id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...entry,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addAsset = (asset: PlantAsset) => {
    setAssets((prev) => [asset, ...prev]);
    addAuditLog({
      user: role,
      role: role,
      entity: 'PlantAsset',
      entity_id: asset.official_tag,
      action: 'CREATE',
      previous_value: 'null',
      new_value: `Tag: ${asset.official_tag} (${asset.name_en})`,
      reason: 'Asset onboarded to plant hierarchy',
    });
  };

  const updateAsset = (updated: PlantAsset) => {
    const old = assets.find((a) => a.asset_id === updated.asset_id);
    setAssets((prev) => prev.map((a) => (a.asset_id === updated.asset_id ? updated : a)));
    addAuditLog({
      user: role,
      role: role,
      entity: 'PlantAsset',
      entity_id: updated.official_tag,
      action: 'UPDATE',
      previous_value: old ? `Status: ${old.operating_status}, Crit: ${old.criticality_class}` : '',
      new_value: `Status: ${updated.operating_status}, Crit: ${updated.criticality_class}`,
      reason: 'Asset technical record updated',
    });
  };

  const addWorkOrder = (wo: WorkOrder) => {
    setWorkOrders((prev) => [wo, ...prev]);
    addAuditLog({
      user: role,
      role: role,
      entity: 'WorkOrder',
      entity_id: wo.wo_number,
      action: 'CREATE',
      previous_value: 'null',
      new_value: `WO ${wo.wo_number} for ${wo.official_tag}`,
      reason: 'Work order scheduled',
    });
  };

  const updateWorkOrderStatus = (wo_number: string, status: WorkOrderStatus, notes?: string) => {
    setWorkOrders((prev) =>
      prev.map((w) => {
        if (w.wo_number === wo_number) {
          const isComplete = status === 'COMPLETED' || status === 'CLOSED';
          return {
            ...w,
            status,
            completed_at: isComplete ? new Date().toISOString() : w.completed_at,
            closure_notes: notes || w.closure_notes,
          };
        }
        return w;
      })
    );
    addAuditLog({
      user: role,
      role: role,
      entity: 'WorkOrder',
      entity_id: wo_number,
      action: 'STATUS_CHANGE',
      previous_value: 'Previous status',
      new_value: status + (notes ? ` (${notes})` : ''),
      reason: 'Work order lifecycle progression',
    });
  };

  const updateShutdownTaskReadiness = (
    shutdown_id: string,
    field: 'preparation_status' | 'permit_status' | 'isolation_status' | 'spare_status' | 'tool_status' | 'team_status',
    val: ReadinessStatus
  ) => {
    setWednesdayTasks((prev) =>
      prev.map((t) => {
        if (t.shutdown_id === shutdown_id) {
          const updated = { ...t, [field]: val };
          // Calculate overall execution readiness
          const allReady =
            updated.preparation_status === 'READY' &&
            updated.permit_status === 'READY' &&
            updated.isolation_status === 'READY' &&
            updated.spare_status === 'READY' &&
            updated.tool_status === 'READY' &&
            updated.team_status === 'READY';
          updated.execution_readiness = allReady ? 'READY' : val;
          return updated;
        }
        return t;
      })
    );
  };

  const addShutdownTask = (task: WednesdayShutdownTask) => {
    setWednesdayTasks((prev) => [...prev, task]);
    addAuditLog({
      user: role,
      role: role,
      entity: 'WednesdayShutdownTask',
      entity_id: task.shutdown_id,
      action: 'CREATE',
      previous_value: 'null',
      new_value: `Tag: ${task.official_tag}, ${task.duration_hours}h`,
      reason: 'Task allocated to Wednesday shutdown window',
    });
  };

  const addCorrectiveCase = (cm: CorrectiveMaintenance) => {
    setCorrectiveCases((prev) => [cm, ...prev]);
    // Also generate associated work order
    const wo: WorkOrder = {
      wo_number: cm.wo_number,
      type: 'CORRECTIVE',
      asset_id: cm.asset_id,
      official_tag: cm.official_tag,
      area_id: cm.area_id,
      task_code: 'CM-CORR-ACT',
      description_en: `Corrective: ${cm.problem_description_en}`,
      description_fr: `Correctif : ${cm.problem_description_fr}`,
      date: cm.failure_date,
      day_of_week: 'Monday',
      shift: 'Emergency / Triage',
      duration_hours: cm.downtime_hours || 4,
      team: cm.failure_category === 'Electrical' ? 'Electrical Team 1' : 'Mechanical Team 1',
      technician_name: cm.technician,
      priority: cm.production_impact === 'CRITICAL_STOP' ? 'CRITICAL' : 'HIGH',
      status: 'IN_PROGRESS',
      shutdown_required: false,
      source_week: 'Week 40',
      safety_permits: ['Corrective Safety Assessment'],
      created_at: new Date().toISOString(),
    };
    addWorkOrder(wo);
    addAuditLog({
      user: role,
      role: role,
      entity: 'CorrectiveMaintenance',
      entity_id: cm.cm_id,
      action: 'CREATE',
      previous_value: 'null',
      new_value: `Incident ${cm.cm_id} on ${cm.official_tag}`,
      reason: 'Failure notification logged',
    });
  };

  const updateCorrectiveCase = (cm: CorrectiveMaintenance) => {
    setCorrectiveCases((prev) => prev.map((c) => (c.cm_id === cm.cm_id ? cm : c)));
  };

  const updateInspectionChecklist = (
    inspection_id: string,
    itemId: string,
    result: 'OK' | 'NOK' | 'N/A',
    observation?: string
  ) => {
    setInspections((prev) =>
      prev.map((ins) => {
        if (ins.inspection_id === inspection_id) {
          const updatedChecklist = ins.checklist.map((c) => {
            if (c.id === itemId) {
              return { ...c, result, observation: observation ?? c.observation };
            }
            return c;
          });
          const hasNok = updatedChecklist.some((c) => c.result === 'NOK');
          return { ...ins, checklist: updatedChecklist, overall_result: hasNok ? 'NOK' : 'OK' };
        }
        return ins;
      })
    );
  };

  const convertNokToWorkOrder = (inspection_id: string, itemId: string): string => {
    const ins = inspections.find((i) => i.inspection_id === inspection_id);
    const item = ins?.checklist.find((c) => c.id === itemId);
    if (!ins || !item) return '';

    const newWoNum = `WO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newWo: WorkOrder = {
      wo_number: newWoNum,
      type: 'CORRECTIVE',
      asset_id: ins.asset_id,
      official_tag: ins.official_tag,
      area_id: 'area-g',
      task_code: 'INSP-NOK-CORR',
      description_en: `Corrective action from inspection finding: ${item.observation || item.item_en}`,
      description_fr: `Action corrective suite à anomalie inspection : ${item.observation || item.item_fr}`,
      date: new Date().toISOString().substring(0, 10),
      day_of_week: 'Tuesday',
      shift: 'Morning Shift',
      duration_hours: 4,
      team: 'Mechanical Team 2',
      priority: item.priority || 'MEDIUM',
      status: 'PLANNED',
      shutdown_required: false,
      source_week: 'Week 40',
      safety_permits: ['Standard Inspection Action Safety Clearance'],
      created_at: new Date().toISOString(),
    };

    addWorkOrder(newWo);

    setInspections((prev) =>
      prev.map((i) => {
        if (i.inspection_id === inspection_id) {
          return {
            ...i,
            checklist: i.checklist.map((c) =>
              c.id === itemId ? { ...c, action_created: true, converted_wo_number: newWoNum } : c
            ),
          };
        }
        return i;
      })
    );

    addAuditLog({
      user: role,
      role: role,
      entity: 'Inspection',
      entity_id: inspection_id,
      action: 'UPDATE',
      previous_value: `NOK Item: ${item.id}`,
      new_value: `Converted to WO ${newWoNum}`,
      reason: 'Inspection NOK converted to corrective work order per Section 26',
    });

    return newWoNum;
  };

  const addCalibrationRecord = (cal: CalibrationRecord) => {
    setCalibrations((prev) => [cal, ...prev]);
    addAuditLog({
      user: role,
      role: role,
      entity: 'CalibrationRecord',
      entity_id: cal.instrument_tag,
      action: 'CREATE',
      previous_value: 'null',
      new_value: `Certificate: ${cal.certificate_number}, Result: ${cal.result}`,
      reason: 'Traceable instrument calibration recorded',
    });
  };

  const addConditionReading = (measurementId: string, value: number) => {
    setConditionMeasurements((prev) =>
      prev.map((cm) => {
        if (cm.id === measurementId) {
          let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
          if (value >= cm.critical_threshold) status = 'CRITICAL';
          else if (value >= cm.warning_threshold) status = 'WARNING';

          const newHistory = [...cm.history, { timestamp: new Date().toISOString().substring(0, 10), value }];
          return {
            ...cm,
            current_value: value,
            status,
            last_measured: new Date().toISOString().substring(0, 16).replace('T', ' '),
            history: newHistory.slice(-10),
          };
        }
        return cm;
      })
    );
  };

  const reserveSparePart = (partId: string, quantity: number, wo_number: string): boolean => {
    let success = false;
    setSpareParts((prev) =>
      prev.map((sp) => {
        if (sp.part_id === partId) {
          if (sp.available_qty >= quantity) {
            success = true;
            return {
              ...sp,
              reserved_qty: sp.reserved_qty + quantity,
              available_qty: sp.available_qty - quantity,
            };
          }
        }
        return sp;
      })
    );

    if (success) {
      addAuditLog({
        user: role,
        role: role,
        entity: 'SparePart',
        entity_id: partId,
        action: 'UPDATE',
        previous_value: `Reserved for WO ${wo_number}`,
        new_value: `Quantity: ${quantity}`,
        reason: 'Spare parts reserved for scheduled work order',
      });
    }
    return success;
  };

  const resetAllData = () => {
    localStorage.clear();
    setAreas(initialAreas);
    setSubAreas(initialSubAreas);
    setSystems(initialSystems);
    setAssets(initialAssets);
    setTaskTemplates(initialTaskTemplates);
    setJobPlans(initialJobPlans);
    setPmPlans(initialPMPlans);
    setWorkOrders(initialWorkOrders);
    setWednesdayTasks(initialWednesdayShutdownTasks);
    setCorrectiveCases(initialCorrectiveMaintenance);
    setInspections(initialInspections);
    setCalibrations(initialCalibrations);
    setConditionMeasurements(initialConditionMeasurements);
    setSpareParts(initialSpareParts);
    setTools(initialTools);
    setAuditLogs(initialAuditLogs);
    setTeams(initialTeams);
    setKpis(initialKPIs);
  };

  const exportConfigJson = (): string => {
    const config = {
      schema_version: '1.0',
      plant: site,
      areas,
      sub_areas: subAreas,
      systems,
      asset_classes: [
        'Conveyor',
        'Screen',
        'Motor',
        'Gearbox',
        'Bearing',
        'Pump',
        'Valve',
        'Dryer',
        'Cooler',
        'Conditioner',
        'Weighing System',
        'Instrument',
        'Air Compressor',
      ],
      disciplines: ['Mechanical', 'Electrical', 'Instrumentation', 'Automation', 'Utilities'],
      task_templates: taskTemplates,
      job_plans: jobPlans,
      teams,
    };
    return JSON.stringify(config, null, 2);
  };

  const importConfigJson = (jsonStr: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    try {
      const data = JSON.parse(jsonStr);
      if (!data.schema_version) {
        errors.push('Missing schema_version attribute');
      }
      if (!Array.isArray(data.areas)) {
        errors.push('Invalid configuration: "areas" must be an array');
      } else {
        // Validate area Q & U rule per Section 3 & 47
        const hasQ = data.areas.some((a: PlantArea) => a.code === 'Q');
        const hasU = data.areas.some((a: PlantArea) => a.code === 'U');
        if (hasQ && hasU) {
          warnings.push('Area Q and Area U detected as distinct areas per Section 3 governance.');
        }
      }

      if (errors.length === 0) {
        if (data.areas) setAreas(data.areas);
        if (data.sub_areas) setSubAreas(data.sub_areas);
        if (data.task_templates) setTaskTemplates(data.task_templates);
        if (data.job_plans) setJobPlans(data.job_plans);
        if (data.teams) setTeams(data.teams);

        addAuditLog({
          user: role,
          role: role,
          entity: 'Configuration',
          entity_id: 'SCHEMA_IMPORT',
          action: 'IMPORT',
          previous_value: 'Old Configuration',
          new_value: `Schema v${data.schema_version} imported`,
          reason: 'JSON Master configuration import approved',
        });
        return { success: true, errors, warnings };
      }
      return { success: false, errors, warnings };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON format';
      return { success: false, errors: [errorMsg], warnings };
    }
  };

  const t = translations[lang];

  return (
    <CMMSContext.Provider
      value={{
        lang,
        setLang,
        t,
        role,
        setRole,
        perspective,
        setPerspective,
        currentTab,
        setCurrentTab,
        isOnline,
        setIsOnline,

        site,
        areas,
        subAreas,
        systems,
        assets,
        taskTemplates,
        jobPlans,
        pmPlans,
        workOrders,
        wednesdayTasks,
        correctiveCases,
        inspections,
        calibrations,
        conditionMeasurements,
        spareParts,
        tools,
        auditLogs,
        teams,
        kpis,

        addAsset,
        updateAsset,
        addWorkOrder,
        updateWorkOrderStatus,
        updateShutdownTaskReadiness,
        addShutdownTask,
        addCorrectiveCase,
        updateCorrectiveCase,
        updateInspectionChecklist,
        convertNokToWorkOrder,
        addCalibrationRecord,
        addConditionReading,
        reserveSparePart,
        addAuditLog,
        resetAllData,
        exportConfigJson,
        importConfigJson,

        selectedAssetForDetail,
        setSelectedAssetForDetail,
        quickSearchQuery,
        setQuickSearchQuery,
      }}
    >
      {children}
    </CMMSContext.Provider>
  );
};

export const useCMMS = () => {
  const context = useContext(CMMSContext);
  if (!context) throw new Error('useCMMS must be used within a CMMSProvider');
  return context;
};
