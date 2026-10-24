import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, X, Check, ShoppingCart, UserCheck, MapPin } from 'lucide-react';

interface ProformasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProformasModal: React.FC<ProformasModalProps> = ({ isOpen, onClose }) => {
  const { cart, activeDestinationId, destinations, staff, activeStaffId } = useApp();

  if (!isOpen) return null;

  const activeDest = destinations.find((d) => d.id === activeDestinationId);
  const activeStaff = staff.find((s) => s.id === activeStaffId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-[#00b4d8] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                Proformas y Cotizaciones
              </h3>
              <p className="text-xs text-slate-400">Precios por destino y fardos para mayoristas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-200 block">
                Cotización Activa: {activeDest?.name}
              </span>
              <span className="text-[11px] text-slate-500">
                Encargado asignado: {activeStaff?.nombre}
              </span>
            </div>
            <span className="px-2 py-1 rounded bg-[#00b4d8] text-white font-extrabold text-[10px]">
              VIGENTE
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Resumen de Carrito como Proforma
            </h4>
            {cart.length === 0 ? (
              <p className="text-slate-400 italic py-4 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                Agregue productos al terminal POS para generar una proforma impresa o cotización para comerciantes de los Yungas / Guanay.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-xl overflow-hidden">
                {cart.map((ci, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between items-center bg-white dark:bg-slate-800/60">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{ci.producto.nombre}</p>
                      <span className="text-[10px] text-slate-400">
                        {ci.cantidad} {ci.unidadSeleccionada} • {ci.kilosCalculados.toFixed(2)} kg
                      </span>
                    </div>
                    <span className="font-bold font-mono text-[#00b4d8]">
                      Bs{ci.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
