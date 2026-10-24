import * as XLSX from 'xlsx';
import { Product, Destination, FideoCategory } from '../types';

/**
 * Normalizes text for header matching: removes accents, symbols, spaces, lowercase
 */
const normalizeKey = (key: string): string => {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .trim();
};

/**
 * Maps category string to valid FideoCategory
 */
const mapCategory = (cat: string): { type: FideoCategory; name: string } => {
  const norm = normalizeKey(cat || '');
  if (norm.includes('paneton') || norm.includes('panettone')) {
    return { type: 'paneton', name: 'PANETÓN NAVIDEÑO' };
  }
  if (norm.includes('galleta') || norm.includes('cookie') || norm.includes('biscuit')) {
    return { type: 'galletas_navidad', name: 'GALLETAS NAVIDEÑAS' };
  }
  if (norm.includes('navidad') || norm.includes('naviden')) {
    return { type: 'paneton', name: 'PANETÓN NAVIDEÑO' };
  }
  if (norm.includes('mono') || norm.includes('monito') || norm.includes('farfalle')) {
    return { type: 'moño', name: 'FIDEO MOÑO' };
  }
  if (norm.includes('largo') || norm.includes('tallarin') || norm.includes('espagueti') || norm.includes('spaghetti')) {
    return { type: 'largos', name: 'FIDEO LARGO' };
  }
  if (norm.includes('corto') || norm.includes('guisero') || norm.includes('macarron') || norm.includes('penne') || norm.includes('tornillo') || norm.includes('corbata')) {
    return { type: 'cortos', name: 'FIDEO CORTO' };
  }
  if (norm.includes('sopero') || norm.includes('cabello') || norm.includes('letra') || norm.includes('semilla')) {
    return { type: 'soperos', name: 'FIDEO SOPERO' };
  }
  return { type: 'especiales', name: 'FIDEO ESPECIAL' };
};

/**
 * Export products catalog to an Excel (.xlsx) file
 */
