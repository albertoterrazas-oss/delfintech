<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Models\Catalogos\Destinos;
use Illuminate\Http\Request;

class DestinosController extends Controller
{

    public function index()
    {
        try {
            // Obtener todos los destinos
            $destinos = Destinos::all();

            // Devolver respuesta JSON
            return response()->json(
              $destinos
            , 200);
        } catch (\Exception $e) {
            // Log::error("Error al obtener la lista de destinos: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno al obtener los destinos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //---------------------------------------------------------

    /**
     * Store a newly created resource in storage.
     * Almacena un recurso recién creado en la base de datos.
     */
    public function store(Request $request)
    {

        $user = $request->user();
        dd($user);
        // 1. Validar los datos de entrada (solo requeridos + tipo)
        // Usamos 'bail' para detener la validación después del primer fallo en un campo.
        $validatedData = $request->validate(
            [
                'Destinos_Nombre'    => 'required|string|max:255',
                'Destinos_Latitud'   => 'required|numeric',
                'Destinos_Longitud'  => 'required|numeric',
                // Asumo que 'Destinos_Estatus' viene como 0 o 1
                'Destinos_Estatus'   => 'required|boolean',
                'Destinos_UsuarioID' => 'required|integer|min:1',
                // 'Destinos_Fecha' se llenará en el código
            ],
            // Mensajes personalizados
            [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric'  => 'El campo :attribute debe ser un número.',
                'boolean'  => 'El campo :attribute debe ser verdadero (1) o falso (0).',
                'integer'  => 'El campo :attribute debe ser un número entero.',
                'min'      => 'El campo :attribute debe ser al menos :min.',
            ]
        );

        // 2. Preparar datos adicionales antes de la creación
        // Tu modelo tiene $timestamps = false, por lo que gestionamos la fecha.
        $validatedData['Destinos_Fecha'] = now();

        try {
            // 3. Crear y guardar el nuevo destino
            $destino = Destinos::create($validatedData);

            // 4. Devolver una respuesta exitosa
            return response()->json([
                'message' => 'Destino creado con éxito',
                'data' => $destino
            ], 201); // Código 201 Created

        } catch (\Exception $e) {
            // Log::error("Error al crear destino: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno al crear el destino',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //---------------------------------------------------------

    /**
     * Update the specified resource in storage.
     * Actualiza el recurso especificado en la base de datos.
     */
    public function update(Request $request, string $id)
    {
        // 1. Validar los datos de entrada
        // Usamos 'sometimes' para que el campo solo se valide si está presente en el request.
        // Pero mantenemos 'required' para asegurar que si se envía, cumpla con el tipo.
        $validatedData = $request->validate(
            [
                'Destinos_Nombre'    => 'sometimes|required|string|max:255',
                'Destinos_Latitud'   => 'sometimes|required|numeric',
                'Destinos_Longitud'  => 'sometimes|required|numeric',
                'Destinos_Estatus'   => 'sometimes|required|boolean',
                'Destinos_UsuarioID' => 'sometimes|required|integer|min:1',
                // 'Destinos_Fecha' usualmente no se actualiza manualmente.
            ],
            // Mensajes personalizados (solo he incluido los nuevos)
            [
                'sometimes' => 'El campo :attribute es obligatorio si se intenta actualizar.',
            ]
        );

        try {
            // 2. Buscar el destino por su llave primaria
            $destino = Destinos::find($id);

            // Si no se encuentra el destino, devolver 404
            if (!$destino) {
                return response()->json([
                    'message' => 'Destino no encontrado'
                ], 404);
            }

            // 3. Actualizar el destino con los datos validados
            $destino->update($validatedData);

            // 4. Devolver respuesta exitosa
            return response()->json([
                'message' => 'Destino actualizado con éxito',
                'data' => $destino
            ], 200);
        } catch (\Exception $e) {
            // Log::error("Error al actualizar destino ID {$id}: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno al actualizar el destino',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
