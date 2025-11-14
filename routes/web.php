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


Route::get('login', [AuthenticatedSessionController::class, 'create'])
    ->name('login')->middleware('authWeb');;

Route::post('login', [AuthenticatedSessionController::class, 'store'])
    ->name('login')->middleware('authWeb');

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout')->middleware('auth');


// Captura todas las demás rutas y las envía a React Router
// Route::get('{path?}', function () {
//     return Inertia::render('Home', [
//         'auth' => [
//             'user' => auth()->user()
//         ]
//     ]);
// })->where('path', '.*')->middleware(['auth']);

require __DIR__ . '/auth.php';
