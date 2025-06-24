<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\ServiceProvider;
use App\Models\MainCategory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Inertia::share('favoriteCount', function () {
            /** @var User $user */
            $user = Auth::user();

            return $user
                ? $user->favorites()->count()
                : 0;
        });

        // Compartir las categorías principales en todas las vistas
        Inertia::share('mainCategories', function () {
            return MainCategory::where('is_active', true)->get();
        });
    }
}
