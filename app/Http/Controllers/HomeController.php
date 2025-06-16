<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'categories' => Category::select('id', 'name', 'slug')->get(),
            'brands' => Brand::select('id', 'name', 'slug')->get(),
        ]);
    }
}
