<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Rutas públicas
Route::middleware('guest')->group(function () {
    Route::get('/', fn() => Inertia::render('Auth/Login'))->name('login');
    Route::get('/login', fn() => Inertia::render('Auth/Login'));
    Route::get('/logout', [AuthenticatedSessionController::class, 'logout'])->name('logout');
});

// Rutas protegidas
Route::middleware('jwt')->group(function () {
    // Ruta del Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Home', [
            'auth' => [
                'user' => auth()->user()
            ],
            'initialPage' => '/dashboard'
        ]);
    })->name('dashboard');

    // Rutas del perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Captura todas las demás rutas autenticadas
    // Route::get('{path?}', function () {
    //     return Inertia::render('Home', [
    //         'auth' => [
    //             'user' => auth()->user()
    //         ]
    //     ]);
    // })->where('path', '^(?!api|login|dashboard).*$');
    Route::get('/{path?}', fn() => Inertia::render('Home', [
        'auth' => ['user' => auth()->user()],
    ]))->where('path', '^(?!api|login).*$');
});

// Redirección después del login (en RedirectIfAuthenticated middleware)
require __DIR__ . '/auth.php';
