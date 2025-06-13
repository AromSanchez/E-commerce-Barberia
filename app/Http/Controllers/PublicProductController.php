<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProductController extends Controller
{
    public function index()
    {
        $productos = Product::with(['brand', 'category'])->get(); // Cargar las relaciones
        $categorias = Category::withCount('products')->get();
        $marcas = Brand::withCount('products')->get();

        return Inertia::render('Tienda', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
        ]);
    }
    public function show($slug)
    {
        $product = Product::with(['brand', 'category', 'images']) // Asegúrate de tener la relación images en el modelo
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Producto', [
            'product' => $product,
        ]);
    }
}
