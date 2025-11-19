<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Models\Catalogos\ChoferUnidadAsignar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Catalogos\Unidades; // Importar el modelo de Unidades
use Carbon\Carbon;

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
            'Unidades_estatus' => 'required',
            // CAMBIADO: Ahora es requerido y debe tener formato datetime completo para SQL Server
            // 'Unidades_fechaCreacion' => 'required|date_format:Y-m-d H:i:s',
            // 'Unidades_usuarioID' => 'required|integer',
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
            // 'Unidades_estatus.required' => 'El estatus de la unidad es obligatorio.',
            // 'Unidades_fechaCreacion.required' => 'La fecha de creación es obligatoria.',
            // 'Unidades_usuarioID.required' => 'El ID del usuario es obligatorio.',
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
    // public function store(Request $request)
    // {
    //     $rules = $this->getValidationRules();
    //     $messages = $this->getValidationMessages();
    //     $user = $request->user();

    //     $validator = Validator::make($request->all(), $rules, $messages);
    //     $validatedData['Unidades_usuarioID'] = $user->Personas_usuarioID;

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 400);
    //     }

    //     try {
    //         // Obtenemos todos los datos (incluyendo, si es necesario, 'Unidades_usuarioID')
    //         $data = $request->all();

    //         $unidad = Unidades::create($data);

    //         return response()->json([
    //             'message' => 'Unidad creada exitosamente',
    //             'unidad' => $unidad
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Error al guardar la unidad. Verifique los tipos de datos.',
    //             'error_detail' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    public function store(Request $request)
    {
        // 1. Obtener reglas y mensajes
        $rules = $this->getValidationRules();
        $messages = $this->getValidationMessages();
        $user = $request->user();

        // 2. Ejecutar la validación
        $validator = Validator::make($request->all(), $rules, $messages);

        // 3. Manejar error de validación
        if ($validator->fails()) {
            // Retorna errores de validación con código 400
            return response()->json($validator->errors(), 400);
        }

        try {

            $validatedData = $validator->validated();
            $validatedData['Unidades_usuarioID'] = $user->Personas_usuarioID;
            $validatedData['Unidades_fechaCreacion'] = Carbon::now()->format('Ymd H:i:s');
            $unidad = Unidades::create($validatedData);

            // 6. Respuesta exitosa
            return response()->json([
                'message' => 'Unidad creada exitosamente',
                'unidad' => $unidad
            ], 201);
        } catch (\Exception $e) {
            // 7. Manejar error de la base de datos o inesperado
            return response()->json([
                'message' => 'Error al guardar la unidad. Verifique los tipos de datos o campos de la base de datos.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        // 1. Encontrar la unidad o fallar (manejo implícito de 404)
        // Cambiamos find($id) por findOrFail($id) para un código más limpio.
        $unidad = Unidades::findOrFail($id);

        // 2. Obtener reglas y mensajes de validación
        $rules = $this->getValidationRules();
        $messages = $this->getValidationMessages();

        // **AJUSTE CRÍTICO 1: Modificación de reglas para la actualización**

        // a) Eliminar reglas de campos que NO deben ser actualizados
        // (Ej: ID de usuario y fecha de creación).
        unset($rules['Unidades_usuarioID'], $rules['Unidades_fechaCreacion']);

        // b) Aplicar 'sometimes' a todas las reglas restantes
        // Reemplazamos la lógica compleja de array_map con una función más robusta.
        $updateRules = [];
        foreach ($rules as $field => $rule) {
            // Aseguramos que 'required' se reemplace por 'sometimes', 
            // y que 'sometimes' esté presente sin importar la posición inicial de 'required'.
            $modifiedRule = str_replace('required', 'sometimes', $rule);
            if (!str_contains($modifiedRule, 'sometimes')) {
                $modifiedRule = 'sometimes|' . $modifiedRule;
            }
            $updateRules[$field] = $modifiedRule;
        }

        // 3. Ejecutar la validación (solo sobre los datos que se enviaron)
        $validator = Validator::make($request->all(), $updateRules, $messages);

        if ($validator->fails()) {
            // Retorna 400 Bad Request con los errores de validación
            return response()->json($validator->errors(), 400);
        }

        // 4. Procesar y guardar
        try {
            // Obtenemos solo los datos validados para evitar campos no deseados
            $validatedData = $validator->validated();

            // Llenar y guardar la unidad. Solo se actualizan los campos presentes y validados.
            $unidad->fill($validatedData);
            $unidad->save(); // Eloquent maneja Unidades_fechaModificacion automáticamente.

            // 5. Respuesta exitosa
            return response()->json([
                'message' => 'Unidad actualizada exitosamente',
                'unidad' => $unidad
            ], 200);
        } catch (\Exception $e) {
            // 6. Manejo de errores de base de datos o inesperados
            return response()->json([
                'message' => 'Error al actualizar la unidad. Ocurrió un error inesperado.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        $unidad = Unidades::find($id);

        if (!$unidad) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Unidad no encontrada'], 404);
        }

        return response()->json($unidad);
    }

    public function DashboardUnidad(Request $request)
    {
        $ultimas5Unidades = Unidades::latest()->limit(5)->get();
    }


    public function QuienconQuienUnidades(Request $request)
    {
        // Obtiene la fecha actual en formato 'Y-m-d'
        $today = now()->toDateString();



        $unidadesDeHoy = ChoferUnidadAsignar::whereDate('CUA_fechaAsignacion', $today)
            ->select('CUA_unidadID', 'CUA_choferID', 'CUA_destino', 'CUA_motivoID', 'CUA_fechaAsignacion')
            ->with([
                'unidad' => function ($query) {
                    $query->select('Unidades_unidadID', 'Unidades_numeroEconomico'); // Ajusta 'Unidades_unidadID' si es la PK real
                }
            ])
            ->where('CUA_estatus', 1)
            ->get();


        $unidadesDeHoy = ChoferUnidadAsignar::whereDate('CUA_fechaAsignacion', $today)
            ->join('dbo.Unidades', 'dbo.ChoferUnidadAsignada.CUA_unidadID', '=', 'Unidades.Unidades_unidadID')
            ->select(
                'dbo.ChoferUnidadAsignada.CUA_unidadID',
                'dbo.ChoferUnidadAsignada.CUA_choferID',
                'dbo.ChoferUnidadAsignada.CUA_destino',
                'dbo.ChoferUnidadAsignada.CUA_motivoID',
                'dbo.ChoferUnidadAsignada.CUA_fechaAsignacion',
                'Unidades.Unidades_numeroEconomico'
            )
            ->where('dbo.ChoferUnidadAsignada.CUA_estatus', 1)
            ->get();

        // Verifica si no se encontró ninguna asignación para hoy
        if ($unidadesDeHoy->isEmpty()) {
            // Si la colección está vacía, devuelve todas las unidades
            $todasLasUnidades = Unidades::get();

            // Agrega el nuevo campo 'CUA_unidadID' con el valor del campo 'Unidades_unidadID'
            $todasLasUnidades = $todasLasUnidades->map(function ($unidad) {
                $unidad->CUA_unidadID = $unidad->Unidades_unidadID;
                $unidad->CUA_choferID = null;
                $unidad->CUA_destino = null;
                $unidad->CUA_motivoID = null;


                return $unidad;
            });

            return response()->json($todasLasUnidades); // ⬅️ Add final return
        }

        // Si hay asignaciones para hoy, devuelve esas asignaciones
        return response()->json($unidadesDeHoy);
    }


    public function QuienconQuienControl(Request $request)
    {
        $today = now()->toDateString();

        $unidadesCompletasDeHoy = ChoferUnidadAsignar::whereDate('CUA_fechaAsignacion', $today)
            // Agregamos las condiciones whereNotNull para forzar que las columnas tengan valor
            ->whereNotNull('dbo.ChoferUnidadAsignada.CUA_choferID')
            ->whereNotNull('dbo.ChoferUnidadAsignada.CUA_destino')
            ->whereNotNull('dbo.ChoferUnidadAsignada.CUA_motivoID')

            // Resto de tu consulta
            ->join('dbo.Unidades', 'dbo.ChoferUnidadAsignada.CUA_unidadID', '=', 'Unidades.Unidades_unidadID')
            ->select(
                'dbo.ChoferUnidadAsignada.CUA_unidadID',
                'dbo.ChoferUnidadAsignada.CUA_choferID',
                'dbo.ChoferUnidadAsignada.CUA_destino',
                'dbo.ChoferUnidadAsignada.CUA_motivoID',
                'dbo.ChoferUnidadAsignada.CUA_fechaAsignacion',
                'Unidades.Unidades_numeroEconomico'
            )
            ->where('dbo.ChoferUnidadAsignada.CUA_estatus', 1)
            ->get(); // Solo se obtienen las unidades completas

        return $unidadesCompletasDeHoy;
    }
}
