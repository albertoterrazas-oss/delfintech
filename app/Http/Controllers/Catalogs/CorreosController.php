<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Models\Catalogos\CorreoNotificacion;
use Illuminate\Http\Request;
// use App\Models\CorreoNotificacion; // Importamos el modelo
use Illuminate\Support\Facades\Validator;

class CorreosController extends Controller
{
    /**
     * Muestra una lista de los correos de notificación.
     */
    public function index()
    {
        // Recupera todos los correos de notificación
        $correos = CorreoNotificacion::all();
        
        return response()->json($correos, 200);
    }

    /**
     * Muestra el formulario para crear un nuevo recurso (usualmente para vistas).
     */
    public function create()
    {
        // En una API REST, este método suele dejarse vacío o se omite.
        return response()->json(['message' => 'Not implemented for API'], 501);
    }

    /**
     * Almacena un recurso recién creado en el almacenamiento (BD).
     */
    public function store(Request $request)
    {
        // 1. Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'correoNotificaciones_correo'     => 'required|email|max:255|unique:dbo.correoNotificaciones,correoNotificaciones_correo',
            'correoNotificaciones_idUsuario'  => 'required|integer',
            'correoNotificaciones_estatus'    => 'sometimes|boolean', // 'sometimes' permite que sea opcional, pero si se envía, debe ser booleano
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422); // Código 422 Unprocessable Entity
        }

        try {
            // 2. Crear el nuevo registro
            $correo = CorreoNotificacion::create($validator->validated());
            
            return response()->json([
                'message' => 'Correo de notificación creado exitosamente',
                'data' => $correo
            ], 201); // Código 201 Created

        } catch (\Exception $e) {
            // 3. Manejo de errores
            return response()->json([
                'message' => 'Ocurrió un error al guardar el correo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Muestra el recurso especificado.
     */
    public function show(string $id)
    {
        // Busca el correo por su clave primaria o lanza una excepción 404
        $correo = CorreoNotificacion::find($id);

        if (!$correo) {
            return response()->json(['message' => 'Correo de notificación no encontrado'], 404);
        }

        return response()->json($correo, 200);
    }

    /**
     * Muestra el formulario para editar el recurso especificado (usualmente para vistas).
     */
    public function edit(string $id)
    {
        // En una API REST, este método suele dejarse vacío o se omite.
        return response()->json(['message' => 'Not implemented for API'], 501);
    }

    /**
     * Actualiza el recurso especificado en el almacenamiento (BD).
     */
    public function update(Request $request, string $id)
    {
        // 1. Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            // El correo debe ser único, excluyendo el registro actual
            'correoNotificaciones_correo'     => 'required|email|max:255|unique:dbo.correoNotificaciones,correoNotificaciones_correo,' . $id . ',correoNotificaciones_id',
            'correoNotificaciones_idUsuario'  => 'sometimes|integer', // 'sometimes' para permitir actualizaciones parciales
            'correoNotificaciones_estatus'    => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Buscar el registro
        $correo = CorreoNotificacion::find($id);

        if (!$correo) {
            return response()->json(['message' => 'Correo de notificación no encontrado'], 404);
        }
        
        try {
            // 3. Actualizar el registro
            $correo->update($validator->validated());
            
            return response()->json([
                'message' => 'Correo de notificación actualizado exitosamente',
                'data' => $correo
            ], 200); // Código 200 OK

        } catch (\Exception $e) {
            // 4. Manejo de errores
            return response()->json([
                'message' => 'Ocurrió un error al actualizar el correo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina el recurso especificado del almacenamiento (BD).
     */
    public function destroy(string $id)
    {
        // 1. Buscar el registro
        $correo = CorreoNotificacion::find($id);

        if (!$correo) {
            return response()->json(['message' => 'Correo de notificación no encontrado'], 404);
        }

        try {
            // 2. Eliminar el registro
            $correo->delete();

            // 3. Retornar respuesta
            return response()->json([
                'message' => 'Correo de notificación eliminado exitosamente'
            ], 204); // Código 204 No Content (Éxito sin contenido de retorno)

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al eliminar el correo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}