import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react';
// Importamos Sonner
import { toast } from 'sonner';
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";

import request from "@/utils";
// Supongo que `route` y `validateInputs` existen en tu entorno.

// ======================================================================
// DUMMY FUNCTIONS ADAPTADAS PARA MOTIVOS
// ======================================================================
const route = (name, params = {}) => {
    // Rutas dummy adaptadas para Motivos
    const routeMap = {
        "motivos.index": "/api/motivos",
        "motivos.store": "/api/motivos",
        "motivos.update": `/api/motivos/${params}`,
    };
    return routeMap[name] || `/${name}`;
};

// Validaciones requeridas para el formulario de Motivo
const motivoValidations = {
    Motivos_nombre: true,
    Motivos_tipo: true,
    Motivos_estatus: true,
};

// Función DUMMY de validación adaptada para Motivos
const validateInputs = (validations, data) => {
    let formErrors = {};

    // Validación de prueba básica:
    if (validations.Motivos_nombre && !data.Motivos_nombre?.trim()) formErrors.Motivos_nombre = 'El nombre del motivo es obligatorio.';
    if (validations.Motivos_tipo && !data.Motivos_tipo?.trim()) formErrors.Motivos_tipo = 'El tipo de motivo es obligatorio.';
    if (validations.Motivos_estatus && !data.Motivos_estatus?.trim()) formErrors.Motivos_estatus = 'El estatus es obligatorio.';

    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};
// FIN DUMMY FUNCTIONS
// ======================================================================

// Datos de ejemplo para el estado inicial del formulario de Motivo
const initialMotivoData = {
    Motivos_motivoID: null, // Nuevo ID para identificar en edición
    Motivos_nombre: "",
    Motivos_tipo: "General",
    Motivos_descripcion: "",
    Motivos_estatus: "Activo", // Ejemplo: 'Activo', 'Inactivo'
};

