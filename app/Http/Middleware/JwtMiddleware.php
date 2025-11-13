<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Session;
use Tymon\JWTAuth\Token;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // try {

            $user = JWTAuth::parseToken()->authenticate();
            // if (!$user) {
            //     return response()->json(['message' => 'Usuario no encontrado'], 401);
            // }

        // } catch (TokenExpiredException $e) {
        //     // return response()->redirectTo('login');
        //     return response()->json(['message' => 'El token ha expirado'], 401);
        // } catch (TokenInvalidException $e) {
        //     // return response()->redirectTo('login');
        //     return response()->json(['message' => 'Token inválido'], 401);
        // } catch (Exception $e) {
        //     // return response()->redirectTo('login');
        //     return response()->json(['message' => 'Token no proporcionado'], 401);
        // }

        return $next($request);
    }
}
