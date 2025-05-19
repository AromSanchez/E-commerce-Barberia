<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        $categories = Category::all();
        
        return Inertia::render('DashAdmin/DashCategory', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        return Inertia::render('DashAdmin/DashCategory');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:category',
            'description' => 'nullable|string|max:255',
        ]);

        $category = Category::create($validated);

        return redirect()->route('dashboard.category')
            ->with('success', 'Categoría creada exitosamente.');
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
}
