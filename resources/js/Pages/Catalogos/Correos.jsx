import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { toast } from 'sonner';
// Asumiendo que Datatable y LoadingDiv existen en tu entorno de componentes
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import request from "@/utils";
import SelectInput from "@/components/SelectInput";

// --- DUMMY FUNCTIONS (Ajustar a tu backend) ---
// Función para simular las rutas de la API (ACTUALIZADAS PARA CORREOS)
const route = (name, params = {}) => {
    const id = params.correoNotificaciones_id;
    const routeMap = {
        "correos.index": "/api/correos",
        "correos.store": "/api/correos",
        "correos.update": `/api/correos/${id}`,
        "correos.destroy": `/api/correos/${id}`,
    };
    return routeMap[name] || `/${name}`;
};

// Función DUMMY de validación para correos (ACTUALIZADA)
const validateInputs = (validations, data) => {
    let formErrors = {};

    // Validación de Correo (Requerido)
    if (validations.correoNotificaciones_correo) {
        if (!data.correoNotificaciones_correo?.trim()) {
            formErrors.correoNotificaciones_correo = 'El correo es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.correoNotificaciones_correo)) {
            formErrors.correoNotificaciones_correo = 'Formato de correo inválido.';
        }
    }

    // Validación de ID de Usuario (Requerido y debe ser un número)
    if (validations.correoNotificaciones_idUsuario) {
        if (data.correoNotificaciones_idUsuario === "" || isNaN(data.correoNotificaciones_idUsuario) || Number(data.correoNotificaciones_idUsuario) <= 0) {
            formErrors.correoNotificaciones_idUsuario = 'El ID de Usuario es obligatorio y debe ser un número positivo.';
        }
    }

    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};

// Validaciones requeridas para el formulario de Correo
const correoValidations = {
    correoNotificaciones_correo: true,
    correoNotificaciones_idUsuario: true,
};

// Datos de ejemplo para el estado inicial del formulario de correo
const initialCorreoData = {
    correoNotificaciones_id: null,
    correoNotificaciones_correo: "",
    correoNotificaciones_idUsuario: "", // Cambiado a string para el input
    correoNotificaciones_estatus: "1", // Activo por defecto
};

