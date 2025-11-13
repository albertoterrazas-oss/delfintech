<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // dd($request);
        // return $request->expectsJson() ? null : route('login');
        if ($request->expectsJson() || $request->header('X-Inertia')) {
            abort(401, 'Sesión expirada');
        }

        return route('login');
    }
}
