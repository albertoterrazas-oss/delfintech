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
        return [
            ...parent::share($request),
            'auth' => [
                // Al usar only(), solo compartimos los campos esenciales con la interfaz
                // usando los nombres de columna correctos de la tabla dbo.Personas.
                'user' => $request->user()
                    ? $request->user()->only([
                        'Personas_usuarioID',
                        'Personas_nombres',
                        'Personas_apPaterno',
                        'Personas_usuario', // Nombre de usuario (login)
                        'Personas_correo',
                        'Personas_esEmpleado',
                        // Agrega otros campos esenciales aquí si son necesarios para la interfaz.
                    ])
                    : null,
            ],
        ];
    }
}
