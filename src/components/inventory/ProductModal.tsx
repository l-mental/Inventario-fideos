import React, { useState, useEffect } from 'react';
import { Product, Destination, FideoCategory } from '../../types';
import { X, Plus, Trash2, Package, MapPin, Scale, DollarSign, FileText } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  productToEdit?: Product | null;
  destinations: Destination[];
  onAddDestination: (dest: Omit<Destination, 'id'>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  destinations,
  onAddDestination,
}) => {
  const [nombre, setNombre] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [tipoFideo, setTipoFideo] = useState<FideoCategory>('moño');
  const [presentacion, setPresentacion] = useState('Bolsa 10 Kg');
  const [descripcion, setDescripcion] = useState('');
  
  // Peso y Kilos
  const [descripcionKilos, setDescripcionKilos] = useState('Bolsa sellada de 10.00 Kilos netos');
  const [kilosPorUnidad, setKilosPorUnidad] = useState<string>('10');
  const [stockKilos, setStockKilos] = useState<string>('500');
  const [stockBolsas, setStockBolsas] = useState<string>('50');
  const [minStockKilos, setMinStockKilos] = useState<string>('80');

  // Precios requeridos por el usuario
  const [precioAntiguo, setPrecioAntiguo] = useState<string>('80');
  const [precioActual, setPrecioActual] = useState<string>('76');
  const [precioTienda, setPrecioTienda] = useState<string>('74');

  // Precios por destino (chulumani, irupana, guanay, palos_blancos, asunta + nuevos)
  const [preciosPorDestino, setPreciosPorDestino] = useState<Record<string, string>>({});

  // Nuevo destino dinámico
  const [isAddingNewDest, setIsAddingNewDest] = useState(false);
  const [newDestName, setNewDestName] = useState('');
  const [newDestDept, setNewDestDept] = useState('La Paz');

  useEffect(() => {
    if (productToEdit) {
      setNombre(productToEdit.nombre);
      setCodigoBarras(productToEdit.codigoBarras);
      setTipoFideo(productToEdit.tipoFideo);
      setPresentacion(productToEdit.presentacion);
      setDescripcion(productToEdit.descripcion);
      setDescripcionKilos(productToEdit.descripcionKilos);
      setKilosPorUnidad(String(productToEdit.kilosPorUnidad));
      setStockKilos(String(productToEdit.stockKilos));
      setStockBolsas(String(productToEdit.stockBolsas));
      setMinStockKilos(String(productToEdit.minStockKilos));
      setPrecioAntiguo(String(productToEdit.precioAntiguo));
      setPrecioActual(String(productToEdit.precioActual));
      setPrecioTienda(String(productToEdit.precioTienda));

      const stringPrices: Record<string, string> = {};
      Object.entries(productToEdit.preciosPorDestino || {}).forEach(([k, v]) => {
        stringPrices[k] = String(v);
      });
      setPreciosPorDestino(stringPrices);
    } else {
      // Default initial state
      setNombre('');
      setCodigoBarras(`77701000${Math.floor(1000 + Math.random() * 9000)}`);
      setTipoFideo('moño');
      setPresentacion('Bolsa 10 Kg');
      setDescripcion('');
      setDescripcionKilos('Bolsa sellada de 10.00 Kilos netos');
      setKilosPorUnidad('10');
      setStockKilos('500');
      setStockBolsas('50');
      setMinStockKilos('80');
      setPrecioAntiguo('82');
      setPrecioActual('78');
      setPrecioTienda('75');

      const initialDestPrices: Record<string, string> = {
        chulumani: '80',
        irupana: '82',
        guanay: '85',
        palos_blancos: '86',
        asunta: '84',
      };
      setPreciosPorDestino(initialDestPrices);
    }
  }, [productToEdit, isOpen]);

  // Auto-sync stock kilos and bolsas when one changes
  const handleBolsasChange = (val: string) => {
    setStockBolsas(val);
    const bolsasNum = parseFloat(val) || 0;
    const kgPerUnit = parseFloat(kilosPorUnidad) || 1;
    setStockKilos(String(bolsasNum * kgPerUnit));
  };

  const handleKilosPerUnitChange = (val: string) => {
    setKilosPorUnidad(val);
    const bolsasNum = parseFloat(stockBolsas) || 0;
    const kgPerUnit = parseFloat(val) || 1;
    setStockKilos(String(bolsasNum * kgPerUnit));
    setDescripcionKilos(kgPerUnit > 1 ? `Bolsa de ${kgPerUnit} Kilos netos` : 'Venta suelta por Kilo exacto');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    // Build numeric map of prices
    const numericDestPrices: Record<string, number> = {};
    destinations.forEach((dest) => {
      if (dest.id !== 'tienda') {
        const val = parseFloat(preciosPorDestino[dest.id]);
        numericDestPrices[dest.id] = isNaN(val) ? (parseFloat(precioTienda) || 0) + 4 : val;
      }
    });

    const categoryNames: Record<FideoCategory, string> = {
      moño: 'FIDEO MOÑO',
      largos: 'FIDEO LARGO',
      cortos: 'FIDEO CORTO',
      soperos: 'FIDEO SOPERO',
      especiales: 'FIDEO ESPECIAL',
      paneton: 'PANETÓN NAVIDEÑO',
      galletas_navidad: 'GALLETAS NAVIDEÑAS',
      navidad: 'ESPECIAL NAVIDAD',
    };

    const productPayload = {
      nombre: nombre.trim().toUpperCase(),
      codigoBarras: codigoBarras.trim(),
      tipoFideo,
      categoriaNombre: categoryNames[tipoFideo],
      presentacion,
      descripcion: descripcion.trim(),
      descripcionKilos: descripcionKilos.trim(),
      kilosPorUnidad: parseFloat(kilosPorUnidad) || 1,
      stockKilos: parseFloat(stockKilos) || 0,
      stockBolsas: parseInt(stockBolsas) || 0,
      minStockKilos: parseFloat(minStockKilos) || 50,
      precioAntiguo: parseFloat(precioAntiguo) || 0,
      precioActual: parseFloat(precioActual) || 0,
      precioTienda: parseFloat(precioTienda) || 0,
      preciosPorDestino: numericDestPrices,
      activo: true,
    };

    if (productToEdit) {
      onSave({ ...productToEdit, ...productPayload });
    } else {
      onSave(productPayload);
    }

    onClose();
  };

  const handleCreateNewDestination = () => {
    if (!newDestName.trim()) return;
    onAddDestination({
      name: newDestName.trim(),
      department: newDestDept.trim(),
      description: `Ruta comercial ${newDestName.trim()}`,
    });
    setNewDestName('');
    setIsAddingNewDest(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-[#00b4d8] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                {productToEdit ? 'Editar Fideo / Producto' : 'Registrar Nuevo Fideo en Catálogo'}
              </h3>
              <p className="text-xs text-slate-400">
                Control por kilos, bolsas y lista de precios por destino
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* SECTION 1: DATOS BÁSICOS */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 dark:border-slate-800">
              <FileText className="w-3.5 h-3.5 text-[#00b4d8]" />
              1. Identificación del Fideo
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Nombre del Fideo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. FIDEO MOÑITO ESPECIAL 10KG"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black text-slate-800 dark:text-white uppercase outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Código de Barras / SKU
                </label>
                <input
                  type="text"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Tipo / Variedad de Fideo *
                </label>
                <select
                  value={tipoFideo}
                  onChange={(e) => setTipoFideo(e.target.value as FideoCategory)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="moño">Fideos de Moño (Moñito, Moño Grande)</option>
                  <option value="largos">Fideos Largos (Tallarín, Espagueti, Fetuccini)</option>
                  <option value="cortos">Cortos / Guisero (Macarrón, Penne, Corbatita, Tornillo)</option>
                  <option value="soperos">Soperos (Cabello de Ángel, Letritas, Semilla)</option>
                  <option value="especiales">Especiales (Nidos al Huevo, Canelón)</option>
                  <option value="paneton">🎄 Panetón Navideño (900g, Caja x6, Chocolate)</option>
                  <option value="galletas_navidad">🍪 Galletas Navideñas (Latas, Surtidas, Jengibre)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Presentación de Empaque *
                </label>
                <input
                  type="text"
                  value={presentacion}
                  onChange={(e) => setPresentacion(e.target.value)}
                  placeholder="ej. Bolsa 10 Kg, Bolsa 25 Kg, Granel / Kilo"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Descripción del Producto
              </label>
              <textarea
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del fideo, ingredientes, sémola de trigo, tiempo de cocción, etc."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* SECTION 2: PESO Y DESCRIPCIÓN EN KILOS */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 dark:border-slate-800">
              <Scale className="w-3.5 h-3.5 text-[#00b4d8]" />
              2. Control de Peso y Kilos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Descripción en Kilos *
                </label>
                <input
                  type="text"
                  required
                  value={descripcionKilos}
                  onChange={(e) => setDescripcionKilos(e.target.value)}
                  placeholder="ej. Bolsa sellada de 10.00 Kilos netos"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Peso Unitario por Bolsa/Unidad (en Kilos) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={kilosPorUnidad}
                  onChange={(e) => handleKilosPerUnitChange(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-cyan-50/50 dark:bg-cyan-950/20 p-3 rounded-xl border border-cyan-100 dark:border-cyan-900">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Stock en Bolsas
                </label>
                <input
                  type="number"
                  value={stockBolsas}
                  onChange={(e) => handleBolsasChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl font-black font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Stock Total en Kilos
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={stockKilos}
                  onChange={(e) => setStockKilos(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl font-black font-mono text-emerald-600 dark:text-emerald-400 outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Alerta Mínima (Kg)
                </label>
                <input
                  type="number"
                  value={minStockKilos}
                  onChange={(e) => setMinStockKilos(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRECIOS PRINCIPALES (Antiguo, Actual, Tienda) */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 dark:border-slate-800">
              <DollarSign className="w-3.5 h-3.5 text-[#00b4d8]" />
              3. Precios Base (Antiguo, Actual y Tienda)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Precio Antiguo (Bs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={precioAntiguo}
                  onChange={(e) => setPrecioAntiguo(e.target.value)}
                  placeholder="ej. 82.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black font-mono text-slate-500 dark:text-slate-400 outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400">Referencia anterior</span>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Precio Actual Base (Bs) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={precioActual}
                  onChange={(e) => setPrecioActual(e.target.value)}
                  placeholder="ej. 78.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400">Tarifa general vigente</span>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Precio de Tienda / Fábrica (Bs) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={precioTienda}
                  onChange={(e) => setPrecioTienda(e.target.value)}
                  placeholder="ej. 75.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black font-mono text-[#00b4d8] outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">Venta local mostrador</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRECIOS REGIONALES (Chulumani, Irupana, Guanay, Palos Blancos, Asunta, + Nuevos) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-1.5 dark:border-slate-800">
              <h4 className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00b4d8]" />
                4. Precios por Destino (Chulumani, Irupana, Guanay, Palos B., Asunta...)
              </h4>

              <button
                type="button"
                onClick={() => setIsAddingNewDest(true)}
                className="text-[11px] font-bold text-[#00b4d8] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                + Agregar Nuevo Destino
              </button>
            </div>

            {/* Quick add destination inline input */}
            {isAddingNewDest && (
              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 dark:text-white block">
                  Crear Nuevo Destino / Plaza Comercial
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre (ej. Caranavi, Coroico)"
                    value={newDestName}
                    onChange={(e) => setNewDestName(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Provincia / Departamento"
                    value={newDestDept}
                    onChange={(e) => setNewDestDept(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewDest(false)}
                    className="px-2 py-1 text-slate-500 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewDestination}
                    className="px-3 py-1 bg-[#00b4d8] text-white rounded-lg font-bold"
                  >
                    Guardar Destino
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {destinations
                .filter((d) => d.id !== 'tienda')
                .map((dest) => (
                  <div
                    key={dest.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 uppercase">
                        {dest.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                        {dest.department}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-400">Bs</span>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="0.00"
                        value={preciosPorDestino[dest.id] || ''}
                        onChange={(e) =>
                          setPreciosPorDestino((prev) => ({
                            ...prev,
                            [dest.id]: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border rounded-lg font-black font-mono text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
            >
              {productToEdit ? 'Actualizar Fideo' : 'Guardar en Catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
