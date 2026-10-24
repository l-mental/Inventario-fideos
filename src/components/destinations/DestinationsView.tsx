import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Plus, Edit2, Check, DollarSign, Package } from 'lucide-react';

export const DestinationsView: React.FC = () => {
  const { destinations, products, addDestination, updateProduct } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [destName, setDestName] = useState('');
  const [destDept, setDestDept] = useState('Sud Yungas - La Paz');
  const [destDesc, setDestDesc] = useState('');

  // Quick edit price in matrix
  const [editingCell, setEditingCell] = useState<{ productId: string; destId: string } | null>(null);
  const [tempPrice, setTempPrice] = useState('');

  const handleCreateDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName.trim()) return;

    addDestination({
      name: destName.trim(),
      department: destDept.trim(),
      description: destDesc.trim() || `Ruta de distribución para ${destName.trim()}`,
    });

    setDestName('');
    setDestDesc('');
    setIsAddModalOpen(false);
  };

  const handleSaveCellPrice = (productId: string, destId: string) => {
    const val = parseFloat(tempPrice);
    if (isNaN(val) || val <= 0) {
      setEditingCell(null);
      return;
    }

    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (destId === 'tienda') {
      updateProduct({
        ...prod,
        precioTienda: val,
      });
    } else {
      updateProduct({
        ...prod,
        preciosPorDestino: {
          ...prod.preciosPorDestino,
          [destId]: val,
        },
      });
    }
    setEditingCell(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-[#00b4d8]" />
            Tarifas & Rutas Regionales (Yungas & Norte)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Matriz comparativa de precios por fideo para Chulumani, Irupana, Guanay, Palos Blancos, La Asunta y nuevos destinos
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Agregar Nuevo Destino</span>
        </button>
      </div>

      {/* Destinations Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00b4d8]" />
                {d.name}
              </span>
              {d.id === 'tienda' && (
                <span className="text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 px-2 py-0.5 rounded">
                  BASE TIENDA
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-slate-400">{d.department}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {d.description || 'Punto de entrega y distribución oficial'}
            </p>
          </div>
        ))}
      </div>

      {/* Price Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase">
              Matriz de Precios por Plaza (Haz clic en un precio para editarlo)
            </h3>
            <p className="text-xs text-slate-400">
              Precios vigentes por unidad de empaque (bolsa o kilo según presentación)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Fideo / Presentación</th>
                <th className="py-3 px-3 text-right">P. Antiguo</th>
                <th className="py-3 px-3 text-right">P. Actual</th>
                {destinations.map((d) => (
                  <th
                    key={d.id}
                    className={`py-3 px-3 text-right ${
                      d.id === 'tienda' ? 'bg-cyan-50/50 dark:bg-cyan-950/20 text-[#00b4d8]' : ''
                    }`}
                  >
                    {d.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <p className="font-black text-slate-900 dark:text-white uppercase leading-snug">
                      {p.nombre}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {p.presentacion} • {p.descripcionKilos}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-400 line-through">
                    Bs{p.precioAntiguo.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                    Bs{p.precioActual.toFixed(2)}
                  </td>

                  {destinations.map((d) => {
                    const price =
                      d.id === 'tienda'
                        ? p.precioTienda
                        : p.preciosPorDestino?.[d.id] ?? (p.precioTienda + 5);

                    const isEditing =
                      editingCell?.productId === p.id && editingCell?.destId === d.id;

                    return (
                      <td
                        key={d.id}
                        className={`py-3 px-3 text-right font-mono font-black ${
                          d.id === 'tienda'
                            ? 'bg-cyan-50/30 dark:bg-cyan-950/20 text-[#00b4d8]'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="0.5"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-16 px-1.5 py-0.5 text-right font-mono text-xs font-bold bg-white dark:bg-slate-800 border rounded text-slate-800 dark:text-white outline-none ring-1 ring-cyan-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCellPrice(p.id, d.id);
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveCellPrice(p.id, d.id)}
                              className="p-1 bg-[#00b4d8] text-white rounded hover:bg-[#0096c7]"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => {
                              setEditingCell({ productId: p.id, destId: d.id });
                              setTempPrice(String(price));
                            }}
                            className="cursor-pointer hover:underline hover:text-cyan-600 block py-1"
                            title="Haz clic para modificar precio"
                          >
                            Bs{price.toFixed(2)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Destination Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Nuevo Destino / Ruta de Precios
            </h3>
            <form onSubmit={handleCreateDestination} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">
                  Nombre del Destino (Población o Feria)
                </label>
                <input
                  type="text"
                  required
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder="ej. Caranavi, Coripata, Tipuani"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">
                  Provincia o Departamento
                </label>
                <input
                  type="text"
                  value={destDept}
                  onChange={(e) => setDestDept(e.target.value)}
                  placeholder="ej. Caranavi - La Paz"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Descripción de Ruta</label>
                <input
                  type="text"
                  value={destDesc}
                  onChange={(e) => setDestDesc(e.target.value)}
                  placeholder="ej. Despacho semanal vía camión refrigerado/cerrado"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-xl text-xs font-bold"
                >
                  Crear Destino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
