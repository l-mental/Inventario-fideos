import React, { useState } from 'react';
import { Truck, Plus, PackageCheck, AlertCircle, Calendar, DollarSign } from 'lucide-react';

interface PurchaseItem {
  id: string;
  fecha: string;
  proveedor: string;
  material: string;
  cantidad: number;
  unidad: string;
  costoTotalBs: number;
  encargadoRecepcion: string;
  factura: string;
}

export const PurchasesView: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([
    {
      id: 'CMP-001',
      fecha: '2026-10-20',
      proveedor: 'Molino Andino S.A.',
      material: 'Harina de Trigo Especial 000 (Bolsas 50 Kg)',
      cantidad: 200,
      unidad: 'Bolsas (10,000 Kg)',
      costoTotalBs: 38000,
      encargadoRecepcion: 'Gonzalo Huanca',
      factura: 'FAC-84910',
    },
    {
      id: 'CMP-002',
      fecha: '2026-10-22',
      proveedor: 'Plásticos del Valle Ltda.',
      material: 'Bobinas de Polipropileno para Bolsa Fideo 10 Kg',
      cantidad: 50,
      unidad: 'Bobinas',
      costoTotalBs: 7200,
      encargadoRecepcion: 'Juan Carlos Mamani',
      factura: 'FAC-10294',
    },
    {
      id: 'CMP-003',
      fecha: '2026-10-22',
      proveedor: 'NutriVitaminas Bolivia',
      material: 'Complejo Vitamínico y Hierro para Fideos Fortificados',
      cantidad: 25,
      unidad: 'Kilos',
      costoTotalBs: 3150,
      encargadoRecepcion: 'Gonzalo Huanca',
      factura: 'FAC-39401',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proveedor, setProveedor] = useState('');
  const [material, setMaterial] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('Bolsas 50 Kg');
  const [costo, setCosto] = useState('');
  const [factura, setFactura] = useState('');

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !proveedor.trim()) return;

    const newPurchase: PurchaseItem = {
      id: `CMP-${String(purchases.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      proveedor: proveedor.trim(),
      material: material.trim(),
      cantidad: parseFloat(cantidad) || 1,
      unidad,
      costoTotalBs: parseFloat(costo) || 0,
      encargadoRecepcion: 'Gonzalo Huanca',
      factura: factura.trim() || `FAC-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setPurchases([newPurchase, ...purchases]);
    setProveedor('');
    setMaterial('');
    setCantidad('');
    setCosto('');
    setFactura('');
    setIsModalOpen(false);
  };

  const totalInvertido = purchases.reduce((acc, p) => acc + p.costoTotalBs, 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-[#00b4d8]" />
            Compras & Ingreso de Materia Prima
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Abastecimiento de harina de trigo, sémola, aditivos e insumos de empaque para fábrica de fideos
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Registrar Ingreso de Insumos</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Inversión en Insumos
          </span>
          <p className="text-2xl font-black text-[#00b4d8] font-mono mt-1">
            Bs{totalInvertido.toLocaleString('es-BO')}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Harina, polipropileno, sémola</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Lotes Recibidos
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {purchases.length} Lotes
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Ingresos a almacén de materia prima</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Stock de Harina Disponible
          </span>
          <p className="text-2xl font-black text-slate-800 dark:text-white font-mono mt-1">
            10,000 <span className="text-sm">Kg</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Equivalente a 200 bolsas de 50 Kg</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Código / Factura</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Proveedor</th>
                <th className="py-3 px-3">Insumo / Materia Prima</th>
                <th className="py-3 px-3 text-center">Cantidad Recibida</th>
                <th className="py-3 px-3 text-right">Costo Total (Bs)</th>
                <th className="py-3 px-4">Encargado Recepción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-[#00b4d8]">
                    {p.id}
                    <span className="block text-[10px] text-slate-400">{p.factura}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                    {p.fecha}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-white">
                    {p.proveedor}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {p.material}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {p.cantidad} {p.unidad}
                  </td>
                  <td className="py-3 px-3 text-right font-black font-mono text-slate-900 dark:text-white">
                    Bs{p.costoTotalBs.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {p.encargadoRecepcion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Registrar Compra de Insumos / Harina
            </h3>
            <form onSubmit={handleAddPurchase} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Proveedor *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Molino Andino S.A."
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Descripción del Insumo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Harina de trigo especial 000 para fideo largo"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Cantidad *</label>
                  <input
                    type="number"
                    required
                    placeholder="ej. 100"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Unidad de Medida</label>
                  <input
                    type="text"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    placeholder="Bolsas 50 Kg / Kilos"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Costo Total (Bs) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="ej. 19000"
                    value={costo}
                    onChange={(e) => setCosto(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono font-black text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Factura / Remisión</label>
                  <input
                    type="text"
                    placeholder="FAC-90123"
                    value={factura}
                    onChange={(e) => setFactura(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-xl text-xs font-bold"
                >
                  Guardar Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
