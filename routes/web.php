<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

// Category Routes 
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard/category', [CategoryController::class, 'index'])
        ->name('dashboard.category');
    Route::post('/dashboard/category', [CategoryController::class, 'store'])
        ->name('dashboard.category.store');
    Route::patch('/dashboard/category/{id}', [CategoryController::class, 'update'])
        ->name('dashboard.category.update');
    Route::delete('/dashboard/category/{id}', [CategoryController::class, 'destroy'])
        ->name('dashboard.category.destroy');
});

// Brands Routes
Route::get('/dashboard/brand', [BrandController::class, 'index'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('dashboard.brand');

Route::post('/dashboard/brand', [BrandController::class, 'store'])
    ->middleware(['auth','verified', 'admin'])
    ->name('dashboard.brand.store');




Route::get('/dashboard/coupon', function(){
    return Inertia::render('DashAdmin/DashCoupon');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.coupon');

Route::get('/dashboard/users', function(){
    return Inertia::render('DashAdmin/DashUsers');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.users');

Route::get('/dashboard/products', function(){
    return Inertia::render('DashAdmin/DashProducts/DashProduct');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.product');

Route::get('/dashboard/addproducts', function(){
    return Inertia::render('DashAdmin/DashProducts/DashAddProduct');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.addproduct');

Route::get('/dashboard/orders', function(){
    return Inertia::render('DashAdmin/DashOrders/DashOrder');
})->middleware(['auth','verified', 'admin'])->name('dashboard.orders');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


