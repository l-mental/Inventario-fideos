export interface Destination {
  id: string;
  name: string;
  department: string;
  description?: string;
  isDefault?: boolean;
}

export type FideoCategory =
  | 'moño'
  | 'largos'
  | 'cortos'
  | 'soperos'
  | 'especiales'
  | 'paneton'
  | 'galletas_navidad'
  | 'navidad';

export interface Product {
  id: string;
  codigoBarras: string;
  nombre: string;
  tipoFideo: FideoCategory;
  categoriaNombre: string; // e.g. "FIDEO MOÑO", "FIDEO LARGO"
  presentacion: string; // e.g. "Bolsa 10 Kg", "Bolsa 25 Kg", "Bolsa 5 Kg", "Granel / Kilo", "Fardo 10x1kg"
  descripcion: string;
  
  // Peso y Kilos
  descripcionKilos: string; // e.g. "Bolsa sellada de 10.00 Kg", "Venta suelta por Kilo"
  kilosPorUnidad: number; // e.g. 10.0, 25.0, 5.0, 1.0
  stockKilos: number; // Cantidad total en kilos disponibles
  stockBolsas: number; // Cantidad en bolsas o unidades disponibles
  minStockKilos: number;

  // Precios
  precioAntiguo: number; // Precio anterior de referencia
  precioActual: number;  // Precio base vigente
  precioTienda: number;  // Precio mostrador / local fábrica
  preciosPorDestino: Record<string, number>; // chulumani, irupana, guanay, palos_blancos, asunta + dinámicos

  // Metadatos
  activo: boolean;
  fechaRegistro: string;
  imagenIcono?: string;
}

export interface StaffMember {
  id: string;
  nombre: string;
  cargo: string; // e.g. "Cajero Central", "Encargado Yungas", "Chofer Distribuidor"
  telefono: string;
  ci?: string;
  activo: boolean;
  totalVentasBs?: number;
  totalKilosDespachados?: number;
}

export interface CartItem {
  producto: Product;
  unidadSeleccionada: 'bolsas' | 'kilos';
  cantidad: number; // Número de bolsas o número de kilos
  kilosCalculados: number; // Total de kilos
  precioUnitario: number; // Precio según el destino actual
  subtotal: number;
}

export type MetodoPago = 'EFECTIVO' | 'PAGO QR' | 'MIXTO' | 'CRÉDITO';

export interface Venta {
  id: string;
  numeroComprobante: string;
  fecha: string; // ISO
  encargadoId: string;
  encargadoNombre: string;
  destinoId: string;
  destinoNombre: string;
  clienteNombre: string;
  clienteDocumento?: string; // NIT/CI
  items: {
    productoId: string;
    nombre: string;
    tipoFideo: FideoCategory;
    unidad: 'bolsas' | 'kilos';
    cantidad: number;
    kilosUnitarios: number;
    kilosTotales: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  totalKilos: number;
  totalBolsas: number;
  subtotal: number;
  descuento: number;
  totalNeto: number;
  metodoPago: MetodoPago;
  montoRecibido?: number;
  cambio?: number;
  observaciones?: string;
  estado: 'COMPLETADA' | 'PROFORMA' | 'ANULADA';
}

export interface MovimientoCaja {
  id: string;
  tipo: 'INGRESO' | 'EGRESO' | 'VENTA';
  monto: number;
  concepto: string;
  fecha: string;
  encargadoNombre: string;
}

export interface TurnoCaja {
  id: string;
  numeroTurno: number;
  fechaApertura: string;
  montoInicial: number;
  efectivoEsperado: number;
  estado: 'ABIERTO' | 'CERRADO';
  encargadoApertura: string;
}
