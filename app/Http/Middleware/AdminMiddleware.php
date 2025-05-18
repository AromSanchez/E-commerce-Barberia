<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado y es administrador
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            // Redirigir al usuario a la página principal si no es administrador
            return redirect('/');
        }

        return $next($request);
    }
}