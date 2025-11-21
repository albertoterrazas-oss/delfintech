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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // MANTENER
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Session;

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


    public function store(Request $request)
    {

        // $request->session()->regenerate();
        // $request->authenticate();
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

        // 3. Verificar credenciales
        if (!$user || !Hash::check($request->Personas_contrasena, $user->Personas_contrasena)) {
            throw ValidationException::withMessages([
                'Personas_usuario' => __('Las credenciales proporcionadas no coinciden con nuestros registros.'),
            ]);
        }

        // --- LÓGICA DE AUTENTICACIÓN BASADA EN TOKEN (Sanctum) ---
        $token = null;
        $token = JWTAuth::fromUser($user);
        Session::put('token', $token);
    }



    public function login(Request $request)
    {

        if (!Auth::attempt(['Personas_usuario' => $request->Personas_usuario, 'Personas_contrasena' => $request->Personas_contrasena]))
            return response()->json([
                "message" => "Credenciales incorrectas",
                "status" => false,
                "data" => null
            ], HttpResponse::HTTP_OK);

        $user = User::where('Personas_usuario', $request->Personas_usuario)->first();

        $token = JWTAuth::fromUser($user);


        return response()->json([
            "message" => "hola",
            "data" => $token,
            "status" => true,

        ], HttpResponse::HTTP_OK);
    }

    /**
     * Destroy an authenticated session (Log out).
     * Maneja el cierre de sesión de la sesión web o la revocación del token de API.
     */
    public function destroy(Request $request): RedirectResponse|JsonResponse
    {
        // Si el usuario está autenticado mediante la API (usando un token)
        Auth::guard('web')->logout();

        // $request->session()->forget('user');
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
