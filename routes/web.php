<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Catalogs\DashboardController;
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
// Ruta para mostrar el formulario (usa el método create)
Route::get('login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');


Route::get('/', function () {
    return redirect()->route('login');
});


Route::middleware(['authWeb'])->group(function () {
    // La ruta que falta
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard'); // Es buena práctica darle un nombre
});

Route::post('login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.attempt')->middleware('authWeb'); // Nota: cambié el nombre de la ruta POST para evitar conflicto con la GET


Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout')->middleware('auth');


require __DIR__ . '/auth.php';
