<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Catalogos\Unidades; // Importar el modelo de Unidades

class UnidadesController extends Controller
{
    /**
     * Define las reglas de validación comunes (CREATE/STORE)
     * AJUSTADO PARA COINCIDIR CON EL ESQUEMA ESTRICTO DE SQL SERVER (INT/DATETIME) y para ser todos campos OBLIGATORIOS.
     */
    private function getValidationRules()
    {
        return [
            'Unidades_numeroEconomico' => 'required|string|max:100',
            'Unidades_numeroSerie' => 'required|string|max:255',
            'Unidades_modelo' => 'required|string|max:255',
            'Unidades_placa' => 'required|string|max:20',
            // El año es un entero y ahora es requerido
            'Unidades_ano' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            // AJUSTADO: Debe ser 'integer' para coincidir con la columna INT de SQL Server
            'Unidades_kilometraje' => 'required|integer|min:0',
            // CAMBIADO: Ahora es requerido y debe ser 'integer'
            'Unidades_mantenimiento' => 'required|integer',
            // REQUERIDO y debe ser string
            'Unidades_estatus' => 'required|string|max:50',
            // CAMBIADO: Ahora es requerido y debe tener formato datetime completo para SQL Server
            'Unidades_fechaCreacion' => 'required|date_format:Y-m-d H:i:s',
            'Unidades_usuarioID' => 'required|integer',
        ];
    }

    /**
     * Define los mensajes de error en español
     */
    private function getValidationMessages()
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser texto.',
            // Mensaje más específico para los campos INT
            'integer' => 'El campo :attribute debe ser un número entero (no se aceptan decimales).',
            'numeric' => 'El campo :attribute debe ser un número válido.',
            'date_format' => 'El campo :attribute no tiene el formato de fecha y hora esperado (YYYY-MM-DD HH:MM:SS).',
            'max' => 'El campo :attribute no debe exceder los :max caracteres.',
            'min' => 'El campo :attribute debe ser al menos :min.',

            // Mensajes específicos para mejor claridad
            'Unidades_numeroEconomico.required' => 'El número económico de la unidad es obligatorio.',
            'Unidades_numeroSerie.required' => 'El número de serie de la unidad es obligatorio.',
            'Unidades_modelo.required' => 'El modelo de la unidad es obligatorio.',
            'Unidades_placa.required' => 'La placa de la unidad es obligatoria.',
            'Unidades_ano.required' => 'El año de la unidad es obligatorio.',
            'Unidades_kilometraje.required' => 'El kilometraje de la unidad es obligatorio.',
            'Unidades_mantenimiento.required' => 'El mantenimiento es obligatorio y debe ser un código numérico entero.',
            'Unidades_estatus.required' => 'El estatus de la unidad es obligatorio.',
            'Unidades_fechaCreacion.required' => 'La fecha de creación es obligatoria.',
            'Unidades_usuarioID.required' => 'El ID del usuario es obligatorio.',
        ];
    }

    /**
     * Obtiene y muestra un listado de todos los recursos (Unidades).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $unidades = Unidades::all();
        return response()->json($unidades);
    }

    /**
     * Almacena un recurso recién creado en el almacenamiento.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $rules = $this->getValidationRules();
        $messages = $this->getValidationMessages();

        // 1. Asegúrate de que tu validación NO requiere Unidades_fechaCreacion
        // ya que será provista por el servidor.
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            // Obtenemos todos los datos (incluyendo, si es necesario, 'Unidades_usuarioID')
            $data = $request->all();

            // Si el cliente accidentalmente manda 'Unidades_fechaCreacion',
            // Eloquent lo ignorará porque el campo no está en $fillable. 
            // No se necesita el unset() en este caso, pero puede ser una capa de seguridad extra.

            // 2. Crear la unidad: Eloquent establecerá automáticamente Unidades_fechaCreacion
            $unidad = Unidades::create($data);

            return response()->json([
                'message' => 'Unidad creada exitosamente',
                'unidad' => $unidad
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar la unidad. Verifique los tipos de datos.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Muestra el recurso (Unidad) especificado.
     *
     * @param  string  $id El ID de la unidad (Unidades_unidadID)
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        $unidad = Unidades::find($id);

        if (!$unidad) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Unidad no encontrada'], 404);
        }

        return response()->json($unidad);
    }

    /**
     * Actualiza el recurso (Unidad) especificado en el almacenamiento.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id El ID de la unidad (Unidades_unidadID)
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $unidad = Unidades::find($id);

        if (!$unidad) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Unidad no encontrada'], 404);
        }

        // 1. Obtener reglas de validación base
        $rules = $this->getValidationRules();

        // **AJUSTE CRÍTICO 1:** Eliminar la regla de validación de la fecha de creación.
        // Este campo es gestionado por el servidor y no debe ser actualizado por el cliente.
        if (isset($rules['Unidades_fechaCreacion'])) {
            unset($rules['Unidades_fechaCreacion']);
        }

        // 2. Aplicar 'sometimes' a todas las reglas restantes para la actualización parcial
        $updateRules = array_map(function ($rule) {
            // Reemplaza 'required' con 'sometimes', o asegura que 'sometimes' esté al inicio
            $modifiedRule = str_replace('required', 'sometimes', $rule);

            if (!str_contains($modifiedRule, 'sometimes')) {
                $modifiedRule = 'sometimes|' . $modifiedRule;
            }
            return $modifiedRule;
        }, $rules);

        $messages = $this->getValidationMessages();

        $validator = Validator::make($request->all(), $updateRules, $messages);

        if ($validator->fails()) {
            // Retorna 400 Bad Request con los errores de validación
            return response()->json($validator->errors(), 400);
        }

        try {
            $data = $request->all();

            // **AJUSTE CRÍTICO 2:** Eliminar cualquier intento de actualizar la fecha de creación.
            // Esto asegura que el campo no se envíe a Eloquent si el cliente lo incluyó.
            if (isset($data['Unidades_fechaCreacion'])) {
                unset($data['Unidades_fechaCreacion']);
            }
            // NOTA: Toda la lógica de re-formateo de fechas con \DateTime se ELIMINÓ
            // ya que Unidades_fechaCreacion no se actualiza, y Unidades_fechaModificacion
            // (UPDATED_AT) es manejado automáticamente por Eloquent.

            // Llenar y guardar la unidad. Solo se actualizan los campos presentes en el request.
            $unidad->fill($data);
            $unidad->save(); // Eloquent establece Unidades_fechaModificacion (UPDATED_AT) automáticamente.

            // Retorna 200 OK con mensaje de éxito
            return response()->json([
                'message' => 'Unidad actualizada exitosamente',
                'unidad' => $unidad
            ], 200);
        } catch (\Exception $e) {
            // Manejo de errores de base de datos
            return response()->json([
                'message' => 'Error al actualizar la unidad. Ocurrió un error en la base de datos.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina el recurso (Unidad) especificado del almacenamiento.
     *
     * @param  string  $id El ID de la unidad (Unidades_unidadID)
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        $unidad = Unidades::find($id);

        if (!$unidad) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Unidad no encontrada'], 404);
        }

        $unidad->delete();

        // Retorna 200 OK con mensaje de éxito
        return response()->json(['message' => 'Unidad eliminada exitosamente'], 200);
    }

    // Los métodos 'create' y 'edit' se dejan vacíos ya que son típicamente para interfaces web (no API REST).
    public function create()
    {
        //
    }

    public function edit(string $id)
    {
        //
    }
}
