<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MainCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        $categories = Category::with('mainCategory')
                        ->withCount('products')
                        ->get();
        $mainCategories = MainCategory::where('is_active', true)->get();
        
        return Inertia::render('DashAdmin/DashCategory', [
            'categories' => $categories,
            'mainCategories' => $mainCategories
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        $mainCategories = MainCategory::where('is_active', true)->get();
        return Inertia::render('DashAdmin/DashCategory', [
            'mainCategories' => $mainCategories
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:category',
            'description' => 'nullable|string|max:255',
            'main_category_id' => 'required|exists:main_categories,id',
        ], [
            'main_category_id.required' => 'Debes seleccionar una categoría principal',
            'main_category_id.exists' => 'La categoría principal seleccionada no es válida',
        ]);

        $category = Category::create($validated);
        
        // Cargar la relación main_category y productos para el retorno
        $category->load('mainCategory');
        $category->loadCount('products');

        return redirect()->route('dashboard.category')->with('category', $category);
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
    
        return redirect()->route('dashboard.category')
            ->with('success', 'Categoría eliminada exitosamente.');
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:category,name,' . $id,
            'description' => 'nullable|string|max:255',
            'main_category_id' => 'required|exists:main_categories,id',
        ], [
            'main_category_id.required' => 'Debes seleccionar una categoría principal',
            'main_category_id.exists' => 'La categoría principal seleccionada no es válida',
        ]);

        $category = Category::findOrFail($id);
        $category->update($validated);
        
        // Cargar la relación main_category y productos para el retorno
        $category->load('mainCategory');
        $category->loadCount('products');

        return redirect()->route('dashboard.category')
            ->with('success', 'Categoría actualizada exitosamente.')
            ->with('category', $category);
    }
}
