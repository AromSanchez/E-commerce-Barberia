<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProductController extends Controller
{
    public function index()
    {
        $productos = Product::all(); // o con relaciones, filtros, etc.
        $categorias = Category::withCount('products')->get();

        return Inertia::render('Products', [
            'productos' => $productos,
            'categorias' => $categorias,
        ]);
    }
}
