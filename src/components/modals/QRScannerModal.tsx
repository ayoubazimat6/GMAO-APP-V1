import React, { useState } from 'react';
import { useCMMS } from '../../context/CMMSContext';
import { QrCode, Search, ArrowRight, Camera } from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
  onSelectTag: (tag: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onSelectTag }) => {
  const { assets } = useCMMS();
  const [selectedTag, setSelectedTag] = useState<string>('G-BC-41');

  const handleScan = () => {
    onSelectTag(selectedTag);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-sm w-full p-6 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm text-slate-100">Equipment QR Tag Scanner</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Visual camera reticle */}
        <div className="relative w-full h-44 bg-slate-950 rounded border border-slate-800 flex flex-col items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-4 border-2 border-dashed border-sky-500/50 rounded flex items-center justify-center pointer-events-none">
            <div className="w-full h-0.5 bg-sky-400/80 shadow-[0_0_8px_#38bdf8] animate-bounce" />
          </div>
          <Camera className="w-8 h-8 text-slate-600 mb-2" />
          <span className="text-[11px] text-slate-400 font-mono text-center">
            Point camera at machine QR plate
          </span>
        </div>

        {/* Tag Selector Simulator */}
        <div className="space-y-2 text-xs">
          <label className="text-slate-400 block font-mono">Simulate Scanning Tag:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
          >
            {assets.map((a) => (
              <option key={a.asset_id} value={a.official_tag}>
                {a.official_tag} — {a.name_en}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs">
            Cancel
          </button>
          <button
            onClick={handleScan}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
          >
            <span>Scan & Open Passport</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
