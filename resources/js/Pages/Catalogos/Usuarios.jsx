import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
// Importamos Sonner
import { toast } from 'sonner';
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import AsignMenusDialog from "./Roles/AsignMenusDialog";

import request from "@/utils";

import PermissionTreeTable from "./PermissionTreeTable";
import SelectInput from "@/components/SelectInput";

PermissionTreeTable
// Supongo que `route` y `validateInputs` existen en tu entorno.

// DUMMY FUNCTIONS (Reemplazar con tus implementaciones reales)
const route = (name, params = {}) => {
    const routeMap = {
        "users.index": "/api/users",
        "roles.index": "/api/roles",

        "menus-tree": "/api/menus-tree",
        "users.store": "/api/users",
        "users.update": `/api/users/${params}`,
    };
    return routeMap[name] || `/${name}`;
};

// Función DUMMY de validación (usada en el componente Usuarios)
const validateInputs = (validations, data) => {
    let formErrors = {};
    // Validación de prueba básica:
    if (validations.Personas_nombres && !data.Personas_nombres?.trim()) formErrors.Personas_nombres = 'El nombre es obligatorio.';
    if (validations.Personas_usuario && !data.Personas_usuario?.trim()) formErrors.Personas_usuario = 'El usuario es obligatorio.';
    if (validations.usuario_idRol && !data.usuario_idRol?.trim()) formErrors.usuario_idRol = 'El rol es obligatorio.';




    // Corrección para usar la validación condicional de la contraseña:
    const isPasswordRequired = typeof validations.Personas_contrasena === 'function'
        ? validations.Personas_contrasena(data)
        : validations.Personas_contrasena;

    if (isPasswordRequired && !data.Personas_contrasena?.trim()) formErrors.Personas_contrasena = 'La contraseña es obligatoria en creación.';

    if (data.Personas_correo && !/\S+@\S+\.\S+/.test(data.Personas_correo)) {
        formErrors.Personas_correo = 'El correo no es válido.';
    }

    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};
// FIN DUMMY FUNCTIONS

// Validaciones requeridas para el formulario
const userValidations = {
    Personas_nombres: true,
    Personas_usuario: true,
    // Contraseña solo es obligatoria si no existe un ID (creación)
    Personas_contrasena: (data) => !data.Personas_usuarioID,
    Personas_correo: true,
    usuario_idRol: true
};


// Datos de ejemplo para el estado inicial del formulario de persona
const initialPersonData = {
    Personas_nombres: "",
    Personas_apPaterno: "",
    Personas_apMaterno: "",
    Personas_telefono: "",
    Personas_direccion: "",
    Personas_fechaNacimiento: "", // Formato 'YYYY-MM-DD'
    Personas_correo: "",
    Personas_puesto: "",
    Personas_licencia: "",
    Personas_vigenciaLicencia: "", // Formato 'YYYY-MM-DD'
    Personas_usuario: "",
    Personas_contrasena: "",
    Personas_esEmpleado: true,
    usuario_idRol: ''
};

