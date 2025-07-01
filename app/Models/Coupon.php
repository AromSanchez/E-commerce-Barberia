<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_amount',
        'usage_limit',
        'usage_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'value' => 'decimal:2',
        'min_amount' => 'decimal:2',
    ];
    
    /**
     * Obtener las marcas a las que aplica este cupón.
     */
    public function brands()
    {
        return $this->belongsToMany(Brand::class, 'coupon_brand');
    }
    
    /**
     * Obtener las categorías a las que aplica este cupón.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'coupon_category');
    }
    
    /**
     * Determina si el cupón aplica a todos los productos o solo a marcas/categorías específicas
     */
    public function appliesToAll()
    {
        return $this->brands->isEmpty() && $this->categories->isEmpty();
    }
}