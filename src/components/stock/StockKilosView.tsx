import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, Package, AlertTriangle, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export const StockKilosView: React.FC = () => {
  const { products, adjustStock } = useApp();

  const [simuladorKilos, setSimuladorKilos] = useState<number>(500);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const totalKilos = products.reduce((acc, p) => acc + p.stockKilos, 0);
  const totalBolsas = products.reduce((acc, p) => acc + p.stockBolsas, 0);

  const selectedProd = products.find((p) => p.id === selectedProductId) || products[0];
  const simulatedBolsas = selectedProd && selectedProd.kilosPorUnidad > 0
    ? Math.floor(simuladorKilos / selectedProd.kilosPorUnidad)
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-[#00b4d8]" />
            Control de Stock en Kilos & Bolsas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervisión precisa de pesaje por kilo y conversión de bolsas de 5, 10 y 25 kg
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Masa Total de Fideo en Planta
          </span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {totalKilos.toFixed(1)} <span className="text-lg">Kilos</span>
          </p>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            {(totalKilos / 1000).toFixed(2)} Toneladas Métricas de pasta
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Unidades Empacadas (Bolsas/Fardos)
          </span>
          <p className="text-3xl font-black text-[#00b4d8] font-mono mt-1">
            {totalBolsas} <span className="text-lg font-bold">Bolsas</span>
          </p>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Listas para distribución a Yungas y Guanay
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Promedio de Peso por Empaque
          </span>
          <p className="text-3xl font-black text-slate-800 dark:text-white font-mono mt-1">
            {(totalBolsas > 0 ? totalKilos / totalBolsas : 10).toFixed(1)}{' '}
            <span className="text-lg font-bold">Kg/Bolsa</span>
          </p>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Densidad de empaque en almacén
          </span>
        </div>
      </div>

      {/* Simulator: Harina a Kilos y Bolsas */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent dark:from-cyan-950/40 p-5 rounded-2xl border border-cyan-200/80 dark:border-cyan-800 space-y-4">
        <div className="flex items-center gap-2 text-[#00b4d8]">
          <RefreshCw className="w-5 h-5" />
          <h3 className="font-black text-sm uppercase text-slate-900 dark:text-white">
            Calculadora de Conversión: Kilos de Producción a Bolsas
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
              Fideo a Empacar
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.kilosPorUnidad} kg/u)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
              Kilos de Fideo Elaborados en Molino
            </label>
            <input
              type="number"
              step="10"
              value={simuladorKilos}
              onChange={(e) => setSimuladorKilos(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-black font-mono text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-slate-500">Rendimiento en Bolsas:</span>
            <span className="text-xl font-black text-[#00b4d8] font-mono">
              {simulatedBolsas} Bolsas
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Products Weight and Bags Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => {
          const isLow = p.stockKilos <= p.minStockKilos;

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase leading-snug">
                    {p.nombre}
                  </h4>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block mt-0.5">
                    {p.descripcionKilos}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Package className="w-4 h-4" />
                </div>
              </div>

              {/* Weight & Bags Progress Visual */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Existencia en Kilos:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                    {p.stockKilos.toFixed(1)} Kg
                  </span>
                </div>

                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Existencia en Bolsas:</span>
                  <span className="font-mono text-slate-800 dark:text-white font-black">
                    {p.stockBolsas} bolsas ({p.kilosPorUnidad} kg c/u)
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isLow ? 'bg-amber-500' : 'bg-[#00b4d8]'
                    }`}
                    style={{
                      width: `${Math.min(100, (p.stockKilos / (p.minStockKilos * 4)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {isLow && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Requiere molienda: Por debajo de {p.minStockKilos} Kg mínimos</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
