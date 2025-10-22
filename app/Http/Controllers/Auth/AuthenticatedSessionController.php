<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
// REMOVIDO: use App\Http\Requests\Auth\LoginRequest; 
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
// AGREGADOS: Importar clases necesarias para la lógica manual
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Admin\User; 
use Illuminate\Support\Facades\Hash;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request (LÓGICA MOVIDA AQUÍ).
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'Personas_usuario' => 'required|string|max:255',
            'Personas_contrasena' => 'required|string',
        ]);

        if ($validator->fails()) {
            // Regresar los errores a la vista de login
            throw new ValidationException($validator);
        }

        // 2. Intentar autenticar manualmente
        $user = User::where('Personas_usuario', $request->Personas_usuario)->first();

        // 3. Verificar si el usuario existe Y si la contraseña coincide con el hash
        if (!$user || !Hash::check($request->Personas_contrasena, $user->Personas_contrasena)) {
            // Si las credenciales fallan, lanza una excepción de validación
            throw ValidationException::withMessages([
                'Personas_usuario' => __('Las credenciales proporcionadas no coinciden con nuestros registros.'),
            ]);
        }

        // 4. Si la autenticación es exitosa, iniciar la sesión
        Auth::login($user);

        // Omitimos la lógica de RateLimiter (límite de intentos) aquí para simplicidad,
        // pero es por eso que el Form Request es mejor.
        
        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
