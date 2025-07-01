<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Coupon;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Session::get('cart', []);
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'isAuthenticated' => auth()->check()
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Session::get('cart', []);
        $product = Product::findOrFail($validated['product_id']);

        $cartItem = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->sale_price ?? $product->regular_price,
            'quantity' => $validated['quantity'],
            'image' => $product->image ? '/storage/' . $product->image : '/images/no-image.png',
            'stock' => $product->stock
        ];

        if (isset($cart[$product->id])) {
            // Validar que no exceda el stock disponible
            $newQuantity = $cart[$product->id]['quantity'] + $validated['quantity'];
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'message' => 'No hay suficiente stock disponible',
                    'available_stock' => $product->stock
                ], 422);
            }
            $cart[$product->id]['quantity'] = $newQuantity;
        } else {
            if ($validated['quantity'] > $product->stock) {
                return response()->json([
                    'message' => 'No hay suficiente stock disponible',
                    'available_stock' => $product->stock
                ], 422);
            }
            $cart[$product->id] = $cartItem;
        }

        Session::put('cart', $cart);

        return response()->json([
            'message' => 'Producto añadido al carrito',
            'cart' => $cart
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Session::get('cart', []);
        $product = Product::findOrFail($validated['product_id']);

        if (isset($cart[$validated['product_id']])) {
            // Validar que no exceda el stock disponible
            if ($validated['quantity'] > $product->stock) {
                return response()->json([
                    'message' => 'No hay suficiente stock disponible',
                    'available_stock' => $product->stock
                ], 422);
            }
            $cart[$validated['product_id']]['quantity'] = $validated['quantity'];
            Session::put('cart', $cart);
        }

        return response()->json([
            'message' => 'Carrito actualizado',
            'cart' => $cart
        ]);
    }

    public function remove(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $cart = Session::get('cart', []);

        if (isset($cart[$validated['product_id']])) {
            unset($cart[$validated['product_id']]);
            Session::put('cart', $cart);
        }

        return response()->json([
            'message' => 'Producto eliminado del carrito',
            'cart' => $cart
        ]);
    }

    public function clear()
    {
        Session::forget('cart');
        return response()->json([
            'message' => 'Carrito vaciado'
        ]);
    }

    public function getCart()
    {
        $cart = Session::get('cart', []);
        $coupon = Session::get('coupon');
        $total = 0;

        // Calcular el total y corregir rutas de imágenes
        foreach ($cart as &$item) {
            $total += $item['price'] * $item['quantity'];

            if ($item['image'] && !str_starts_with($item['image'], '/storage/') && !str_starts_with($item['image'], '/images/')) {
                $item['image'] = '/storage/' . $item['image'];
            }
        }

        $discount = 0;

        // Si hay un cupón en sesión, aplicar descuento
        if ($coupon) {
            if ($coupon['type'] === 'fixed') {
                $discount = $coupon['value'];
            } elseif ($coupon['type'] === 'percentage') {
                $discount = $total * ($coupon['value'] / 100);
            }
        }

        $totalAfterDiscount = max(0, $total - $discount);

        return response()->json([
            'items' => $cart,
            'total' => round($total, 2),
            'discount' => round($discount, 2),
            'total_after_discount' => round($totalAfterDiscount, 2),
            'coupon' => $coupon
        ]);
    }


    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:coupons,code'
        ]);

        $coupon = Coupon::where('code', $request->code)->where('is_active', true)->first();

        if (!$coupon) {
            return response()->json(['message' => 'Cupón inválido o inactivo'], 404);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json(['message' => 'El cupón ha expirado'], 400);
        }

        if ($coupon->usage_limit !== null && $coupon->usage_count >= $coupon->usage_limit) {
            return response()->json(['message' => 'El cupón ha alcanzado su límite de uso'], 400);
        }

        $cart = Session::get('cart', []);
        $total = 0;

        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        if ($coupon->min_amount !== null && $total < $coupon->min_amount) {
            return response()->json(['message' => 'El total del carrito no cumple con el mínimo requerido para este cupón'], 400);
        }

        $discount = 0;
        if ($coupon->type === 'fixed') {
            $discount = $coupon->value;
        } elseif ($coupon->type === 'percentage') {
            $discount = $total * ($coupon->value / 100);
        }

        $newTotal = max(0, $total - $discount);

        // Puedes guardar el cupón en la sesión
        Session::put('coupon', $coupon);

        return response()->json([
            'message' => 'Cupón aplicado exitosamente',
            'coupon' => $coupon,
            'discount' => round($discount, 2),
            'new_total' => round($newTotal, 2)
        ]);
    }
}
