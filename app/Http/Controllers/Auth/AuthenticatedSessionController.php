<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\JsonResponse; 
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Admin\User; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse; 
use Illuminate\Support\Facades\DB; // NUEVO: Para transacciones
use Illuminate\Support\Facades\Log; // NUEVO: Para registrar errores
use Symfony\Component\HttpKernel\Exception\ConflictHttpException; // NUEVO: Para lanzar el 409

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view (Mantener para la vista Inertia).
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request, now returning a Sanctum Token for API usage.
     * La lógica de transacción se asegura de que el token se genere de forma segura.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'Personas_usuario' => 'required|string|max:255',
            'Personas_contrasena' => 'required|string',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // 2. Intentar encontrar al usuario
        $user = User::where('Personas_usuario', $request->Personas_usuario)->first();

        // 3. Verificar si el usuario existe Y si la contraseña coincide con el hash
        if (!$user || !Hash::check($request->Personas_contrasena, $user->Personas_contrasena)) {
            throw ValidationException::withMessages([
                'Personas_usuario' => __('Las credenciales proporcionadas no coinciden con nuestros registros.'),
            ]);
        }

        // --- LÓGICA DE AUTENTICACIÓN BASADA EN TOKEN (Sanctum) con Transacción ---
        $token = null;

        try {
            // Inicia la transacción para garantizar la atomicidad (prevención de 409 Conflict)
            DB::beginTransaction();

            // 4. Eliminar tokens existentes para evitar acumulación
            $user->tokens()->delete();

            // 5. Generar el nuevo token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Confirma la transacción
            DB::commit();

        } catch (\Exception $e) {
            // Si algo falla, revierte los cambios de la transacción
            DB::rollBack();

            // Registra el error interno para diagnóstico
            Log::error('Error al generar token de acceso para el usuario ID: ' . $user->id . ' - ' . $e->getMessage());

            // Lanza una excepción 409 Conflict explícitamente
            throw new ConflictHttpException('Hubo un conflicto al intentar generar su sesión de acceso. Intente nuevamente.');
        }

        // 6. Retornar el token y los datos del usuario en una respuesta JSON
        return response()->json([
            'user' => [
                'id' => $user->id,
                'Personas_usuario' => $user->Personas_usuario,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer', // Añadido para seguir el estándar de API
            'redirect_to' => RouteServiceProvider::HOME,
        ], 200);
    }

    /**
     * Destroy an authenticated session (Log out).
     * Maneja el cierre de sesión de la sesión web o la revocación del token de API.
     */
    public function destroy(Request $request): RedirectResponse|JsonResponse
    {
        // Si el usuario está autenticado mediante la API (usando un token)
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Token revocado exitosamente.'], 200);
        }

        // Si es una solicitud tradicional de cierre de sesión web (Inertia/Session)
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}