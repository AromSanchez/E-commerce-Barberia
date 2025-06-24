<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'customer_name',
        'customer_phone',
        'shipping_address',
        'payment_status',
        'order_status',
        'order_number',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::created(function ($order) {
            // Generar número: PED-2025-001
            $order->order_number = 'PED-' . now()->year . '-' . str_pad($order->id, 3, '0', STR_PAD_LEFT);
            $order->save();

            Log::debug('Número de orden generado automáticamente: ' . $order->order_number);
        });
    }
}
