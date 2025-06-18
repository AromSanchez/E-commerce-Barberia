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

    public function byCategory($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $productos = Product::with(['brand', 'category'])
            ->where('category_id', $category->id)
            ->get();

        $categorias = Category::withCount('products')->get();
        $marcas = Brand::withCount('products')->get();

        return Inertia::render('Tienda', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'currentFilter' => [
                'type' => 'category',
                'value' => $category->id,
                'name' => $category->name
            ]
        ]);
    }

    public function byBrand($slug)
    {
        $brand = Brand::where('slug', $slug)->firstOrFail();
        $productos = Product::with(['brand', 'category'])
            ->where('brand_id', $brand->id)
            ->get();

        $categorias = Category::withCount('products')->get();
        $marcas = Brand::withCount('products')->get();

        return Inertia::render('Tienda', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'currentFilter' => [
                'type' => 'brand',
                'value' => $brand->id,
                'name' => $brand->name
            ]
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['brand', 'category', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Buscar productos relacionados (misma categoría, excepto el actual)
        $relatedProducts = Product::with('brand')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('Producto', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
    
    public function ofertas()
    {
        $productos = Product::with(['brand', 'category'])
            ->whereNotNull('sale_price')
            ->where('sale_price', '>', 0)
            ->get();

        return Inertia::render('Ofertas', [
            'productos' => $productos,
        ]);
    }
}
