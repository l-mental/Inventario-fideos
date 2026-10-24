import React, { useState } from 'react';
import {
  LayoutGrid,
  ShoppingCart,
  Truck,
  Boxes,
  Package,
  History,
  TrendingUp,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  LogOut,
  MapPin,
  Scale,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  onOpenCashModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeView, setActiveView, staff, activeStaffId } = useApp();
  const [inventorySubmenuOpen, setInventorySubmenuOpen] = useState(true);

  const activeStaff = staff.find((s) => s.id === activeStaffId) || staff[0];

  return (
    <aside className="w-64 shrink-0 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors select-none">
      {/* Navigation menu list */}
      <div className="py-4 px-3 flex flex-col gap-1.5 overflow-y-auto">
        {/* TABLERO PRINCIPAL */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
            activeView === 'dashboard'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] border border-cyan-200 dark:border-cyan-800'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="uppercase">TABLERO PRINCIPAL</span>
        </button>

        {/* VENTA DIRECTA (Matches screenshot active style: bordered cyan pill with right arrow) */}
        <button
          onClick={() => setActiveView('pos')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition border ${
            activeView === 'pos'
              ? 'bg-cyan-50/70 dark:bg-cyan-950/40 text-[#00b4d8] border-[#00b4d8] shadow-xs'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-4 h-4 text-[#00b4d8]" />
            <span className="uppercase font-extrabold text-[#00b4d8]">VENTA DIRECTA</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#00b4d8]" />
        </button>

        {/* COMPRAS */}
        <button
          onClick={() => setActiveView('purchases')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
            activeView === 'purchases'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] border border-cyan-200 dark:border-cyan-800'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span className="uppercase">COMPRAS / MATERIA PRIMA</span>
        </button>

        {/* INVENTARIO (Dropdown) */}
        <div>
          <button
            onClick={() => setInventorySubmenuOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <Boxes className="w-4 h-4" />
              <span className="uppercase">INVENTARIO</span>
            </div>
            {inventorySubmenuOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {inventorySubmenuOpen && (
            <div className="pl-6 pr-1 mt-1 space-y-1">
              {/* Gestión Catálogo */}
              <button
                onClick={() => setActiveView('inventory')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  activeView === 'inventory'
                    ? 'text-[#00b4d8] font-bold bg-cyan-50/50 dark:bg-cyan-950/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Gestión Catálogo</span>
              </button>

              {/* Stock e Insumos */}
              <button
                onClick={() => setActiveView('stock')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  activeView === 'stock'
                    ? 'text-[#00b4d8] font-bold bg-cyan-50/50 dark:bg-cyan-950/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Stock en Kilos & Bolsas</span>
              </button>

              {/* Precios Regionales */}
              <button
                onClick={() => setActiveView('destinations')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  activeView === 'destinations'
                    ? 'text-[#00b4d8] font-bold bg-cyan-50/50 dark:bg-cyan-950/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Precios por Destino</span>
              </button>

              {/* Especial Navidad (Panetones y Galletas) */}
              <button
                onClick={() => setActiveView('inventory')}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <span>🎄</span>
                <span>Stock Navidad (Panetones)</span>
              </button>
            </div>
          )}
        </div>

        {/* HISTORIAL VENTAS */}
        <button
          onClick={() => setActiveView('sales')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
            activeView === 'sales'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] border border-cyan-200 dark:border-cyan-800'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span className="uppercase">HISTORIAL VENTAS</span>
        </button>

        {/* FINANZAS Y REPORTES */}
        <button
          onClick={() => setActiveView('reports')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
            activeView === 'reports'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] border border-cyan-200 dark:border-cyan-800'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="uppercase">FINANZAS Y REPORTES</span>
        </button>

        {/* BASE CLIENTES */}
        <button
          onClick={() => setActiveView('customers')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
            activeView === 'customers'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] border border-cyan-200 dark:border-cyan-800'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="uppercase">BASE CLIENTES</span>
        </button>

        {/* EQUIPO / STAFF */}
        <button
          onClick={() => setActiveView('staff')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${
            activeView === 'staff'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-[#00b4d8] border border-cyan-200 dark:border-cyan-800'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="uppercase">EQUIPO / STAFF</span>
        </button>
      </div>

      {/* Bottom Profile card and Desconectar matching screenshot */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-2.5 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900 text-[#00b4d8] font-black text-sm flex items-center justify-center shrink-0">
            {activeStaff.nombre.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
              {activeStaff.nombre.toUpperCase()}
            </p>
            <span className="text-[10px] font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
              {activeStaff.cargo}
            </span>
          </div>
        </div>

        <button
          onClick={() => alert(`Sesión activa: ${activeStaff.nombre}. Para cambiar de encargado utilice el selector superior o la sección Equipo.`)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="tracking-wider uppercase">DESCONECTAR</span>
        </button>
      </div>
    </aside>
  );
};
