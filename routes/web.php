<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController; 
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

Route::get('/dashboard/brand', function(){
    return Inertia::render('DashAdmin/DashBrand');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.brand');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


