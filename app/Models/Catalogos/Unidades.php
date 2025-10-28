<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unidades extends Model
{
    use HasFactory;
    
    // Al eliminar 'public $timestamps = false;', el valor por defecto es TRUE.
    // Esto hace que Eloquent busque las constantes CREATED_AT y UPDATED_AT.

    // Updated to the correct table name
    protected $table = 'dbo.Unidades';

    // Updated to the correct primary key
    protected $primaryKey = 'Unidades_unidadID';
    
    /**
     * Define la columna de fecha de creación personalizada.
     * Eloquent establecerá automáticamente esta columna al crear el registro.
     */
    const CREATED_AT = 'Unidades_fechaCreacion';

    /**
     * Define la columna de fecha de modificación personalizada.
     * Eloquent establecerá automáticamente esta columna al actualizar el registro.
     */
    const UPDATED_AT = 'Unidades_fechaModificacion';
    
    // Campos que pueden ser llenados masivamente
    protected $fillable = [
        'Unidades_numeroEconomico',
        'Unidades_numeroSerie',
        'Unidades_modelo',
        'Unidades_ano',
        'Unidades_placa',
        'Unidades_kilometraje',
        'Unidades_mantenimiento',
        'Unidades_estatus',
        // CRÍTICO: Eliminamos 'Unidades_fechaCreacion' de $fillable 
        // porque será gestionado automáticamente por Eloquent.
        'Unidades_usuarioID',
    ];
}