export const exportProductsToExcel = (
  products: Product[],
  destinations: Destination[],
  fileName = 'Inventario_Fideos_Navidad_SoftPlus.xlsx'
) => {
  const rows = products.map((p) => {
    const row: Record<string, any> = {
      'CÓDIGO / SKU': p.codigoBarras || p.id,
      'NOMBRE PRODUCTO': p.nombre,
      'CATEGORÍA': p.categoriaNombre,
      'PRESENTACIÓN': p.presentacion,
      'DESCRIPCIÓN': p.descripcion,
      'DESCRIPCIÓN EN KILOS': p.descripcionKilos,
      'PESO UNITARIO (KG)': p.kilosPorUnidad,
      'STOCK EN BOLSAS O CAJAS': p.stockBolsas,
      'STOCK EN KILOS': p.stockKilos,
      'ALERTA MÍNIMA (KG)': p.minStockKilos,
      'PRECIO ANTIGUO (BS)': p.precioAntiguo,
      'PRECIO ACTUAL BASE (BS)': p.precioActual,
      'PRECIO TIENDA / MOSTRADOR (BS)': p.precioTienda,
    };

    // Add each regional destination column
    destinations.forEach((dest) => {
      if (dest.id !== 'tienda') {
        const colName = `PRECIO ${dest.name.toUpperCase()} (BS)`;
        row[colName] = p.preciosPorDestino?.[dest.id] ?? (p.precioTienda + 5);
      }
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const colWidths = [
    { wch: 18 }, // CÓDIGO
    { wch: 35 }, // NOMBRE
    { wch: 20 }, // CATEGORÍA
    { wch: 22 }, // PRESENTACIÓN
    { wch: 45 }, // DESCRIPCIÓN
    { wch: 28 }, // DESCRIPCIÓN KILOS
    { wch: 18 }, // PESO UNITARIO
    { wch: 22 }, // STOCK BOLSAS
    { wch: 16 }, // STOCK KILOS
    { wch: 18 }, // ALERTA
    { wch: 18 }, // PRECIO ANTIGUO
    { wch: 20 }, // PRECIO ACTUAL
    { wch: 25 }, // PRECIO TIENDA
    ...destinations.filter((d) => d.id !== 'tienda').map(() => ({ wch: 22 })),
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario y Precios');
  XLSX.writeFile(workbook, fileName);
};

/**
 * Downloads a ready-to-fill Excel template with sample noodle and Christmas products
 */
export const downloadExcelTemplate = (destinations: Destination[]) => {
  const sampleRows = [
    {
      'CÓDIGO / SKU': '777010000001',
      'NOMBRE PRODUCTO': 'FIDEO MOÑITO ESPECIAL 10KG',
      'CATEGORÍA': 'FIDEO MOÑO',
      'PRESENTACIÓN': 'Bolsa 10 Kg',
      'DESCRIPCIÓN': 'Fideo de sémola fortificada, cocción rápida, no se deshace',
      'DESCRIPCIÓN EN KILOS': 'Bolsa sellada de 10.00 Kilos netos',
      'PESO UNITARIO (KG)': 10.0,
      'STOCK EN BOLSAS O CAJAS': 80,
      'STOCK EN KILOS': 800.0,
      'ALERTA MÍNIMA (KG)': 100,
      'PRECIO ANTIGUO (BS)': 82.0,
      'PRECIO ACTUAL BASE (BS)': 78.0,
      'PRECIO TIENDA / MOSTRADOR (BS)': 75.0,
      'PRECIO CHULUMANI (BS)': 80.0,
      'PRECIO IRUPANA (BS)': 82.0,
      'PRECIO GUANAY (BS)': 85.0,
      'PRECIO PALOS BLANCOS (BS)': 86.0,
      'PRECIO LA ASUNTA (BS)': 84.0,
    },
    {
      'CÓDIGO / SKU': '777010000003',
      'NOMBRE PRODUCTO': 'FIDEO TALLARÍN LARGO 10KG',
      'CATEGORÍA': 'FIDEO LARGO',
      'PRESENTACIÓN': 'Bolsa 10 Kg',
      'DESCRIPCIÓN': 'Tallarín largo tradicional de hebra resistente y textura al dente',
      'DESCRIPCIÓN EN KILOS': 'Bolsa sellada de 10.00 Kilos netos',
      'PESO UNITARIO (KG)': 10.0,
      'STOCK EN BOLSAS O CAJAS': 90,
      'STOCK EN KILOS': 900.0,
      'ALERTA MÍNIMA (KG)': 100,
      'PRECIO ANTIGUO (BS)': 80.0,
      'PRECIO ACTUAL BASE (BS)': 76.0,
      'PRECIO TIENDA / MOSTRADOR (BS)': 74.0,
      'PRECIO CHULUMANI (BS)': 78.0,
      'PRECIO IRUPANA (BS)': 80.0,
      'PRECIO GUANAY (BS)': 83.0,
      'PRECIO PALOS BLANCOS (BS)': 84.0,
      'PRECIO LA ASUNTA (BS)': 82.0,
    },
    {
      'CÓDIGO / SKU': '777010000021',
      'NOMBRE PRODUCTO': 'PANETÓN TRADICIONAL CON FRUTAS 900G',
      'CATEGORÍA': 'PANETÓN NAVIDEÑO',
      'PRESENTACIÓN': 'Unidad 900g',
      'DESCRIPCIÓN': 'Panetón artesanal con frutas confitadas y pasas en caja decorada',
      'DESCRIPCIÓN EN KILOS': 'Unidad de 0.90 Kilos netos',
      'PESO UNITARIO (KG)': 0.9,
      'STOCK EN BOLSAS O CAJAS': 200,
      'STOCK EN KILOS': 180.0,
      'ALERTA MÍNIMA (KG)': 30,
      'PRECIO ANTIGUO (BS)': 38.0,
      'PRECIO ACTUAL BASE (BS)': 34.0,
      'PRECIO TIENDA / MOSTRADOR (BS)': 32.0,
      'PRECIO CHULUMANI (BS)': 35.0,
      'PRECIO IRUPANA (BS)': 36.0,
      'PRECIO GUANAY (BS)': 38.0,
      'PRECIO PALOS BLANCOS (BS)': 39.0,
      'PRECIO LA ASUNTA (BS)': 37.0,
    },
    {
      'CÓDIGO / SKU': '777010000025',
      'NOMBRE PRODUCTO': 'GALLETAS SURTIDAS EN LATA NAVIDEÑA 500G',
      'CATEGORÍA': 'GALLETAS NAVIDEÑAS',
      'PRESENTACIÓN': 'Lata metálica de 500g',
      'DESCRIPCIÓN': 'Surtido de galletas finas de mantequilla en lata decorativa navideña',
      'DESCRIPCIÓN EN KILOS': 'Lata de 0.50 Kilos netos',
      'PESO UNITARIO (KG)': 0.5,
      'STOCK EN BOLSAS O CAJAS': 180,
      'STOCK EN KILOS': 90.0,
      'ALERTA MÍNIMA (KG)': 20,
      'PRECIO ANTIGUO (BS)': 45.0,
      'PRECIO ACTUAL BASE (BS)': 40.0,
      'PRECIO TIENDA / MOSTRADOR (BS)': 38.0,
      'PRECIO CHULUMANI (BS)': 41.0,
      'PRECIO IRUPANA (BS)': 42.0,
      'PRECIO GUANAY (BS)': 45.0,
      'PRECIO PALOS BLANCOS (BS)': 46.0,
      'PRECIO LA ASUNTA (BS)': 43.0,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla Productos');
  XLSX.writeFile(workbook, 'Plantilla_Excel_Inventario_Fideos_Navidad.xlsx');
};

/**
 * Parses an uploaded Excel or CSV file into product objects
 */
export const parseExcelFile = async (
  file: File,
  destinations: Destination[]
): Promise<{
  products: Omit<Product, 'id' | 'fechaRegistro'>[];
  errors: string[];
  warnings: string[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (workbook.SheetNames.length === 0) {
          resolve({
            products: [],
            errors: ['El archivo Excel no contiene hojas de cálculo.'],
            warnings: [],
          });
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          resolve({
            products: [],
            errors: ['La hoja de cálculo está vacía o no tiene datos reconocibles.'],
            warnings: [],
          });
          return;
        }

        const parsedProducts: Omit<Product, 'id' | 'fechaRegistro'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        rawJson.forEach((row, index) => {
          const rowNum = index + 2; // considering header is row 1

          // Build normalized dictionary of keys for this row
          const normRow: Record<string, any> = {};
          Object.keys(row).forEach((k) => {
            normRow[normalizeKey(k)] = row[k];
          });

          // Match Name
          const nombre =
            normRow['nombre_producto'] ||
            normRow['nombre'] ||
            normRow['producto'] ||
            normRow['descripcion_del_producto'] ||
            '';

          if (!nombre || String(nombre).trim() === '') {
            warnings.push(`Fila ${rowNum} ignorada: no tiene nombre de producto.`);
            return;
          }

          // Match Barcode
          const codigoBarras =
            String(
              normRow['codigo_sku'] ||
                normRow['codigo_barras'] ||
                normRow['codigo'] ||
                normRow['sku'] ||
                `77701${Math.floor(1000000 + Math.random() * 9000000)}`
            ).trim();

          // Match Category
          const rawCat =
            normRow['categoria'] ||
            normRow['tipo'] ||
            normRow['rubro'] ||
            normRow['clasificacion'] ||
            '';
          const { type: tipoFideo, name: categoriaNombre } = mapCategory(
            String(rawCat) || String(nombre)
          );

          // Match Presentation
          const presentacion =
            String(
              normRow['presentacion'] ||
                normRow['empaque'] ||
                normRow['formato'] ||
                (tipoFideo === 'paneton'
                  ? 'Unidad 900g'
                  : tipoFideo === 'galletas_navidad'
                  ? 'Caja 1 Kg'
                  : 'Bolsa 10 Kg')
            ).trim();

          // Match Description
          const descripcion =
            String(
              normRow['descripcion'] ||
                normRow['detalle'] ||
                normRow['observaciones'] ||
                `${nombre} para venta y distribución`
            ).trim();

          // Kilos per unit
          let kilosPorUnidad = parseFloat(
            normRow['peso_unitario_kg'] ||
              normRow['peso_unitario'] ||
              normRow['kilos_por_unidad'] ||
              normRow['peso_kg'] ||
              normRow['kilos']
          );
          if (isNaN(kilosPorUnidad) || kilosPorUnidad <= 0) {
            if (tipoFideo === 'paneton') kilosPorUnidad = 0.9;
            else if (tipoFideo === 'galletas_navidad') kilosPorUnidad = 1.0;
            else kilosPorUnidad = 10.0;
          }

          // Kilos Description
          const descripcionKilos =
            String(
              normRow['descripcion_en_kilos'] ||
                normRow['descripcion_kilos'] ||
                normRow['peso_descripcion'] ||
                (kilosPorUnidad < 1
                  ? `Presentación de ${(kilosPorUnidad * 1000).toFixed(0)}g (${kilosPorUnidad.toFixed(2)} Kg)`
                  : `Presentación de ${kilosPorUnidad.toFixed(2)} Kilos netos`)
            ).trim();

          // Stock in Bags/Boxes
          const stockBolsas = parseInt(
            normRow['stock_en_bolsas_o_cajas'] ||
              normRow['stock_bolsas'] ||
              normRow['stock_cajas'] ||
              normRow['stock_unidades'] ||
              normRow['unidades'] ||
              normRow['stock'] ||
              '50',
            10
          ) || 0;

          // Stock in Kilos
          let stockKilos = parseFloat(
            normRow['stock_en_kilos'] ||
              normRow['stock_kilos'] ||
              normRow['kilos_totales']
          );
          if (isNaN(stockKilos) || stockKilos <= 0) {
            stockKilos = Number((stockBolsas * kilosPorUnidad).toFixed(2));
          }

          // Min stock alert
          const minStockKilos = parseFloat(
            normRow['alerta_minima_kg'] ||
              normRow['alerta_minima'] ||
              normRow['min_stock_kilos'] ||
              '30'
          ) || 30;

          // Prices
          const precioActual = parseFloat(
            normRow['precio_actual_base_bs'] ||
              normRow['precio_actual'] ||
              normRow['precio_base'] ||
              normRow['precio'] ||
              '35'
          ) || 35;

          const precioAntiguo = parseFloat(
            normRow['precio_antiguo_bs'] ||
              normRow['precio_antiguo'] ||
              String(precioActual + 4)
          ) || precioActual;

          const precioTienda = parseFloat(
            normRow['precio_tienda_mostrador_bs'] ||
              normRow['precio_tienda'] ||
              normRow['precio_mostrador'] ||
              String(precioActual - 2)
          ) || precioActual;

          // Regional destination prices
          const preciosPorDestino: Record<string, number> = {};
          destinations.forEach((dest) => {
            if (dest.id !== 'tienda') {
              const destSlug = normalizeKey(dest.name);
              const destId = dest.id;

              // Find matching column in Excel row
              let foundVal: number | undefined;
              for (const [k, v] of Object.entries(normRow)) {
                if (k.includes(destSlug) || k.includes(destId)) {
                  const num = parseFloat(v);
                  if (!isNaN(num) && num > 0) {
                    foundVal = num;
                    break;
                  }
                }
              }

              preciosPorDestino[dest.id] =
                foundVal !== undefined
                  ? foundVal
                  : Number((precioTienda + (tipoFideo === 'paneton' ? 3 : 5)).toFixed(2));
            }
          });

          parsedProducts.push({
            nombre: String(nombre).trim().toUpperCase(),
            codigoBarras,
            tipoFideo,
            categoriaNombre,
            presentacion,
            descripcion,
            descripcionKilos,
            kilosPorUnidad,
            stockKilos: Number(stockKilos.toFixed(2)),
            stockBolsas,
            minStockKilos,
            precioAntiguo,
            precioActual,
            precioTienda,
            preciosPorDestino,
            activo: true,
          });
        });

        resolve({
          products: parsedProducts,
          errors,
          warnings,
        });
      } catch (err: any) {
        resolve({
          products: [],
          errors: [`Error al procesar el archivo Excel: ${err.message || 'Formato no válido'}`],
          warnings: [],
        });
      }
    };

    reader.onerror = () => {
      reject(new Error('No se pudo leer el archivo seleccionado.'));
    };

    reader.readAsArrayBuffer(file);
  });
};
