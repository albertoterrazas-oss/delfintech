<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Models\Catalogos\ChoferUnidadAsignar;
use App\Models\Catalogos\IncidenciasMovimiento;
use App\Models\Catalogos\Movimientos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RegistroEntradaController extends Controller
{



    public function store(Request $request)
    {

        try {

            // Preparar datos de la Asignación
            $datosAsignacion = $request->only([
                'CUA_unidadID',
                'CUA_choferID',
                'CUA_ayudanteID',
                'CUA_motivoID',
                'CUA_destino',
                'CUA_estatus'
            ]);

            $datosAsignacion['CUA_unidadID'] = $request->unit;
            $datosAsignacion['CUA_choferID'] = $request->driver;
            $datosAsignacion['CUA_ayudanteID'] = $request->driver;
            $datosAsignacion['CUA_motivoID'] = $request->motive;
            $datosAsignacion['CUA_destino'] = $request->destination;
            $datosAsignacion['CUA_estatus'] = 1;


            // 3. **Creación del Registro de Asignación**
            $asignacion = ChoferUnidadAsignar::create($datosAsignacion);

            // 4. **Creación del Registro de Movimientos**
            // Se usa el ID de la Asignación para la tabla Movimientos
            $datosMovimiento = [
                // Usamos la fecha actual (o la misma de la asignación, si es el caso)
                'Movimientos_fecha'         => Carbon::now()->format('Ymd H:i:s'),
                'Movimientos_tipoMovimiento' => $request->movementType,
                'Movimientos_asignacionID'  => $asignacion->CUA_asignacionID, // ID de la Asignación
                'Movimientos_kilometraje'   => $request->kilometers,
                'Movimientos_combustible'   => $request->combustible,
                'Movimientos_observaciones' => $request->observation,
                'Movimientos_usuarioID'     => 1,
                // Asegúrate de incluir aquí cualquier otro campo que Movimientos requiera
            ];

            // Crea el Movimiento
            $movimiento = Movimientos::create($datosMovimiento);


            foreach ($request->checklist as $list) {

                $datosMovimiento = [
                    'IncidenciasMovimiento_movimientoID' => $movimiento->Movimientos_movimientoID,
                    'IncidenciasMovimiento_listaID' => $list['id'],
                    'IncidenciasMovimiento_usuarioID'  => 1,
                    'IncidenciasMovimiento_observaciones' => $list['observacion'],
                ];

                $Incedencias = IncidenciasMovimiento::create($datosMovimiento);
            }

            // 5. **Respuesta Exitosa**
            return response()->json([
                'message' => 'Asignación de unidad y chófer y Movimiento creados exitosamente.',
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
                'message' => 'Ocurrió un error al intentar guardar la asignación.',
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
        $datos_a_procesar = $request->input('quienconquien');

        if (empty($datos_a_procesar)) {
            return redirect()->back()->with('warning', 'No se recibieron datos para procesar.');
        }

        try {
            $registros_creados = 0;

            DB::transaction(function () use ($datos_a_procesar, &$registros_creados) {

                collect($datos_a_procesar)->map(function ($item) use (&$registros_creados) {

                    // 1. Preprocesar y validar los campos requeridos
                    $unidadID = (int)($item['CUA_unidadID'] ?? 0);
                    $choferID = (int)($item['CUA_choferID'] ?? 0);
                    $motivoID = (int)($item['CUA_motivoID'] ?? 0);
                    $destino = trim($item['CUA_destino'] ?? ''); // Limpiar el destino

                    // 2. 🟢 Validación estricta: Se requiere Unidad (>0), Chofer (>0), Motivo (>0) y Destino (no vacío)
                    if ($unidadID > 0 && $choferID > 0 && $motivoID > 0 && !empty($destino)) {

                        // El ayudante (CUA_ayudanteID) puede ser 0 si no es obligatorio.
                        $ayudanteID = (int)($item['CUA_ayudanteID'] ?? 0);

                        $datosAsignacion = [
                            'CUA_unidadID'   => $unidadID,
                            'CUA_choferID'   => $choferID,
                            'CUA_ayudanteID' => $ayudanteID,
                            'CUA_motivoID'   => $motivoID,
                            'CUA_destino'    => $destino,
                            'CUA_estatus'    => 1,
                        ];

                        ChoferUnidadAsignar::create($datosAsignacion);
                        $registros_creados++;
                    }
                });
            });

            // 3. Devolver la respuesta adecuada
            if ($registros_creados > 0) {
                return redirect()->back()->with('success', "Se procesaron correctamente $registros_creados asignaciones completas.");
            } else {
                return redirect()->back()->with('warning', 'No se encontraron asignaciones con la Unidad, Chofer, Motivo y Destino completos para procesar.');
            }
        } catch (\Exception $e) {
            // En un entorno real, registra el error ($e->getMessage())
            return redirect()->back()->with('error', 'Hubo un error al procesar las asignaciones: ' . $e->getMessage());
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
            $movimientos = Movimientos::whereIn('Movimientos_asignacionID', $assignmentIds)
                ->orderBy('Movimientos_fecha', 'desc')
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
