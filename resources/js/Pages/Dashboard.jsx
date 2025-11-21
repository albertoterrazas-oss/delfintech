


import { useEffect, useState } from "react";
import request from "@/utils";
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

import Datatable from "@/Components/Datatable";
import { Link } from 'react-router-dom'

const quickActions = [
  { name: 'Nueva Unidad', icon: Truck, url: 'unidades' },
  { name: 'Nuevo Chofer', icon: User, url: 'choferes' },
  { name: 'Registrar Movimiento', icon: Clock, url: 'registrosalida' },
  { name: 'Nuevo Motivo', icon: ClipboardList, url: 'motivos' },
  { name: 'Generar Reporte', icon: FileText, url: 'reportes' },
  { name: 'Nuevo Destino', icon: Plus, url: 'destino' },
];



function StatCard({ name, value, color = 'text-gray-900', icon: Icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between transition transform hover:scale-[1.01] duration-300 ease-in-out">
      <div>
        <p className="text-sm font-medium text-gray-500">{name}</p>
        <p className={`mt-1 text-4xl font-extrabold ${color}`}>{value}</p>
      </div>
      {/* Icono con color tenue y un círculo de fondo para contraste */}
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
        {Icon && <Icon className={`w-8 h-8 ${color}`} />}
      </div>
    </div>
  );
}

function QuickActionButton({ name, icon: Icon, action, ArrowRight,url }) {
  const toPath = `/${url.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Link to={toPath} className="w-full">
      <button
        onClick={action}
        className="flex items-center p-4 bg-white rounded-xl shadow-md border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg transition duration-200 ease-in-out w-full transform hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-blue-300/50"
      >
        <span className="flex items-center space-x-4 flex-grow text-sm font-semibold text-gray-700">
          <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <span className="text-left">{name}</span>
        </span>
        {ArrowRight && <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />}
      </button>
    </Link>
  );
}

function QuickActions() {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Acciones Rápidas</h2>
      <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {

  const [dashboardData, setDashboardData] = useState({
    ultimas5Unidades: [],
    totalUnidades: 0,
    movimientosDeHoy: [],
    totalMovimientosHoy: 0,
    incidencias: [],
    totalIncidencias: 0,
  });

  const getUnits = async () => {

    try {
      const response = await fetch(route("DashboardUnidad"));

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();

      // ⭐️ ¡Aquí se guardan los datos en el estado! ⭐️
      setDashboardData(data);

      console.log('dashboard obtenidas:', data);

    } catch (error) {
      console.error('Error al obtener las unidades:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const stats = [
    { name: 'Unidades en Patio', value: dashboardData.totalUnidades, icon: Truck, color: 'text-blue-600' },
    { name: 'Movimientos Hoy', value: dashboardData.totalMovimientosHoy, icon: Clock, color: 'text-yellow-600' },
    { name: 'Alertas Críticas', value: dashboardData.totalIncidencias, icon: ClipboardList, color: 'text-red-500' },
  ]

  useEffect(() => {
    getUnits() // Llamar a getUnits al montar
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumen operativo y movimientos en tiempo real.
        </p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Main Content Area: Table and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Table (takes 2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Últimas Unidades Registradas</h2>
            <div className="overflow-x-auto">
              <Datatable
                data={dashboardData.ultimas5Unidades}
                virtual={true}
                searcher={false}
                columns={[
                  {
                    header: "Estatus",
                    accessor: "Unidades_estatus",
                    width: '20%',
                    cell: ({ item: { Unidades_estatus } }) => {
                      const color = String(Unidades_estatus) === "1"
                        ? "bg-green-300" // Si es "1"
                        : "bg-red-300";  // Si NO es "1" (incluyendo "2", "0", null, etc.)

                      return (
                        <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`} />
                      );
                    },
                  },
                  { header: 'No. Económico', accessor: 'Unidades_numeroEconomico' },
                  { header: 'Modelo', accessor: 'Unidades_modelo' },
                  { header: 'Placa', accessor: 'Unidades_placa' },
                  { header: 'Mantenimiento', accessor: 'Unidades_mantenimiento' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions (takes 1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}