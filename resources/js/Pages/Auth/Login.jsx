import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Loading from '@/Components/Loading';

export default function Login({ status, canResetPassword }) {
    // 1. CAMBIO CLAVE: Usar Personas_usuario y Personas_contrasena en lugar de email y password
    const { data, setData, post, processing, errors, reset } = useForm({
        Personas_usuario: '', // Corresponde al campo del backend
        Personas_contrasena: '', // Corresponde al campo del backend
        remember: false,
    });

    useEffect(() => {
        return () => {
            // Asegura que la contraseña se borre al salir
            reset('Personas_contrasena');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    {/* 2. CAMBIO: Etiqueta para Personas_usuario */}
                    <InputLabel htmlFor="Personas_usuario" value="Usuario" />

                    <TextInput
                        id="Personas_usuario"
                        type="text"
                        // 3. CAMBIO: Nombre del campo
                        name="Personas_usuario"
                        // 4. CAMBIO: Valor del estado
                        value={data.Personas_usuario}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        // 5. CAMBIO: Manejo del cambio de estado
                        onChange={(e) => setData('Personas_usuario', e.target.value)}
                    />

                    {/* 6. CAMBIO: Mensaje de error asociado */}
                    <InputError message={errors.Personas_usuario} className="mt-2" />
                </div>

                <div className="mt-4">
                    {/* 7. CAMBIO: Etiqueta para Personas_contrasena */}
                    <InputLabel htmlFor="Personas_contrasena" value="Contraseña" />

                    <TextInput
                        id="Personas_contrasena"
                        type="password"
                        // 8. CAMBIO: Nombre del campo
                        name="Personas_contrasena"
                        // 9. CAMBIO: Valor del estado
                        value={data.Personas_contrasena}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        // 10. CAMBIO: Manejo del cambio de estado
                        onChange={(e) => setData('Personas_contrasena', e.target.value)}
                    />

                    {/* 11. CAMBIO: Mensaje de error asociado */}
                    <InputError message={errors.Personas_contrasena} className="mt-2" />
                </div>

                {/* Se mantienen comentadas las secciones de 'Remember me' y 'Forgot password' como en tu código original */}

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Iniciar Sesión
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
