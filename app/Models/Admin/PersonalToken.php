<?php

namespace App\Models\Admin;

use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Carbon; // Importa Carbon para asegurar que el parsing funcione

class PersonalToken extends PersonalAccessToken 
{
    protected $table = 'dbo.personal_access_tokens';
    protected $primaryKey = 'id';

    /**
     * SOLUCIÓN CRÍTICA: Define el formato de fecha sin milisegundos 
     * para compatibilidad con el tipo 'datetime' de SQL Server.
     */
    protected $dateFormat = 'Y-m-d H:i:s'; 

    /**
     * Sobrescribe la forma en que Laravel convierte un objeto Carbon 
     * en una cadena de fecha SQL, eliminando la precisión del milisegundo.
     */
    public function fromDateTime($value)
    {
        // Usamos el formato definido en $dateFormat
        return Carbon::parse(parent::fromDateTime($value))->format($this->dateFormat);
    }
    
    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
    ];
}