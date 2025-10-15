<?php

// use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\Admin\UserController ;
use App\Http\Controllers\Catalogs\UnidadesController;
use App\Models\Catalogos\Unidades;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('users', UserController::class);

// Esto crea automáticamente las 5 rutas: index, store, show, update, destroy
Route::resource('unidades', UnidadesController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);


