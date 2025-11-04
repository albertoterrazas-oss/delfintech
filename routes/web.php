<?php

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

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register')
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

Route::get('/', function () {
    // Redirigir a dashboard si está autenticado
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    // Si no está autenticado, mostrar login
    return Inertia::render('Auth/Login');
})->name('login');

// Ruta específica de login que también redirige si está autenticado
Route::get('/login', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/Login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Home', [
            'initialPage' => '/dashboard'
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de autenticación y API específicas primero
// Route::middleware(['auth'])->group(function () {
//     // Rutas específicas de API o backend...
// });

// Captura todas las demás rutas y las envía a React Router
Route::get('{path?}', function () {
    return Inertia::render('Home', [
        'auth' => [
            'user' => auth()->user()
        ]
    ]);
})->where('path', '.*')->middleware(['auth']);

require __DIR__ . '/auth.php';
