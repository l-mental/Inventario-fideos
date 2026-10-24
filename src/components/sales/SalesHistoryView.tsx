import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Filter,
  UserCheck,
  MapPin,
  FileText,
  Printer,
  Calendar,
  DollarSign,
  Scale,
  Package,
} from 'lucide-react';
import { Venta } from '../../types';
import { ReceiptModal } from '../pos/ReceiptModal';

export const SalesHistoryView: React.FC = () => {
  const { sales, staff, destinations } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [staffFilter, setStaffFilter] = useState('todos');
  const [destinationFilter, setDestinationFilter] = useState('todos');
  const [paymentFilter, setPaymentFilter] = useState('todos');
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Venta | null>(null);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchSearch =
        s.numeroComprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.encargadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.destinoNombre.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;
      if (staffFilter !== 'todos' && s.encargadoId !== staffFilter) return false;
      if (destinationFilter !== 'todos' && s.destinoId !== destinationFilter) return false;
      if (paymentFilter !== 'todos' && s.metodoPago !== paymentFilter) return false;

      return true;
    });
  }, [sales, searchTerm, staffFilter, destinationFilter, paymentFilter]);

  // Aggregate totals
  const totalKilos = filteredSales.reduce((acc, s) => acc + s.totalKilos, 0);
  const totalBs = filteredSales.reduce((acc, s) => acc + s.totalNeto, 0);
  const totalBolsas = filteredSales.reduce((acc, s) => acc + s.totalBolsas, 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#00b4d8]" />
            Historial de Ventas & Despachos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro detallado de despachos por encargado, destino regional, kilos entregados y método de pago
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Total Facturado
          </span>
          <p className="text-2xl font-black text-[#00b4d8] font-mono mt-1">
            Bs{totalBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">{filteredSales.length} comprobantes emitidos</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Total Kilos Despachados
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {totalKilos.toFixed(1)} <span className="text-sm font-bold">Kg</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Volumen de pasta distribuida</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Total Bolsas / Fardos
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalBolsas} <span className="text-sm font-bold">unidades</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Bolsas de 5, 10 y 25 kg</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar venta, cliente o encargado..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Staff filter */}
          <div>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="todos">Todos los Encargados</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Destination filter */}
          <div>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="todos">Todos los Destinos (Chulumani, Guanay...)</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="todos">Todos los Métodos de Pago</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="PAGO QR">Pago QR</option>
              <option value="MIXTO">Mixto</option>
              <option value="CRÉDITO">Crédito</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Comprobante</th>
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-3">Encargado de Venta</th>
                <th className="py-3 px-3">Destino / Tarifa</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3 text-center">Kilos y Bolsas</th>
                <th className="py-3 px-3">Método</th>
                <th className="py-3 px-3 text-right">Total Neto</th>
                <th className="py-3 px-4 text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    No se encontraron registros de ventas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#00b4d8]">
                      {s.numeroComprobante}
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {new Date(s.fecha).toLocaleDateString('es-BO')}
                      <span className="block text-[10px] text-slate-400">
                        {new Date(s.fecha).toLocaleTimeString('es-BO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                        {s.encargadoNombre}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {s.destinoNombre}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {s.clienteNombre}
                      </p>
                      {s.clienteDocumento && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          NIT: {s.clienteDocumento}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                        {s.totalKilos.toFixed(1)} Kg
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        ({s.totalBolsas} bolsas)
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {s.metodoPago}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-black font-mono text-sm text-slate-900 dark:text-white">
                      Bs{s.totalNeto.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSaleForReceipt(s)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white text-xs font-bold transition flex items-center justify-center gap-1 mx-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ver Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        sale={selectedSaleForReceipt}
        onClose={() => setSelectedSaleForReceipt(null)}
      />
    </div>
  );
};
