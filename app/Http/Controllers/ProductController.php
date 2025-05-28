<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category; // Importar el modelo Category
use App\Models\Brand;    // Importar el modelo Brand
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
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
        ]);
        // Si hay imagen, la sube al storage
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Crea el producto con los datos validados (el slug se genera en el modelo)
        $product = Product::create($validated);

        return redirect()->route('dashboard.product');
    }

    public function destroy($id)
    {

        $product = Product::findOrFail($id);

        // Eliminar la imagen si existe
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
    }

    public function edit(Product $product)
    {
        $categories = Category::all(['id', 'name']);
        $brands = Brand::all(['id', 'name']);

        return Inertia::render('DashAdmin/DashProducts/DashEditProduct', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }


    public function update(Request $request, Product $product)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'category_id' => 'nullable|exists:category,id', // Cambiado de categories a category
            'brand_id' => 'nullable|exists:brands,id',
            'is_featured' => 'in:yes,no',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
        ]);
        $validated['sale_price'] = $request->input('sale_price') !== '' ? $request->input('sale_price') : null;

        // Si llega una nueva imagen, eliminar la anterior y guardar la nueva
        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Actualizar el producto con los datos validados
        $product->update($validated);

        // Redirigir a la lista o detalle with mensaje de éxito
        return redirect()->route('dashboard.product')->with('success', 'Producto actualizado correctamente.');
    }
}
