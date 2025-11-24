<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Models\Admin\User;
use App\Models\Catalogos\ChoferUnidadAsignar;
use App\Models\Catalogos\IncidenciasMovimiento;
use App\Models\Catalogos\Movimientos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RegistroEntradaController extends Controller
{



    // public function store(Request $request)
    // {

    //     try {

    //         $user = $request->user();

    //         $asignacion = ChoferUnidadAsignar::where('CUA_estatus', 1)
    //             ->latest('CUA_fechaAsignacion')
    //             ->first();

    //         $datosMovimiento = [
    //             'Movimientos_fecha'         => Carbon::now()->format('Ymd H:i:s'),
    //             'Movimientos_tipoMovimiento' => $request->movementType,
    //             'Movimientos_asignacionID'  => $asignacion->CUA_asignacionID, // ID de la Asignación
    //             'Movimientos_kilometraje'   => $request->kilometers,
    //             'Movimientos_combustible'   => $request->combustible,
    //             'Movimientos_observaciones' => $request->observation,
    //             'Movimientos_usuarioID'     => $user->Personas_usuarioID,
    //         ];

    //         // Crea el Movimiento
    //         $movimiento = Movimientos::create($datosMovimiento);


    //         foreach ($request->checklist as $list) {

    //             $datosMovimiento = [
    //                 'IncidenciasMovimiento_movimientoID' => $movimiento->Movimientos_movimientoID,
    //                 'IncidenciasMovimiento_listaID' => $list['id'],
    //                 'IncidenciasMovimiento_usuarioID'  => 1,
    //                 'IncidenciasMovimiento_observaciones' => $list['observacion'],
    //             ];

    //             $Incedencias = IncidenciasMovimiento::create($datosMovimiento);
    //         }

    //         // 5. **Respuesta Exitosa**
    //         return response()->json([
    //             'message' => 'Asignación de unidad y chófer y Movimiento creados exitosamente.',
    //             'asignacion' => $asignacion,
    //             'movimiento' => $movimiento
    //         ], 201);
    //     } catch (\Exception $e) {
    //         // Manejo de error para detectar el problema de fecha
    //         $errorMessage = $e->getMessage();

    //         if (strpos($errorMessage, 'SQLSTATE[22007]') !== false) {
    //             $errorMessage = 'Error de formato de fecha/hora. La base de datos no aceptó el valor para la columna de fecha. Por favor, verifique el formato.';
    //         }

    //         return response()->json([
    //             'message' => 'Ocurrió un error al intentar guardar la asignación.',
    //             'error' => $errorMessage
    //         ], 500);
    //     }
    // }
    public function store(Request $request)
    {
        try {
            $user = $request->user();

            // 1. Obtiene la asignación activa (estatus 1)
            $asignacion = ChoferUnidadAsignar::where('CUA_estatus', 1)
                ->latest('CUA_fechaAsignacion')
                ->where('CUA_unidadID', $request->unit)
                ->first();

            // **Añadir una verificación para $asignacion para evitar un error si no se encuentra**
            if (!$asignacion) {
                return response()->json([
                    'message' => 'No se encontró una asignación de unidad y chófer activa (CUA_estatus = 1).',
                ], 404);
            }

            // 2. Prepara y crea el Movimiento
            $datosMovimiento = [
                'Movimientos_fecha'          => Carbon::now()->format('Ymd H:i:s'),
                'Movimientos_tipoMovimiento' => $request->movementType,
                'Movimientos_asignacionID'   => $asignacion->CUA_asignacionID, // ID de la Asignación
                'Movimientos_kilometraje'    => $request->kilometers,
                'Movimientos_combustible'    => $request->combustible,
                'Movimientos_observaciones'  => $request->observation,
                'Movimientos_usuarioID'      => $user->Personas_usuarioID,
            ];

            $movimiento = Movimientos::create($datosMovimiento);

            // 3. Crea las Incidencias del Movimiento
            foreach ($request->checklist as $list) {

                $datosIncidencia = [
                    'IncidenciasMovimiento_movimientoID'  => $movimiento->Movimientos_movimientoID,
                    'IncidenciasMovimiento_listaID'       => $list['id'],
                    // Se cambió 'IncidenciasMovimiento_usuarioID' a $user->Personas_usuarioID, asumiendo que el usuario actual es quien registra.
                    'IncidenciasMovimiento_usuarioID'     => $user->Personas_usuarioID,
                    'IncidenciasMovimiento_observaciones' => $list['observacion'],
                ];

                $Incedencias = IncidenciasMovimiento::create($datosIncidencia);
            }

            // 4. **ACTUALIZACIÓN CLAVE: Cambia el estatus de la asignación a 0**
            $asignacion->update(['CUA_estatus' => 0]);


            // $unidad->CUA_unidadID = $unidad->Unidades_unidadID;
            // $unidad->CUA_choferID = null;
            // $unidad->CUA_destino = null;
            // $unidad->CUA_motivoID = null;

            $datosAsignacion = [
                'CUA_unidadID'             => $asignacion->CUA_unidadID,
                'CUA_choferID'             => null,
                'CUA_ayudanteID'        => null,
                'CUA_motivoID'             => null,
                'CUA_destino'             => null,
                'CUA_estatus'             => 1, // Asumiendo que 1 es 'ACTIVO'
                'CUA_fechaAsignacion'     => Carbon::now()->format('Ymd H:i:s'),
            ];

            // 5. Guardar en la base de datos
            // Asegúrate de que ChoferUnidadAsignar::create() maneje bien los valores 'null'
            // y de que el modelo tenga el array $fillable configurado
            ChoferUnidadAsignar::create($datosAsignacion);

            // 5. **Respuesta Exitosa**
            return response()->json([
                'message' => 'Movimiento creado exitosamente y asignación de unidad y chófer finalizada.',
                'asignacion' => $asignacion,
                'movimiento' => $movimiento
            ], 201);
        } catch (\Exception $e) {
            // Manejo de error para detectar el problema de fecha
            $errorMessage = $e->getMessage();

            if (strpos($errorMessage, 'SQLSTATE[22007]') !== false) {
                $errorMessage = 'Error de formato de fecha/hora. La base de datos no aceptó el valor para la columna de fecha. Por favor, verifique el formato.';
            }

            return response()->json([
                'message' => 'Ocurrió un error al intentar guardar el movimiento y finalizar la asignación.',
                'error' => $errorMessage
            ], 500);
        }
    }

    // public function changesswho(Request $request)
    // {

    //         $datos_a_procesar = $request->input('quienconquien');

    //         if (empty($datos_a_procesar)) {
    //             return redirect()->back()->with('warning', 'No se recibieron datos para procesar.');
    //         }

    //         try {
    //             DB::transaction(function () use ($datos_a_procesar) {

    //                 collect($datos_a_procesar)->map(function ($item) {

    //                     $datosAsignacion = [
    //                         'CUA_unidadID'   => (int)($item['CUA_unidadID'] ?? 0),
    //                         'CUA_choferID'   => (int)($item['CUA_choferID'] ?? 0),
    //                         'CUA_ayudanteID' => (int)($item['CUA_ayudanteID'] ?? 0),
    //                         'CUA_motivoID'   => (int)($item['CUA_motivoID'] ?? 0),
    //                         'CUA_destino'    => $item['CUA_destino'] ?? '',
    //                         'CUA_estatus'    => 1,
    //                     ];

    //                     ChoferUnidadAsignar::create($datosAsignacion);
    //                 });
    //             });

    //             return redirect()->back()->with('success', 'Las asignaciones se han procesado correctamente.');
    //         } catch (\Exception $e) {
    //             // En un entorno real, registra el error ($e->getMessage())
    //             return redirect()->back()->with('error', 'Hubo un error al procesar las asignaciones: ' . $e->getMessage());
    //         }
    // }

    public function changesswho(Request $request)
    {
        // 1. Obtener los datos del request
        $quienConQuien = $request->input('quienconquien');

        if (!is_null($quienConQuien) && is_array($quienConQuien)) {

            // 2. Iterar sobre la lista de unidades
            foreach ($quienConQuien as $unidad) {

                // 3. Extraer los datos necesarios del arreglo actual
                $unidadID = $unidad['CUA_unidadID'];

                // Usamos el operador de fusión de null (??)
                $choferID = $unidad['CUA_choferID'] ?? null;
                $destino = $unidad['CUA_destino'] ?? null;
                $motivoID = $unidad['CUA_motivoID'] ?? null;
                $ayudanteID = null;

                // 🌟 4. VERIFICACIÓN DE EXISTENCIA 
                // Buscar una asignación existente y activa (CUA_estatus = 1) para esta unidad.
                $asignacionExistente = ChoferUnidadAsignar::where('CUA_unidadID', $unidadID)
                    ->where('CUA_estatus', 1)
                    ->first();

                 // Si se encuentra una asignación activa, se omite y pasa a la siguiente unidad.
                if ($asignacionExistente) {
                    // Puedes agregar un log aquí si deseas registrar las unidades omitidas
                    // \Log::info("Asignación activa ya existe para la Unidad ID: " . $unidadID);
                    continue; // Salta al siguiente elemento del bucle `foreach`
                }

                // Si no hay una asignación activa, procede a crear la nueva.

                // 5. Crear el arreglo de datos para la asignación
                $datosAsignacion = [
                    'CUA_unidadID'           => $unidadID,
                    'CUA_choferID'           => $choferID,
                    'CUA_ayudanteID'         => $ayudanteID,
                    'CUA_motivoID'           => $motivoID,
                    'CUA_destino'            => $destino,
                    'CUA_estatus'            => 1, // Asumiendo que 1 es 'ACTIVO'
                    'CUA_fechaAsignacion'    => Carbon::now()->format('Ymd H:i:s'),
                ];

                // 6. Guardar en la base de datos
                ChoferUnidadAsignar::create($datosAsignacion);
            }

            // Devolver una respuesta JSON de éxito al final de la iteración
            return response()->json(['success' => true, 'message' => 'Asignaciones procesadas correctamente. Las unidades con asignaciones activas existentes fueron omitidas.']);
        } else {
            // Devolver una respuesta JSON de error
            return response()->json(['success' => false, 'message' => 'No se encontró la clave "quienconquien" o no es un arreglo válido.'], 400);
        }
    }


    public function getUltimosMovimientosUnidad(Request $request)
    {
        try {
            // Obtener el unidadID desde el cuerpo de la solicitud (POST)
            $unidadID = $request->input('unidadID');

            // Validar que el unidadID esté presente
            if (empty($unidadID)) {
                return response()->json([
                    'message' => 'El campo unidadID es obligatorio.',
                ], 400); // 400 Bad Request
            }

            // 1. Obtener los IDs de las asignaciones para esa unidad
            $assignmentIds = ChoferUnidadAsignar::where('CUA_unidadID', $unidadID)
                ->pluck('CUA_asignacionID');

            if ($assignmentIds->isEmpty()) {
                return response()->json([
                    'message' => 'No se encontraron asignaciones para la unidad ' . $unidadID,
                    'data' => []
                ], 200);
            }

            // 2. Obtener los últimos 5 movimientos relacionados con esas asignaciones
            // $movimientos = Movimientos::whereIn('Movimientos_asignacionID', $assignmentIds)
            //     ->orderBy('Movimientos_fecha', 'desc')
            //     ->limit(5)
            //     ->get();

            $movimientos = DB::table('dbo.Movimientos')
                ->select(
                    'Movimientos.Movimientos_fecha',
                    'Movimientos.Movimientos_tipoMovimiento',
                    'Movimientos.Movimientos_kilometraje',
                    'Movimientos.Movimientos_combustible',

                    'Movimientos.Movimientos_usuarioID',
                    DB::raw("CONCAT(Personas.Personas_nombres, ' ', Personas.Personas_apPaterno) AS nombre_chofer"),
                    'Unidades.Unidades_placa',
                    'Unidades.Unidades_modelo',
                    'Unidades.Unidades_numeroEconomico',
                    'Motivos.Motivos_nombre',
                    'Destinos.Destinos_Nombre'
                )
                ->join('dbo.ChoferUnidadAsignada', 'Movimientos.Movimientos_asignacionID', '=', 'ChoferUnidadAsignada.CUA_asignacionID')
                ->join('dbo.Personas', 'ChoferUnidadAsignada.CUA_choferID', '=', 'Personas.Personas_usuarioID')
                ->join('dbo.Unidades', 'ChoferUnidadAsignada.CUA_unidadID', '=', 'Unidades.Unidades_unidadID')
                ->join('dbo.Motivos', 'ChoferUnidadAsignada.CUA_motivoID', '=', 'Motivos.Motivos_motivoID')
                ->join('dbo.Destinos', 'ChoferUnidadAsignada.CUA_destino', '=', 'Destinos.Destinos_Id')
                ->orderBy('Movimientos.Movimientos_fecha', 'DESC')

                ->whereIn('Movimientos_asignacionID', $assignmentIds)
                ->limit(5)
                ->get();


            return response()->json($movimientos, 200);
        } catch (\Exception $e) {
            // Log del error para facilitar la depuración
            // \Log::error("Error al obtener movimientos para unidad $unidadID: " . $e->getMessage()); 

            return response()->json([
                'message' => 'Error al intentar obtener los movimientos de la unidad.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
