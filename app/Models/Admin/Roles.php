<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;
    public $table = 'dbo.Roles';
    public $timestamps = false;
    public $primaryKey = 'roles_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'roles_descripcion',
        'roles_menuInicio'
    ];
}
