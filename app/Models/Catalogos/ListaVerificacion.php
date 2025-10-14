<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListaVerificacion extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'dbo.Motivos';
    protected $primaryKey = 'ListaVerificacion_listaID';
    protected $fillable = [
        'ListaVerificacion_nombre',
        'ListaVerificacion_tipo',
        'ListaVerificacion_observaciones',
        'ListaVerificacion_usuarioID',
    ];
}