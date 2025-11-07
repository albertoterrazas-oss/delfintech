import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import logo from '../../../../public/img/logo.png'; 

// ===========================================
// UTILITY/MOCK FUNCTIONS
// ===========================================

// Mock de la función route() de Laravel/Ziggy para evitar errores de compilación.
// En un entorno de producción Laravel/Inertia, esta función es global.
const route = (name) => {
    if (name === 'login') return '/login';
    if (name === 'dashboard') return '/dashboard';
    return `/${name}`;
};

// Componente Placeholder para <Head> (Inertia)
const Head = ({ title }) => <title>{title}</title>;


// ===========================================
// COMPONENTES ESTILIZADOS CON TAILWIND CSS
// ===========================================

// 1. Componente TextInput con Icono
const TextInput = ({ icon, type = 'text', name, value, onChange, placeholder, error, className = '', isFocused, ...props }) => {
    // Definición de SVGs para los iconos
    const IconSVG = () => {
        if (icon === 'email') {
            return (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            );
        } else if (icon === 'lock') {
            return (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            );
        }
        return null;
    };

    const input = React.useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <div className={`relative ${className}`}>
            <input
                {...props}
                ref={input}
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full py-3 ps-4 pe-12 border rounded-lg text-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pe-3 pointer-events-none">
                <IconSVG />
            </div>
        </div>
    );
};

// 2. Componente PrimaryButton con Icono de Flecha y Spinner
const PrimaryButton = ({ children, disabled, className = '', processing, ...props }) => (
    <button
        {...props}
        className={`w-full flex items-center justify-center px-4 py-3 bg-[#66C0FF] border border-transparent rounded-lg font-semibold text-base uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-150 ${disabled && 'opacity-60 cursor-not-allowed'
            } ${className}`}
        disabled={disabled}
    >
        {processing ? (
            <div className="flex items-center text-white">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
            </div>
        ) : (
            <span className="flex items-center text-white">
                {children}
                <svg
                    className="w-4 h-4 ms-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                </svg>
            </span>
        )}
    </button>
);

// 3. Componente InputError
const InputError = ({ message, className = '' }) => {
    // El mensaje de error de Laravel 422 viene como un array (ej: ["El campo es requerido."])
    const displayMessage = Array.isArray(message) ? message[0] : message;
    return displayMessage ? (
        <p className={`text-sm text-red-600 ${className}`}>{displayMessage}</p>
    ) : null;
};

// ===========================================
// COMPONENTE PRINCIPAL DE LOGIN (Token Auth)
// ===========================================

// Quitamos 'status' y 'canResetPassword' ya que son props de Inertia y no se usan
export default function Login() {
    // 1. Usamos useState en lugar de useForm de Inertia
    const [data, setData] = useState({
        Personas_usuario: '',
        Personas_contrasena: '',
    });

    // Función para manejar el cambio de datos
    const handleDataChange = (name, value) => {
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Usaremos estados locales para manejar el procesamiento y los errores de la llamada AXIOS
    const [localErrors, setLocalErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [generalError, setGeneralError] = useState(null);


    useEffect(() => {
        // Limpiamos la contraseña al desmontar (simulando reset)
        return () => {
            setData(prevData => ({ ...prevData, Personas_contrasena: '' }));
        };
    }, []);


    // 2. Función submit modificada para usar AXIOS
    const submit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setLocalErrors({});
        setGeneralError(null);

        try {
            // 🛑 Hacemos la llamada AJAX directa a la API de autenticación
            const response = await axios.post(route('login'), {
                Personas_usuario: data.Personas_usuario,
                Personas_contrasena: data.Personas_contrasena,
            });

            const { access_token, redirect_to, id, Personas_usuario } = response.data;
            // console.log(user)

            // 3. Guardar el token en localStorage
            if (access_token) {
                localStorage.setItem('authToken', access_token);
                localStorage.setItem('userId', id);
                localStorage.setItem('persona', Personas_usuario);
                // localStorage.setItem('tokenType', 'Bearer');
            }
            // 4. Redirigir al usuario (hard redirect)
            const targetUrl = redirect_to || '/dashboard';
            window.location.href = targetUrl; // 👈 Línea clave

        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                const { status, data: responseData } = error.response;

                if (status === 422) {
                    // Errores de validación de Laravel (credenciales incorrectas)
                    setLocalErrors(responseData.errors);
                } else {
                    // Otros errores del servidor
                    setGeneralError(`Error ${status}: No se pudo completar la solicitud de inicio de sesión. Mensaje: ${responseData.message || 'Error desconocido'}`);
                }
            } else {
                // Error de red
                setGeneralError('Error de red. Verifica tu conexión.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        // Contenedor principal responsive (simulando el layout)
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-sans">
            <Head title="Iniciar Sesión" />

            {/* Contenedor del formulario (Tarjeta central y sombreada) */}
            <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-xl shadow-2xl transition duration-500">

                {/* Sección de Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src={logo}
                        alt=""
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block' // Recomendado para evitar espacios no deseados debajo de la imagen
                        }}
                    />
                </div>

                {/* Sección de Título */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Iniciar sesión</h2>
                    <p className="text-sm text-gray-500">Accede con tus credenciales corporativas</p>
                </div>

                {/* Mensaje de error general */}
                {generalError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {generalError}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">

                    {/* Campo Correo electrónico (Personas_usuario) */}
                    <div>
                        <label htmlFor="Personas_usuario" className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario/Correo electrónico
                        </label>
                        <TextInput
                            id="Personas_usuario"
                            type="text"
                            name="Personas_usuario"
                            value={data.Personas_usuario}
                            onChange={(e) => handleDataChange('Personas_usuario', e.target.value)}
                            placeholder="nombre.usuario"
                            icon="email"
                            autoComplete="username"
                            isFocused={true}
                            error={localErrors.Personas_usuario}
                        />
                        <InputError message={localErrors.Personas_usuario} className="mt-2" />
                    </div>

                    {/* Campo Contraseña (Personas_contrasena) */}
                    <div>
                        <label htmlFor="Personas_contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <TextInput
                            id="Personas_contrasena"
                            type="password"
                            name="Personas_contrasena"
                            value={data.Personas_contrasena}
                            onChange={(e) => handleDataChange('Personas_contrasena', e.target.value)}
                            placeholder="••••••••"
                            icon="lock"
                            autoComplete="current-password"
                            error={localErrors.Personas_contrasena}
                        />
                        <InputError message={localErrors.Personas_contrasena} className="mt-2" />
                    </div>

                    {/* Botón de Ingresar */}
                    <div className="mt-6">
                        <PrimaryButton disabled={isProcessing} processing={isProcessing}>
                            Ingresar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}