import React, { useState } from 'react';
import { useCMMS } from '../context/CMMSContext';
import { SparePart, MaintenanceTool } from '../types/cmms';
import {
  Boxes,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus,
  Bookmark,
  Calendar,
  Layers,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { spareParts, tools, t, lang, reserveSparePart } = useCMMS();
  const [activeTab, setActiveTab] = useState<'parts' | 'tools'>('parts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);
  const [reserveQty, setReserveQty] = useState<number>(1);
  const [reserveWoNum, setReserveWoNum] = useState<string>('WO-2026-000141');
  const [reserveMessage, setReserveMessage] = useState<string | null>(null);

  const filteredParts = spareParts.filter((p) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.part_number.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q) ||
        p.description_fr.toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart) return;
    const ok = reserveSparePart(selectedPart.part_id, reserveQty, reserveWoNum);
    if (ok) {
      setReserveMessage(`Reserved ${reserveQty} ${selectedPart.unit} for ${reserveWoNum}`);
    } else {
      setReserveMessage('Insufficient available quantity in warehouse!');
    }
    setTimeout(() => {
      setReserveMessage(null);
      setSelectedPart(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{t.inventory.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.inventory.subtitle}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 rounded p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'parts' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>MRO Spare Parts ({spareParts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'tools' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Special Tools ({tools.length})</span>
          </button>
        </div>
      </div>

      {reserveMessage && (
        <div className="p-3 rounded bg-sky-950 border border-sky-800 text-sky-300 text-xs flex items-center justify-between">
          <span>{reserveMessage}</span>
          <button onClick={() => setReserveMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SPARE PARTS TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'parts' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search part number, description, manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Part #</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Warehouse & Bin</th>
                    <th className="py-2.5 px-3 text-right">In Stock</th>
                    <th className="py-2.5 px-3 text-right">Reserved</th>
                    <th className="py-2.5 px-3 text-right">Available</th>
                    <th className="py-2.5 px-3 text-right">Unit Price (MAD)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredParts.map((sp) => {
                    const isStockout = sp.available_qty <= 0;
                    return (
                      <tr key={sp.part_id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-bold text-sky-400">{sp.part_number}</td>
                        <td className="py-3 px-3 font-sans text-slate-200">
                          <div className="font-medium">{lang === 'fr' ? sp.description_fr : sp.description_en}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {sp.manufacturer} · MPN: {sp.mpn}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300">{sp.category}</td>
                        <td className="py-3 px-3 text-slate-400">
                          {sp.warehouse} · <span className="text-slate-200 font-bold">{sp.bin_location}</span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-200">
                          {sp.current_stock} {sp.unit}
                        </td>
                        <td className="py-3 px-3 text-right text-amber-400">
                          {sp.reserved_qty} {sp.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-bold">
                          <span className={isStockout ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {sp.available_qty} {sp.unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-200">{sp.unit_cost_mad.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">
                          {isStockout ? (
                            <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded font-bold font-sans">
                              STOCKOUT
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-sans">
                              IN STOCK
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedPart(sp)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition"
                          >
                            Reserve
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SPECIAL TOOLS & CALIBRATION TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'tools' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-slate-800 text-xs text-slate-400">
            Regulated Field Instruments, Diagnostic Analyzers & Calibrated Torque Wrenches
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Tool Description</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Serial Number</th>
                  <th className="py-2.5 px-4">Calibration Due Date</th>
                  <th className="py-2.5 px-4">Current Status</th>
                  <th className="py-2.5 px-4">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {tools.map((tl) => (
                  <tr key={tl.tool_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-sans font-bold text-slate-100">
                      {lang === 'fr' ? tl.name_fr : tl.name_en}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">{tl.category}</td>
                    <td className="py-3 px-4 text-sky-400 font-bold">{tl.serial_number}</td>
                    <td className="py-3 px-4 text-slate-300">{tl.calibration_due_date || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                          tl.status === 'AVAILABLE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : tl.status === 'IN_USE'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {tl.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400">{tl.assigned_to || 'Plant Tool Crib'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spare Reservation Modal */}
      {selectedPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-sm w-full p-5 text-slate-100 shadow-2xl space-y-3">
            <h3 className="font-semibold text-base text-sky-400 flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              Reserve Spare Part for Work Order
            </h3>
            <div className="text-xs bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-slate-200">{selectedPart.part_number}</span>
              <p className="text-slate-400 font-sans">{selectedPart.description_en}</p>
              <div className="text-slate-300 font-mono pt-1">
                Available in stock: <strong className="text-emerald-400">{selectedPart.available_qty} {selectedPart.unit}</strong>
              </div>
            </div>

            <form onSubmit={handleReserve} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Work Order #</label>
                <input
                  type="text"
                  value={reserveWoNum}
                  onChange={(e) => setReserveWoNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reservation Quantity ({selectedPart.unit})</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, selectedPart.available_qty)}
                  value={reserveQty}
                  onChange={(e) => setReserveQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPart(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
