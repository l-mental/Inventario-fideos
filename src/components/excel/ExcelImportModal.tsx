import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Upload,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { parseExcelFile, downloadExcelTemplate } from '../../utils/excelUtils';
import { Product } from '../../types';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose }) => {
  const { destinations, products, addProduct, updateProduct } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewProducts, setPreviewProducts] = useState<Omit<Product, 'id' | 'fechaRegistro'>[]>([]);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setImportErrors([]);
    setImportWarnings([]);
    setImportSuccess(false);

    try {
      const result = await parseExcelFile(file, destinations);
      setPreviewProducts(result.products);
      setImportErrors(result.errors);
      setImportWarnings(result.warnings);
    } catch (err: any) {
      setImportErrors([err.message || 'Error al leer el archivo Excel.']);
      setPreviewProducts([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (previewProducts.length === 0) return;

    let count = 0;

    if (importMode === 'replace') {
      // Clear and add all
      localStorage.removeItem('softplus_products');
      previewProducts.forEach((p) => {
        addProduct(p);
        count++;
      });
    } else {
      // Merge: if product with barcode or exact name exists, update it; otherwise add
      previewProducts.forEach((item) => {
        const existing = products.find(
          (p) =>
            (item.codigoBarras && p.codigoBarras === item.codigoBarras) ||
            p.nombre.toLowerCase().trim() === item.nombre.toLowerCase().trim()
        );

        if (existing) {
          updateProduct({
            ...existing,
            ...item,
            id: existing.id,
            fechaRegistro: existing.fechaRegistro,
          });
        } else {
          addProduct(item);
        }
        count++;
      });
    }

    setImportedCount(count);
    setImportSuccess(true);
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewProducts([]);
    setImportErrors([]);
    setImportWarnings([]);
    setImportSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-800 dark:text-white flex items-center gap-2">
                Importar Inventario desde Excel (.xlsx / .csv)
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Fideos & Navidad
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Carga masiva de fideos, panetones, galletas, pesos en kilos y listas de precios regionales
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Success screen */}
          {importSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase">
                  ¡Importación Completada con Éxito!
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Se procesaron e ingresaron <strong>{importedCount} productos</strong> al catálogo del sistema con sus precios de tienda y regionales.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    resetState();
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl font-bold uppercase transition"
                >
                  Volver al Inventario
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Top banner: Download Template */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    ¿No tienes el formato listo? Descarga la Plantilla Excel Oficial
                  </h4>
                  <p className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px] mt-0.5">
                    Incluye ejemplos listos de fideos (moño, tallarín), panetones (900g, caja x6) y galletas navideñas con todas las columnas de Yungas y Guanay.
                  </p>
                </div>

                <button
                  onClick={() => downloadExcelTemplate(destinations)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-wider text-[11px] whitespace-nowrap transition shadow-xs flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Descargar Plantilla (.xlsx)</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00b4d8] dark:hover:border-[#00b4d8] rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-[#00b4d8] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
                  <Upload className="w-7 h-7 stroke-[2]" />
                </div>

                <h4 className="font-black text-sm text-slate-800 dark:text-white uppercase">
                  {selectedFile ? selectedFile.name : 'Haz clic o arrastra tu archivo Excel aquí'}
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  Formatos soportados: <strong>.xlsx, .xls, .csv</strong> (Hojas de cálculo de Microsoft Excel o Google Sheets)
                </p>
                {selectedFile && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-mono text-[11px] font-bold">
                    {(selectedFile.size / 1024).toFixed(1)} KB seleccionado
                  </span>
                )}
              </div>

              {/* Errors & Warnings */}
              {importErrors.length > 0 && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1 text-rose-700 dark:text-rose-300">
                  <div className="flex items-center gap-1.5 font-black uppercase text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Errores detectados en el archivo:
                  </div>
                  {importErrors.map((err, i) => (
                    <p key={i} className="text-xs">
                      • {err}
                    </p>
                  ))}
                </div>
              )}

              {importWarnings.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1 text-amber-700 dark:text-amber-300">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Avisos:
                  </div>
                  {importWarnings.map((w, i) => (
                    <p key={i} className="text-[11px]">
                      • {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Preview Table */}
              {previewProducts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-black text-sm text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-500" />
                      Vista Previa de Productos Detectados ({previewProducts.length})
                    </h4>

                    {/* Import Mode: Merge vs Replace */}
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer px-2 py-1 rounded-lg">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="accent-[#00b4d8]"
                        />
                        <span>Fusionar / Actualizar existente</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer px-2 py-1 rounded-lg">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="accent-rose-500"
                        />
                        <span className="text-rose-600 dark:text-rose-400">Reemplazar catálogo</span>
                      </label>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-2.5">Código</th>
                          <th className="p-2.5">Producto</th>
                          <th className="p-2.5">Categoría</th>
                          <th className="p-2.5">Presentación</th>
                          <th className="p-2.5 text-center">Peso (Kg)</th>
                          <th className="p-2.5 text-center">Stock</th>
                          <th className="p-2.5 text-right">P. Tienda</th>
                          <th className="p-2.5 text-right">Chulumani</th>
                          <th className="p-2.5 text-right">Guanay</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {previewProducts.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-2.5 font-mono text-slate-500">{p.codigoBarras}</td>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-white uppercase">
                              {p.nombre}
                              {p.tipoFideo === 'paneton' && (
                                <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800">
                                  🎄 Panetón
                                </span>
                              )}
                              {p.tipoFideo === 'galletas_navidad' && (
                                <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-red-100 text-red-800">
                                  🍪 Galletas
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-400 font-semibold">
                              {p.categoriaNombre}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">{p.presentacion}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              {p.kilosPorUnidad} kg
                            </td>
                            <td className="p-2.5 text-center font-mono">
                              <strong>{p.stockBolsas}</strong> u ({p.stockKilos} kg)
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-[#00b4d8]">
                              Bs{p.precioTienda.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                              Bs{(p.preciosPorDestino?.chulumani || p.precioTienda + 5).toFixed(2)}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                              Bs{(p.preciosPorDestino?.guanay || p.precioTienda + 8).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!importSuccess && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={() => {
                resetState();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmImport}
              disabled={previewProducts.length === 0 || isProcessing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md ${
                previewProducts.length === 0 || isProcessing
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 cursor-pointer'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Confirmar e Importar {previewProducts.length} Productos</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
