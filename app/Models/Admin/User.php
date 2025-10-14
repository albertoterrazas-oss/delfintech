<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = 'dbo.Personas';
    public $timestamps = false;
    protected $primaryKey = 'Personas_usuarioID'; // FIX: Removed square brackets

    protected $fillable = [
        'Personas_nombres',
        'Personas_apPaterno',
        'Personas_apMaterno',
        'Personas_telefono',
        'Personas_direccion',
        'Personas_fechaNacimiento',
        'Personas_correo',
        'Personas_puesto',
        'Personas_licencia',
        'Personas_vigenciaLicencia',
        'Personas_usuario',
        'Personas_contrasena',
        'Personas_esEmpleado',
    ];


    protected $hidden = [
        'Personas_contrasena',
        'remember_token',
    ];

    protected $casts = [
        'Personas_contrasena' => 'hashed',
    ];

    public function getAuthPassword()
    {
        return $this->Personas_contrasena;
    }

      public function getJWTIdentifier()
    {
        return $this->getKey();
    }

}
