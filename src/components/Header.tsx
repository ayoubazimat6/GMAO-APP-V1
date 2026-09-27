import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { UserRole } from '../types/cmms';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  ShieldAlert,
  Globe,
  User,
  QrCode,
  FileSpreadsheet,
  BookOpen,
  Wifi,
  WifiOff,
  Download,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onOpenQRScanner: () => void;
  onOpenAnomalyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQRScanner, onOpenAnomalyModal }) => {
  const {
    lang,
    setLang,
    t,
    role,
    setRole,
    isOnline,
    setIsOnline,
    setCurrentTab,
    currentTab,
    resetAllData,
  } = useCMMS();

  const { isInstallable, install } = usePWAInstall();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const availableRoles: UserRole[] = [
    'MAINTENANCE_MANAGER',
    'MAINTENANCE_PLANNER',
    'MAINTENANCE_SUPERVISOR',
    'MECHANICAL_SUPERVISOR',
    'ELECTRICAL_SUPERVISOR',
    'INSTRUMENTATION_SUPERVISOR',
    'TECHNICIAN',
    'RELIABILITY_ENGINEER',
    'STOREKEEPER',
    'ADMIN',
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center font-black text-white text-sm shadow">
            T3
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="text-left font-bold text-base tracking-tight text-white hover:text-sky-300 transition-colors"
            >
              TSP3 Industrial CMMS
            </button>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider">
              OCP JORF LASFAR · FACTORY 3
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Fast Switcher */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-colors hover:text-white ${
              currentTab === 'dashboard' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            {t.nav.dashboard}
          </button>
          <button
            onClick={() => setCurrentTab('assets')}
            className={`transition-colors hover:text-white ${
              currentTab === 'assets' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            {t.nav.assets}
          </button>
          <button
            onClick={() => setCurrentTab('planning')}
            className={`transition-colors hover:text-white ${
              currentTab === 'planning' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            {t.nav.planning}
          </button>
          <button
            onClick={() => setCurrentTab('workOrders')}
            className={`transition-colors hover:text-white ${
              currentTab === 'workOrders' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : ''
            }`}
          >
            {t.nav.workOrders}
          </button>
          <button
            onClick={() => setCurrentTab('engineeringDossier')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              currentTab === 'engineeringDossier' ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1' : 'text-amber-300/90'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dossier Système (A–X)</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Offline/Online field indicator & toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            title={isOnline ? t.common.onlineMode : t.common.offlineMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
              isOnline
                ? 'bg-slate-800 text-emerald-400 border-emerald-900/60 hover:bg-slate-700'
                : 'bg-amber-950/80 text-amber-300 border-amber-800 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          {/* Quick QR Asset Scanner */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title={t.common.qrScanner}
          >
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">QR Scan</span>
          </button>

          {/* Report Failure / Anomaly */}
          <button
            onClick={onOpenAnomalyModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.common.reportAnomaly}</span>
          </button>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition"
              title="Install PWA"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">App</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setLang('fr')}
              className={`px-2 py-0.5 rounded transition ${
                lang === 'fr' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded transition ${
                lang === 'en' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* RBAC Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
              title="Switch RBAC Persona"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[110px] truncate hidden md:inline font-mono">{t.roles[role]}</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-xl bg-slate-800 border border-slate-700 py-1 text-xs z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-700 uppercase">
                  Select Active Persona / RBAC
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {availableRoles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-700 transition flex items-center justify-between ${
                        role === r ? 'bg-slate-700/60 text-sky-400 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <span>{t.roles[r]}</span>
                      {role === r && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-800 transition"
            title="Reset Master Plant Dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-sm w-full p-5 text-slate-100 shadow-2xl">
            <h3 className="font-semibold text-base mb-2 text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Reset TSP3 Initial Dataset?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              This will restore all verified TSP3 plant assets, task templates, weekly schedules and calibration records to official factory defaults.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
