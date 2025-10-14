<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;
    public $table = 'dbo.menus';
    public $timestamps = false;
    public $primaryKey = 'menu_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'menu_nombre',
        'menu_idPadre',
        'menu_url',
        'menu_tooltip',
        'estatus',
    ];
}
