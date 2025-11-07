<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;


// ¡CORRECCIÓN CRÍTICA! Debe extender Authenticatable para que Auth::login() funcione.
class User extends Authenticatable
{
    // Usamos los traits necesarios, incluyendo HasApiTokens
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'dbo.Personas';
    public $timestamps = false;
    protected $primaryKey = 'Personas_usuarioID';

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
        // Esta línea asegura que la contraseña se hashee automáticamente al guardarse
        'Personas_contrasena' => 'hashed',
    ];

    /**
     * Define qué columna usar como contraseña para la autenticación.
     */
    public function getAuthPassword()
    {
        return $this->Personas_contrasena;
    }

    // --- MÉTODOS AÑADIDOS PARA RESOLVER CONFLICTO CON CLAVE PRIMARIA ---

    /**
     * Obtiene el nombre de la columna que identifica al usuario para la autenticación.
     * Esto fuerza a Laravel a usar 'Personas_usuarioID' en lugar del default 'id'.
     */
    public function getAuthIdentifierName()
    {
        return $this->primaryKey;
    }

    /**
     * Obtiene el valor de la clave que identifica al usuario para la autenticación.
     */
    public function getAuthIdentifier()
    {
        return $this->getKey();
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'usuarioxmenu', 'usuarioxmenu_idusuario', 'usuarioxmenu_idmenu')
            ->withPivot('usuarioxmenu_idusuario', 'usuarioxmenu_idmenu', 'usuarioxmenu_alta', 'usuarioxmenu_consulta', 'usuarioxmenu_especial', 'usuarioxmenu_cambio', );
    }
}
