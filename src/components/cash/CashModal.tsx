import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck, PlusCircle } from 'lucide-react';

interface CashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashModal: React.FC<CashModalProps> = ({ isOpen, onClose }) => {
  const { turnoCaja, movimientosCaja, addMovimientoCaja } = useApp();
  const [tipo, setTipo] = useState<'INGRESO' | 'EGRESO'>('INGRESO');
  const [monto, setMonto] = useState<string>('');
  const [concepto, setConcepto] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(monto);
    if (isNaN(val) || val <= 0) return;
    if (!concepto.trim()) return;

    addMovimientoCaja(tipo, val, concepto);
    setMonto('');
    setConcepto('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                Arqueo y Movimientos de Caja
              </h3>
              <p className="text-xs text-slate-400">Turno #{turnoCaja.numeroTurno} Activo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status box */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Apertura de Caja</span>
              <span className="text-lg font-black text-slate-800 dark:text-white font-mono">
                Bs{turnoCaja.montoInicial.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Por: {turnoCaja.encargadoApertura}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">
                Efectivo Esperado
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Bs{turnoCaja.efectivoEsperado.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-600/80 block mt-0.5">En custodia actual</span>
            </div>
          </div>

          {/* New movement form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
            <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-[#00b4d8]" />
              Registrar Movimiento / Gasto
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipo('INGRESO')}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  tipo === 'INGRESO'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Ingreso Extra
              </button>
              <button
                type="button"
                onClick={() => setTipo('EGRESO')}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  tipo === 'EGRESO'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Egreso / Gasto
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.5"
                placeholder="Monto (Bs)"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
                className="col-span-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <input
                type="text"
                placeholder="Concepto (ej. Compra de cintas, flete)"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                required
                className="col-span-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition"
            >
              Guardar Movimiento
            </button>
          </form>

          {/* Movements History */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Últimos Movimientos de Este Turno
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {movimientosCaja.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No hay movimientos manuales registrados aún en este turno.
                </p>
              ) : (
                movimientosCaja.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{m.concepto}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.fecha).toLocaleTimeString('es-BO')} • {m.encargadoNombre}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        m.tipo === 'EGRESO' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {m.tipo === 'EGRESO' ? '-' : '+'}Bs{m.monto.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
