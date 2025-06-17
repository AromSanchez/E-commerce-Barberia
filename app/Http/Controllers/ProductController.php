<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category; // Importar el modelo Category
use App\Models\Brand;    // Importar el modelo Brand
use App\Models\ProductImage; // Importar el modelo ProductImage
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'brand'])->get();
        return Inertia::render('DashAdmin/DashProducts/DashProduct', [
            'products' => $products
        ]);
    }
    // create product
    public function create()
    {
        $categories = Category::all(['id', 'name']);
        $brands = Brand::all(['id', 'name']);

        return Inertia::render('DashAdmin/DashProducts/DashAddProduct', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'category_id' => 'nullable|exists:category,id',
            'brand_id' => 'nullable|exists:brands,id',
            'is_featured' => 'in:yes,no',
            'is_new' => 'in:yes,no',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'gallery_images.*' => 'image|max:2048',
        ]);
        // Si hay imagen, la sube al storage
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Crea el producto con los datos validados (el slug se genera en el modelo)
        $product = Product::create($validated);

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $index => $image) {
                $path = $image->store('product_images', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('dashboard.product');
    }

    public function destroy($id)
    {

        $product = Product::findOrFail($id);

        // Eliminar la imagen principal si existe
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // Eliminar imágenes de galería físicas y registros de la base de datos
        foreach ($product->images as $image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        // Eliminar registros de la galería (aunque la FK con cascade ya lo hace)
        $product->images()->delete();

        // Eliminar el producto
        $product->delete();

        return redirect()->route('dashboard.product')->with('success', 'Producto eliminado correctamente.');
    }

    public function edit(Product $product)
    {
        $categories = Category::all(['id', 'name']);
        $brands = Brand::all(['id', 'name']);

        // Cargar imágenes de galería relacionadas (id e image_path)
        $product->load(['images:id,product_id,image_path,sort_order']);

        return Inertia::render('DashAdmin/DashProducts/DashEditProduct', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }


    public function update(Request $request, Product $product)
    {

        // Validación de los datos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'category_id' => 'nullable|exists:category,id',
            'brand_id' => 'nullable|exists:brands,id',
            'is_featured' => 'in:yes,no',
            'is_new' => 'in:yes,no',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'gallery_images.*' => 'image|max:2048',
            'deleted_gallery_image_ids' => 'array',
            'deleted_gallery_image_ids.*' => 'integer|exists:product_images,id',
        ]);

        // Normalizar el campo sale_price
        $validated['sale_price'] = $request->input('sale_price') !== '' ? $request->input('sale_price') : null;

        // Reemplazo de la imagen principal si llega una nueva
        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Iniciar transacción para operaciones atómicas
        DB::transaction(function () use ($request, $product, $validated) {
            // Actualizar el producto
            $product->update($validated);

            // Eliminar imágenes de galería seleccionadas
            if ($request->has('deleted_gallery_image_ids')) {
                foreach ($request->input('deleted_gallery_image_ids') as $id) {
                    $image = ProductImage::find($id);
                    if ($image && Storage::disk('public')->exists($image->image_path)) {
                        Storage::disk('public')->delete($image->image_path);
                    }
                    $image?->delete();
                }
            }

            // Guardar nuevas imágenes de galería
            if ($request->hasFile('gallery_images')) {
                $lastOrder = $product->images()->max('sort_order') ?? 0;

                foreach ($request->file('gallery_images') as $index => $imageFile) {
                    $path = $imageFile->store('product_images', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'sort_order' => $lastOrder + $index + 1,
                    ]);
                }
            }
        });

        return redirect()->route('dashboard.product')->with('success', 'Producto actualizado correctamente.');
    }

}
