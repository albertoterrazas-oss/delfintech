<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>prueba correo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
        }

        .factura-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
        }

        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .circle {
            width: 300px;
            height: 100px;
            /* border-radius: 50%; */
            /* object-fit: cover; Ensures the image covers the circle without distortion */
            margin-right: 20px;
        }

        .title h1 {
            margin: 0;
            font-size: 24px;
        }

        .title h2 {
            margin: 0;
            font-size: 20px;
        }

        .details p {
            margin: 5px 0;
            font-size: 14px;
        }

        .details strong {
            display: inline-block;
            width: 100px;
        }
    </style>
</head>

<body>
    <div class="factura-container">
        <div class="header">

            <div class="title">
                <h1> DELFIN TECNOLOGYS</h1>
                <h2>CORREO DE INCIDENCIAS</h2>
            </div>
        </div>
        <div class="details">
            <h1>LISTADO</h1>


            @if ($datos->Incidencias->isEmpty())
                <p>No se encontraron incidencias guardadas.</p>
            @else
                <!-- 
                    Iteramos sobre la colección de Incidencias y solo mostramos el nombre de la Lista.
                -->
                @foreach ($datos->Incidencias as $incidencia)
                    <div class="list-item">
                        <!-- 
                                Acceso directo al nombre de la lista de verificación:
                                $incidencia->listaVerificacion->ListaVerificacion_nombre
                            -->
                        <strong>{{ $incidencia->listaVerificacion->ListaVerificacion_nombre ?? 'Lista No Disponible' }}</strong>
                    </div>
                @endforeach
            @endif

        </div>
    </div>
</body>

</html>