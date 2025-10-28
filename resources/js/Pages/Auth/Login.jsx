// import { useEffect } from 'react';
// import Checkbox from '@/Components/Checkbox';
// import GuestLayout from '@/Layouts/GuestLayout';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import { Head, Link, useForm } from '@inertiajs/react';
// import Loading from '@/Components/LoadingDiv';

// export default function Login({ status, canResetPassword }) {
//     // 1. CAMBIO CLAVE: Usar Personas_usuario y Personas_contrasena en lugar de email y password
//     const { data, setData, post, processing, errors, reset } = useForm({
//         Personas_usuario: '', // Corresponde al campo del backend
//         Personas_contrasena: '', // Corresponde al campo del backend
//         remember: false,
//     });

//     useEffect(() => {
//         return () => {
//             // Asegura que la contraseña se borre al salir
//             reset('Personas_contrasena');
//         };
//     }, []);

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'));
//     };

//     return (
//         <GuestLayout>
//             <Head title="Iniciar Sesión" />

//             {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

//             <form onSubmit={submit}>
//                 <div>
//                     {/* 2. CAMBIO: Etiqueta para Personas_usuario */}
//                     <InputLabel htmlFor="Personas_usuario" value="Usuario" />

//                     <TextInput
//                         id="Personas_usuario"
//                         type="text"
//                         // 3. CAMBIO: Nombre del campo
//                         name="Personas_usuario"
//                         // 4. CAMBIO: Valor del estado
//                         value={data.Personas_usuario}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         // 5. CAMBIO: Manejo del cambio de estado
//                         onChange={(e) => setData('Personas_usuario', e.target.value)}
//                     />

//                     {/* 6. CAMBIO: Mensaje de error asociado */}
//                     <InputError message={errors.Personas_usuario} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     {/* 7. CAMBIO: Etiqueta para Personas_contrasena */}
//                     <InputLabel htmlFor="Personas_contrasena" value="Contraseña" />

//                     <TextInput
//                         id="Personas_contrasena"
//                         type="password"
//                         // 8. CAMBIO: Nombre del campo
//                         name="Personas_contrasena"
//                         // 9. CAMBIO: Valor del estado
//                         value={data.Personas_contrasena}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         // 10. CAMBIO: Manejo del cambio de estado
//                         onChange={(e) => setData('Personas_contrasena', e.target.value)}
//                     />

//                     {/* 11. CAMBIO: Mensaje de error asociado */}
//                     <InputError message={errors.Personas_contrasena} className="mt-2" />
//                 </div>

//                 {/* Se mantienen comentadas las secciones de 'Remember me' y 'Forgot password' como en tu código original */}

//                 <div className="flex items-center justify-end mt-4">
//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Iniciar Sesión
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }

import React, { useState } from 'react';
// Asumiendo que 'ArrowRight' es un icono simple, puedes usar un SVG o un paquete de iconos.
// Por simplicidad, usaremos un SVG inline para la flecha y el candado/correo.

// Componente del botón con icono y estilos de Delfin Technologies (azul claro)
const PrimaryButton = ({ children, disabled, className = '', ...props }) => (
    <button
        {...props}
        className={`w-full flex items-center justify-center px-4 py-3 bg-blue-500 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-300 transition ease-in-out duration-150 ${disabled && 'opacity-25'
            } ${className}`}
        disabled={disabled}
    >
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
    </button>
);

// Componente para el campo de texto con el icono
const TextInput = ({ icon, type, name, value, onChange, placeholder, error, className = '', ...props }) => {
    // Definir el SVG del icono
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

    return (
        <div className={`relative ${className}`}>
            <input
                {...props}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full py-3 ps-4 pe-12 border rounded-lg text-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pe-3">
                <IconSVG />
            </div>
        </div>
    );
};

// Componente principal del formulario de Login
export default function Login() {
    const [data, setData] = useState({
        Personas_usuario: '', // Correo electrónico
        Personas_contrasena: '', // Contraseña
    });

    const [errors, setErrors] = useState({}); // Para manejo de errores simples de frontend
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Lógica de validación (simulación)
        const newErrors = {};
        if (!data.Personas_usuario) newErrors.Personas_usuario = 'El correo electrónico es obligatorio.';
        if (!data.Personas_contrasena) newErrors.Personas_contrasena = 'La contraseña es obligatoria.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }

        setErrors({}); // Limpiar errores

        // Simulación de envío de formulario (reemplazar con tu lógica de 'post(route('login'))')
        console.log('Datos a enviar:', data);
        setTimeout(() => {
            setProcessing(false);
            // Simular un error de backend o éxito
            // if (simularError) setErrors({ Personas_usuario: 'Credenciales inválidas.' });
            // else console.log('Inicio de sesión exitoso');
        }, 1500);
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            {/* Contenedor del formulario (Simulando la tarjeta de la imagen) */}
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl transition duration-500 hover:shadow-3xl">

                {/* Logo de Delfin Technologies */}
                <div className="flex justify-center mb-8">
                    {/* Reemplaza esta etiqueta con el componente Image de tu librería o un <img> si tienes la URL del logo */}
                    <div className="h-16 w-32">
                        {/*  */}
                        {/* Placeholder simple para el logo */}
                        <span className="text-xl font-bold text-blue-600">Delfin Technologies</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Iniciar sesión</h2>
                    <p className="text-sm text-gray-500">Accede con tus credenciales corporativas</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Campo de Correo Electrónico (Personas_usuario) */}
                    <div>
                        <label htmlFor="Personas_usuario" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <TextInput
                            id="Personas_usuario"
                            type="text" // Usamos tipo email para teclado móvil apropiado
                            name="Personas_usuario"
                            value={data.Personas_usuario}
                            onChange={handleChange}
                            placeholder="nombre@empresa.com"
                            icon="email"
                            autoComplete="username"
                            error={errors.Personas_usuario}
                        />
                        {errors.Personas_usuario && (
                            <p className="mt-2 text-xs text-red-600">{errors.Personas_usuario}</p>
                        )}
                    </div>

                    {/* Campo de Contraseña (Personas_contrasena) */}
                    <div>
                        <label htmlFor="Personas_contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <TextInput
                            id="Personas_contrasena"
                            type="password"
                            name="Personas_contrasena"
                            value={data.Personas_contrasena}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon="lock"
                            autoComplete="current-password"
                            error={errors.Personas_contrasena}
                        />
                        {errors.Personas_contrasena && (
                            <p className="mt-2 text-xs text-red-600">{errors.Personas_contrasena}</p>
                        )}
                    </div>

                    {/* Botón de Ingresar */}
                    <PrimaryButton disabled={processing}>
                        {processing ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </div>
                        ) : (
                            'Ingresar'
                        )}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}