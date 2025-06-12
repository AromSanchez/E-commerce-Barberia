<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="{{ asset('images/logo-ventana.png') }}" type="image/png">
        <link rel="apple-touch-icon" href="{{ asset('images/logo-ventana.png') }}">
        <title inertia>{{ config('app.name', 'BarberShop') }}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-satoshi antialiased">
        @inertia
    </body>
</html>
