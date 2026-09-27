import React from 'react';
import { useCMMS, NavTab, DashboardPerspective } from '../context/CMMSContext';
import {
  LayoutDashboard,
  Layers,
  CalendarCheck,
  CalendarDays,
  Wrench,
  AlertOctagon,
  ClipboardCheck,
  Gauge,
  Activity,
  Boxes,
  ShieldCheck,
  TrendingUp,
  FileCode,
  Settings,
  ChevronRight,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    perspective,
    setPerspective,
    t,
    workOrders,
    pmPlans,
    wednesdayTasks,
    correctiveCases,
    calibrations,
    spareParts,
  } = useCMMS();

  // Badges calculation
  const openWOCount = workOrders.filter((w) => w.status !== 'CLOSED' && w.status !== 'CANCELLED').length;
  const overduePMCount = pmPlans.filter((p) => p.status === 'ACTIVE' && new Date(p.next_due_date) < new Date()).length;
  const criticalCorrectiveCount = correctiveCases.filter((c) => c.status !== 'CLOSED' && c.production_impact === 'CRITICAL_STOP').length;
  const stockoutCount = spareParts.filter((s) => s.available_qty < 0).length;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'assets', label: t.nav.assets, icon: Layers },
    { id: 'preventive', label: t.nav.preventive, icon: CalendarCheck, badge: overduePMCount, badgeColor: 'bg-amber-500' },
    { id: 'planning', label: t.nav.planning, icon: CalendarDays },
    { id: 'workOrders', label: t.nav.workOrders, icon: Wrench, badge: openWOCount, badgeColor: 'bg-sky-600' },
    { id: 'corrective', label: t.nav.corrective, icon: AlertOctagon, badge: criticalCorrectiveCount, badgeColor: 'bg-rose-600' },
    { id: 'inspections', label: t.nav.inspections, icon: ClipboardCheck },
    { id: 'calibration', label: t.nav.calibration, icon: Gauge },
    { id: 'condition', label: t.nav.conditionMonitoring, icon: Activity },
    { id: 'inventory', label: t.nav.inventory, icon: Boxes, badge: stockoutCount, badgeColor: 'bg-amber-600' },
    { id: 'safety', label: t.nav.safety, icon: ShieldCheck },
    { id: 'reliability', label: t.nav.reliability, icon: TrendingUp },
    { id: 'engineeringDossier', label: t.nav.engineeringDossier, icon: FileCode },
    { id: 'configuration', label: t.nav.configuration, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Perspective Selector for Dashboard */}
      {currentTab === 'dashboard' && (
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-semibold">
            Operational Perspective
          </label>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <button
              onClick={() => setPerspective('manager')}
              className={`px-2 py-1 rounded text-left truncate transition ${
                perspective === 'manager'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setPerspective('planner')}
              className={`px-2 py-1 rounded text-left truncate transition ${
                perspective === 'planner'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Planner
            </button>
            <button
              onClick={() => setPerspective('technician')}
              className={`px-2 py-1 rounded text-left truncate transition ${
                perspective === 'technician'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Field Tech
            </button>
            <button
              onClick={() => setPerspective('supervisor')}
              className={`px-2 py-1 rounded text-left truncate transition ${
                perspective === 'supervisor'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Supervisor
            </button>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors group ${
                isActive
                  ? 'bg-sky-950/60 text-sky-400 font-semibold border-l-2 border-sky-400'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold text-white ${
                      item.badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Wednesday Shutdown Quick Status Banner */}
      <div className="p-3 m-2 rounded bg-amber-950/40 border border-amber-900/60 text-slate-300 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Arrêt Mercredi (8h)</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          {wednesdayTasks.filter((t) => t.execution_readiness === 'READY').length} / {wednesdayTasks.length} tâches prêtes pour l’exécution.
        </p>
      </div>

      {/* Facility Footer Reference */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <span>TSP3 · Jorf Lasfar</span>
        <span className="text-emerald-400 font-medium">v1.4 ISO 55000</span>
      </div>
    </aside>
  );
};
