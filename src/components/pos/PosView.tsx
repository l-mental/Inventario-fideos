import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Package,
  ShoppingCart,
  User,
  Plus,
  Minus,
  Trash2,
  FileText,
  CreditCard,
  QrCode,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
  MapPin,
  UserCheck,
  Scale,
  Percent,
  CheckCircle2,
  Edit2,
  Brain,
} from 'lucide-react';
import { MetodoPago, Product } from '../../types';
import { ReceiptModal } from './ReceiptModal';
import { CashModal } from '../cash/CashModal';
import { ProformasModal } from './ProformasModal';

export const PosView: React.FC = () => {
  const {
    products,
    destinations,
    staff,
    cart,
    activeDestinationId,
    setActiveDestinationId,
    activeStaffId,
    setActiveStaffId,
    turnoCaja,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTotalNeto,
    cartTotalKilos,
    cartTotalBolsas,
    executeSale,
    getProductPriceForDestination,
    lastCompletedSale,
    selectedReceiptSale,
    setSelectedReceiptSale,
    addStaff,
  } = useApp();

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Checkout states
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('EFECTIVO');
  const [clienteNombre, setClienteNombre] = useState('VENTA MOSTRADOR (CONSUMIDOR FINAL)');
  const [clienteDoc, setClienteDoc] = useState('');
  const [montoRecibido, setMontoRecibido] = useState<string>('');
  const [descuento, setDescuento] = useState<string>('0');
  const [observaciones, setObservaciones] = useState('');

  // Modals
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isProformasModalOpen, setIsProformasModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Vendedor / Repartidor');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  // Active destination & staff objects
  const activeDest = destinations.find((d) => d.id === activeDestinationId) || destinations[0];
  const activeStaff = staff.find((s) => s.id === activeStaffId) || staff[0];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.codigoBarras.includes(searchTerm) ||
        prod.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (selectedCategory === 'todos') return true;
      if (selectedCategory === 'navidad')
        return (
          prod.tipoFideo === 'paneton' ||
          prod.tipoFideo === 'galletas_navidad' ||
          prod.tipoFideo === 'navidad'
        );
      if (selectedCategory === 'paneton') return prod.tipoFideo === 'paneton';
      if (selectedCategory === 'galletas') return prod.tipoFideo === 'galletas_navidad';
      if (selectedCategory === 'moño') return prod.tipoFideo === 'moño';
      if (selectedCategory === 'largos') return prod.tipoFideo === 'largos';
      if (selectedCategory === 'cortos') return prod.tipoFideo === 'cortos';
      if (selectedCategory === 'soperos') return prod.tipoFideo === 'soperos';
      if (selectedCategory === 'granel')
        return prod.kilosPorUnidad === 1 || prod.presentacion.toLowerCase().includes('kilo');
      if (selectedCategory === 'bolsas') return prod.kilosPorUnidad > 1;

      return true;
    });
  }, [products, searchTerm, selectedCategory]);

  // Discount calculation
  const numDescuento = Math.max(0, parseFloat(descuento) || 0);
  const finalTotal = Math.max(0, cartSubtotal - numDescuento);

  // Quick handle sale submit
  const handleExecuteSale = () => {
    if (cart.length === 0) {
      alert('Por favor agregue productos al carrito antes de ejecutar la venta.');
      return;
    }

    try {
      executeSale({
        metodoPago,
        clienteNombre,
        clienteDocumento: clienteDoc,
        montoRecibido: parseFloat(montoRecibido) || finalTotal,
        descuento: numDescuento,
        observaciones,
      });
      // reset checkout specific inputs
      setMontoRecibido('');
      setDescuento('0');
      setObservaciones('');
    } catch (err: any) {
      alert(err.message || 'Error al procesar la venta');
    }
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    addStaff({
      nombre: newStaffName.trim(),
      cargo: newStaffRole.trim(),
      telefono: newStaffPhone.trim() || 'Sin teléfono',
      activo: true,
    });
    setNewStaffName('');
    setNewStaffPhone('');
    setIsNewStaffModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100/60 dark:bg-slate-950">
      {/* LEFT/CENTER MAIN AREA: Catalog & Products */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto space-y-4">
        {/* Top Active Cash Shift Bar (Matching Screenshot) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Green pulsating indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                TURNO DE CAJA #{turnoCaja.numeroTurno} ACTIVO
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Efectivo Esperado en Caja:
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  Bs{turnoCaja.efectivoEsperado.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* PROFORMAS / COTIZACIONES Button matching screenshot */}
            <button
              onClick={() => setIsProformasModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-50/70 hover:bg-cyan-100/80 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/40 text-[#00b4d8] text-xs font-bold tracking-wide border border-cyan-200/70 dark:border-cyan-800 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PROFORMAS / COTIZACIONES ({cart.length > 0 ? '1' : '0'})</span>
            </button>

            {/* ARQUEO / MOVIMIENTOS DE CAJA Button matching screenshot */}
            <button
              onClick={() => setIsCashModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008f5a] hover:bg-[#007b4c] text-white text-xs font-bold tracking-wide transition shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>ARQUEO / MOVIMIENTOS DE CAJA</span>
            </button>
          </div>
        </div>

        {/* Regional Destination and Encargado Context Banner */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent dark:from-cyan-950/40 dark:via-cyan-950/20 border border-cyan-200/70 dark:border-cyan-800/60 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-[#00b4d8]" />
              <span>Tarifa Activa:</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#00b4d8] text-white font-extrabold uppercase">
                {activeDest?.name}
              </span>
              <span className="text-slate-400 font-normal">
                ({activeDest?.id === 'tienda' ? 'Precio Mostrador Fábrica' : `Precios aplicados para ${activeDest?.name}`})
              </span>
            </div>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Encargado de Venta:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {activeStaff?.nombre}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewStaffModalOpen(true)}
              className="text-[11px] font-bold text-[#00b4d8] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Nuevo Encargado
            </button>
          </div>
        </div>

        {/* Big Rounded Search Bar (Matching Screenshot) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-cyan-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="BUSCAR POR NOMBRE, CATEGORÍA O CÓDIGO DE BARRAS..."
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white placeholder:text-slate-400 uppercase outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent shadow-xs transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              LIMPIAR
            </button>
          )}
        </div>

        {/* Pasta & Christmas Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none scrollbar-thin">
          {[
            { id: 'todos', label: 'TODOS LOS PRODUCTOS' },
            { id: 'navidad', label: '🎄 ESPECIAL NAVIDAD' },
            { id: 'paneton', label: '🍞 PANETONES' },
            { id: 'galletas', label: '🍪 GALLETAS NAVIDAD' },
            { id: 'moño', label: 'FIDEOS DE MOÑO' },
            { id: 'largos', label: 'FIDEOS LARGOS' },
            { id: 'cortos', label: 'CORTOS / GUISERO' },
            { id: 'soperos', label: 'SOPEROS' },
            { id: 'bolsas', label: 'POR BOLSAS' },
            { id: 'granel', label: 'POR KILOS (GRANEL)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-[11px] ${
                selectedCategory === cat.id
                  ? cat.id === 'navidad' || cat.id === 'paneton' || cat.id === 'galletas'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-[#00b4d8] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-cyan-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid (Matching the exact card layout in screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.map((prod) => {
            const currentPrice = getProductPriceForDestination(prod, activeDestinationId);
            const inCart = cart.find((ci) => ci.producto.id === prod.id);
            const isChristmas =
              prod.tipoFideo === 'paneton' ||
              prod.tipoFideo === 'galletas_navidad' ||
              prod.tipoFideo === 'navidad';

            const unitLabel =
              prod.tipoFideo === 'paneton'
                ? prod.presentacion.toLowerCase().includes('caja')
                  ? '+1 Caja'
                  : '+1 Panetón'
                : prod.tipoFideo === 'galletas_navidad'
                ? prod.presentacion.toLowerCase().includes('lata')
                  ? '+1 Lata'
                  : '+1 Caja'
                : '+1 Bolsa';

            return (
              <div
                key={prod.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-md ${
                  isChristmas
                    ? 'border-rose-200/90 dark:border-rose-900/60 ring-1 ring-rose-500/10'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Active selection indicator line at top if in cart */}
                {inCart && (
                  <div
                    className={`absolute top-0 inset-x-0 h-1 ${
                      isChristmas ? 'bg-rose-500' : 'bg-[#00b4d8]'
                    }`}
                  />
                )}

                <div>
                  {/* Top Row: Icon + STOCK.AVAL badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        isChristmas
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-[#00b4d8]'
                      }`}
                    >
                      {isChristmas ? (
                        <span className="text-lg">🎄</span>
                      ) : (
                        <Package className="w-5 h-5 stroke-[1.75]" />
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">
                        STOCK.AVAL
                      </span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {String(prod.stockBolsas).padStart(3, '0')}{' '}
                        {prod.tipoFideo === 'paneton' ? 'unid' : 'bol'}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          ({prod.stockKilos.toFixed(1)} kg)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Title: Bold italic uppercase matching screenshot */}
                  <h3 className="font-black italic text-sm text-slate-900 dark:text-white uppercase leading-snug line-clamp-2">
                    {prod.nombre}
                  </h3>

                  {/* Category & Code / Description subtitle */}
                  <div className="flex items-center gap-1.5 mt-1">
                    {isChristmas && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900">
                        NAVIDAD
                      </span>
                    )}
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {prod.categoriaNombre} • {prod.codigoBarras}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {prod.descripcionKilos}
                  </p>
                </div>

                {/* Price and Add Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      {/* Old price strikethrough if higher */}
                      {prod.precioAntiguo > currentPrice && (
                        <span className="text-[11px] line-through text-slate-400 block font-mono -mb-1">
                          Bs{prod.precioAntiguo.toFixed(2)}
                        </span>
                      )}
                      <span
                        className={`text-lg font-black font-mono ${
                          isChristmas
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        Bs{currentPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">
                        /{prod.kilosPorUnidad > 1 ? 'u' : 'kg'}
                      </span>
                    </div>

                    {/* Regional destination tag */}
                    <span className="text-[9px] font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded uppercase border border-cyan-100 dark:border-cyan-900">
                      {activeDest?.name}
                    </span>
                  </div>

                  {/* Dual buttons: Vender en Bolsa/Unidad / Vender en Kilos */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(prod.id, 'bolsas', 1)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-extrabold uppercase transition flex items-center justify-center gap-1 ${
                        isChristmas
                          ? 'bg-rose-50 hover:bg-rose-600 hover:text-white dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 hover:bg-[#00b4d8] hover:text-white dark:bg-slate-800 dark:hover:bg-[#00b4d8] text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{unitLabel}</span>
                    </button>

                    <button
                      onClick={() => addToCart(prod.id, 'kilos', 1)}
                      className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-extrabold uppercase transition flex items-center justify-center gap-1"
                    >
                      <Scale className="w-3 h-3" />
                      <span>+1 Kilo</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE PANEL: TERMINAL POS (Matching Screenshot) */}
      <div className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors shadow-lg z-10">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Terminal POS with Cart icon matching image */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00b4d8] flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-black italic text-slate-900 dark:text-white uppercase tracking-tight">
                  TERMINAL POS
                </h2>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {cart.length} {cart.length === 1 ? 'ÍTEM' : 'ÍTEMS'} SELECCIONADOS
                </span>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-bold text-rose-500 hover:underline uppercase"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Customer identity card matching screenshot */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block mb-1.5">
              IDENTIDAD DE CLIENTE Y FIDELIZACIÓN
            </span>

            <div
              onClick={() => setIsClientModalOpen(true)}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer hover:border-cyan-400 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-cyan-50 dark:bg-cyan-950 text-[#00b4d8] flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate uppercase">
                    {clienteNombre}
                  </p>
                  {clienteDoc && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      NIT/CI: {clienteDoc}
                    </span>
                  )}
                </div>
              </div>

              <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            {/* Encargado indicator for this sale */}
            <div className="mt-2 flex items-center justify-between text-[11px] px-1 font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#00b4d8]" />
                Encargado: <strong className="text-slate-700 dark:text-slate-200">{activeStaff?.nombre}</strong>
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                {activeDest?.name}
              </span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {cart.length === 0 ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Package className="w-12 h-12 stroke-[1] text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-bold text-slate-500 uppercase">Carrito de Venta Vacío</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Seleccione fideos de la lista para despachar en bolsas o por kilos.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.producto.id}-${item.unidadSeleccionada}`}
                  className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase leading-snug">
                        {item.producto.nombre}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                          Bs{item.precioUnitario.toFixed(2)} /{item.unidadSeleccionada === 'bolsas' ? 'bolsa' : 'kg'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({item.kilosCalculados.toFixed(2)} kg tot.)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.producto.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Unit Switch: Bolsas vs Kilos */}
                    <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-0.5 text-[10px] font-bold">
                      <button
                        onClick={() => updateCartQuantity(item.producto.id, item.cantidad, 'bolsas')}
                        className={`px-2 py-0.5 rounded-md transition ${
                          item.unidadSeleccionada === 'bolsas'
                            ? 'bg-[#00b4d8] text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Bolsas
                      </button>
                      <button
                        onClick={() => updateCartQuantity(item.producto.id, item.cantidad, 'kilos')}
                        className={`px-2 py-0.5 rounded-md transition ${
                          item.unidadSeleccionada === 'kilos'
                            ? 'bg-[#00b4d8] text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Kilos
                      </button>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.producto.id, item.cantidad - 1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-black text-xs min-w-[20px] text-center text-slate-800 dark:text-white">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.producto.id, item.cantidad + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                      Bs{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM TOTALS & CHECKOUT CONTROLS (Matching Screenshot) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          {/* Subtotal & Kilos statistics */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-bold text-slate-500">
              <span className="uppercase text-[11px]">SUBTOTAL</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                Bs{cartSubtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>PESO TOTAL A ENTREGAR:</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                {cartTotalKilos.toFixed(2)} Kg ({cartTotalBolsas} bolsas)
              </span>
            </div>

            {/* Editable discount option */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>DESCUENTO (Bs):</span>
              <input
                type="number"
                min="0"
                step="1"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 border rounded text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* NETO TOTAL (Giant cyan font matching screenshot) */}
          <div className="pt-1 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              NETO TOTAL
            </span>
            <span className="text-3xl font-black text-[#00b4d8] font-mono tracking-tight">
              Bs{finalTotal.toFixed(2)}
            </span>
          </div>

          {/* Payment Method Selector (4 tabs matching screenshot: EFECTIVO, PAGO QR, MIXTO, CRÉDITO) */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {/* EFECTIVO */}
            <button
              onClick={() => setMetodoPago('EFECTIVO')}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase transition ${
                metodoPago === 'EFECTIVO'
                  ? 'bg-[#00b4d8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>EFECTIVO</span>
            </button>

            {/* PAGO QR */}
            <button
              onClick={() => setMetodoPago('PAGO QR')}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase transition ${
                metodoPago === 'PAGO QR'
                  ? 'bg-[#00b4d8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>PAGO QR</span>
            </button>

            {/* MIXTO */}
            <button
              onClick={() => setMetodoPago('MIXTO')}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase transition ${
                metodoPago === 'MIXTO'
                  ? 'bg-[#00b4d8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>MIXTO</span>
            </button>

            {/* CRÉDITO */}
            <button
              onClick={() => setMetodoPago('CRÉDITO')}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase transition ${
                metodoPago === 'CRÉDITO'
                  ? 'bg-[#00b4d8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>CRÉDITO</span>
            </button>
          </div>

          {/* EJECUTAR VENTA button (Giant bright cyan pill matching screenshot) */}
          <button
            onClick={handleExecuteSale}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-wider text-sm shadow-md transition ${
              cart.length === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-[#56cfe1] hover:bg-[#48cae4] text-white shadow-cyan-500/30 active:scale-[0.99] cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>EJECUTAR VENTA</span>
          </button>
        </div>
      </div>

      {/* Floating AI / Shortcut Button at bottom right matching screenshot */}
      <div className="fixed bottom-5 right-5 z-20">
        <button
          onClick={() => alert(`Asistente de Fábrica SoftPlus: Precios activos sincronizados con ${activeDest?.name}. Encargado actual: ${activeStaff?.nombre}. Stock controlado en Kilos y Bolsas.`)}
          title="Asistencia y atajos rápidos"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00b4d8] to-[#48cae4] text-white flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-105 transition"
        >
          <Brain className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      <ReceiptModal
        sale={selectedReceiptSale}
        onClose={() => setSelectedReceiptSale(null)}
      />

      <CashModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
      />

      <ProformasModal
        isOpen={isProformasModalOpen}
        onClose={() => setIsProformasModalOpen(false)}
      />

      {/* Client Identity Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Datos del Cliente / Facturación
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Nombre o Razón Social</label>
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="ej. Abarrotes Los Yungas, Don Pedro"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">NIT / CI del Cliente</label>
                <input
                  type="text"
                  value={clienteDoc}
                  onChange={(e) => setClienteDoc(e.target.value)}
                  placeholder="ej. 4920194012"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="px-4 py-2 bg-[#00b4d8] text-white rounded-xl text-xs font-bold"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Staff Quick Modal */}
      {isNewStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Registrar Nuevo Encargado de Venta
            </h3>
            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="ej. Mateo Mamani"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Cargo / Responsabilidad</label>
                <input
                  type="text"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  placeholder="ej. Encargado Ruta Caranavi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Teléfono / Celular</label>
                <input
                  type="text"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="ej. 777-12345"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(false)}
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
