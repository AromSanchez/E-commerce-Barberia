<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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
        $total = 0;

        // Asegurarse de que todas las imágenes tengan la ruta correcta
        foreach ($cart as &$item) {
            $total += $item['price'] * $item['quantity'];
            // Si la imagen no tiene el prefijo /storage/ o /images/, agregarlo
            if ($item['image'] && !str_starts_with($item['image'], '/storage/') && !str_starts_with($item['image'], '/images/')) {
                $item['image'] = '/storage/' . $item['image'];
            }
        }

        return response()->json([
            'items' => $cart,
            'total' => $total
        ]);
    }
}
