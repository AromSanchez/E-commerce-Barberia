<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use App\Models\Brand;
use App\Models\User; // Asegúrate de importar esto arriba
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    public function index()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        /** @var \App\Models\User $user */  // 👈 Esta línea soluciona el error en VS Code

        $productos = Product::with(['brand', 'category'])->get();

        if ($user) {
            $user->load('favorites');

            $productos->each(function ($producto) use ($user) {
                $producto->is_favorite = $user->favorites->contains($producto->id);
            });
        } else {
            $productos->each(function ($producto) {
                $producto->is_favorite = false;
            });
        }

        $categorias = Category::withCount('products')->get();
        $marcas = Brand::withCount('products')->get();
        $mainCategories = \App\Models\MainCategory::where('is_active', true)->get();

        return Inertia::render('Tienda', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'mainCategories' => $mainCategories,
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
        $mainCategories = \App\Models\MainCategory::where('is_active', true)->get();

        return Inertia::render('Tienda', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'mainCategories' => $mainCategories,
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
        $mainCategories = \App\Models\MainCategory::where('is_active', true)->get();

        return Inertia::render('Tienda', [
            'productos' => $productos,
            'categorias' => $categorias,
            'mainCategories' => $mainCategories,
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

    public function liveSearch(Request $request)
    {
        $query = trim($request->input('q'));
        if (strlen($query) === 0) {
            return response()->json([
                'productos' => [],
                'marcas' => [],
                'categorias' => []
            ]);
        }

        // Buscar productos por coincidencia exacta, al inicio, y por palabra
        $productos = Product::with(['brand', 'images'])
            ->where(function($q) use ($query) {
                $q->where('name', 'like', $query . '%') // empieza con
                  ->orWhere('name', 'like', '% ' . $query . '%') // palabra intermedia
                  ->orWhere('name', 'like', '%' . $query . '%'); // en cualquier parte
            })
            ->limit(7)
            ->get();

        // Si no hay productos, sugerir marcas y categorías relevantes
        $marcas = collect();
        $categorias = collect();
        if ($productos->isEmpty()) {
            $marcas = Brand::where('name', 'like', '%' . $query . '%')
                ->limit(5)
                ->get(['id', 'name', 'slug']);
            $categorias = Category::where('name', 'like', '%' . $query . '%')
                ->limit(5)
                ->get(['id', 'name', 'slug']);
        } else {
            // Sugerir marcas de los productos encontrados
            $marcas = $productos->pluck('brand')->filter()->unique('id')->values()->map(function($brand) {
                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug
                ];
            });
        }

        $productosArr = $productos->map(function($p) {
            $img = null;
            if ($p->images && $p->images->count() > 0) {
                $img = asset('storage/' . $p->images->first()->image_path);
            } elseif ($p->image) {
                $img = asset('storage/' . $p->image);
            }
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'brand' => $p->brand ? $p->brand->name : null,
                'brand_slug' => $p->brand ? $p->brand->slug : null,
                'image' => $img
            ];
        });

        return response()->json([
            'productos' => $productosArr,
            'marcas' => $marcas,
            'categorias' => $categorias
        ]);
    }

    /**
     * Obtiene los productos marcados como destacados
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFeaturedProducts()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Obtener productos destacados
        $featuredProducts = Product::with(['brand', 'category'])
            ->where('is_featured', 'yes')
            ->where('stock', '>', 0) // Solo productos con stock
            ->latest()
            ->take(8) // Limitar a 8 productos destacados
            ->get();

        // Marcar favoritos para el usuario actual
        if ($user) {
            $user->load('favorites');
            
            $featuredProducts->each(function ($product) use ($user) {
                $product->isFavorite = $user->favorites->contains($product->id);
            });
        } else {
            $featuredProducts->each(function ($product) {
                $product->isFavorite = false;
            });
        }

        // Transformar los datos para que coincidan con lo esperado por CardProduct
        $featuredProducts = $featuredProducts->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'regular_price' => $product->regular_price,
                'sale_price' => $product->sale_price,
                'main_image' => $product->image,
                'brand' => $product->brand,
                'in_stock' => $product->stock > 0,
                'is_new' => $product->is_new === 'yes',
                'isFavorite' => $product->isFavorite
            ];
        });

        return response()->json($featuredProducts);
    }
}
