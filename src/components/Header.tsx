import React from 'react';
import { ShoppingCart, Calendar, Moon, Sun, MapPin, UserCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    isDarkMode,
    setIsDarkMode,
    destinations,
    activeDestinationId,
    setActiveDestinationId,
    staff,
    activeStaffId,
    setActiveStaffId,
  } = useApp();

  const activeStaff = staff.find((s) => s.id === activeStaffId);
  const activeDest = destinations.find((d) => d.id === activeDestinationId);

  // Formatted date
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  const formattedDate = now.toLocaleDateString('es-BO', options);

  return (
    <header className="h-16 px-5 border-b flex items-center justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors z-20">
      {/* Brand logo matching image */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b4d8] to-[#48cae4] flex items-center justify-center shadow-sm shadow-cyan-500/20 text-white">
          <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
              SOFTPLUS
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#00b4d8] bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
              FIDEOS
            </span>
          </div>
          <p className="text-[10px] tracking-wider font-semibold text-slate-400 dark:text-slate-400 uppercase -mt-0.5">
            INTELLIGENCE & INVENTARIOS
          </p>
        </div>
      </div>

      {/* Central Regional Selector & Encargado Quick Bar */}
      <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#00b4d8]" />
          <span>Destino / Lista:</span>
          <select
            value={activeDestinationId}
            onChange={(e) => setActiveDestinationId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name} {dest.id === 'tienda' ? '(Precio Tienda)' : `(Ruta ${dest.name})`}
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <UserCheck className="w-3.5 h-3.5 text-[#00b4d8]" />
          <span>Encargado:</span>
          <select
            value={activeStaffId}
            onChange={(e) => setActiveStaffId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer max-w-[180px] truncate"
          >
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} ({s.cargo.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date, Location & Dark mode toggle matching image */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
            {formattedDate}
          </p>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {activeDest?.name || 'LA PAZ'} • BOLIVIA
          </p>
        </div>

        {/* Calendar button */}
        <button
          title="Calendario de despachos"
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Calendar className="w-4 h-4 text-[#00b4d8]" />
        </button>

        {/* Nocturno / Diurno button matching image button: [icon] NOCTURNO */}
        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>DIURNO</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>NOCTURNO</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
