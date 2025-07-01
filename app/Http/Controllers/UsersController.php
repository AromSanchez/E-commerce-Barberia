<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        $users = User::withCount('orders')
            ->with(['orders' => function ($query) {
                $query->with(['items.product']);
            }])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'role' => $user->role,
                    'total_orders' => $user->orders_count,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    // Incluimos las órdenes completas para el modal
                    'orders' => $user->orders->map(function ($order) {
                        return [
                            'id' => $order->id,
                            'order_number' => $order->order_number,
                            'customer_name' => $order->customer_name,
                            'customer_phone' => $order->customer_phone,
                            'shipping_address' => $order->shipping_address,
                            'total_amount' => $order->total_amount,
                            'payment_status' => $order->payment_status,
                            'order_status' => $order->order_status,
                            'created_at' => $order->created_at,
                            'items' => $order->items->map(function ($item) {
                                return [
                                    'id' => $item->id,
                                    'quantity' => $item->quantity,
                                    'price' => $item->price,
                                    'product' => $item->product ? [
                                        'id' => $item->product->id,
                                        'name' => $item->product->name,
                                        'image' => $item->product->image,
                                        'slug' => $item->product->slug,
                                    ] : null
                                ];
                            })
                        ];
                    })
                ];
            });

        return Inertia::render('DashAdmin/DashUsers', [
            'users' => $users
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->input('role');
        $user->save();
    }
}
