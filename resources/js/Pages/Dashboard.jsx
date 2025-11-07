import React from 'react';
import {
  Truck,
  User,
  Plus,
  ArrowRight,
  ClipboardList,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

// --- Data Structures ---

const stats = [
  { name: 'Unidades en Patio', value: '12', icon: Truck },
  { name: 'Movimientos Hoy', value: '34', icon: Clock },
  { name: 'Alertas Críticas', value: '2', icon: ClipboardList, color: 'text-red-500' },
];

const latestUnits = [
  {
    fecha: '02/10/2025 10:02',
    unidad: 'ECO-310',
    chofer: 'Carlos Díaz',
    tipo: 'Salida',
    TypeIcon: ArrowUpRight, // Usamos ArrowUpRight para Salida
    typeColor: 'text-red-600 bg-red-100',
  },
  {
    fecha: '02/10/2025 09:10',
    unidad: 'ECO-245',
    chofer: 'María López',
    tipo: 'Entrada',
    TypeIcon: ArrowDownLeft, // Usamos ArrowDownLeft para Entrada
    typeColor: 'text-green-600 bg-green-100',
  },
  {
    fecha: '02/10/2025 08:55',
    unidad: 'ECO-199',
    chofer: 'Juan Pérez',
    tipo: 'Salida',
    TypeIcon: ArrowUpRight,
    typeColor: 'text-red-600 bg-red-100',
  },
  {
    fecha: '02/10/2025 08:40',
    unidad: 'ECO-450',
    chofer: 'Ana Ruiz',
    tipo: 'Entrada',
    TypeIcon: ArrowDownLeft,
    typeColor: 'text-green-600 bg-green-100',
  },
  {
  fecha: '02/10/2025 08:21',
  unidad: 'ECO-102',
  chofer: 'Juan Pérez',
  tipo: 'Salida',
  TypeIcon: ArrowUpRight,
  typeColor: 'text-red-600 bg-red-100',
  },
];

const quickActions = [
  { name: 'Nueva Unidad', icon: Truck, action: () => console.log('Nueva Unidad') },
  { name: 'Nuevo Chofer', icon: User, action: () => console.log('Nuevo Chofer') },
  { name: 'Nuevo Motivo', icon: Plus, action: () => console.log('Nuevo Motivo') },
  { name: 'Ver Registros', icon: ClipboardList, action: () => console.log('Ver Registros') },
  { name: 'Generar Reporte', icon: FileText, action: () => console.log('Generar Reporte') },
  { name: 'Registrar Movimiento', icon: Clock, action: () => console.log('Registrar Movimiento') },
];

// --- Components ---

function StatCard({ name, value, color = 'text-gray-900', icon: Icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{name}</p>
        <p className={`mt-1 text-3xl font-semibold ${color}`}>{value}</p>
      </div>
      {Icon && <Icon className={`w-8 h-8 ${color.replace('text-', 'text-')} opacity-50`} />}
    </div>
  );
}

function LatestUnitsTable() {
  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimas 5 Unidades Registradas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {['Fecha', 'Unidad', 'Chofer', 'Tipo'].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {latestUnits.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.unidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.chofer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${item.typeColor}`}>
                    {item.TypeIcon && <item.TypeIcon className="w-3 h-3 mr-1" />}
                    {item.tipo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuickActionButton({ name, icon: Icon, action }) {
  return (
    <button
      onClick={action}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-lg transition duration-150 ease-in-out w-full border-2 border-gray-100 hover:border-blue-300"
    >
      <span className="flex items-center space-x-3 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <span>{name}</span>
      </span>
      <ArrowRight className="w-4 h-4 text-gray-400" />
    </button>
  );
}

function QuickActions() {
  return (
    <div className="p-4 rounded-xl bg-white shadow lg:shadow-none lg:bg-transparent">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
      {/* Usamos un grid de 2 o 3 columnas dependiendo del tamaño de la pantalla */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
}

// --- Main Dashboard Component ---

export default function DashboardLucide() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="sr-only">Dashboard de Gestión de Patios</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Main Content Area: Table and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-2">
          <LatestUnitsTable />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}