// Componente del Formulario de Motivo (Modal de Headless UI)
function MotivoFormDialog({ isOpen, closeModal, onSubmit, motivoToEdit, action, errors, setErrors }) {
    // Cambiado de unitData a motivoData
    const [motivoData, setMotivoData] = useState(initialMotivoData);
    const [loading, setLoading] = useState(false);

    // Sincroniza los datos al abrir el modal o cambiar el motivo a editar
    useEffect(() => {
        if (isOpen) {
            const dataToLoad = motivoToEdit
                ? {
                    ...motivoToEdit,
                    // Aseguramos valores por defecto para campos que pueden ser null
                    Motivos_nombre: motivoToEdit.Motivos_nombre || "",
                    Motivos_tipo: motivoToEdit.Motivos_tipo || "General",
                    Motivos_descripcion: motivoToEdit.Motivos_descripcion || "",
                    Motivos_estatus: motivoToEdit.Motivos_estatus || "Activo",
                }
                : initialMotivoData;
            setMotivoData(dataToLoad);
            setErrors({}); // Limpia errores al abrir
        }
    }, [isOpen, motivoToEdit]);


    // Función genérica para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMotivoData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Limpiar error al cambiar el campo
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
            // Llama a la función onSubmit del padre, pasándole los datos del formulario
            await onSubmit(motivoData);
            // Si la función onSubmit tiene éxito (no lanza error), cierra el modal.
            closeModal();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            // El error es propagado desde el padre, si falla, el modal no se cierra.
        } finally {
            setLoading(false);
        }
    };

    const dialogTitle = action === 'create' ? 'Crear Nuevo Motivo' : 'Editar Motivo';

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            {/* Overlay de fondo */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Contenedor del Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl relative">

                    {/* Indicador de carga */}
                    {loading && <LoadingDiv />}

                    <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                        {dialogTitle}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <div className="space-y-3">
                            {/* Input Nombre */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Nombre del Motivo: <span className="text-red-500">*</span></span>
                                <input
                                    type="text"
                                    name="Motivos_nombre"
                                    value={motivoData.Motivos_nombre}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Motivos_nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.Motivos_nombre && <p className="text-red-500 text-xs mt-1">{errors.Motivos_nombre}</p>}
                            </label>

                            {/* Input Tipo */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Tipo: <span className="text-red-500">*</span></span>
                                <select
                                    name="Motivos_tipo"
                                    value={motivoData.Motivos_tipo}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Motivos_tipo ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="General">General</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="Cliente">Cliente</option>
                                </select>
                                {errors.Motivos_tipo && <p className="text-red-500 text-xs mt-1">{errors.Motivos_tipo}</p>}
                            </label>

                            {/* Textarea Descripción */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Descripción:</span>
                                <textarea
                                    name="Motivos_descripcion"
                                    value={motivoData.Motivos_descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </label>

                            {/* Input Estatus */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Estatus: <span className="text-red-500">*</span></span>
                                <select
                                    name="Motivos_estatus"
                                    value={motivoData.Motivos_estatus}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Motivos_estatus ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                {errors.Motivos_estatus && <p className="text-red-500 text-xs mt-1">{errors.Motivos_estatus}</p>}
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
                                {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...') : (action === 'create' ? 'Guardar Motivo' : 'Actualizar Motivo')}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

// ----------------------------------------------------------------------
// Componente principal MOTIVOS
// ----------------------------------------------------------------------

export default function Motivos() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [motivos, setMotivos] = useState([]); // Cambiado a motivos
    const [action, setAction] = useState('create');
    const [motivoData, setMotivoData] = useState(initialMotivoData); // Cambiado a motivoData
    const [errors, setErrors] = useState({});

    // Función para abrir modal en modo creación
    const openCreateModal = () => {
        setAction('create');
        setMotivoData(initialMotivoData); // Limpiar para creación
        setErrors({});
        setIsDialogOpen(true);
    };

    // Función para abrir modal en modo edición
    const openEditModal = (motivo) => {
        setAction('edit');
        setMotivoData(motivo); // Cargar datos del motivo para edición
        setErrors({});
        setIsDialogOpen(true);
    };

    // Limpia el formulario y cierra el modal
    const closeModal = () => {
        setIsDialogOpen(false);
        setMotivoData(initialMotivoData);
        setErrors({});
    };

    /**
     * Función que maneja la validación y la petición POST/PUT real.
     */
    const submit = async (data) => {
        setErrors({});

        // 1. VALIDACIÓN
        const validationResult = validateInputs(motivoValidations, data); // Usar motivoValidations

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            // Lanza un error para que el MotivoFormDialog sepa que falló
            throw new Error("Validation Failed");
        }

        // 2. RUTAS Y MÉTODO: Usa Motivos_ID para la actualización
        const isEdit = data.Motivos_motivoID;
        // La ID que se pasa a route debe ser la del Motivo
        const ruta = isEdit
            ? route("motivos.update", data.Motivos_motivoID)
            : route("motivos.store");

        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Motivo actualizado con éxito." : "Motivo creado con éxito.";

        // 3. PETICIÓN (Request)
        try {
            await request(ruta, method, data);

            // 4. POST-ÉXITO
            await getMotivos(); // Obtener lista actualizada
            toast.success(successMessage);
        } catch (error) {
            console.error("Error al guardar el motivo:", error);
            // Mostrar error más genérico al usuario
            toast.error("Hubo un error al guardar el motivo.");
            throw error; // Propagar el error al MotivoFormDialog para evitar que cierre el modal
        }
    };

    const getMotivos = async () => {
        try {
            // Simulación: Si request no está definido para GET, usamos fetch
            const response = await fetch(route("motivos.index"));
            if (!response.ok) throw new Error("Fallo al cargar motivos");
            const data = await response.json();
            setMotivos(data);
        } catch (error) {
            console.error('Error al obtener los motivos:', error);
            // Opcional: toast.error('No se pudieron cargar los motivos.');
        }
    }

    useEffect(() => {
        getMotivos() // Llamar a getMotivos al montar
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">

            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Motivos ✨</h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Motivo
                </button>
            </div>

            {/* Contenido de la tabla de Motivos */}
            <div className="p-3 bg-white rounded-lg shadow-md min-h-[500px]">
                <p className="text-gray-500">Listado y gestión de motivos para diferentes procesos (mantenimiento, rechazos, etc.).</p>
                {motivos && motivos.length > 0 ? (
                    <Datatable
                        data={motivos}
                        columns={[
                            { header: 'ID', accessor: 'Motivos_motivoID' }, // Opcional, si tienes el ID en la respuesta
                            { header: 'Nombre', accessor: 'Motivos_nombre' },
                            { header: 'Tipo', accessor: 'Motivos_tipo' },
                            { header: 'Descripción', accessor: 'Motivos_descripcion' },
                            {
                                header: 'Estatus',
                                accessor: 'Motivos_estatus',
                                cell: (eprops) => (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${eprops.item.Motivos_estatus === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {eprops.item.Motivos_estatus}
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
                    <p className="text-gray-400 mt-4">No hay motivos registrados.</p>
                )}
            </div>

            {/* Componente Modal de Headless UI */}
            <MotivoFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                motivoToEdit={motivoData}
                action={action}
                errors={errors}
                setErrors={setErrors}

            />

        </div>
    );
}