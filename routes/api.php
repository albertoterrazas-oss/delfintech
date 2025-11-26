<?php

// use App\Http\Controllers\Admin\UserController;

use App\Http\Controllers\Auth\Admin\RolesController;
use App\Http\Controllers\Auth\Admin\UserController;
use App\Http\Controllers\Catalogs\CorreosController;
use App\Http\Controllers\Catalogs\DepartamentoController;
use App\Http\Controllers\Catalogs\DestinosController;
use App\Http\Controllers\Catalogs\ListaVerificacionController;
use App\Http\Controllers\Catalogs\MenuController;
use App\Http\Controllers\Catalogs\MotivosController;
use App\Http\Controllers\Catalogs\PuestosController;
use App\Http\Controllers\Catalogs\RegistroEntradaController;
use App\Http\Controllers\Catalogs\UnidadesController;
use App\Models\Catalogos\Departamento;
use App\Models\Catalogos\Puestos;
use App\Models\Catalogos\Unidades;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Admin\User;
use App\Models\Catalogos\ListaVerificacion;
use Tymon\JWTAuth\Facades\JWTAuth;

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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Las rutas que están dentro de este grupo requerirán el token en el header Authorization


Route::middleware('jwt')->group(function () {

    Route::resource('destinos', DestinosController::class)->only([
        'index',    // (GET /api/destinos)
        'store',    // (POST /api/destinos)
        'update'    // (PUT/PATCH /api/destinos/{destino})
    ]);

    // Esto crea automáticamente las 5 rutas: index, store, show, update, destroy
    Route::resource('unidades', UnidadesController::class)->only([
        'index',
        'store',
        'show',
        'update',
        'destroy'
    ]);

    Route::resource('motivos', MotivosController::class)->only([
        'index',  // Registra el método index (GET)
        'store',  // Registra el método store (POST)
        'update'  // Registra el método update (PUT/PATCH)
    ]);


    Route::resource('menus', MenuController::class)->only([
        'index',  // Registra el método index (GET)
        'store',  // Registra el método store (POST)
        'update'  // Registra el método update (PUT/PATCH)
    ]);


    Route::resource('listaverificacion', ListaVerificacionController::class)->only([
        'index',  // Registra el método index (GET)
        'store',  // Registra el método store (POST)
        'update'  // Registra el método update (PUT/PATCH)
    ]);

    Route::resource('departamentos', DepartamentoController::class)->only([
        'index',  // Registra el método index (GET)
        'store',  // Registra el método store (POST)
        'update'  // Registra el método update (PUT/PATCH)
    ]);


    Route::resource('puestos', PuestosController::class)->only([
        'index',  // Registra el método index (GET)
        'store',  // Registra el método store (POST)
        'update'  // Registra el método update (PUT/PATCH)
    ]);

    Route::get('menus-tree', [MenuController::class, 'getTree'])->name('menus-tree');
    Route::get('user/menus', [UserController::class, 'menus'])->name('user.menus');
    Route::get('QuienconQuienUnidades', [UnidadesController::class, 'QuienconQuienUnidades'])->name('QuienconQuienUnidades');
    Route::get('QuienconQuienControl', [UnidadesController::class, 'QuienconQuienControl'])->name('QuienconQuienControl');
    Route::get('DashboardUnidad', [UnidadesController::class, 'DashboardUnidad'])->name('DashboardUnidad');
    Route::get('UnidadesQuiencQuien', [UnidadesController::class, 'UnidadesQuiencQuien'])->name('UnidadesQuiencQuien');
    Route::post('ReporteMovimientos', [UnidadesController::class, 'ReporteMovimientos'])->name('ReporteMovimientos');

    Route::get('DestinosQuiencQuien', [DestinosController::class, 'DestinosQuiencQuien'])->name('DestinosQuiencQuien');
    Route::get('MotivosQuiencQuien', [MotivosController::class, 'MotivosQuiencQuien'])->name('MotivosQuiencQuien');
    Route::get('DepartamentosActivos', [DepartamentoController::class, 'DepartamentosActivos'])->name('DepartamentosActivos');

    Route::post('/asignaciones', [RegistroEntradaController::class, 'store'])->name('asignaciones.store');
    Route::post('/changesswho',  [RegistroEntradaController::class, 'changesswho'])->name('changesswho');
    Route::post('ultimos-movimientos-unidad', [RegistroEntradaController::class, 'getUltimosMovimientosUnidad'])->name('ultimos-movimientos-unidad');

    Route::resource('users', UserController::class)->only([
        'index', // GET /api/admin/users
        'store', // POST /api/admin/users
        'show',  // GET /api/admin/users/{user}
        'update', // PUT/PATCH /api/admin/users/{user}
        'destroy' // DELETE /api/admin/users/{user}
    ]);

    Route::resource('roles', RolesController::class)->only([
        'index', // GET /api/admin/roles
        'store', // POST /api/admin/roles
        'update' // PUT/PATCH /api/admin/roles/{role}
    ]);

    Route::resource('correos', CorreosController::class)->only([
        'index', // GET /api/admin/roles
        'store', // POST /api/admin/roles
        'update' // PUT/PATCH /api/admin/roles/{role}
    ]);
});


Route::get('rolesxmenu', [RolesController::class, 'getAllRolesMenu'])->name('rolesxmenu.index');
Route::get('rolesxmenu/{id}', [RolesController::class, 'getRolesMenu'])->name('rolesxmenu.show');
Route::put('rolesxmenu/{id}', [RolesController::class, 'rolesxmenu'])->name('rolesxmenu.update');
Route::post('rolesxmenu/usersPerRole', [RolesController::class, 'usersPerRole'])->name('rolesxmenu.usersPerRole');
Route::post('usuarioxmenu', [UserController::class, 'getUsuarioMenu'])->name('usuarioxmenu.index');
Route::put('usuarioxmenu/{id}', [UserController::class, 'usuarioxmenu'])->name('usuarioxmenu.update');

Route::get('testcorreo', [ListaVerificacionController::class, 'testcorreo'])->name('testcorreo');

Route::get('jwt', function () {
    $users = User::first();

    $token = JWTAuth::fromUser($users);
    return response()->json([
        "token" => $token
    ]);
});
