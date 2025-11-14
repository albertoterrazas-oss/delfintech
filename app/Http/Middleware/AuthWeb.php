<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Log;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Token;

class AuthWeb
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $currentPath = $request->path();
        $isLoginRoute = ($currentPath === 'login');

        // Rutas que no requieren autenticación (e.g., login, register, password reset)
        // Se asume que RouteServiceProvider::SKIPPED_ROUTES_JWT contiene rutas como 'login' y otras rutas públicas.
        $isSkippedRoute = in_array($currentPath, RouteServiceProvider::SKIPPED_ROUTES_JWT);

        try {
            $token = Session::get('token');

            if ($token) {
                $tokenObject = new Token($token);
                $tokenParsed = JWTAuth::decode($tokenObject);
                
                // La fecha de expiración ('exp') es un timestamp Unix.
                // Carbon::createFromTimestamp() lo convierte.
                $limitDate = Carbon::createFromTimestamp($tokenParsed['exp']);
                $isTokenExpired = Carbon::now()->isAfter($limitDate);

                if ($isTokenExpired) {
                    // Si el token expiró, cerramos sesión web y redirigimos a login
                    Auth::guard('web')->logout();
                    Session::forget('token');
                    return response()->redirectTo('login');
                }

                // Si el token es válido y el usuario intenta acceder a 'login', lo redirigimos a 'dashboard'
                if ($isLoginRoute) {
                    return response()->redirectTo('dashboard');
                }

                // El token es válido, permitir el acceso a la ruta protegida
                return $next($request);

            } else {
                // No hay token en la sesión. Si no es una ruta saltada, redirigir a login.
                if (!$isSkippedRoute) {
                    return response()->redirectTo('login');
                }
            }

            // Permitir el acceso a rutas públicas (incluyendo el POST de login si no hay token)
            return $next($request);

        } catch (\Throwable $th) {
            // Manejar cualquier error de decodificación de JWT (token inválido o corrupto)
            Log::error("Error en AuthWeb Middleware: " . $th->getMessage());
            Session::forget('token');
            Auth::guard('web')->logout();
            return response()->redirectTo('login');
        }
    }
}