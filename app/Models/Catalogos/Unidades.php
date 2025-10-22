<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unidades extends Model
{
    use HasFactory;
    public $timestamps = false;

    // Updated to the correct table name
    protected $table = 'dbo.Unidades';

    // Updated to the correct primary key
    protected $primaryKey = 'Unidades_unidadID';

    // Replaced $fillable with the new columns
    protected $fillable = [
        'Unidades_numeroEconomico',
        'Unidades_numeroSerie',
        'Unidades_modelo',
        'Unidades_ano',
        'Unidades_placa',
        'Unidades_kilometraje',
        'Unidades_mantenimiento',
        'Unidades_estatus',
        'Unidades_fechaCreacion',
        'Unidades_usuarioID',
    ];
}
