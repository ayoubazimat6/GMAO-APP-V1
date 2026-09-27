export type Language = 'en' | 'fr';

export type UserRole =
  | 'ADMIN'
  | 'MAINTENANCE_MANAGER'
  | 'MAINTENANCE_PLANNER'
  | 'MAINTENANCE_SUPERVISOR'
  | 'MECHANICAL_SUPERVISOR'
  | 'ELECTRICAL_SUPERVISOR'
  | 'INSTRUMENTATION_SUPERVISOR'
  | 'AUTOMATION_SUPERVISOR'
  | 'TEAM_LEADER'
  | 'TECHNICIAN'
  | 'RELIABILITY_ENGINEER'
  | 'STOREKEEPER'
  | 'VIEWER';

export type Discipline =
  | 'Mechanical'
  | 'Electrical'
  | 'Instrumentation'
  | 'Automation'
  | 'Utilities'
  | 'Process'
  | 'Civil'
  | 'Safety'
  | 'Other';

export type CriticalityClass = 'A' | 'B' | 'C';

export type VerificationStatus = 'VERIFIED' | 'TO_BE_VERIFIED' | 'PROPOSED' | 'OBSOLETE';

export type OperatingStatus = 'OPERATIONAL' | 'DEGRADED' | 'STOPPED' | 'UNDER_MAINTENANCE';

export type MaintenanceStrategy =
  | 'Preventive'
  | 'Condition Based'
  | 'Predictive'
  | 'Run to Failure'
  | 'Inspection'
  | 'Calibration'
  | 'Combination'
  | 'No Scheduled Maintenance';

export interface PlantSite {
  code: string;
  name_en: string;
  name_fr: string;
  location: string;
}

export interface PlantArea {
  id: string;
  code: string; // S, Q, G, U, MT
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  verification_status: VerificationStatus;
  notes?: string;
}

export interface SubArea {
  id: string;
  area_id: string;
  code: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
}

export interface PlantSystem {
  id: string;
  sub_area_id: string;
  code: string;
  name_en: string;
  name_fr: string;
}

export interface PlantAsset {
  asset_id: string;
  official_tag: string;
  legacy_tag?: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  site_id: string;
  area_id: string;
  sub_area_id: string;
  system_id?: string;
  subsystem_id?: string;
  parent_asset_id?: string;
  asset_class: string;
  equipment_type: string;
  discipline: Discipline;
  criticality_class: CriticalityClass;
  criticality_score: number;
  operating_status: OperatingStatus;
  maintenance_strategy: MaintenanceStrategy;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  commissioning_date: string;
  functional_location: string;
  drawing_reference: string;
  pid_reference: string;
  electrical_drawing_reference: string;
  manual_reference: string;
  datasheet_reference: string;
  source_document: string;
  source_revision: string;
  verification_status: VerificationStatus;
  active: boolean;
  qr_code?: string;
  components?: AssetComponent[];
  devices?: AssetDevice[];
}

export interface AssetComponent {
  component_id: string;
  name_en: string;
  name_fr: string;
  component_class: string;
  discipline: Discipline;
  status: 'OK' | 'DEGRADED' | 'CRITICAL';
}

export interface AssetDevice {
  device_id: string;
  tag: string;
  device_type: 'Sensor' | 'Transmitter' | 'Switch' | 'Actuator' | 'VFD' | 'PLC_IO';
  name_en: string;
  name_fr: string;
  calibration_required: boolean;
  last_calibration?: string;
}

export interface TaskTemplate {
  task_template_id: string;
  task_code: string;
  task_name_en: string;
  task_name_fr: string;
  description_en: string;
  description_fr: string;
  maintenance_type: 'Preventive' | 'Inspection' | 'Calibration' | 'Condition Monitoring' | 'Shutdown' | 'Corrective';
  discipline: Discipline;
  equipment_class: string;
  equipment_type: string;
  frequency_type: 'Daily' | 'Weekly' | 'Biweekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Meter-based';
  default_frequency: string;
  default_duration: number; // in hours
  default_team: string;
  default_priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  shutdown_required: boolean;
  safety_requirements: string[];
  tools: string[];
  spare_parts: string[];
  measurement_points: string[];
  acceptance_criteria: string;
  procedure_reference: string;
  revision: string;
  active: boolean;
}

