<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefundRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'reason',
        'user_comment',
        'status',
        'admin_response',
        'processed_at',
    ];

    protected $dates = [
        'processed_at', 
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
