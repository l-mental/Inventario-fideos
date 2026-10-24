import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Destination,
  StaffMember,
  Venta,
  CartItem,
  TurnoCaja,
  MovimientoCaja,
  MetodoPago,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_DESTINATIONS,
  INITIAL_STAFF,
  INITIAL_SALES,
  INITIAL_TURNO,
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface AppContextType {
  products: Product[];
  destinations: Destination[];
  staff: StaffMember[];
  sales: Venta[];
  cart: CartItem[];
  activeDestinationId: string;
  activeStaffId: string;
  activeView: string;
  isDarkMode: boolean;
  turnoCaja: TurnoCaja;
  movimientosCaja: MovimientoCaja[];
  lastCompletedSale: Venta | null;
  selectedReceiptSale: Venta | null;

  // Setters
  setActiveDestinationId: (id: string) => void;
  setActiveStaffId: (id: string) => void;
  setActiveView: (view: string) => void;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedReceiptSale: (sale: Venta | null) => void;

  // Cart operations
  addToCart: (productId: string, unitType?: 'bolsas' | 'kilos', qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number, unitType?: 'bolsas' | 'kilos') => void;
  clearCart: () => void;
  cartTotalNeto: number;
  cartSubtotal: number;
  cartTotalKilos: number;
  cartTotalBolsas: number;

  // Sales execution
  executeSale: (params: {
    metodoPago: MetodoPago;
    clienteNombre: string;
    clienteDocumento?: string;
    montoRecibido?: number;
    descuento?: number;
    observaciones?: string;
  }) => Venta;

  // Product management
  addProduct: (product: Omit<Product, 'id' | 'fechaRegistro'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, deltaKilos: number, deltaBolsas: number, concepto: string) => void;

  // Destinations & Prices
  addDestination: (destination: Omit<Destination, 'id'>, defaultPrices?: Record<string, number>) => void;
  updateDestination: (destination: Destination) => void;
  getProductPriceForDestination: (product: Product, destinationId: string) => number;

  // Staff
  addStaff: (staffMember: Omit<StaffMember, 'id'>) => void;
  updateStaff: (staffMember: StaffMember) => void;

  // Cash Shift
  addMovimientoCaja: (tipo: 'INGRESO' | 'EGRESO', monto: number, concepto: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization with safety
  const loadStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(`softplus_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadStored<Product[]>('products', INITIAL_PRODUCTS);
    const hasPaneton = stored.some((p) => p.tipoFideo === 'paneton');
    if (!hasPaneton) {
      const christmasDefaults = INITIAL_PRODUCTS.filter(
        (p) => p.tipoFideo === 'paneton' || p.tipoFideo === 'galletas_navidad'
      );
      return [...stored, ...christmasDefaults];
    }
    return stored;
  });  const [destinations, setDestinations] = useState<Destination[]>(() => loadStored('destinations', INITIAL_DESTINATIONS));
  const [staff, setStaff] = useState<StaffMember[]>(() => loadStored('staff', INITIAL_STAFF));
  const [sales, setSales] = useState<Venta[]>(() => loadStored('sales', INITIAL_SALES));
  const [activeDestinationId, setActiveDestinationId] = useState<string>(() => loadStored('active_dest', 'tienda'));
  const [activeStaffId, setActiveStaffId] = useState<string>(() => loadStored('active_staff', 'stf-001'));
  const [activeView, setActiveView] = useState<string>('pos');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadStored('dark_mode', false));
  const [turnoCaja, setTurnoCaja] = useState<TurnoCaja>(() => loadStored('turno', INITIAL_TURNO));
  const [movimientosCaja, setMovimientosCaja] = useState<MovimientoCaja[]>(() => loadStored('mov_caja', []));

  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastCompletedSale, setLastCompletedSale] = useState<Venta | null>(null);
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<Venta | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('softplus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('softplus_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('softplus_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('softplus_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('softplus_active_dest', JSON.stringify(activeDestinationId));
  }, [activeDestinationId]);

  useEffect(() => {
    localStorage.setItem('softplus_active_staff', JSON.stringify(activeStaffId));
  }, [activeStaffId]);

  useEffect(() => {
    localStorage.setItem('softplus_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('softplus_turno', JSON.stringify(turnoCaja));
  }, [turnoCaja]);

  useEffect(() => {
    localStorage.setItem('softplus_mov_caja', JSON.stringify(movimientosCaja));
  }, [movimientosCaja]);

  // Price resolution helper
  const getProductPriceForDestination = (product: Product, destinationId: string): number => {
    if (!product) return 0;
    if (destinationId === 'tienda') {
      return product.precioTienda || product.precioActual || 0;
    }
    if (product.preciosPorDestino && product.preciosPorDestino[destinationId] !== undefined) {
      return product.preciosPorDestino[destinationId];
    }
    return product.precioActual || product.precioTienda || 0;
  };

  // Re-calculate cart item prices whenever destination changes
  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        const unitPrice = getProductPriceForDestination(item.producto, activeDestinationId);
        // If sold by kilos and product is in bulk vs bags
        const effectivePrice = item.unidadSeleccionada === 'kilos' && item.producto.kilosPorUnidad > 1
          ? (unitPrice / item.producto.kilosPorUnidad)
          : unitPrice;
        
        return {
          ...item,
          precioUnitario: effectivePrice,
          subtotal: Number((effectivePrice * item.cantidad).toFixed(2)),
        };
      })
    );
  }, [activeDestinationId]);

  // Cart totals
  const cartSubtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const cartTotalNeto = cartSubtotal; // discount can be applied on checkout
  const cartTotalKilos = cart.reduce((acc, item) => acc + item.kilosCalculados, 0);
  const cartTotalBolsas = cart.reduce((acc, item) => acc + (item.unidadSeleccionada === 'bolsas' ? item.cantidad : 0), 0);

  // Cart operations
  const addToCart = (productId: string, unitType: 'bolsas' | 'kilos' = 'bolsas', qty: number = 1) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (ci) => ci.producto.id === productId && ci.unidadSeleccionada === unitType
      );

      const price = getProductPriceForDestination(prod, activeDestinationId);
      const effectiveUnitPrice = unitType === 'kilos' && prod.kilosPorUnidad > 1
        ? Number((price / prod.kilosPorUnidad).toFixed(2))
        : price;

      if (existingIndex >= 0) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].cantidad + qty;
        const kilosCalc = unitType === 'bolsas' ? newQty * prod.kilosPorUnidad : newQty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: newQty,
          kilosCalculados: Number(kilosCalc.toFixed(2)),
          subtotal: Number((effectiveUnitPrice * newQty).toFixed(2)),
        };
        return updated;
      } else {
        const kilosCalc = unitType === 'bolsas' ? qty * prod.kilosPorUnidad : qty;
        return [
          ...prevCart,
          {
            producto: prod,
            unidadSeleccionada: unitType,
            cantidad: qty,
            kilosCalculados: Number(kilosCalc.toFixed(2)),
            precioUnitario: effectiveUnitPrice,
            subtotal: Number((effectiveUnitPrice * qty).toFixed(2)),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.producto.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number, unitType?: 'bolsas' | 'kilos') => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.producto.id === productId) {
          const actualUnit = unitType || item.unidadSeleccionada;
          const price = getProductPriceForDestination(item.producto, activeDestinationId);
          const effectiveUnitPrice = actualUnit === 'kilos' && item.producto.kilosPorUnidad > 1
            ? Number((price / item.producto.kilosPorUnidad).toFixed(2))
            : price;
          const kilosCalc = actualUnit === 'bolsas' ? quantity * item.producto.kilosPorUnidad : quantity;
          return {
            ...item,
            unidadSeleccionada: actualUnit,
            cantidad: quantity,
            kilosCalculados: Number(kilosCalc.toFixed(2)),
            precioUnitario: effectiveUnitPrice,
            subtotal: Number((effectiveUnitPrice * quantity).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Execute Sale
  const executeSale = ({
    metodoPago,
    clienteNombre,
    clienteDocumento = '',
    montoRecibido = 0,
    descuento = 0,
    observaciones = '',
  }: {
    metodoPago: MetodoPago;
    clienteNombre: string;
    clienteDocumento?: string;
    montoRecibido?: number;
    descuento?: number;
    observaciones?: string;
  }): Venta => {
    if (cart.length === 0) {
      throw new Error('El carrito de compras está vacío.');
    }

    const currentStaff = staff.find((s) => s.id === activeStaffId) || staff[0];
    const currentDest = destinations.find((d) => d.id === activeDestinationId) || destinations[0];

    const subtotal = cartSubtotal;
    const totalNeto = Math.max(0, subtotal - (descuento || 0));
    const cambio = montoRecibido > totalNeto ? montoRecibido - totalNeto : 0;

    const nextSaleNum = sales.length + 101;
    const saleId = `VNT-${String(nextSaleNum).padStart(5, '0')}`;
    const voucherNum = `BOL-${String(nextSaleNum).padStart(6, '0')}`;

    const saleItems = cart.map((ci) => ({
      productoId: ci.producto.id,
      nombre: ci.producto.nombre,
      tipoFideo: ci.producto.tipoFideo,
      unidad: ci.unidadSeleccionada,
      cantidad: ci.cantidad,
      kilosUnitarios: ci.producto.kilosPorUnidad,
      kilosTotales: ci.kilosCalculados,
      precioUnitario: ci.precioUnitario,
      subtotal: ci.subtotal,
    }));

    const newSale: Venta = {
      id: saleId,
      numeroComprobante: voucherNum,
      fecha: new Date().toISOString(),
      encargadoId: currentStaff.id,
      encargadoNombre: currentStaff.nombre,
      destinoId: currentDest.id,
      destinoNombre: currentDest.name,
      clienteNombre: clienteNombre || 'VENTA MOSTRADOR (CONSUMIDOR FINAL)',
      clienteDocumento,
      items: saleItems,
      totalKilos: cartTotalKilos,
      totalBolsas: cartTotalBolsas,
      subtotal,
      descuento,
      totalNeto,
      metodoPago,
      montoRecibido: montoRecibido || totalNeto,
      cambio,
      observaciones,
      estado: 'COMPLETADA',
    };

    // Deduct stock from inventory
    setProducts((prevProds) =>
      prevProds.map((p) => {
        const itemSold = cart.find((ci) => ci.producto.id === p.id);
        if (!itemSold) return p;

        let newStockKilos = p.stockKilos - itemSold.kilosCalculados;
        let newStockBolsas = p.stockBolsas;

        if (itemSold.unidadSeleccionada === 'bolsas') {
          newStockBolsas = Math.max(0, p.stockBolsas - itemSold.cantidad);
        } else {
          // If sold in loose kilos, reflect on bags proportionally
          newStockBolsas = p.kilosPorUnidad > 0 ? Math.floor(newStockKilos / p.kilosPorUnidad) : newStockBolsas;
        }

        return {
          ...p,
          stockKilos: Math.max(0, Number(newStockKilos.toFixed(2))),
          stockBolsas: Math.max(0, newStockBolsas),
        };
      })
    );

    // Update staff sales performance
    setStaff((prevStaff) =>
      prevStaff.map((s) => {
        if (s.id === currentStaff.id) {
          return {
            ...s,
            totalVentasBs: (s.totalVentasBs || 0) + totalNeto,
            totalKilosDespachados: (s.totalKilosDespachados || 0) + cartTotalKilos,
          };
        }
        return s;
      })
    );

    // Update Cash shift if cash payment
    if (metodoPago === 'EFECTIVO' || metodoPago === 'MIXTO') {
      const cashPortion = metodoPago === 'EFECTIVO' ? totalNeto : totalNeto * 0.5;
      setTurnoCaja((prev) => ({
        ...prev,
        efectivoEsperado: Number((prev.efectivoEsperado + cashPortion).toFixed(2)),
      }));

      setMovimientosCaja((prev) => [
        {
          id: `MOV-${Date.now()}`,
          tipo: 'VENTA',
          monto: cashPortion,
          concepto: `Venta ${voucherNum} (${currentDest.name})`,
          fecha: new Date().toISOString(),
          encargadoNombre: currentStaff.nombre,
        },
        ...prev,
      ]);
    }

    setSales((prev) => [newSale, ...prev]);
    setLastCompletedSale(newSale);
    setSelectedReceiptSale(newSale);
    clearCart();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b4d8', '#06b6d4', '#10b981', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    return newSale;
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'fechaRegistro'>) => {
    const nextNum = products.length + 1;
    const newId = `FID-${String(nextNum).padStart(3, '0')}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      fechaRegistro: new Date().toISOString().split('T')[0],
      activo: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustStock = (productId: string, deltaKilos: number, deltaBolsas: number, concepto: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newKilos = Math.max(0, p.stockKilos + deltaKilos);
          const newBolsas = Math.max(0, p.stockBolsas + deltaBolsas);
          return {
            ...p,
            stockKilos: Number(newKilos.toFixed(2)),
            stockBolsas: newBolsas,
          };
        }
        return p;
      })
    );
  };

  // Destinations & Prices CRUD
  const addDestination = (destData: Omit<Destination, 'id'>, defaultPrices?: Record<string, number>) => {
    const slug = destData.name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '_');
    const newDestId = slug || `dest_${Date.now()}`;

    const newDest: Destination = {
      ...destData,
      id: newDestId,
    };

    setDestinations((prev) => [...prev, newDest]);

    // Update all products with pricing for this new destination
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const newPrices = { ...prod.preciosPorDestino };
        if (defaultPrices && defaultPrices[prod.id] !== undefined) {
          newPrices[newDestId] = defaultPrices[prod.id];
        } else {
          // Default to base price + modest transport margin (e.g. + Bs 4.00)
          newPrices[newDestId] = Number((prod.precioTienda + 4.0).toFixed(2));
        }
        return {
          ...prod,
          preciosPorDestino: newPrices,
        };
      })
    );
  };

  const updateDestination = (updatedDest: Destination) => {
    setDestinations((prev) => prev.map((d) => (d.id === updatedDest.id ? updatedDest : d)));
  };

  // Staff CRUD
  const addStaff = (staffData: Omit<StaffMember, 'id'>) => {
    const nextNum = staff.length + 1;
    const newStaff: StaffMember = {
      ...staffData,
      id: `stf-${String(nextNum).padStart(3, '0')}`,
      activo: true,
      totalVentasBs: 0,
      totalKilosDespachados: 0,
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaff = (updatedStaff: StaffMember) => {
    setStaff((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const addMovimientoCaja = (tipo: 'INGRESO' | 'EGRESO', monto: number, concepto: string) => {
    const curStaff = staff.find((s) => s.id === activeStaffId) || staff[0];
    const newMov: MovimientoCaja = {
      id: `MOV-${Date.now()}`,
      tipo,
      monto,
      concepto,
      fecha: new Date().toISOString(),
      encargadoNombre: curStaff.nombre,
    };

    setMovimientosCaja((prev) => [newMov, ...prev]);

    setTurnoCaja((prev) => ({
      ...prev,
      efectivoEsperado: Number(
        (prev.efectivoEsperado + (tipo === 'INGRESO' ? monto : -monto)).toFixed(2)
      ),
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setDestinations(INITIAL_DESTINATIONS);
    setStaff(INITIAL_STAFF);
    setSales(INITIAL_SALES);
    setTurnoCaja(INITIAL_TURNO);
    setMovimientosCaja([]);
    setCart([]);
    setActiveDestinationId('tienda');
    setActiveStaffId('stf-001');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        destinations,
        staff,
        sales,
        cart,
        activeDestinationId,
        activeStaffId,
        activeView,
        isDarkMode,
        turnoCaja,
        movimientosCaja,
        lastCompletedSale,
        selectedReceiptSale,
        setActiveDestinationId,
        setActiveStaffId,
        setActiveView,
        setIsDarkMode,
        setSelectedReceiptSale,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalNeto,
        cartSubtotal,
        cartTotalKilos,
        cartTotalBolsas,
        executeSale,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addDestination,
        updateDestination,
        getProductPriceForDestination,
        addStaff,
        updateStaff,
        addMovimientoCaja,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