export interface JobPlanStep {
  step_number: number;
  instruction_en: string;
  instruction_fr: string;
  required: boolean;
  safety_note?: string;
  measurement_required?: boolean;
  acceptance_criteria?: string;
  estimated_duration?: number; // minutes
}

export interface JobPlan {
  job_plan_id: string;
  task_code: string;
  title_en: string;
  title_fr: string;
  steps: JobPlanStep[];
}

export interface PMPlan {
  pm_id: string;
  asset_id: string;
  official_tag: string;
  task_template_id: string;
  job_plan_id?: string;
  maintenance_strategy: MaintenanceStrategy;
  frequency_type: string;
  frequency_value: number;
  frequency_unit: 'DAYS' | 'WEEKS' | 'MONTHS' | 'HOURS';
  calendar_rule: string;
  next_due_date: string;
  tolerance_days: number;
  lead_time_days: number;
  duration_hours: number;
  required_team: string;
  required_skills: string[];
  shutdown_required: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  safety_requirements: string[];
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
}

export type WorkOrderStatus =
  | 'PLANNED'
  | 'RELEASED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'OVERDUE';

export interface WorkOrder {
  wo_number: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'CALIBRATION' | 'SHUTDOWN' | 'EMERGENCY';
  asset_id: string;
  official_tag: string;
  area_id: string;
  sub_area_id?: string;
  system_id?: string;
  task_code: string;
  description_en: string;
  description_fr: string;
  date: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  shift: string;
  duration_hours: number;
  actual_hours?: number;
  team: string;
  technician_name?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: WorkOrderStatus;
  shutdown_required: boolean;
  source_week: string; // e.g. "Week 39"
  safety_permits: string[];
  parts_used?: { part_number: string; quantity: number }[];
  tools_needed?: string[];
  findings?: string;
  closure_notes?: string;
  created_at: string;
  completed_at?: string;
}

export type ReadinessStatus =
  | 'READY'
  | 'NOT_READY'
  | 'WAITING_FOR_PART'
  | 'WAITING_FOR_PERMIT'
  | 'WAITING_FOR_ISOLATION';

export interface WednesdayShutdownTask {
  shutdown_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  area_id: string;
  asset_id: string;
  official_tag: string;
  task_description_en: string;
  task_description_fr: string;
  team: string;
  owner: string;
  preparation_status: ReadinessStatus;
  permit_status: ReadinessStatus;
  isolation_status: ReadinessStatus;
  spare_status: ReadinessStatus;
  tool_status: ReadinessStatus;
  team_status: ReadinessStatus;
  execution_readiness: ReadinessStatus;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
}

export interface CorrectiveMaintenance {
  cm_id: string;
  wo_number: string;
  asset_id: string;
  official_tag: string;
  area_id: string;
  failure_date: string;
  failure_time: string;
  problem_description_en: string;
  problem_description_fr: string;
  failure_symptom: string;
  failure_mode: string;
  failure_cause: string;
  failure_category: 'Mechanical' | 'Electrical' | 'Instrumentation' | 'Automation' | 'Control' | 'Process' | 'Lubrication' | 'Structural' | 'Safety' | 'Other';
  diagnosis: string;
  corrective_action: string;
  downtime_hours: number;
  production_impact: 'CRITICAL_STOP' | 'REDUCED_RATE' | 'NO_IMPACT';
  safety_impact: boolean;
  root_cause_status: 'IDENTIFIED' | 'NOT_YET_IDENTIFIED' | 'UNDER_INVESTIGATION';
  five_why?: string[];
  ishikawa?: {
    manpower: string[];
    machine: string[];
    method: string[];
    material: string[];
    measurement: string[];
    environment: string[];
  };
  permanent_corrective_action?: string;
  temporary_repair?: string;
  functional_test_passed?: boolean;
  technician: string;
  status: 'REPORTED' | 'TRIAGE' | 'APPROVED' | 'PLANNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_PARTS' | 'AWAITING_SHUTDOWN' | 'COMPLETED' | 'VERIFIED' | 'CLOSED';
  closure_date?: string;
}

