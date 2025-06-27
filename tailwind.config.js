// tailwind.config.js

import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            // Aquí puedes añadir tus keyframes y animaciones si las necesitas
            // keyframes: { ... },
            // animation: { ... },
            
            fontFamily: {
                // Usamos el método profesional para extender la fuente por defecto
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                'satoshi': ['Satoshi', 'sans-serif'],
            },
            
            screens: {
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
            
            // Añadiendo utilidades de máscara personalizadas
            maskImage: {
                'luminance': 'linear-gradient(to right, transparent, white)'
            },
            maskPosition: {
                'r-from-50%': '50%'
            },
            maskSize: {
                'r-to-black': 'cover'
            }
        },
    },

    plugins: [
        forms,
        require('tailwind-scrollbar-hide'),
        // Plugin oficial para la clase "text-balance"
        require('tailwindcss-text-balance'),
        // Plugin para máscaras de gradiente
        
    ],
};