// Componente del Formulario de Persona (Modal de Headless UI)
// Recibe personToEdit para precargar, y action para saber el contexto
function PersonFormDialog({ isOpen, closeModal, onSubmit, personToEdit, action, errors, setErrors }) {
    // Inicializa el estado con los datos a editar o con el estado inicial
    const [personData, setPersonData] = useState(initialPersonData);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    // Sincroniza los datos al abrir el modal o cambiar la persona a editar
    useEffect(() => {
        if (isOpen) {
            // Aseguramos que los campos de fecha vacíos no sean null o undefined
            const dataToLoad = personToEdit
                ? {
                    ...personToEdit,
                    Personas_fechaNacimiento: personToEdit.Personas_fechaNacimiento || "",
                    Personas_vigenciaLicencia: personToEdit.Personas_vigenciaLicencia || "",
                }
                : initialPersonData;
            setPersonData(dataToLoad);
            setErrors({}); // Limpia errores al abrir
        }
    }, [isOpen, personToEdit]);


    // Función genérica para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPersonData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
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
            await onSubmit(personData);
            // Si la función onSubmit tiene éxito (no lanza error), cierra el modal.
            closeModal();
        } catch (error) {
            // El error y el setErrors se manejan en el componente padre (Usuarios)
            console.error("Error al enviar el formulario:", error);
        } finally {
            setLoading(false);
        }
    };


    const getRoles = async () => {
        try {
            // Simulación: Si request no está definido para GET, usamos fetch
            const data = await fetch(route("roles.index")).then(res => res.json());
            setRoles(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }
    // const [roles, setRoles] = useState([]);


    useEffect(() => {
        getRoles() // Llamar a getUnits al montar
    }, [])

    const dialogTitle = action === 'create' ? 'Crear Nuevo Usuario/Persona' : 'Editar Usuario/Persona';

    return (
        <Transition show={isOpen}>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                {/* Overlay de fondo */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Contenedor del Modal */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl relative">

                        {/* Indicador de carga */}
                        {loading && <LoadingDiv />}

                        <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                            {dialogTitle}
                        </DialogTitle>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {/* Columna 1 */}
                            <div className="space-y-3">
                                {/* Input Nombre */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Nombre: <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="Personas_nombres"
                                        value={personData.Personas_nombres}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Personas_nombres ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    {errors.Personas_nombres && <p className="text-red-500 text-xs mt-1">{errors.Personas_nombres}</p>}
                                </label>
                                {/* Input Apellido Paterno - (Resto de inputs de Columna 1...) */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Apellido Paterno:</span>
                                    <input
                                        type="text"
                                        name="Personas_apPaterno"
                                        value={personData.Personas_apPaterno}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Apellido Materno:</span>
                                    <input
                                        type="text"
                                        name="Personas_apMaterno"
                                        value={personData.Personas_apMaterno}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Teléfono:</span>
                                    <input
                                        type="text"
                                        name="Personas_telefono"
                                        value={personData.Personas_telefono}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Dirección:</span>
                                    <input
                                        type="text"
                                        name="Personas_direccion"
                                        value={personData.Personas_direccion}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Columna 2 */}
                            <div className="space-y-3">
                                {/* Input Correo */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Correo:</span>
                                    <input
                                        type="email"
                                        name="Personas_correo"
                                        value={personData.Personas_correo}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Personas_correo ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    {errors.Personas_correo && <p className="text-red-500 text-xs mt-1">{errors.Personas_correo}</p>}
                                </label>
                                {/* Input Puesto */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Puesto:</span>
                                    <input
                                        type="text"
                                        name="Personas_puesto"
                                        value={personData.Personas_puesto}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </label>
                                {/* Input Usuario (Username) */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Usuario (Username): <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="Personas_usuario"
                                        value={personData.Personas_usuario}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Personas_usuario ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    {errors.Personas_usuario && <p className="text-red-500 text-xs mt-1">{errors.Personas_usuario}</p>}
                                </label>
                                {/* Input Contraseña */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Contraseña: {action === 'create' && <span className="text-red-500">*</span>}</span>
                                    <input
                                        type="password"
                                        name="Personas_contrasena"
                                        value={personData.Personas_contrasena}
                                        onChange={handleChange}
                                        // Solo validamos la contraseña si estamos creando o si el campo tiene valor
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Personas_contrasena ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    {errors.Personas_contrasena && <p className="text-red-500 text-xs mt-1">{errors.Personas_contrasena}</p>}
                                </label>
                                {/* Checkbox Es Empleado */}
                                <label className="flex items-center pt-2">
                                    <input
                                        type="checkbox"
                                        name="Personas_esEmpleado"
                                        checked={personData.Personas_esEmpleado}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">¿Es Empleado?</span>
                                </label>
                            </div>

                            {/* Fecha de Nacimiento y Licencia - se mantienen divididas en 2 columnas */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Fecha de Nacimiento:</span>
                                <input
                                    type="date"
                                    name="Personas_fechaNacimiento"
                                    value={personData.Personas_fechaNacimiento}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Vigencia Licencia:</span>
                                <input
                                    type="date"
                                    name="Personas_vigenciaLicencia"
                                    value={personData.Personas_vigenciaLicencia}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </label>

                            {/* <SelectInput
                                label="Rol"
                                value={personData.usuario_idRol}
                                onChange={(event) => { setPersonData({ ...personData, usuario_idRol: event.target.value }); }}
                                options={roles}
                                placeholder="Selecciona rol"
                                valueKey="roles_id"
                                labelKey="roles_descripcion"
                            /> */}

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Rol: <span className="text-red-500">*</span></span>
                                <select
                                    name="Rol"
                                    value={personData.usuario_idRol || ''}
                                    // onChange={handleChange}
                                    onChange={(event) => { setPersonData({ ...personData, usuario_idRol: event.target.value }); }}

                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.usuario_idRol ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="" disabled>Selecciona un rol</option>
                                    {roles.map((dept) => (
                                        <option
                                            key={dept.roles_id}
                                            value={dept.roles_id}
                                        >
                                            {dept.roles_descripcion}
                                        </option>
                                    ))}
                                </select>
                                {errors.roles_id && <p className="text-red-500 text-xs mt-1">{errors.roles_id}</p>}
                            </label>


                            {/* Botones */}
                            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-4">
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
                                    {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...') : (action === 'create' ? 'Guardar Usuario' : 'Actualizar Usuario')}
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
// Componente principal Usuarios
// ----------------------------------------------------------------------

export default function Usuarios() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);

    const [menus, setMenus] = useState([]);

    const [action, setAction] = useState('create'); // 'create' o 'edit'
    const [personData, setPersonData] = useState(initialPersonData); // Datos para editar/crear
    const [errors, setErrors] = useState({}); // Errores de validación

    // Función para abrir modal en modo creación
    const openCreateModal = () => {
        setAction('create');
        setPersonData(initialPersonData); // Limpiar para creación
        setErrors({});
        setIsDialogOpen(true);
    };

    // Función para abrir modal en modo edición
    const openEditModal = (user) => {
        setAction('edit');
        setPersonData(user); // Cargar datos del usuario para edición
        setErrors({});
        setIsDialogOpen(true);
    };

    // Limpia el formulario y cierra el modal
    const closeModal = () => {
        setIsDialogOpen(false);
        setPersonData(initialPersonData); // Opcional, pero buena práctica
        setErrors({});
    };

    /**
     * Función que maneja la validación y la petición POST/PUT real.
     * Recibe los datos del formulario.
     */
    const submit = async (data) => {
        setErrors({});

        // 1. VALIDACIÓN
        const validationResult = validateInputs(userValidations, data);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            // Lanza un error para que el PersonFormDialog sepa que falló
            throw new Error("Validation Failed");
        }

        // 2. RUTAS Y MÉTODO: Usa Personas_usuarioID para la actualización
        const isEdit = data.Personas_usuarioID;
        // 🚨 CORRECCIÓN CLAVE AQUÍ: Sintaxis correcta del operador ternario (condición ? valorTrue : valorFalse)
        const ruta = isEdit
            ? route("users.update", data.Personas_usuarioID)
            : route("users.store");

        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Usuario actualizado con éxito." : "Usuario creado con éxito.";

        // 3. PETICIÓN (Request)
        try {
            await request(ruta, method, data);

            // 4. POST-ÉXITO
            await getUsers();
            toast.success(successMessage);
            // El closeModal se ejecuta en el PersonFormDialog al no haber error
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            // Mostrar un error genérico (o específico si la API lo proporciona)
            toast.error("Hubo un error al guardar el usuario.");
            throw error; // Propagar el error al PersonFormDialog para evitar que cierre el modal
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


    const getMenus = async () => {
        try {
            // Simulación: Si request no está definido para GET, usamos fetch
            const data = await fetch(route("menus-tree")).then(res => res.json());

            setMenus(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }

    useEffect(() => {
        getUsers();
        getMenus();
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <button
                    onClick={openCreateModal} // Usamos la nueva función
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Usuario
                </button>
            </div>

            {/* Aquí iría tu Datatable u otro contenido */}
            {/* Por ejemplo, un componente <UsuariosTable /> */}
            {users &&
                <Datatable
                    data={users}
                    virtual={true}
                    columns={[
                        { header: 'Nombre', accessor: 'nombre_completo' },
                        { header: 'Usuario', accessor: 'Personas_usuario' },
                        { header: 'Correo', accessor: 'Personas_correo' },
                        {
                            header: "Acciones", accessor: "Acciones", cell: (eprops) => (<>
                                <button
                                    onClick={() => openEditModal(eprops.item)}
                                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 "
                                >
                                    Editar
                                </button>
                            </>)
                        },
                    ]}
                />
            }

            {/* Componente Modal de Headless UI */}
            <PersonFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                personToEdit={personData} // Pasamos los datos para edición/creación
                action={action} // Pasamos la acción
                errors={errors} // Pasamos los errores
                setErrors={setErrors} // Pasamos el setter de errores
            />


            {/* <AsignMenusDialog
                assignMenu={assignMenu}
                assignMenuHandler={setAssignMenu}
                user={data}
            /> */}

            {/* <PermissionTreeTable initialData={menus} />; */}

        </div>
    );
}