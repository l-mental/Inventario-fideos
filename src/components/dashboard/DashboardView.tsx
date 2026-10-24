import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutGrid,
  ShoppingCart,
  Boxes,
  Users,
  TrendingUp,
  MapPin,
  ArrowRight,
  Scale,
  Award,
  PackageCheck,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { sales, products, staff, destinations, setActiveView } = useApp();

  const totalVentasBs = sales.reduce((acc, s) => acc + s.totalNeto, 0);
  const totalKilosVendidos = sales.reduce((acc, s) => acc + s.totalKilos, 0);
  const totalKilosStock = products.reduce((acc, p) => acc + p.stockKilos, 0);
  const totalBolsasStock = products.reduce((acc, p) => acc + p.stockBolsas, 0);

  // Group sales by destination
  const salesByDest: Record<string, { name: string; totalBs: number; totalKg: number }> = {};
  sales.forEach((s) => {
    if (!salesByDest[s.destinoId]) {
      salesByDest[s.destinoId] = { name: s.destinoNombre, totalBs: 0, totalKg: 0 };
    }
    salesByDest[s.destinoId].totalBs += s.totalNeto;
    salesByDest[s.destinoId].totalKg += s.totalKilos;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-[#00b4d8]" />
            Tablero Principal de Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resumen general de operaciones de la fábrica de fideos, ventas a Yungas y estado de inventarios
          </p>
        </div>

        <button
          onClick={() => setActiveView('pos')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
        >
          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          <span>Ir a Terminal POS (Venta Directa)</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Total Despachado (Kilos)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {totalKilosVendidos.toFixed(0)} <span className="text-sm font-bold">Kg</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Pasta entregada a clientes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Ventas Totales
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#00b4d8] font-mono mt-1">
            Bs{totalVentasBs.toFixed(2)}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Facturación acumulada</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Inventario en Kilos
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-mono mt-1">
            {totalKilosStock.toFixed(0)} <span className="text-sm font-bold">Kg</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">En almacén central</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Bolsas Disponibles
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-mono mt-1">
            {totalBolsasStock} <span className="text-sm font-bold">bolsas</span>
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Unidades selladas</span>
        </div>
      </div>

      {/* Distribution by Destination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Destinos */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00b4d8]" />
              Despachos por Destino / Región
            </h3>
            <button
              onClick={() => setActiveView('destinations')}
              className="text-xs font-bold text-[#00b4d8] hover:underline"
            >
              Ver Rutas
            </button>
          </div>

          <div className="space-y-3">
            {Object.values(salesByDest).map((dest) => {
              const pct = totalVentasBs > 0 ? (dest.totalBs / totalVentasBs) * 100 : 0;
              return (
                <div key={dest.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{dest.name}</span>
                    <span className="font-mono text-[#00b4d8]">
                      Bs{dest.totalBs.toFixed(2)}{' '}
                      <span className="text-slate-400 font-normal">({dest.totalKg.toFixed(0)} kg)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00b4d8] h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Encargados Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Desempeño de Encargados
            </h3>
            <button
              onClick={() => setActiveView('staff')}
              className="text-xs font-bold text-[#00b4d8] hover:underline"
            >
              Ver Equipo
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {staff.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-black text-slate-900 dark:text-white uppercase">{s.nombre}</p>
                  <span className="text-[10px] text-slate-400">{s.cargo}</span>
                </div>
                <div className="text-right">
                  <span className="font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                    {(s.totalKilosDespachados || 0).toFixed(0)} Kg
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bs{(s.totalVentasBs || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
