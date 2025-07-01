<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;


class FavoriteController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $favorites = $user->favorites()
            ->with('category', 'brand')
            ->get();

        return Inertia::render('Favoritos', [
            'favorites' => $favorites,
        ]);
    }

    // ✅ Alterna agregar o quitar producto de favoritos
    public function toggleFavorite(Request $request, $productId)
    {
        /** @var \App\Models\User $user */

        $user = Auth::user();

        if ($user->favorites()->where('product_id', $productId)->exists()) {
            $user->favorites()->detach($productId);
            return response()->json(['message' => 'Producto eliminado de favoritos']);
        } else {
            // Verifica que el producto exista
            $product = Product::findOrFail($productId);
            $user->favorites()->attach($productId);
            return response()->json(['message' => 'Producto agregado a favoritos']);
        }
    }

    // ✅ Obtener el conteo de favoritos para API
    public function getCount()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['count' => 0]);
        }

        $count = $user->favorites()->count();
        return response()->json(['count' => $count]);
    }
}
