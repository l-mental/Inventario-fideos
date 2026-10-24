import React from 'react';
import { Venta } from '../../types';
import { Printer, Download, CheckCircle2, X, Package, UserCheck, MapPin, Calendar } from 'lucide-react';

interface ReceiptModalProps {
  sale: Venta | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header modal */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
              Venta Registrada Exitosamente
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 overflow-y-auto space-y-4 print:p-0 print:m-0" id="printable-receipt">
          {/* Header Ticket */}
          <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-4">
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              FIDEOS SOFTPLUS BOLIVIA
            </h2>
            <p className="text-xs text-slate-500 font-medium">MOLINO & FÁBRICA DE PASTAS ALIMENTICIAS</p>
            <p className="text-xs text-slate-500">La Paz - Sud Yungas - Guanay</p>
            <div className="mt-2 inline-block px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 rounded font-mono font-bold text-xs border border-cyan-200 dark:border-cyan-800">
              NOTA DE ENTREGA / DESPACHO #{sale.numeroComprobante}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block font-medium">Fecha y Hora:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {new Date(sale.fecha).toLocaleString('es-BO')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Encargado de Venta:</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                {sale.encargadoNombre}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Destino / Tarifa:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" />
                {sale.destinoNombre}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Método de Pago:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {sale.metodoPago}
              </span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block font-medium">Cliente:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {sale.clienteNombre} {sale.clienteDocumento ? `(NIT/CI: ${sale.clienteDocumento})` : ''}
              </span>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5">Producto</th>
                  <th className="p-2.5 text-center">Cant. / Kilos</th>
                  <th className="p-2.5 text-right">P. Unit</th>
                  <th className="p-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sale.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                      {it.nombre}
                      <span className="block text-[10px] font-normal text-slate-500">
                        {it.unidad === 'bolsas' ? `Presentación en bolsa` : `Venta fraccionada`}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {it.cantidad} {it.unidad}
                      </span>
                      <span className="block text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                        ({it.kilosTotales.toFixed(2)} kg)
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-slate-600 dark:text-slate-300 font-mono">
                      Bs{it.precioUnitario.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-right font-bold text-slate-800 dark:text-white font-mono">
                      Bs{it.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
              <span>Total Kilos Despachados:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">{sale.totalKilos.toFixed(2)} Kg</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
              <span>Total Bolsas / Paquetes:</span>
              <span>{sale.totalBolsas} unid.</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono">Bs{sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.descuento > 0 && (
              <div className="flex justify-between text-amber-600 font-semibold">
                <span>Descuento aplicado:</span>
                <span className="font-mono">-Bs{sale.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-300 dark:border-slate-700 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-900 dark:text-white">TOTAL NETO:</span>
              <span className="text-xl font-black text-[#00b4d8] font-mono">
                Bs{sale.totalNeto.toFixed(2)}
              </span>
            </div>

            {sale.metodoPago === 'EFECTIVO' && sale.montoRecibido && (
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Efectivo Recibido: Bs{sale.montoRecibido.toFixed(2)}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Cambio: Bs{(sale.cambio || 0).toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400 italic">
            Gracias por su preferencia • Fideos de calidad boliviana
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
