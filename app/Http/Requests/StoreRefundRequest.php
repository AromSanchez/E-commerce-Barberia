<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRefundRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'reason' => ['required', 'in:no_llego,doble_cobro,informacion_incorrecta,producto_incorrecto,otro'],
            'user_comment' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
