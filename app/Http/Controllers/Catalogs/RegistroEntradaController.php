<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Mail\ConfiguracionCorreo;
use App\Models\Admin\User;
use App\Models\Catalogos\ChoferUnidadAsignar;
use App\Models\Catalogos\CorreoNotificacion;
use App\Models\Catalogos\IncidenciasMovimiento;
use App\Models\Catalogos\ListaVerificacion;
use App\Models\Catalogos\Movimientos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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


            // $incidenciasGuardadas = [];
            // foreach ($request->checklist as $list) {
            //     $datosIncidencia = [
            //         'IncidenciasMovimiento_movimientoID'  => $movimiento->Movimientos_movimientoID,
            //         'IncidenciasMovimiento_listaID'       => $list['id'],
            //         'IncidenciasMovimiento_usuarioID'     => $user->Personas_usuarioID,
            //         'IncidenciasMovimiento_observaciones' => $list['observacion'],
            //     ];

            //     $Incedencia = IncidenciasMovimiento::create($datosIncidencia);


            //     $lista = ListaVerificacion::find($list['id']);
            //     dd($lista);

            //     $Incedencia = $lista
            //     // $ListaVerificacion
            //     $incidenciasGuardadas[] = $Incedencia;
            // }

            $incidenciasGuardadas = [];
            foreach ($request->checklist as $list) {
                // 1. Prepara los datos para la nueva incidencia
                $datosIncidencia = [
                    'IncidenciasMovimiento_movimientoID'  => $movimiento->Movimientos_movimientoID,
                    'IncidenciasMovimiento_listaID'      => $list['id'],
                    'IncidenciasMovimiento_usuarioID'    => $user->Personas_usuarioID,
                    'IncidenciasMovimiento_observaciones' => $list['observacion'],
                ];

                $incidencia = IncidenciasMovimiento::create($datosIncidencia);
                $lista = ListaVerificacion::find($list['id']);
                $incidencia->listaVerificacion = $lista;
                $incidenciasGuardadas[] = $incidencia;
            }

            $this->configEmail();

            $Correos = CorreoNotificacion::all(); // Obtiene los correos de notificación

            $Datos = (object) [
                "Titulo" => "CORREO DE INCIDENCIAS",
                "Incidencias" => $incidenciasGuardadas,
            ];

            foreach ($Correos as $correo) {
                $destinatario = $correo->correoNotificaciones_correo;
                Mail::to($destinatario)->send(new ConfiguracionCorreo($Datos));
            }


            if ($request->movementType == "ENTRADA") {
                $asignacion->update([
                    'CUA_estatus' => 0 // 0 = INACTIVO/FINALIZADO
                ]);

                // Si realmente quieres crear un registro para la 'Entrada' con estatus 1:
                $datosAsignacion = [
                    'CUA_unidadID'        => $asignacion->CUA_unidadID, // Usar la ID de la asignación anterior
                    'CUA_choferID'        => null,
                    'CUA_ayudanteID'      => null,
                    'CUA_motivoID'        => null,
                    'CUA_destino'         => null,
                    'CUA_estatus'         => 1, // 1 = ACTIVO/EN PATIO/DISPONIBLE
                    'CUA_fechaAsignacion' => Carbon::now()->format('Ymd H:i:s')
                ];

                // Ejemplo de cómo guardar esta nueva asignación de 'Entrada' si usas un modelo:
                ChoferUnidadAsignar::create($datosAsignacion);
            }

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


    public function configEmail(): void
    {
        // 1. Obtener los valores de las variables de entorno.
        // Usamos env() para leer el .env directamente.

        $host = env('MAIL_HOST');
        $port = (int) env('MAIL_PORT'); // Asegurar que sea entero
        $username = env('MAIL_USERNAME');
        $password = env('MAIL_PASSWORD');
        // Laravel espera 'tls' o 'ssl' para encryption.
        $encryption = env('MAIL_ENCRYPTION', 'ssl');

        // 2. Obtener la plantilla de configuración actual para el mailer 'smtp'.
        $config = config('mail.mailers.smtp');

        // 3. Modificar los valores del mailer 'smtp' con los datos del .env.
        $config['host'] = $host;
        $config['port'] = $port;
        $config['username'] = $username;
        $config['password'] = $password;
        $config['encryption'] = $encryption;

        // 4. Crear el array de configuración del remitente ('from') desde el .env.
        $from = [
            'address' => env('MAIL_FROM_ADDRESS'),
            'name' => env('MAIL_FROM_NAME', 'DELFIN'), // Usamos 'DELFIN' como valor por defecto si no está en el .env
        ];

        // 5. Inyectar la configuración dinámica.

        // A. Sobrescribir el mailer 'smtp'
        config(['mail.mailers.smtp' => $config]);

        // B. Sobrescribir la dirección 'from' global
        config(['mail.from' => $from]);
    }
    // public function store(Request $request)
    // {
    //     try {
    //         $user = $request->user();

    //         // 1. Obtiene la asignación activa (estatus 1)
    //         $asignacion = ChoferUnidadAsignar::where('CUA_estatus', 1)
    //             ->latest('CUA_fechaAsignacion')
    //             ->where('CUA_unidadID', $request->unit)
    //             ->first();

    //         // **Añadir una verificación para $asignacion para evitar un error si no se encuentra**
    //         if (!$asignacion) {
    //             return response()->json([
    //                 'message' => 'No se encontró una asignación de unidad y chófer activa (CUA_estatus = 1).',
    //             ], 404);
    //         }

    //         // 2. Prepara y crea el Movimiento
    //         $datosMovimiento = [
    //             'Movimientos_fecha'          => Carbon::now()->format('Ymd H:i:s'),
    //             'Movimientos_tipoMovimiento' => $request->movementType,
    //             'Movimientos_asignacionID'   => $asignacion->CUA_asignacionID, // ID de la Asignación
    //             'Movimientos_kilometraje'    => $request->kilometers,
    //             'Movimientos_combustible'    => $request->combustible,
    //             'Movimientos_observaciones'  => $request->observation,
    //             'Movimientos_usuarioID'      => $user->Personas_usuarioID,
    //         ];

    //         $movimiento = Movimientos::create($datosMovimiento);

    //         // 3. Crea las Incidencias del Movimiento
    //         foreach ($request->checklist as $list) {

    //             $datosIncidencia = [
    //                 'IncidenciasMovimiento_movimientoID'  => $movimiento->Movimientos_movimientoID,
    //                 'IncidenciasMovimiento_listaID'       => $list['id'],
    //                 'IncidenciasMovimiento_usuarioID'     => $user->Personas_usuarioID,
    //                 'IncidenciasMovimiento_observaciones' => $list['observacion'],
    //             ];

    //             $Incedencias = IncidenciasMovimiento::create($datosIncidencia);
    //         }



    //         if ($request->movementType == "ENTRADA") {
    //             $asignacion->update([
    //                 'CUA_estatus' => 0 // 0 = INACTIVO/FINALIZADO
    //             ]);

    //             // Si realmente quieres crear un registro para la 'Entrada' con estatus 1:
    //             $datosAsignacion = [
    //                 'CUA_unidadID'        => $asignacion->CUA_unidadID, // Usar la ID de la asignación anterior
    //                 'CUA_choferID'        => null,
    //                 'CUA_ayudanteID'      => null,
    //                 'CUA_motivoID'        => null,
    //                 'CUA_destino'         => null,
    //                 'CUA_estatus'         => 1, // 1 = ACTIVO/EN PATIO/DISPONIBLE
    //                 'CUA_fechaAsignacion' => Carbon::now()->format('Y-m-d H:i:s'), // Formato estándar de MySQL
    //             ];

    //             // Ejemplo de cómo guardar esta nueva asignación de 'Entrada' si usas un modelo:
    //             ChoferUnidadAsignar::create($datosAsignacion);
    //         }

    //         // 5. **Respuesta Exitosa**
    //         return response()->json([
    //             'message' => 'Movimiento creado exitosamente y asignación de unidad y chófer finalizada.',
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
    //             'message' => 'Ocurrió un error al intentar guardar el movimiento y finalizar la asignación.',
    //             'error' => $errorMessage
    //         ], 500);
    //     }
    // }

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
        $quienConQuien = $request->input('quienconquien');
        $unidadesProcesadas = 0;
        $unidadesActualizadas = 0;
        $unidadesCreadas = 0;
        $unidadesIgnoradas = 0; // Contador para las unidades que no requieren cambio

        if (!is_null($quienConQuien) && is_array($quienConQuien)) {

            foreach ($quienConQuien as $unidad) {

                $unidadID = $unidad['CUA_unidadID'];
                $choferID = $unidad['CUA_choferID'] ?? null;
                $destino = $unidad['CUA_destino'] ?? null;
                $motivoID = $unidad['CUA_motivoID'] ?? null;
                $ayudanteID = $unidad['CUA_ayudanteID'] ?? null; // Asumiendo que ahora puede venir en el request

                // 1. Buscar la asignación ACTIVA existente para esta unidad.
                $asignacionExistente = ChoferUnidadAsignar::where('CUA_unidadID', $unidadID)
                    ->where('CUA_estatus', 1)
                    ->first();

                // 2. Si NO existe una asignación activa, la creamos directamente.
                if (!$asignacionExistente) {
                    $datosAsignacion = [
                        'CUA_unidadID'           => $unidadID,
                        'CUA_choferID'           => $choferID,
                        'CUA_ayudanteID'         => $ayudanteID,
                        'CUA_motivoID'           => $motivoID,
                        'CUA_destino'            => $destino,
                        'CUA_fechaAsignacion'    => Carbon::now()->format('Ymd H:i:s'),
                        'CUA_estatus'            => 1,
                    ];
                    ChoferUnidadAsignar::create($datosAsignacion);
                    $unidadesCreadas++;
                } else {
                    // 3. Si SÍ existe, verificamos si los datos entrantes son IDÉNTICOS.

                    // Convertimos los campos de la asignación existente a los tipos de datos correctos para la comparación, 
                    // asegurando que sean del mismo tipo que los entrantes (pueden ser strings o integers/nulls).
                    $choferExistente = (string)$asignacionExistente->CUA_choferID;
                    $destinoExistente = (string)$asignacionExistente->CUA_destino;
                    $motivoExistente = (string)$asignacionExistente->CUA_motivoID;
                    $ayudanteExistente = (string)$asignacionExistente->CUA_ayudanteID;

                    $datosEntrantes = [
                        'chofer' => (string)$choferID,
                        'destino' => (string)$destino,
                        'motivo' => (string)$motivoID,
                        'ayudante' => (string)$ayudanteID,
                    ];

                    $datosActuales = [
                        'chofer' => $choferExistente,
                        'destino' => $destinoExistente,
                        'motivo' => $motivoExistente,
                        'ayudante' => $ayudanteExistente,
                    ];

                    // 4. Comparación: si los datos son iguales, ignoramos la unidad.
                    if ($datosEntrantes === $datosActuales) {
                        $unidadesIgnoradas++;
                        $unidadesProcesadas++;
                        continue; // Salta al siguiente elemento del bucle
                    }

                    // 5. Si los datos son diferentes, procedemos a actualizar la asignación existente.
                    // Si quieres crear un nuevo registro (desactivar y crear), usa la lógica del ejemplo anterior.
                    // Para mantener la lógica de tu código original (solo actualizar):
                    $asignacionExistente->update([
                        'CUA_choferID'           => $choferID,
                        'CUA_ayudanteID'         => $ayudanteID,
                        'CUA_motivoID'           => $motivoID,
                        'CUA_destino'            => $destino,
                        // Opcional: Actualizar la fecha para marcar el cambio
                        'CUA_fechaAsignacion'    => Carbon::now()->format('Ymd H:i:s'),
                    ]);
                    $unidadesActualizadas++;
                }

                $unidadesProcesadas++;
            }

            // Devolver una respuesta JSON de éxito al final de la iteración
            return response()->json([
                'success' => true,
                'message' => 'Asignaciones procesadas. Las unidades con datos idénticos fueron ignoradas.',
                'resumen' => [
                    'total_procesadas' => $unidadesProcesadas,
                    'actualizadas' => $unidadesActualizadas,
                    'creadas' => $unidadesCreadas,
                    'ignoradas' => $unidadesIgnoradas,
                ]
            ]);
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
