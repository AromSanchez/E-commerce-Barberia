<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard/category', [App\Http\Controllers\CategoryController::class, 'index'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('dashboard.category');

Route::post('/dashboard/category', [App\Http\Controllers\CategoryController::class, 'store'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('dashboard.category.store');

Route::delete('/dashboard/category/{id}', [App\Http\Controllers\CategoryController::class, 'destroy'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('dashboard.category.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


