<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HandleStripeKey
{
    public function handle(Request $request, Closure $next)
    {
        Inertia::share('stripeKey', config('services.stripe.key'));
        
        return $next($request);
    }
}
