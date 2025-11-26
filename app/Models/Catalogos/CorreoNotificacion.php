<?php

namespace App\Models\Catalogos;

use App\Models\Admin\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

     public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'correoNotificaciones_idUsuario', 'Personas_usuarioID');
    }
}
