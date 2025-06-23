<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{

    public function store(Request $request)
    {
        Log::debug('Datos recibidos:', $request->all()); // ✅ Ver qué llega
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $userId = $user?->id;
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            Log::debug('Creando orden...');
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $request->amount,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'payment_status' => 'pagado', // ← en español
                'order_status' => 'procesando', // ← en español
            ]);

            Log::debug('Orden creada: ' . $order->id);

            foreach ($request->products as $item) {
                $product = Product::findOrFail($item['id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->sale_price ?? $product->regular_price,
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            DB::commit();

            Log::info('Orden guardada con éxito');
            return response()->json(['message' => 'Orden guardada con éxito'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar la orden: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al guardar la orden',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
