<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;
    protected $table = 'category';

    protected $fillable = [
        'name',
        'description',
        'slug',
        'main_category_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $category->slug = Str::slug($category->name);
        });

        static::updating(function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }
    
    // Relación con Product
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    
    /**
     * Get the main category this category belongs to.
     */
    public function mainCategory()
    {
        return $this->belongsTo(MainCategory::class);
    }
}