// Componente del Formulario de Correo (Modal de Headless UI)
function CorreoFormDialog({ isOpen, closeModal, onSubmit, correoToEdit, action, errors, setErrors }) {
    const [correoData, setCorreoData] = useState(initialCorreoData);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Asegura que correoToEdit esté cargado o usa el estado inicial
            const dataToLoad = correoToEdit || initialCorreoData;
            // Asegura que idUsuario sea string para el input
            setCorreoData({
                ...dataToLoad,
                correoNotificaciones_idUsuario: String(dataToLoad.correoNotificaciones_idUsuario || ""),
            });
            setErrors({});
        }
    }, [isOpen, correoToEdit, setErrors]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? (checked ? "1" : "0") : value;

        setCorreoData(prevData => ({
            ...prevData,
            [name]: finalValue
        }));

        // Limpiar error específico si se empieza a escribir
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        // Permite solo dígitos. Podrías permitir el signo '-' si fuera necesario, pero no para un ID de usuario.
        const filteredValue = value.replace(/[^\d]/g, '');

        setCorreoData(prevState => ({
            ...prevState,
            [name]: filteredValue
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convertir idUsuario a número para la validación/envío, aunque se almacene como string en el estado
        const dataToSend = {
            ...correoData,
            correoNotificaciones_idUsuario: Number(correoData.correoNotificaciones_idUsuario)
        };

        try {
            await onSubmit(dataToSend);
            closeModal();
        } catch (error) {
            // El error de validación ya fue manejado en la función onSubmit
        } finally {
            setLoading(false);
        }
    };

     const getUsers = async () => {
        try {
            // Simulación: Si request no está definido para GET, usamos fetch
            const data = await fetch(route("users.index")).then(res => res.json());
            setUsers(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }

    const dialogTitle = action === 'create' ? 'Crear Nuevo Correo' : 'Editar Correo';

    return (
        <Transition show={isOpen}>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl relative">
                        {loading && <LoadingDiv />}
                        <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                            {dialogTitle}
                        </DialogTitle>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

                            {/* Input Correo */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Correo Electrónico: <span className="text-red-500">*</span></span>
                                <input
                                    type="email"
                                    name="correoNotificaciones_correo"
                                    value={correoData.correoNotificaciones_correo || ''}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.correoNotificaciones_correo ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    placeholder="ejemplo@dominio.com"
                                />
                                {errors.correoNotificaciones_correo && <p className="text-red-500 text-xs mt-1">{errors.correoNotificaciones_correo}</p>}
                            </label>

                            {/* Input ID Usuario */}
                            {/* <label className="block">
                                <span className="text-sm font-medium text-gray-700">ID de Usuario Asociado: <span className="text-red-500">*</span></span>
                                <input
                                    type="text"
                                    name="correoNotificaciones_idUsuario"
                                    value={correoData.correoNotificaciones_idUsuario || ''}
                                    onChange={handleNumericChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.correoNotificaciones_idUsuario ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    placeholder="Solo números"
                                />
                                {errors.correoNotificaciones_idUsuario && <p className="text-red-500 text-xs mt-1">{errors.correoNotificaciones_idUsuario}</p>}
                            </label> */}


                            <SelectInput
                                label="Usuario"
                                value={correoData.correoNotificaciones_idUsuario}
                                onChange={(event) => { setCorreoData({ ...correoData, correoNotificaciones_idUsuario: event.target.value }); }}
                                options={users}
                                placeholder="Seleccionar usuario"
                                valueKey="Personas_usuarioID"
                                labelKey="nombre_completo"
                                disabled={true}
                            />


                            <div className="flex justify-center w-full mt-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="correoNotificaciones_estatus"
                                        checked={correoData.correoNotificaciones_estatus === "1"}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Activo</span>
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="col-span-1 flex justify-end gap-3 pt-4 border-t mt-4">
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
                                    {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...') : (action === 'create' ? 'Guardar Correo' : 'Actualizar Correo')}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </Transition>
    )
}

// ----------------------------------------------------------------------
// Componente principal Correos
// ----------------------------------------------------------------------

export default function Correos() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [correos, setCorreos] = useState([]);
    const [action, setAction] = useState('create');
    const [correoData, setCorreoData] = useState(initialCorreoData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const openCreateModal = () => {
        setAction('create');
        setCorreoData(initialCorreoData);
        setErrors({});
        setIsDialogOpen(true);
    };

    const openEditModal = (correo) => {
        setAction('edit');
        setCorreoData(correo);
        setErrors({});
        setIsDialogOpen(true);
    };

    const closeModal = () => {
        setIsDialogOpen(false);
        setCorreoData(initialCorreoData);
        setErrors({});
    };

    // Función para crear/actualizar un correo
    const submit = async (data) => {
        console.log("Datos a enviar:", data); // Depuración
        setErrors({});
        const validationResult = validateInputs(correoValidations, data);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            throw new Error("Validation Failed");
        }

        const isEdit = data.correoNotificaciones_id;
        const ruta = isEdit
            ? route("correos.update", { correoNotificaciones_id: data.correoNotificaciones_id })
            : route("correos.store");

        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Correo actualizado con éxito." : "Correo creado con éxito.";

        try {
            // Envía solo los campos fillable
            const payload = {
                correoNotificaciones_correo: data.correoNotificaciones_correo,
                correoNotificaciones_idUsuario: data.correoNotificaciones_idUsuario,
                correoNotificaciones_estatus: data.correoNotificaciones_estatus,
            };

            await request(ruta, method, payload);
            await getCorreos();
            toast.success(successMessage);
        } catch (error) {
            console.error("Error al guardar el correo:", error);
            toast.error("Hubo un error al guardar el correo.");
            throw error;
        }
    };


    // Función para obtener la lista de correos
    const getCorreos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(route("correos.index"));
            // Simular respuesta JSON si no tienes un backend real
            const result = await response.json();

            // Si la respuesta es un array y no un objeto con 'data', úsalo directamente:
            setCorreos(result.data || result);

        } catch (error) {
            console.error('Error al obtener los correos:', error);
            toast.error("No se pudieron cargar los correos.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCorreos()
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">✉️ Gestión de Correos de Notificación</h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Correo
                </button>
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>

            ) : (
                <Datatable
                    data={correos}
                    virtual={true}
                    columns={[
                        {
                            header: "Estatus",
                            accessor: "correoNotificaciones_estatus",
                            width: '10%',
                            cell: ({ item: { correoNotificaciones_estatus } }) => {
                                const isActivo = String(correoNotificaciones_estatus) === "1";
                                const color = isActivo
                                    ? "bg-green-300"
                                    : "bg-red-300";

                                return (
                                    <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`}
                                        title={isActivo ? "Activo" : "Inactivo"}
                                    />
                                );
                            },
                        },
                        { header: 'Correo', accessor: 'correoNotificaciones_correo' },
                        { header: 'ID Usuario', accessor: 'correoNotificaciones_idUsuario' },
                        {
                            header: "Acciones", accessor: "Acciones", width: '10%', cell: (eprops) => (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openEditModal(eprops.item)}
                                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                                    >
                                        Editar
                                    </button>
                                </div>
                            )
                        },
                    ]}
                />
            )}


            {/* Componente Modal de Headless UI */}
            <CorreoFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                correoToEdit={correoData}
                action={action}
                errors={errors}
                setErrors={setErrors}
            />

        </div>
    );
}