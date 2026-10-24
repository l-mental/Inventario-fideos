import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Plus, UserCheck, Phone, CheckCircle, Scale, DollarSign } from 'lucide-react';
import { StaffMember } from '../../types';

export const StaffView: React.FC = () => {
  const { staff, activeStaffId, setActiveStaffId, addStaff } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('Encargado de Ventas / Distribución');
  const [telefono, setTelefono] = useState('');
  const [ci, setCi] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    addStaff({
      nombre: nombre.trim(),
      cargo: cargo.trim(),
      telefono: telefono.trim() || 'Sin teléfono',
      ci: ci.trim() || undefined,
      activo: true,
    });

    setNombre('');
    setTelefono('');
    setCi('');
    setIsAddOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#00b4d8]" />
            Equipo & Encargados de Venta
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cada venta y despacho de fideos se asocia a un encargado responsable (tienda o rutas de distribución)
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Registrar Nuevo Encargado</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((s) => {
          const isActiveSession = s.id === activeStaffId;

          return (
            <div
              key={s.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition shadow-xs flex flex-col justify-between ${
                isActiveSession
                  ? 'border-[#00b4d8] ring-2 ring-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-[#00b4d8] font-black text-lg flex items-center justify-center">
                    {s.nombre.charAt(0)}
                  </div>
                  {isActiveSession && (
                    <span className="text-[10px] font-black uppercase bg-[#00b4d8] text-white px-2 py-0.5 rounded-full">
                      SESIÓN ACTIVA
                    </span>
                  )}
                </div>

                <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm leading-snug">
                  {s.nombre}
                </h3>
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {s.cargo}
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.telefono}</span>
                  </p>
                  {s.ci && <p className="text-[10px] text-slate-400">CI: {s.ci}</p>}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400 text-[11px]">Kilos Despachados:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      {(s.totalKilosDespachados || 0).toFixed(0)} Kg
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400 text-[11px]">Total Facturado:</span>
                    <span className="font-mono text-[#00b4d8]">
                      Bs{(s.totalVentasBs || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {!isActiveSession ? (
                  <button
                    onClick={() => setActiveStaffId(s.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-[#00b4d8] hover:text-white dark:bg-slate-800 dark:hover:bg-[#00b4d8] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Seleccionar para Turno</span>
                  </button>
                ) : (
                  <div className="py-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Encargado Actual de Caja</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Nuevo Encargado de Venta / Chofer
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="ej. Juan Perez Gutierrez"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Cargo / Responsabilidad</label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="ej. Distribuidor Ruta Sud Yungas"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Teléfono o Celular</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="ej. 712-34567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Cédula de Identidad (CI)</label>
                <input
                  type="text"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  placeholder="ej. 6849201 LP"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-xl text-xs font-bold"
                >
                  Guardar Encargado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
