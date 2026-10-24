import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, DollarSign, Scale, MapPin, Calendar, ArrowUpRight, BarChart3 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { sales, products, destinations, staff } = useApp();

  const totalFacturado = sales.reduce((acc, s) => acc + s.totalNeto, 0);
  const totalKilos = sales.reduce((acc, s) => acc + s.totalKilos, 0);

  // Group by payment method
  const byPayment: Record<string, number> = {};
  sales.forEach((s) => {
    byPayment[s.metodoPago] = (byPayment[s.metodoPago] || 0) + s.totalNeto;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-[#00b4d8]" />
            Finanzas, Márgenes & Reportes de Distribución
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Análisis de ingresos por plaza comercial (Chulumani, Irupana, Guanay, Palos Blancos, La Asunta) y rentabilidad
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Ingresos Totales (Ventas Netas)
          </span>
          <p className="text-3xl font-black text-[#00b4d8] font-mono mt-1">
            Bs{totalFacturado.toFixed(2)}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Cobrado en efectivo, QR y crédito</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Kilos Totales Comercializados
          </span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {totalKilos.toFixed(1)} <span className="text-lg">Kg</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Promedio: Bs{(totalKilos > 0 ? totalFacturado / totalKilos : 0).toFixed(2)} / Kilo
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Margen de Flete y Transporte
          </span>
          <p className="text-3xl font-black text-slate-800 dark:text-white font-mono mt-1">
            +9.8%
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Compensa logística hacia los Yungas</span>
        </div>
      </div>

      {/* Breakdown by destination table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase">
            Rendimiento Financiero por Plaza de Venta
          </h3>
          <p className="text-xs text-slate-400">
            Comparativo de ventas, kilos y preferencia de mercado
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Destino / Ruta</th>
                <th className="py-3 px-3">Departamento / Zona</th>
                <th className="py-3 px-3 text-center">Despachos Registrados</th>
                <th className="py-3 px-3 text-right">Kilos Vendidos</th>
                <th className="py-3 px-3 text-right">Facturación en Bs</th>
                <th className="py-3 px-4 text-right">% Participación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {destinations.map((d) => {
                const salesInDest = sales.filter((s) => s.destinoId === d.id);
                const kgInDest = salesInDest.reduce((acc, s) => acc + s.totalKilos, 0);
                const bsInDest = salesInDest.reduce((acc, s) => acc + s.totalNeto, 0);
                const pct = totalFacturado > 0 ? (bsInDest / totalFacturado) * 100 : 0;

                return (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#00b4d8]" />
                      <span>{d.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {d.department}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {salesInDest.length} pedidos
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {kgInDest.toFixed(1)} Kg
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900 dark:text-white">
                      Bs{bsInDest.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-600 font-bold">
                      {pct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
