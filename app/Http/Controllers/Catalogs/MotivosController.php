<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Catalogos\Motivos; // Importamos el modelo Motivos

class MotivosController extends Controller
{
    /**
     * Display a listing of the resource (GET /motivos).
     * Recupera y retorna todos los motivos.
     */
    public function index()
    {
        // Obtiene todos los registros de la tabla dbo.Motivos
        $motivos = Motivos::all();

        return response()->json($motivos);
    }

    /**
     * Show the form for creating a new resource (GET /motivos/create).
     * Generalmente usado para retornar una vista.
     */
    public function create()
    {
        // Este método se deja vacío ya que se asume una API o se manejan las vistas en el frontend.
    }

    /**
     * Store a newly created resource in storage (POST /motivos).
     * Valida la data y crea un nuevo motivo.
     */
    public function store(Request $request)
    {
        // Reglas de validación para los campos
        $validatedData = $request->validate([
            'Motivos_nombre' => 'required',
            'Motivos_tipo' => 'required',
            'Motivos_descripcion' => 'nullable',
            // Asumiendo que 'Motivos_estatus' es un booleano (0 o 1)
            'Motivos_estatus' => 'required', 
        ]);

        // Crear el nuevo registro en la base de datos
        $motivo = Motivos::create($validatedData);

        // Retorna el registro creado con un código de estado 201 (Created)
        return response()->json($motivo, 201);
    }

    /**
     * Display the specified resource (GET /motivos/{id}).
     * Recupera y retorna un motivo específico por su ID.
     */
    public function show(string $id)
    {
        // Busca el motivo por su clave primaria (Motivos_motivoID) o lanza una excepción 404
        $motivo = Motivos::findOrFail($id);

        return response()->json($motivo);
    }

    /**
     * Show the form for editing the specified resource (GET /motivos/{id}/edit).
     * Generalmente usado para retornar una vista con la data a editar.
     */
    public function edit(string $id)
    {
        // Este método se deja vacío ya que se asume una API o se manejan las vistas en el frontend.
    }

    /**
     * Update the specified resource in storage (PUT/PATCH /motivos/{id}).
     * Valida la data y actualiza el motivo existente.
     */
    public function update(Request $request, string $id)
    {
        // Busca el motivo por su clave primaria o lanza una excepción 404
        $motivo = Motivos::findOrFail($id);

        // Reglas de validación. 'sometimes' permite actualizar solo los campos enviados.
        $validatedData = $request->validate([
            'Motivos_nombre' => 'sometimes|required|string|max:255',
            'Motivos_tipo' => 'sometimes|required|string|max:50',
            'Motivos_descripcion' => 'nullable|string',
            'Motivos_estatus' => 'sometimes|required|boolean',
        ]);

        // Actualizar el registro
        $motivo->update($validatedData);

        // Retorna el registro actualizado
        return response()->json($motivo);
    }

    /**
     * Remove the specified resource from storage (DELETE /motivos/{id}).
     * Elimina un motivo.
     */
    public function destroy(string $id)
    {
        // Busca el motivo por su clave primaria o lanza una excepción 404
        $motivo = Motivos::findOrFail($id);

        // Eliminar el registro
        $motivo->delete();

        // Retorna un código 204 (No Content) para indicar que la eliminación fue exitosa
        return response()->json(null, 204);
    }
}