export interface InspectionChecklistItem {
  id: string;
  item_en: string;
  item_fr: string;
  result: 'OK' | 'NOK' | 'N/A' | 'PENDING';
  observation?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
  action_created?: boolean;
  converted_wo_number?: string;
}

export interface Inspection {
  inspection_id: string;
  asset_id: string;
  official_tag: string;
  title_en: string;
  title_fr: string;
  inspector_name: string;
  date: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  checklist: InspectionChecklistItem[];
  overall_result?: 'OK' | 'NOK';
}

export interface CalibrationRecord {
  cal_id: string;
  instrument_tag: string;
  asset_id: string;
  asset_tag: string;
  serial_number: string;
  range_min: number;
  range_max: number;
  unit: string;
  reference_standard: string;
  standard_id: string;
  traceability: string;
  procedure_ref: string;
  calibration_date: string;
  due_date: string;
  as_found_value: number;
  adjustment_performed: boolean;
  as_left_value: number;
  error_found: number;
  error_left: number;
  acceptance_criteria: string;
  result: 'PASSED' | 'FAILED' | 'ADJUSTED';
  technician: string;
  certificate_number: string;
}

export interface ConditionMeasurement {
  id: string;
  asset_id: string;
  official_tag: string;
  measurement_point: string;
  parameter: 'Vibration RMS' | 'Bearing Temperature' | 'Motor Current' | 'Discharge Pressure' | 'Lubricant Dielectric';
  unit: string;
  current_value: number;
  warning_threshold: number;
  alarm_threshold: number;
  critical_threshold: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  last_measured: string;
  technician: string;
  history: { timestamp: string; value: number }[];
}

export interface SparePart {
  part_id: string;
  part_number: string;
  description_en: string;
  description_fr: string;
  manufacturer: string;
  mpn: string;
  category: 'Bearings' | 'Belts & Rollers' | 'Electrical & VFD' | 'Instrumentation' | 'Valves & Seals' | 'Screen Mesh' | 'Motors' | 'Lubricants';
  unit: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  warehouse: string;
  bin_location: string;
  reserved_qty: number;
  available_qty: number;
  supplier: string;
  unit_cost_mad: number;
  critical_spare: boolean;
  compatible_equipment: string[];
}

export interface MaintenanceTool {
  tool_id: string;
  name_en: string;
  name_fr: string;
  category: 'Electrical Test' | 'Vibration & Condition' | 'Torque & Mechanical' | 'Calibration Reference' | 'Lifting';
  serial_number: string;
  status: 'AVAILABLE' | 'RESERVED' | 'IN_USE' | 'CALIBRATION_DUE';
  calibration_due_date?: string;
  assigned_to?: string;
}

export interface SafetyPermit {
  permit_id: string;
  permit_type: 'LOTO' | 'Work at Height' | 'Hot Work' | 'Confined Space' | 'Electrical Isolation';
  title_en: string;
  title_fr: string;
  asset_tag: string;
  issuer: string;
  holder: string;
  valid_from: string;
  valid_to: string;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
}

export interface AuditLogEntry {
  log_id: string;
  timestamp: string;
  user: string;
  role: string;
  entity: string;
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'DELETE' | 'EXPORT' | 'IMPORT';
  previous_value: string;
  new_value: string;
  reason: string;
}

export interface MaintenanceTeam {
  team_id: string;
  name: string;
  discipline: Discipline;
  members_count: number;
  daily_capacity_hours: number;
  supervisor: string;
}

export interface KPIMetric {
  id: string;
  code: string;
  name_en: string;
  name_fr: string;
  value: number;
  unit: string;
  target: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  definition_en: string;
  definition_fr: string;
  formula: string;
  dataSource: string;
  status: 'GOOD' | 'WARNING' | 'CRITICAL';
}
