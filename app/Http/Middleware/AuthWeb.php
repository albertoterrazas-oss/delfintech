<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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
     
        try {
            //code...
            $token = Session::get('token');
            if ($token) {
                $token = new Token($token);
                $tokenParsed = JWTAuth::decode($token);
                $limitDate = Carbon::parse($tokenParsed['exp']);

                if (!in_array($request->path(), RouteServiceProvider::SKIPPED_ROUTES_JWT)) {
                    if (Carbon::now()->isAfter($limitDate))
                        return response()->redirectTo('login');
                    return $next($request);
                }

                if ($request->path() == 'login') {
                    if (Carbon::now()->isAfter($limitDate))
                        return $next($request);
                    return response()->redirectTo('dashboard');
                }
            }
            if (in_array($request->path(), RouteServiceProvider::SKIPPED_ROUTES_JWT))
                return $next($request);
            else
                return response()->redirectTo('login');
        } catch (\Throwable $th) {
            Session::forget('token');
            return response()->redirectTo('login');
        }
    }
}
