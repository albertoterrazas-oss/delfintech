import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

// ===========================================
//  COMPONENTES ESTILIZADOS CON TAILWIND CSS
//  (Replicando el diseño de la imagen)
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
    
    // Auto-foco usando una referencia para mantener la funcionalidad Inertia
    const input = React.useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

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
                className={`w-full py-3 ps-4 pe-12 border rounded-lg text-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 ${
                    error ? 'border-red-500' : 'border-gray-300'
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
        className={`w-full flex items-center justify-center px-4 py-3 bg-blue-500 border border-transparent rounded-lg font-semibold text-base text-white uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-150 ${
            disabled && 'opacity-60 cursor-not-allowed'
        } ${className}`}
        disabled={disabled}
    >
        {processing ? (
            <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
            </div>
        ) : (
            <>
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
            </>
        )}
    </button>
);

// 3. Componente InputError
const InputError = ({ message, className = '' }) => {
    return message ? (
        <p className={`text-sm text-red-600 ${className}`}>{message}</p>
    ) : null;
};

// ===========================================
//  COMPONENTE PRINCIPAL DE LOGIN (Inertia.js)
// ===========================================

export default function Login({ status, canResetPassword }) {
    // 1. Mantenemos el useForm de Inertia con los campos de backend
    const { data, setData, post, processing, errors, reset } = useForm({
        Personas_usuario: '', // Corresponde al campo del backend
        Personas_contrasena: '', // Corresponde al campo del backend
        remember: false,
    });

    useEffect(() => {
        // Asegura que la contraseña se borre al salir
        return () => {
            reset('Personas_contrasena');
        };
    }, []);

    // 2. Mantenemos la lógica de envío POST de Inertia
    const submit = (e) => {
        e.preventDefault();
        // Usamos la función post proporcionada por useForm
        post(route('login'));
    };

    return (
        // Contenedor principal responsive (simulando el layout)
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Head title="Iniciar Sesión" />
            
            {/* Contenedor del formulario (Tarjeta central y sombreada) */}
            <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-xl shadow-2xl transition duration-500">
                
                {/* Sección de Logo */}
                <div className="flex justify-center mb-8">
                    {/* Placeholder para el logo. Ajusta la ruta o el contenido según necesites */}
                    <div className="h-12 w-auto">
                        {/*  */}
                         <span className="text-2xl font-bold text-blue-600">Delfin Tech</span>
                    </div>
                </div>

                {/* Sección de Título */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Iniciar sesión</h2>
                    <p className="text-sm text-gray-500">Accede con tus credenciales corporativas</p>
                </div>
                
                {/* Mensaje de estado (si existe) */}
                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
                    
                    {/* Campo Correo electrónico (Personas_usuario) */}
                    <div>
                        <label htmlFor="Personas_usuario" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <TextInput
                            id="Personas_usuario"
                            type="text"
                            name="Personas_usuario"
                            value={data.Personas_usuario}
                            onChange={(e) => setData('Personas_usuario', e.target.value)}
                            placeholder="nombre@empresa.com"
                            icon="email"
                            autoComplete="username"
                            isFocused={true}
                            error={errors.Personas_usuario}
                        />
                         <InputError message={errors.Personas_usuario} className="mt-2" />
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
                            onChange={(e) => setData('Personas_contrasena', e.target.value)}
                            placeholder="••••••••"
                            icon="lock"
                            autoComplete="current-password"
                            error={errors.Personas_contrasena}
                        />
                        <InputError message={errors.Personas_contrasena} className="mt-2" />
                    </div>

                    {/* Sección de recordatorio y 'Forgot password' (si se requiere, descomentar/añadir) */}
                    {/* Puedes añadir aquí la lógica si la necesitas, usando <Link> de Inertia si aplica. */}
                    {/* <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                            <span className="ms-2 text-gray-600">Recuérdame</span>
                        </label>
                         {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div> */}

                    {/* Botón de Ingresar */}
                    <div className="mt-6">
                        <PrimaryButton disabled={processing} processing={processing}>
                            Ingresar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}