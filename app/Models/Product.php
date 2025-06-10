<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'regular_price',
        'sale_price',
        'category_id',
        'brand_id',
        'is_featured',
        'is_new',
        'stock',
        'image',
        'short_description',
        'long_description'
    ];

    // Relación con Brand
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    // Relación con Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($brand) {
            $brand->slug = Str::slug($brand->name);
        });

        static::updating(function ($brand) {
            $brand->slug = Str::slug($brand->name);
        });
    }
}
