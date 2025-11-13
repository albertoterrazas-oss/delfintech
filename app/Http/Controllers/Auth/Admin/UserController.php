<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Menu;
use App\Models\Admin\User;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Usamos el operador de concatenación '+' en SQL Server.
        // Es crucial usar comillas simples (') para los espacios.
        $users = User::selectRaw("
        *,
        (Personas_nombres + ' ' + Personas_apPaterno + ' ' + Personas_apMaterno) AS nombre_completo
    ")->get();

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Personas_nombres' => 'required|string|max:255',
            'Personas_apPaterno' => 'required|string|max:255',
            // VALIDACIÓN UNIQUE REMOVIDA
            'Personas_correo' => 'required|string|email|max:255',
            'Personas_contrasena' => 'required|string|min:8',
            // VALIDACIÓN UNIQUE REMOVIDA
            'Personas_usuario' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            // Retorna 400 Bad Request con los errores de validación
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'Personas_nombres' => $request->Personas_nombres,
            'Personas_apPaterno' => $request->Personas_apPaterno,
            'Personas_apMaterno' => $request->Personas_apMaterno,
            'Personas_telefono' => $request->Personas_telefono,
            'Personas_direccion' => $request->Personas_direccion,
            'Personas_fechaNacimiento' => $request->Personas_fechaNacimiento,
            'Personas_correo' => $request->Personas_correo,
            'Personas_puesto' => $request->Personas_puesto,
            'Personas_licencia' => $request->Personas_licencia,
            'Personas_vigenciaLicencia' => $request->Personas_vigenciaLicencia,
            'Personas_usuario' => $request->Personas_usuario,
            // La contraseña se hasheará automáticamente por la propiedad 'casts' del modelo
            'Personas_contrasena' => $request->Personas_contrasena,
            'Personas_esEmpleado' => $request->Personas_esEmpleado ?? false, // Default to false if not provided
        ]);

        // Retorna 201 Created
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Reglas de validación para la actualización
        $validator = Validator::make($request->all(), [
            'Personas_nombres' => 'sometimes|required|string|max:255',
            'Personas_apPaterno' => 'sometimes|required|string|max:255',
            // VALIDACIÓN UNIQUE REMOVIDA
            'Personas_correo' => 'sometimes|required|string|email|max:255',
            // VALIDACIÓN UNIQUE REMOVIDA
            'Personas_usuario' => 'sometimes|required|string|max:255',
            'Personas_contrasena' => 'sometimes|nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            // Retorna 400 Bad Request con los errores de validación
            return response()->json($validator->errors(), 400);
        }

        // Manejar la actualización de la contraseña por separado para que el 'casts' la hashee
        if ($request->filled('Personas_contrasena')) {
            $user->Personas_contrasena = $request->Personas_contrasena;
        }

        // Llenar el resto de los campos excluyendo la contraseña (ya manejada)
        $user->fill($request->except('Personas_contrasena'));
        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user
        ], 200); // Retorna 200 OK
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        // Retorna 200 OK
        return response()->json(['message' => 'Usuario eliminado exitosamente']);
    }

    public function menus(Request $request)
    {
        $user = $request->user();
        // dd($user);
        // $menus = Menu::get();

        // return response()->json($menus);

        // $payload = JWTAuth::parseToken()->getPayload();
        // $empresa = $payload['companyId'];
        // $centro_costos = $payload['centroId'];

        // $id = $request->id ?? null;

        $user = User::where('Personas_usuarioID', $user->Personas_usuarioID)
            ->with('menus') // <--- Aquí estaba el error: se necesita usar ()
            ->first();

        // dd(vars: $user);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Obtener y filtrar menús
        $menusData = $user->menus()
            ->orderBy('menu_nombre')
            ->get()
            // ->filter(function ($menu) use ($empresa, $centro_costos) {
            //     return ($empresa === null || $menu->pivot->usuarioxmenu_idempresa == $empresa) &&
            //         ($centro_costos === null || $menu->pivot->usuarioxmenu_idcentrocostos == $centro_costos);
            // })
            ->map(fn($menu) => $menu->toArray());

        $menus = [];
        $menusMap = [];
        $processedMenus = []; // Array para controlar menús procesados y evitar duplicados

        // Crear un mapa de menús
        foreach ($menusData as $menu) {
            $menu['childs'] = []; // Ahora sí podemos modificarlo porque es un array
            $menusMap[$menu['menu_id']] = $menu;
        }

        // Construir jerarquía de menús
        foreach ($menusData as $menu) {
            // Verificar si el menú ya ha sido procesado para evitar duplicados
            if (in_array($menu['menu_id'], $processedMenus)) {
                continue; // Si ya fue procesado, lo saltamos
            }

            if ($menu['menu_idPadre'] == 0) {
                $menus[] = &$menusMap[$menu['menu_id']];
            } else {
                $menusMap[$menu['menu_idPadre']]['childs'][] = &$menusMap[$menu['menu_id']];
            }

            // Marcar el menú como procesado
            $processedMenus[] = $menu['menu_id'];
        }

        return response()->json($menus, 200);
    }
}
