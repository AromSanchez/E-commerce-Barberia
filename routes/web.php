<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PublicProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use Inertia\Inertia;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas públicas de productos
Route::prefix('productos')->group(function () {
    Route::get('/', [PublicProductController::class, 'index'])->name('products.index');
    Route::get('/categoria/{slug}', [PublicProductController::class, 'byCategory'])->name('products.category');
    Route::get('/marca/{slug}', [PublicProductController::class, 'byBrand'])->name('products.brand');
});

Route::get('/nosotros', function () {
    return Inertia::render('Nosotros');
})->name('nosotros');

Route::get('/ofertas', function () {
    return Inertia::render('Ofertas');
})->name('ofertas');

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

Route::middleware(['auth','verified', 'admin'])->group(function () {
    Route::get('/dashboard/brand', [BrandController::class, 'index'])
        ->name('dashboard.brand');
    Route::post('/dashboard/brand', [BrandController::class, 'store'])
        ->name('dashboard.brand.store');
    Route::patch('/dashboard/brand/{id}', [BrandController::class, 'update'])
        ->name('dashboard.brand.update');
    Route::delete('/dashboard/brand/{id}', [BrandController::class, 'destroy'])
        ->name('dashboard.brand.destroy');
});



Route::get('/dashboard/coupon', function(){
    return Inertia::render('DashAdmin/DashCoupon');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.coupon');

Route::get('/dashboard/users', [UsersController::class, 'index'])->middleware(['auth','verified', 'admin'])->name('dashboard.users');
Route::put('/dashboard/users/{id}', [UsersController::class, 'updateRole'])->middleware(['auth','verified', 'admin'])->name('dashboard.users.update-role');

Route::get('/dashboard/products', [ProductController::class, 'index'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.product');
Route::delete('/dashboard/products/{id}', [ProductController::class, 'destroy'])->name('dashboard.products.destroy');

Route::get('/dashboard/addproducts', [ProductController::class, 'create'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.addproduct');
Route::post('/dashboard/addproducts', [ProductController::class, 'store'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.addproduct.store');

Route::get('/dashboard/products/{product}/edit/', [ProductController::class, 'edit'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.products.edit');
Route::patch('/dashboard/products/{product}/edit/', [ProductController::class, 'update'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.products.update');

Route::get('/dashboard/orders', function(){
    return Inertia::render('DashAdmin/DashOrders/DashOrder');
})->middleware(['auth','verified', 'admin'])->name('dashboard.orders');

// Rutas del carrito
Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/get', [CartController::class, 'getCart'])->name('cart.get');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


