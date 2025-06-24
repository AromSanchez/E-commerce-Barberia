<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Config;
use App\Http\Controllers\PublicProductController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
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


Route::middleware('auth')->get('/favoritos', [FavoriteController::class, 'index']);
Route::middleware('auth')->post('/favorites/{productId}/toggle', [FavoriteController::class, 'toggleFavorite']);




Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Rutas públicas de productos
Route::prefix('productos')->group(function () {
    Route::get('/', [PublicProductController::class, 'index'])->name('products.index');
    Route::get('/buscar-sugerencias', [PublicProductController::class, 'liveSearch'])->name('products.live_search');
    Route::get('/categoria/{slug}', [PublicProductController::class, 'byCategory'])->name('products.category');
    Route::get('/marca/{slug}', [PublicProductController::class, 'byBrand'])->name('products.brand');
});

// Ruta individual para mostrar un producto
Route::get('/producto/{slug}', [PublicProductController::class, 'show'])->name('products.show');

// Página "Nosotros"
Route::get('/nosotros', function () {
    return Inertia::render('Nosotros');
})->name('nosotros');

Route::get('/historial', [OrderController::class, 'index'])->name('historial.index');

Route::get('/carrito', function () {
    return Inertia::render('VerCarrito');
})->name('carrito');

Route::get('/ofertas', [PublicProductController::class, 'ofertas'])->name('ofertas');

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

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard/brand', [BrandController::class, 'index'])
        ->name('dashboard.brand');
    Route::post('/dashboard/brand', [BrandController::class, 'store'])
        ->name('dashboard.brand.store');
    Route::patch('/dashboard/brand/{id}', [BrandController::class, 'update'])
        ->name('dashboard.brand.update');
    Route::delete('/dashboard/brand/{id}', [BrandController::class, 'destroy'])
        ->name('dashboard.brand.destroy');
});



Route::get('/dashboard/coupon', function () {
    return Inertia::render('DashAdmin/DashCoupon');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.coupon');

Route::get('/dashboard/users', [UsersController::class, 'index'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.users');
Route::put('/dashboard/users/{id}', [UsersController::class, 'updateRole'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.users.update-role');

Route::get('/dashboard/products', [ProductController::class, 'index'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.product');
Route::delete('/dashboard/products/{id}', [ProductController::class, 'destroy'])->name('dashboard.products.destroy');

Route::get('/dashboard/addproducts', [ProductController::class, 'create'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.addproduct');
Route::post('/dashboard/addproducts', [ProductController::class, 'store'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.addproduct.store');

Route::get('/dashboard/products/{product}/edit/', [ProductController::class, 'edit'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.products.edit');
Route::patch('/dashboard/products/{product}/edit/', [ProductController::class, 'update'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.products.update');

Route::get('/dashboard/orders', function () {
    return Inertia::render('DashAdmin/DashOrders/DashOrder');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.orders');

// Rutas del carrito
Route::group(['prefix' => 'cart'], function () {
    Route::get('/', [CartController::class, 'index'])->name('cart.index');
    Route::post('/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/update', [CartController::class, 'update'])->name('cart.update');
    Route::post('/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/get', [CartController::class, 'getCart'])->name('cart.get');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de pago con Stripe
Route::middleware('auth')->group(function () {
    Route::post('/create-payment-intent', [App\Http\Controllers\PaymentController::class, 'createPaymentIntent'])
        ->name('payment.create-intent');
});


Route::post('/orden/guardar', [OrderController::class, 'store'])->name('order.store');



Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', function () {
        $cart = session('cart', []);

        if (empty($cart)) {
            return redirect()->route('carrito');
        }

        // Obtener el total enviado como parámetro que incluye el costo de envío
        $total = request('total', null);
        
        // Si no se proporciona el total en la URL, calcularlo incluyendo el envío
        if ($total === null) {
            $subtotal = array_reduce($cart, function ($carry, $item) {
                return $carry + ($item['price'] * $item['quantity']);
            }, 0);
            
            // Envío gratis para compras mayores a 50 soles
            $shipping = $subtotal >= 50 ? 0 : 10.00;
            $total = $subtotal + $shipping;
        }

        return \Inertia\Inertia::render('Checkout/Index', [
            'total' => $total,
            'stripeKey' => Config::get('services.stripe.key'),
            'cart' => $cart,
            'includesShipping' => true, // Indicador para el frontend
            'isFreeShipping' => $total == request('total') ? request('total') >= 50 : ($subtotal ?? 0) >= 50
        ]);
    })->name('checkout');
});


require __DIR__ . '/auth.php';
