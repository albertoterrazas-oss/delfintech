import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react';
// Importamos Sonner (asumo que está configurado)
import { toast } from 'sonner';

// ======================================================================
// Dependencias externas simuladas (Asegúrate de que existan en tu proyecto)
// ======================================================================

// Estos deben ser importados de tu proyecto real:
// import Datatable from "@/Components/Datatable";
// import LoadingDiv from "@/Components/LoadingDiv";
// import request from "@/utils";

// Sustitución DUMMY para el ejemplo completo:
const Datatable = ({ data, columns }) => (
    <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>{columns.map(col => <th key={col.header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                    <tr key={index}>
                        {columns.map(col => (
                            <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {col.cell ? col.cell({ item }) : item[col.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
const LoadingDiv = () => (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl z-10">
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    </div>
);
const request = async (ruta, method, data) => {
    console.log(`Petición simulada: ${method} a ${ruta}`, data);
    // Simulación de una respuesta exitosa y un retraso
    return new Promise((resolve) => setTimeout(resolve, 500));
};

// Rutas DUMMY adaptadas para Reportes
const route = (name, params = {}) => {
    const routeMap = {
        "reportes.index": "/api/reportes",
        "reportes.store": "/api/reportes",
        "reportes.update": `/api/reportes/${params}`,
    };
    return routeMap[name] || `/${name}`;
};

// Validaciones DUMMY
const reporteValidations = {
    Reporte_nombre: true,
    Reporte_tipo: true,
    Reporte_estatus: true,
};

const validateInputs = (validations, data) => {
    let formErrors = {};
    if (validations.Reporte_nombre && !data.Reporte_nombre?.trim()) formErrors.Reporte_nombre = 'El nombre del reporte es obligatorio.';
    if (validations.Reporte_tipo && !data.Reporte_tipo?.trim()) formErrors.Reporte_tipo = 'El tipo de reporte es obligatorio.';
    if (validations.Reporte_estatus && !data.Reporte_estatus?.trim()) formErrors.Reporte_estatus = 'El estatus es obligatorio.';
    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};

const initialReporteData = {
    Reporte_reporteID: null, 
    Reporte_nombre: "",
    Reporte_tipo: "Operativo",
    Reporte_descripcion: "",
    Reporte_url: "",
    Reporte_estatus: "Activo",
};

// ======================================================================
// COMPONENTES MODULARES (MÉTRICAS Y FILTROS)
// ======================================================================

// 1. Componente Card (Métricas/Headlines)
const Card = ({ title, value }) => (
    <div className="bg-white rounded-lg p-5 shadow-sm flex-1 ring-1 ring-gray-100">
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
);

// 2. Componente de Filtros
const ReportFilterSection = () => {
    // Aquí iría el estado y lógica real de los filtros
    const handleApply = () => toast.info("Filtros aplicados (Simulación)");
    const handleClear = () => toast.info("Filtros limpiados (Simulación)");
    const handleExport = () => toast.success("Exportando datos (Simulación)");
    
    // Las clases usan Tailwind CSS para replicar la imagen
    return (
        <div className="bg-white rounded-lg p-5 shadow-sm mt-5 ring-1 ring-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Filtros</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {/* Rango de Fechas */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rango de Fechas</label>
                    <input 
                        type="text" 
                        placeholder="DD/MM/AAAA - DD/MM/AAAA" 
                        className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                {/* Unidad (Número Económico) */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Unidad (Número Económico)</label>
                    <input 
                        type="text" 
                        placeholder="Buscar unidad..." 
                        className="w-full p-2 border border-gray-200 rounded-md bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                {/* Chofer */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Chofer</label>
                    <input 
                        type="text" 
                        placeholder="Buscar chofer..." 
                        className="w-full p-2 border border-gray-200 rounded-md bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                {/* Tipo de Movimiento */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de Movimiento</label>
                    <input 
                        type="text" 
                        readOnly
                        value="Entrada / Salida" 
                        className="w-full p-2 border border-gray-200 rounded-md bg-white text-sm cursor-default"
                    />
                </div>
            </div>
            
            <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button 
                    onClick={handleApply}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-200 transition disabled:opacity-50"
                >
                    Aplicar
                </button>
                <button 
                    onClick={handleClear}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-200 transition disabled:opacity-50"
                >
                    Limpiar
                </button>
                <button 
                    onClick={handleExport}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                    style={{ backgroundColor: '#5bc0de' }} // Color exacto de la imagen
                >
                    Exportar
                </button>
            </div>
        </div>
    )
}

// ======================================================================
// MODAL FORMULARIO (ReporteFormDialog)
// ======================================================================

function ReporteFormDialog({ isOpen, closeModal, onSubmit, reporteToEdit, action, errors, setErrors }) {
    const [reporteData, setReporteData] = useState(initialReporteData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const dataToLoad = reporteToEdit
                ? {
                    ...reporteToEdit,
                    Reporte_nombre: reporteToEdit.Reporte_nombre || "",
                    Reporte_tipo: reporteToEdit.Reporte_tipo || "Operativo",
                    Reporte_descripcion: reporteToEdit.Reporte_descripcion || "",
                    Reporte_url: reporteToEdit.Reporte_url || "",
                    Reporte_estatus: reporteToEdit.Reporte_estatus || "Activo",
                }
                : initialReporteData;
            setReporteData(dataToLoad);
            setErrors({});
        }
    }, [isOpen, reporteToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReporteData(prevData => ({ ...prevData, [name]: value }));
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(reporteData);
            closeModal();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        } finally {
            setLoading(false);
        }
    };

    const dialogTitle = action === 'create' ? 'Crear Nuevo Reporte' : 'Editar Reporte';

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl relative">
                    {loading && <LoadingDiv />}

                    <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                        {dialogTitle}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <div className="space-y-3">
                            {/* Input Nombre */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Nombre del Reporte: <span className="text-red-500">*</span></span>
                                <input
                                    type="text"
                                    name="Reporte_nombre"
                                    value={reporteData.Reporte_nombre}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Reporte_nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.Reporte_nombre && <p className="text-red-500 text-xs mt-1">{errors.Reporte_nombre}</p>}
                            </label>

                            {/* Input URL/Ruta */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Ruta/URL del Reporte:</span>
                                <input
                                    type="text"
                                    name="Reporte_url"
                                    value={reporteData.Reporte_url}
                                    onChange={handleChange}
                                    placeholder="/ruta-al-reporte-ejemplo"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </label>

                            {/* Input Tipo */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Tipo: <span className="text-red-500">*</span></span>
                                <select
                                    name="Reporte_tipo"
                                    value={reporteData.Reporte_tipo}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Reporte_tipo ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="Operativo">Operativo</option>
                                    <option value="Financiero">Financiero</option>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Administrativo">Administrativo</option>
                                </select>
                                {errors.Reporte_tipo && <p className="text-red-500 text-xs mt-1">{errors.Reporte_tipo}</p>}
                            </label>

                            {/* Textarea Descripción */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Descripción:</span>
                                <textarea
                                    name="Reporte_descripcion"
                                    value={reporteData.Reporte_descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </label>

                            {/* Input Estatus */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Estatus: <span className="text-red-500">*</span></span>
                                <select
                                    name="Reporte_estatus"
                                    value={reporteData.Reporte_estatus}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Reporte_estatus ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                {errors.Reporte_estatus && <p className="text-red-500 text-xs mt-1">{errors.Reporte_estatus}</p>}
                            </label>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...') : (action === 'create' ? 'Guardar Reporte' : 'Actualizar Reporte')}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

// ======================================================================
// COMPONENTE PRINCIPAL REPORTES
// ======================================================================

export default function Reportes() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [reportes, setReportes] = useState([]); 
    const [action, setAction] = useState('create');
    const [reporteData, setReporteData] = useState(initialReporteData);
    const [errors, setErrors] = useState({});

    // Función para abrir modal en modo creación
    const openCreateModal = () => {
        setAction('create');
        setReporteData(initialReporteData);
        setErrors({});
        setIsDialogOpen(true);
    };

    // Función para abrir modal en modo edición
    const openEditModal = (reporte) => {
        setAction('edit');
        setReporteData(reporte);
        setErrors({});
        setIsDialogOpen(true);
    };

    // Limpia el formulario y cierra el modal
    const closeModal = () => {
        setIsDialogOpen(false);
        setReporteData(initialReporteData);
        setErrors({});
    };

    const submit = async (data) => {
        setErrors({});

        const validationResult = validateInputs(reporteValidations, data);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            throw new Error("Validation Failed");
        }

        const isEdit = data.Reporte_reporteID;
        const ruta = isEdit
            ? route("reportes.update", data.Reporte_reporteID)
            : route("reportes.store");

        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Reporte actualizado con éxito." : "Reporte creado con éxito.";

        try {
            await request(ruta, method, data);
            await getReportes(); 
            toast.success(successMessage);
        } catch (error) {
            console.error("Error al guardar el reporte:", error);
            toast.error("Hubo un error al guardar el reporte.");
            throw error; 
        }
    };

    const getReportes = async () => {
        try {
            const response = await fetch(route("reportes.index"));
            if (!response.ok) throw new Error("Fallo al cargar reportes");
            const data = await response.json();
            // Simulación de datos para la tabla si la API está vacía
            if (data.length === 0) {
                 setReportes([
                    { Reporte_reporteID: 1, Reporte_nombre: "Reporte de Entradas/Salidas", Reporte_tipo: "Operativo", Reporte_url: "/op/entradas", Reporte_estatus: "Activo" },
                    { Reporte_reporteID: 2, Reporte_nombre: "Reporte de Mantenimiento", Reporte_tipo: "Técnico", Reporte_url: "/tec/mantenimiento", Reporte_estatus: "Activo" },
                    { Reporte_reporteID: 3, Reporte_nombre: "Reporte de Facturación", Reporte_tipo: "Financiero", Reporte_url: "/fin/facturacion", Reporte_estatus: "Inactivo" },
                ]);
            } else {
                 setReportes(data);
            }
        } catch (error) {
            console.error('Error al obtener los reportes:', error);
        }
    }

    useEffect(() => {
        getReportes()
    }, [])

    const metrics = [
        { title: "Movimientos Hoy", value: 128 },
        { title: "Entradas", value: 64 },
        { title: "Salidas", value: 64 },
    ];

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto bg-gray-50">

            {/* Encabezado */}
            <div className="flex justify-between items-center p-3 border-b mb-4 bg-white sticky top-0 z-10 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Reportes 📊</h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Reporte
                </button>
            </div>

            {/* SECCIÓN DE MÉTRICAS (HEADLINES) */}
            <div className="flex gap-4 mb-4">
                {metrics.map(metric => (
                    <Card key={metric.title} title={metric.title} value={metric.value} />
                ))}
            </div>

            {/* SECCIÓN DE FILTROS */}
            <ReportFilterSection />

            {/* Contenido de la tabla de Reportes */}
            <div className="p-3 bg-white rounded-lg shadow-md min-h-[300px] mt-4 ring-1 ring-gray-100">
                <p className="text-gray-500 mb-3">Listado y gestión de reportes disponibles para la aplicación. (Los datos son de ejemplo)</p>
                {reportes && reportes.length > 0 ? (
                    <Datatable
                        data={reportes}
                        columns={[
                            { header: 'ID', accessor: 'Reporte_reporteID', width: '5%' },
                            { header: 'Nombre', accessor: 'Reporte_nombre', width: '25%' },
                            { header: 'Tipo', accessor: 'Reporte_tipo', width: '15%' },
                            { header: 'Ruta/URL', accessor: 'Reporte_url', width: '25%' },
                            {
                                header: 'Estatus',
                                accessor: 'Reporte_estatus',
                                width: '10%',
                                cell: (eprops) => (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${eprops.item.Reporte_estatus === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {eprops.item.Reporte_estatus}
                                    </span>
                                )
                            },
                            {
                                header: "Editar", accessor: "Acciones", width: '10%', cell: (eprops) => (<>
                                    <button
                                        onClick={() => openEditModal(eprops.item)}
                                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                                    >
                                        Editar
                                    </button>
                                </>)
                            },
                        ]}
                    />
                ) : (
                    <p className="text-gray-400 mt-4">No hay reportes registrados.</p>
                )}
            </div>

            {/* Componente Modal de Headless UI */}
            <ReporteFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                reporteToEdit={reporteData}
                action={action}
                errors={errors}
                setErrors={setErrors}
            />

        </div>
    );
}