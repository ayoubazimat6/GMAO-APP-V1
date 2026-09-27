import React, { useState } from 'react';
import { CMMSProvider, useCMMS } from './context/CMMSContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AssetRegisterView } from './components/AssetRegisterView';
import { PreventiveMaintenanceView } from './components/PreventiveMaintenanceView';
import { PlanningView } from './components/PlanningView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { CorrectiveView } from './components/CorrectiveView';
import { InspectionsView } from './components/InspectionsView';
import { CalibrationView } from './components/CalibrationView';
import { ConditionMonitoringView } from './components/ConditionMonitoringView';
import { InventoryView } from './components/InventoryView';
import { SafetyView } from './components/SafetyView';
import { ReliabilityView } from './components/ReliabilityView';
import { EngineeringDossierView } from './components/EngineeringDossierView';
import { ConfigurationView } from './components/ConfigurationView';

// Modals
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { QRScannerModal } from './components/modals/QRScannerModal';
import { NewWorkOrderModal } from './components/modals/NewWorkOrderModal';
import { ReportAnomalyModal } from './components/modals/ReportAnomalyModal';
import { ExcelImportModal } from './components/modals/ExcelImportModal';

const CMMSMainContent: React.FC = () => {
  const {
    currentTab,
    selectedAssetForDetail,
    setSelectedAssetForDetail,
    assets,
    isOnline,
    t,
  } = useCMMS();

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [anomalyModalOpen, setAnomalyModalOpen] = useState(false);
  const [preselectedAnomalyTag, setPreselectedAnomalyTag] = useState<string | undefined>(undefined);
  const [newWOModalOpen, setNewWOModalOpen] = useState(false);
  const [excelImportOpen, setExcelImportOpen] = useState(false);

  const handleOpenAnomaly = (tag?: string) => {
    setPreselectedAnomalyTag(tag);
    setAnomalyModalOpen(true);
  };

  const handleSelectQRTag = (tag: string) => {
    const matched = assets.find((a) => a.official_tag === tag);
    if (matched) {
      setSelectedAssetForDetail(matched);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenQRScanner={() => setQrModalOpen(true)}
        onOpenAnomalyModal={() => handleOpenAnomaly()}
      />

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{t.common.offlineCachedNotice}</span>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Module Navigation Sidebar */}
        <Sidebar />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'assets' && <AssetRegisterView />}
          {currentTab === 'preventive' && <PreventiveMaintenanceView />}
          {currentTab === 'planning' && (
            <PlanningView onOpenExcelImport={() => setExcelImportOpen(true)} />
          )}
          {currentTab === 'workOrders' && (
            <WorkOrdersView onOpenNewWOModal={() => setNewWOModalOpen(true)} />
          )}
          {currentTab === 'corrective' && (
            <CorrectiveView onOpenReportModal={() => handleOpenAnomaly()} />
          )}
          {currentTab === 'inspections' && <InspectionsView />}
          {currentTab === 'calibration' && <CalibrationView />}
          {currentTab === 'condition' && <ConditionMonitoringView />}
          {currentTab === 'inventory' && <InventoryView />}
          {currentTab === 'safety' && <SafetyView />}
          {currentTab === 'reliability' && <ReliabilityView />}
          {currentTab === 'engineeringDossier' && <EngineeringDossierView />}
          {currentTab === 'configuration' && <ConfigurationView />}
        </main>
      </div>

      {/* Modals */}
      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
          onReportAnomaly={(tag) => {
            setSelectedAssetForDetail(null);
            handleOpenAnomaly(tag);
          }}
        />
      )}

      {qrModalOpen && (
        <QRScannerModal
          onClose={() => setQrModalOpen(false)}
          onSelectTag={handleSelectQRTag}
        />
      )}

      {newWOModalOpen && (
        <NewWorkOrderModal onClose={() => setNewWOModalOpen(false)} />
      )}

      {anomalyModalOpen && (
        <ReportAnomalyModal
          preselectedTag={preselectedAnomalyTag}
          onClose={() => setAnomalyModalOpen(false)}
        />
      )}

      {excelImportOpen && (
        <ExcelImportModal onClose={() => setExcelImportOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <CMMSProvider>
      <CMMSMainContent />
    </CMMSProvider>
  );
}
