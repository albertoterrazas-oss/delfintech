<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 1. Obtener el token flasheado. Si existe, lo recupera y lo elimina de la sesión
        // (Será null si no hay un token flasheado, lo cual es normal después del primer request).
        $flashedToken = session('auth_token');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()
                    ? array_merge(
                        // Parte 1: Atributos limitados del usuario
                        $request->user()->only([
                            'Personas_usuarioID',
                            'Personas_nombres',
                            'Personas_apPaterno',
                            'Personas_usuario', // Nombre de usuario (login)
                            'Personas_correo',
                            'Personas_esEmpleado',
                            // Agrega otros campos esenciales aquí si son necesarios para la interfaz.
                        ]),
                        // ⭐️ Parte 2: Añadir el token de Sanctum
                        // Si $flashedToken es null (en requests posteriores), el 'token'
                        // se compartirá como null.
                        ['token' => $flashedToken]
                    )
                    : null,
            ],
            // Asegúrate de agregar otros props globales aquí si los necesitas
            // (ej: 'flash' para mensajes de sesión).
        ];
    }
}