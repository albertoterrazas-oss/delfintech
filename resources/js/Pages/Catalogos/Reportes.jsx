import { useEffect, useState } from "react";
import { toast } from 'sonner';
import Datatable from "@/Components/Datatable";
import SelectInput from "@/components/SelectInput";
import { excelTemplate } from '../Catalogos/ExcelTemplate'


const Card = ({ title, value }) => (
    <div className="bg-white rounded-lg p-5 shadow-sm flex-1 ring-1 ring-gray-100">
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
);

export default function Reportes() {
    const [reportes, setReportes] = useState({
        totalMovimientos: 0,
        totalSalidas: 0,
        movimientos: [],
        totalEntradas: 0,
    });
    const [units, setUnits] = useState([]); // Cambiado a units
    const [users, setUsers] = useState([]);
    const [filtros, setfiltros] = useState({
        usuarioID: null,
        tipoMovimiento: null,
        fechaInicio: null,
        fechaFin: null,
    });


    const getReportes = async () => {
        try {
            const response = await fetch(route('ReporteMovimientos'), {
                method: 'POST',
                body: JSON.stringify(filtros),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setReportes(data);

        } catch (err) {
            console.error('Error al obtener movimientos:', err);
        }
    };


    const getUnits = async () => {

        try {
            const response = await fetch(route("unidades.index"));

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText} (${response.status})`);
            }
            const data = await response.json();
            setUnits(data);

        } catch (error) {
            console.error('Error al obtener las unidades:', error);
        } finally {
        }
    };

    const getUsers = async () => {
        try {
            const data = await fetch(route("users.index")).then(res => res.json());
            setUsers(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }


    useEffect(() => {
        getReportes()
        getUsers();
        getUnits()
    }, [])

    const metrics = [
        { title: "Movimientos Hoy", value: reportes.totalMovimientos },
        { title: "Entradas", value: reportes.totalEntradas },
        { title: "Salidas", value: reportes.totalSalidas },
    ];


     const excelColumns = [
        { header: "Fecha", accessor: "Movimientos_fecha", type: "date" },
        { header: "Chofer", accessor: "nombre_chofer", type: "text" },
        { header: "Placas", accessor: "Unidades_placa", type: "text" },
        { header: "Unidad", accessor: "Unidades_numeroEconomico", type: "text" },
        { header: "Tipo Movimiento", accessor: "Movimientos_tipoMovimiento", type: "text" },
        { header: "Destino", accessor: "Destinos_Nombre", type: "text" },
        { header: "Combustible", accessor: "Movimientos_combustible", type: "number" },
        { header: "Kilometraje", accessor: "Movimientos_kilometraje", type: "number" },
    ]

    const handleExportExcel = () => excelTemplate(
        reportes.movimientos,
        excelColumns,
        filtros,
        "Reporte_Movimientos"
    )

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto bg-gray-50">

            {/* Encabezado */}
            <div className="flex justify-between items-center p-3 border-b mb-4 bg-white sticky top-0 z-10 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Reportes </h2>
            </div>

            {/* SECCIÓN DE MÉTRICAS (HEADLINES) */}
            <div className="flex gap-4 mb-4">
                {metrics.map(metric => (
                    <Card key={metric.title} title={metric.title} value={metric.value} />
                ))}
            </div>

            {/* <ReportFilterSection /> */}
            <div className="bg-white rounded-lg p-5 shadow-sm mt-5 ring-1 ring-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Filtros</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">

                    <div className={`flex flex-col gap-1 h-full`}>
                        <label className="text-sm font-medium text-gray-600">
                            Rango de Fechas
                        </label>

                        <input
                            type="date"
                            name="fechaInicio"
                            value={filtros.fechaInicio}
                            onChange={(e) => { // <-- Cambiado de (value) a (e) para recibir el objeto de evento
                                setfiltros({ ...filtros, fechaInicio: event.target.value });
                            }}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="date"
                            name="fechaFin"
                            value={filtros.fechaFin}
                            onChange={(e) => { // <-- Cambiado de (value) a (e) para recibir el objeto de evento
                                setfiltros({ ...filtros, fechaFin: event.target.value });
                            }}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>


                    <SelectInput
                        label="Unidad (Número Económico)"
                        value={filtros.unidad}
                        onChange={(event) => {
                            setfiltros({ ...filtros, unidad: event.target.value });
                        }}
                        options={units}
                        placeholder="Seleccionar unidad..."
                        valueKey="CUA_unidadID"
                        labelKey="Unidades_numeroEconomico"
                    />

                    <SelectInput
                        label="Chofer / Ayudante"
                        value={filtros.usuarioID}
                        onChange={(event) => {
                            setfiltros({ ...filtros, usuarioID: event.target.value });
                        }} options={users}
                        placeholder="Seleccionar Chofer / ayudante"
                        valueKey="Personas_usuarioID"
                        labelKey="nombre_completo"
                    />

                    <SelectInput
                        label="Tipo de movimiento" // Etiqueta del campo
                        value={filtros.tipoMovimiento} // Valor actual del filtro
                        onChange={(event) => {
                            // Actualiza el estado con el nuevo valor seleccionado
                            setfiltros({ ...filtros, tipoMovimiento: event.target.value });
                        }}
                        options={[
                            { id: "ENTRADA", nombre: "ENTRADA" },
                            { id: "SALIDA", nombre: "SALIDA" },
                        ]}
                        placeholder="Seleccionar tipo de movimiento"
                        valueKey="id" // Clave para el valor que se guardará en `filtros.tipoMovimiento`
                        labelKey="nombre" // Clave para el texto que se mostrará en la lista desplegable
                    />

                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <button
                        onClick={getReportes}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-200 transition disabled:opacity-50"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={() =>
                            setfiltros({
                                usuarioID: null,
                                tipoMovimiento: null,
                                fechaInicio: null,
                                fechaFin: null,
                            })
                        }
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-200 transition disabled:opacity-50"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                        style={{ backgroundColor: '#5bc0de' }} // Color exacto de la imagen
                    >
                        Exportar
                    </button>
                </div>
            </div>


            {/* Contenido de la tabla de Reportes */}
            <div className="p-3 w-full bg-white rounded-lg shadow-md min-h-[300px] mt-4 ring-1 ring-gray-100">
                <Datatable
                    data={reportes.movimientos}
                    virtual={true}
                    searcher={false}
                    columns={[
                        { header: 'Fecha hora', accessor: 'Movimientos_fecha' },
                        { header: 'Unidad', accessor: 'Unidades_numeroEconomico' },
                        { header: 'Chofer', accessor: 'nombre_chofer' },
                        { header: 'Destino', accessor: 'Destinos_Nombre' },
                        { header: 'Motivo', accessor: 'Motivos_nombre' },
                        { header: 'Kilometraje', accessor: 'Movimientos_kilometraje' },
                        { header: 'Combustible', accessor: 'Movimientos_combustible' },
                    ]}
                />
            </div>
        </div>
    );
}