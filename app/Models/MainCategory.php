<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'is_active'
    ];

    /**
     * Get the categories that belong to this main category.
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
