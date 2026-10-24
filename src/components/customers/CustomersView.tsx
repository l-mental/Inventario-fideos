import React, { useState } from 'react';
import { Users, Plus, Phone, MapPin, Building2, Search } from 'lucide-react';

interface Customer {
  id: string;
  nombre: string;
  tipo: 'Mayorista' | 'Tienda de Barrio' | 'Consumidor Final' | 'Comedor / Minera';
  nitCi: string;
  ciudad: string;
  telefono: string;
  totalKilosComprados: number;
}

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CLI-001',
      nombre: 'Abarrotes Don Pedro (Chulumani)',
      tipo: 'Mayorista',
      nitCi: '4920194012',
      ciudad: 'Chulumani - Sud Yungas',
      telefono: '715-44901',
      totalKilosComprados: 450,
    },
    {
      id: 'CLI-002',
      nombre: 'Comercializadora Minera Norte',
      tipo: 'Comedor / Minera',
      nitCi: '1029384019',
      ciudad: 'Guanay - Larecaja',
      telefono: '720-88129',
      totalKilosComprados: 680,
    },
    {
      id: 'CLI-003',
      nombre: 'Distribuidora Los Yungas Irupana',
      tipo: 'Mayorista',
      nitCi: '3829104021',
      ciudad: 'Irupana',
      telefono: '680-12940',
      totalKilosComprados: 390,
    },
    {
      id: 'CLI-004',
      nombre: 'Pulpería Central Palos Blancos',
      tipo: 'Tienda de Barrio',
      nitCi: '5928102018',
      ciudad: 'Palos Blancos',
      telefono: '732-90184',
      totalKilosComprados: 280,
    },
    {
      id: 'CLI-005',
      nombre: 'Almacén Rural La Asunta',
      tipo: 'Mayorista',
      nitCi: '6192840129',
      ciudad: 'La Asunta',
      telefono: '719-33201',
      totalKilosComprados: 520,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<Customer['tipo']>('Mayorista');
  const [nitCi, setNitCi] = useState('');
  const [ciudad, setCiudad] = useState('Chulumani');
  const [telefono, setTelefono] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nitCi.includes(searchTerm)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const newCust: Customer = {
      id: `CLI-${String(customers.length + 1).padStart(3, '0')}`,
      nombre: nombre.trim(),
      tipo,
      nitCi: nitCi.trim() || 'S/N',
      ciudad: ciudad.trim(),
      telefono: telefono.trim() || 'S/N',
      totalKilosComprados: 0,
    };

    setCustomers([newCust, ...customers]);
    setNombre('');
    setNitCi('');
    setTelefono('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#00b4d8]" />
            Base de Clientes & Comerciantes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comerciantes mayoristas, pulperías y tiendas de barrio en los Yungas, Guanay y La Paz
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nombre, ciudad (Chulumani, Guanay...) o NIT..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500 shadow-xs"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase">
                  {c.nombre}
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 px-2 py-0.5 rounded mt-1 inline-block">
                  {c.tipo}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{c.ciudad}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.telefono}</span>
              </p>
              <p className="text-[11px] font-mono text-slate-400">NIT/CI: {c.nitCi}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px]">Volumen Comprado:</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                {c.totalKilosComprados} Kg
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Nuevo Cliente Mayorista / Tienda
            </h3>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Nombre o Tienda *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Abarrotes San Juan (Guanay)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Tipo de Cliente</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Mayorista">Mayorista (Fardos y Bolsas)</option>
                  <option value="Tienda de Barrio">Tienda de Barrio</option>
                  <option value="Comedor / Minera">Comedor / Empresa Minera</option>
                  <option value="Consumidor Final">Consumidor Final</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Población / Localidad</label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="ej. Chulumani, Irupana, Guanay"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">NIT / CI</label>
                  <input
                    type="text"
                    value={nitCi}
                    onChange={(e) => setNitCi(e.target.value)}
                    placeholder="4910291012"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="712-99012"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00b4d8] text-white rounded-xl text-xs font-bold"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
