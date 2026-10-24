import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Scale,
  MapPin,
  TrendingDown,
  AlertTriangle,
  ArrowUpDown,
  Boxes,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Upload,
  Sparkles,
  Gift,
} from 'lucide-react';
import { Product } from '../../types';
import { ProductModal } from './ProductModal';
import { ExcelImportModal } from '../excel/ExcelImportModal';
import { exportProductsToExcel, downloadExcelTemplate } from '../../utils/excelUtils';

export const InventoryView: React.FC = () => {
  const {
    products,
    destinations,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    addDestination,
    activeDestinationId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // Stock Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [deltaBolsas, setDeltaBolsas] = useState<string>('10');
  const [motivoAjuste, setMotivoAjuste] = useState('Producción de nuevo lote molino');

  // Filtered
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchText =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigoBarras.includes(searchTerm) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcionKilos.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchText) return false;
      if (categoryFilter === 'todos') return true;
      if (categoryFilter === 'navidad')
        return (
          p.tipoFideo === 'paneton' ||
          p.tipoFideo === 'galletas_navidad' ||
          p.tipoFideo === 'navidad'
        );
      if (categoryFilter === 'paneton') return p.tipoFideo === 'paneton';
      if (categoryFilter === 'galletas_navidad') return p.tipoFideo === 'galletas_navidad';
      if (categoryFilter === 'moño') return p.tipoFideo === 'moño';
      if (categoryFilter === 'largos') return p.tipoFideo === 'largos';
      if (categoryFilter === 'cortos') return p.tipoFideo === 'cortos';
      if (categoryFilter === 'soperos') return p.tipoFideo === 'soperos';
      if (categoryFilter === 'bajo_stock') return p.stockKilos <= p.minStockKilos;
      return true;
    });
  }, [products, searchTerm, categoryFilter]);

  // Overall totals
  const totalKilos = products.reduce((acc, p) => acc + p.stockKilos, 0);
  const totalBolsas = products.reduce((acc, p) => acc + p.stockBolsas, 0);
  const totalVariedades = products.length;
  const lowStockCount = products.filter((p) => p.stockKilos <= p.minStockKilos).length;

  const handleOpenAdd = () => {
    setSelectedProductForModal(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProductForModal(p);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (prodData: any) => {
    if (selectedProductForModal) {
      updateProduct(prodData);
    } else {
      addProduct(prodData);
    }
  };

  const handleConfirmStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const bolsas = parseInt(deltaBolsas) || 0;
    const kilos = bolsas * adjustingProduct.kilosPorUnidad;
    adjustStock(adjustingProduct.id, kilos, bolsas, motivoAjuste);
    setAdjustingProduct(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-[#00b4d8]" />
            Inventario & Catálogo de Fideos y Navidad
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control de stock en kilos y bolsas, panetones, galletas, precios regionales e importación/exportación Excel
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template */}
          <button
            onClick={() => downloadExcelTemplate(destinations)}
            title="Descargar plantilla Excel oficial con columnas de fideos, panetones y precios"
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Plantilla Excel</span>
          </button>

          {/* Export to Excel */}
          <button
            onClick={() => exportProductsToExcel(products, destinations)}
            title="Exportar todo el catálogo actual a un archivo Excel (.xlsx)"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel</span>
          </button>

          {/* Import from Excel */}
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm shadow-emerald-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Importar Excel</span>
          </button>

          {/* New Product */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Total en Inventario (Kilos)
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalKilos.toLocaleString('es-BO')} <span className="text-sm text-cyan-600 font-bold">Kg</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Equivalente en planta central</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Total en Bolsas / Fardos
          </span>
          <p className="text-2xl font-black text-[#00b4d8] font-mono mt-1">
            {totalBolsas.toLocaleString('es-BO')} <span className="text-sm font-bold">unid.</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Empacadas y listas para despacho</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Variedades de Fideos
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalVariedades}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Moños, largos, guiseros, soperos</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
            Alertas de Bajo Stock
          </span>
          <p className={`text-2xl font-black font-mono mt-1 ${lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {lowStockCount} {lowStockCount === 1 ? 'producto' : 'productos'}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Por debajo del mínimo</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, descripción, kilos o código..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'navidad', label: '🎄 Especial Navidad' },
              { id: 'paneton', label: '🍞 Panetones' },
              { id: 'galletas_navidad', label: '🍪 Galletas' },
              { id: 'moño', label: 'Moños' },
              { id: 'largos', label: 'Largos' },
              { id: 'cortos', label: 'Cortos' },
              { id: 'soperos', label: 'Soperos' },
              { id: 'bajo_stock', label: '⚠️ Bajo Stock' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition ${
                  categoryFilter === cat.id
                    ? cat.id === 'navidad'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-[#00b4d8] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table with all requested pricing columns */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Producto & Descripción</th>
                <th className="py-3 px-3">Empaque & Kilos</th>
                <th className="py-3 px-3 text-center">Stock Actual</th>
                <th className="py-3 px-3 text-right">P. Antiguo</th>
                <th className="py-3 px-3 text-right">P. Actual</th>
                <th className="py-3 px-3 text-right bg-cyan-50/50 dark:bg-cyan-950/20 text-[#00b4d8]">
                  P. Tienda
                </th>
                <th className="py-3 px-3 text-right">Chulumani</th>
                <th className="py-3 px-3 text-right">Irupana</th>
                <th className="py-3 px-3 text-right">Guanay</th>
                <th className="py-3 px-3 text-right">Palos B.</th>
                <th className="py-3 px-3 text-right">La Asunta</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const isLow = p.stockKilos <= p.minStockKilos;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    {/* Name & Desc */}
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white uppercase leading-snug">
                            {p.nombre}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {p.codigoBarras} • {p.categoriaNombre}
                          </span>
                          <span className="text-[10px] text-slate-500 italic line-clamp-1 max-w-[220px]">
                            {p.descripcion}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Empaque & Kilos */}
                    <td className="py-3 px-3 min-w-[140px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {p.presentacion}
                      </span>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block">
                        {p.descripcionKilos}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({p.kilosPorUnidad.toFixed(1)} kg/unidad)
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-3 text-center min-w-[120px]">
                      <div className="inline-block text-center">
                        <span className="font-black font-mono text-xs text-slate-900 dark:text-white block">
                          {p.stockBolsas} bolsas
                        </span>
                        <span className="font-black font-mono text-[11px] text-emerald-600 dark:text-emerald-400 block">
                          {p.stockKilos.toFixed(1)} Kg
                        </span>
                        {isLow && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-700">
                            <AlertTriangle className="w-2.5 h-2.5" /> Bajo stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Precio Antiguo */}
                    <td className="py-3 px-3 text-right font-mono text-slate-400 line-through">
                      Bs{p.precioAntiguo.toFixed(2)}
                    </td>

                    {/* Precio Actual */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      Bs{p.precioActual.toFixed(2)}
                    </td>

                    {/* Precio Tienda */}
                    <td className="py-3 px-3 text-right font-mono font-black text-[#00b4d8] bg-cyan-50/30 dark:bg-cyan-950/20">
                      Bs{p.precioTienda.toFixed(2)}
                    </td>

                    {/* Regional Prices */}
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Bs{(p.preciosPorDestino?.chulumani || p.precioTienda + 5).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Bs{(p.preciosPorDestino?.irupana || p.precioTienda + 7).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Bs{(p.preciosPorDestino?.guanay || p.precioTienda + 10).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Bs{(p.preciosPorDestino?.palos_blancos || p.precioTienda + 11).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Bs{(p.preciosPorDestino?.asunta || p.precioTienda + 9).toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          title="Ajustar stock (Entrada de producción o merma)"
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Editar fideo y precios"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#00b4d8] transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar ${p.nombre} del catálogo?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          title="Eliminar producto"
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={selectedProductForModal}
        destinations={destinations}
        onAddDestination={addDestination}
      />

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Entrada de Producción / Ajuste
            </h3>
            <p className="text-xs text-slate-500">
              {adjustingProduct.nombre} ({adjustingProduct.kilosPorUnidad} kg/bolsa)
            </p>

            <form onSubmit={handleConfirmStockAdjust} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">
                  Cantidad de Bolsas a Ingresar (o restar con signo -)
                </label>
                <input
                  type="number"
                  required
                  value={deltaBolsas}
                  onChange={(e) => setDeltaBolsas(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-cyan-600 block mt-1 font-semibold">
                  Equivalente a:{' '}
                  {((parseInt(deltaBolsas) || 0) * adjustingProduct.kilosPorUnidad).toFixed(1)} Kg
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Motivo / Concepto</label>
                <input
                  type="text"
                  value={motivoAjuste}
                  onChange={(e) => setMotivoAjuste(e.target.value)}
                  placeholder="ej. Salida de molino turno tarde"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Registrar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />
    </div>
  );
};
