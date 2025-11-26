<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'dbo.Personas';
    public $timestamps = false; // Asumo que no usas created_at/updated_at en Personas
    protected $primaryKey = 'Personas_usuarioID';

    /**
     * CORRECCIÓN: Define el formato de fecha sin milisegundos para SQL Server.
     * Aunque $timestamps es false aquí, esto afecta las fechas que Sanctum intenta guardar.
     */
    // protected $dateFormat = 'Y-m-d H:i:s'; 

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
        'usuario_idRol'
    ];


    protected $hidden = [
        'Personas_contrasena',
        'remember_token',
    ];

    protected $casts = [
        'Personas_contrasena' => 'hashed',
    ];

    // Métodos de autenticación
    public function getAuthPassword() { return $this->Personas_contrasena; }
    // public function getAuthIdentifierName() { return $this->primaryKey; }
    public function getJWTIdentifier() { return $this->getKey(); }


    public function getJWTCustomClaims()
    {
        return [];
    }
    /**
     * Sobrescribe el método tokens() para usar el modelo de token personalizado.
     */
    // public function tokens()
    // {
    //     return $this->morphMany(PersonalToken::class, 'tokenable');
    // }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'usuarioxmenu', 'usuarioxmenu_idusuario', 'usuarioxmenu_idmenu')
            ->withPivot('usuarioxmenu_idusuario', 'usuarioxmenu_idmenu', 'usuarioxmenu_alta', 'usuarioxmenu_consulta', 'usuarioxmenu_especial', 'usuarioxmenu_cambio', );
    }
}