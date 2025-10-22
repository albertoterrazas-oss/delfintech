<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChoferUnidadAsignar extends Model
{
    use HasFactory;

    // Define the table name
    protected $table = 'dbo.ChoferUnidadAsignada';

    // Define the primary key
    protected $primaryKey = 'CUA_asignacionID';

    // Disable timestamps if your table doesn't have 'created_at' and 'updated_at' columns
    public $timestamps = false;

    // Define the mass-assignable fields
    protected $fillable = [
        'CUA_unidadID',
        'CUA_choferID',
        'CUA_ayudanteID',
        'CUA_motivoID',
        'CUA_destino',
        'CUA_fechaAsignacion',
        'CUA_estatus',
    ];
}
