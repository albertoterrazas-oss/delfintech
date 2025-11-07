<?php

// use App\Http\Controllers\Admin\UserController;

use App\Http\Controllers\Auth\Admin\RolesController;
use App\Http\Controllers\Auth\Admin\UserController;
use App\Http\Controllers\Catalogs\DestinosController;
use App\Http\Controllers\Catalogs\MotivosController;
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



Route::middleware('auth:sanctum')->group(function () {

    // RUTA PROTEGIDA CON TOKEN: Destinos
    // Para que funcione en Insomnia/Postman, debes enviar el token en el encabezado 'Authorization: Bearer [TOKEN]'
    Route::resource('destinos', DestinosController::class)->only([
        'index',    // (GET /api/destinos)
        'store',    // (POST /api/destinos)
        'update'    // (PUT/PATCH /api/destinos/{destino})
    ]);


    Route::resource('users', UserController::class)->only([
        'index', // GET /api/admin/users
        'store', // POST /api/admin/users
        'show',  // GET /api/admin/users/{user}
        'update', // PUT/PATCH /api/admin/users/{user}
        'destroy' // DELETE /api/admin/users/{user}
    ]);

    // Esto crea automáticamente las 5 rutas: index, store, show, update, destroy
    Route::resource('unidades', UnidadesController::class)->only([
        'index',
        'store',
        'show',
        'update',
        'destroy'
    ]);


    Route::resource('roles', RolesController::class)->only([
        'index', // GET /api/admin/roles
        'store', // POST /api/admin/roles
        'update' // PUT/PATCH /api/admin/roles/{role}
    ]);

    Route::resource('motivos', MotivosController::class)->only([
        'index',  // Registra el método index (GET)
        'store',  // Registra el método store (POST)
        'update'  // Registra el método update (PUT/PATCH)
        // No incluyas 'show', 'destroy', 'create', 'edit'
    ]);
    // Opcional: Ruta para obtener el usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::get('user/menus', [UserController::class, 'menus'])->name('user.menus');
Route::get('rolesxmenu', [RolesController::class, 'getAllRolesMenu'])->name('rolesxmenu.index');
Route::get('rolesxmenu/{id}', [RolesController::class, 'getRolesMenu'])->name('rolesxmenu.show');
Route::put('rolesxmenu/{id}', [RolesController::class, 'rolesxmenu'])->name('rolesxmenu.update');
Route::post('rolesxmenu/usersPerRole', [RolesController::class, 'usersPerRole'])->name('rolesxmenu.usersPerRole');
Route::post('usuarioxmenu', [UserController::class, 'getUsuarioMenu'])->name('usuarioxmenu.index');
Route::put('usuarioxmenu/{id}', [UserController::class, 'usuarioxmenu'])->name('usuarioxmenu.update');
