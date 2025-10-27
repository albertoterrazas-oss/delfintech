import { useState } from "react";
import { Dialog } from '@headlessui/react';
// Importamos Sonner
import { toast } from 'sonner';

// Reemplaza esto con tu componente real
const LoadingDiv = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

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
    Personas_esEmpleado: true
};

// Componente del Formulario de Persona (Modal de Headless UI)
function PersonFormDialog({ isOpen, closeModal, onSubmit }) {
    const [personData, setPersonData] = useState(initialPersonData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
    
    // Función de validación simple
    const validate = () => {
        let formErrors = {};
        if (!personData.Personas_nombres.trim()) formErrors.Personas_nombres = 'El nombre es obligatorio.';
        if (!personData.Personas_usuario.trim()) formErrors.Personas_usuario = 'El usuario es obligatorio.';
        if (!personData.Personas_contrasena.trim()) formErrors.Personas_contrasena = 'La contraseña es obligatoria.';
        // Validación básica de correo electrónico
        if (personData.Personas_correo && !/\S+@\S+\.\S+/.test(personData.Personas_correo)) {
            formErrors.Personas_correo = 'El correo no es válido.';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            toast.error("Por favor, corrige los errores en el formulario.");
            return;
        }
        
        setLoading(true);
        try {
            // Llama a la función onSubmit pasada por props
            await onSubmit(personData); 
            // Limpia y cierra al éxito
            setPersonData(initialPersonData);
            closeModal();
            // La notificación de éxito la maneja el componente padre (Usuarios)
        } catch (error) {
            // La notificación de error la maneja el componente padre (Usuarios)
            console.error("Error en el formulario:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            {/* Overlay de fondo */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Contenedor del Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl relative">
                    
                    {/* Indicador de carga */}
                    {loading && <LoadingDiv />}

                    <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                        Crear Nuevo Usuario/Persona
                    </Dialog.Title>

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
                            {/* Input Apellido Paterno */}
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
                            {/* Input Apellido Materno */}
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
                            {/* Input Teléfono */}
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
                            {/* Input Dirección */}
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
                                <span className="text-sm font-medium text-gray-700">Contraseña: <span className="text-red-500">*</span></span>
                                <input
                                    type="password"
                                    name="Personas_contrasena"
                                    value={personData.Personas_contrasena}
                                    onChange={handleChange}
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
                                {loading ? 'Registrando...' : 'Guardar Usuario'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

// ----------------------------------------------------------------------
// Componente principal Usuarios
// ----------------------------------------------------------------------

export default function Usuarios() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openModal = () => setIsDialogOpen(true);
    // Limpia el formulario y cierra el modal
    const closeModal = () => setIsDialogOpen(false); 

    // Función que maneja la petición POST real
    const handleCreatePerson = async (data) => {
        const url = 'http://localhost:8000/api/users'; // Tu endpoint
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Asegúrate de incluir la autenticación (Bearer Token) si es necesario
                },
                body: JSON.stringify(data),
            });

            // Leer el cuerpo de la respuesta antes de chequear .ok
            const result = await response.json();

            if (!response.ok) {
                // Si la respuesta no es 2xx, lanza un error con un mensaje útil
                const errorMsg = result.message || result.error || `Error HTTP: ${response.status}`;
                toast.error(`Error al registrar: ${errorMsg}`);
                throw new Error(errorMsg); 
            }

            console.log('Respuesta del servidor:', result);
            // Notificación de éxito con Sonner
            toast.success("✅ Usuario/Persona registrado con éxito.", {
                description: `ID: ${result.id || 'N/A'}, Nombre: ${data.Personas_nombres}`
            });

            // Opcional: Recargar datos de la tabla (si la tuvieras)
            // fetchdata(); 

        } catch (error) {
            console.error('Error en la creación del usuario (fetch):', error);
            // Si el error no fue manejado con toast.error dentro del try, se puede poner un catch-all aquí.
            // Si ya se notificó arriba, esto previene una doble notificación.
            if (!error.message.includes('Error HTTP')) {
                 toast.error("Ocurrió un error inesperado. Revisa la conexión o la consola.");
            }
            // Re-lanza el error para que el formulario sepa que falló y pueda manejar su estado
            throw error; 
        }
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            
            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <button
                    onClick={openModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Usuario
                </button>
            </div>
            
            {/* Aquí iría tu Datatable u otro contenido */}
            <div className="p-3 bg-white rounded-lg shadow-md min-h-[500px]">
                <p className="text-gray-500">Contenido principal de la tabla de usuarios...</p>
                {/* Por ejemplo, un componente <UsuariosTable /> */}
            </div>

            {/* Componente Modal de Headless UI */}
            <PersonFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={handleCreatePerson}
            />
            
            {/* NOTA IMPORTANTE: 
                Para que Sonner funcione, necesitas renderizar el componente 'Toaster' 
                en un nivel superior (ej. en tu layout o App.js).
                Ejemplo: <Toaster position="bottom-right" /> 
            */}
        </div>
    );
}