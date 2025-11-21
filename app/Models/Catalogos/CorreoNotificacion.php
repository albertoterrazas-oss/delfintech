<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorreoNotificacion extends Model
{
    // use HasFactory;
    use HasFactory;

    public $timestamps = false;
    protected $table = 'dbo.correoNotificaciones';
    protected $primaryKey = 'correoNotificaciones_id';
    protected $fillable = [
        'correoNotificaciones_correo',
        'correoNotificaciones_idUsuario',
        'correoNotificaciones_estatus',
    ];
}
