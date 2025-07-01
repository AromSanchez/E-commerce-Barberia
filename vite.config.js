import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👉 necesitas importar esto

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            publicDirectory: 'public',
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'), // 👉 alias configurado
            '@/Components': path.resolve(__dirname, 'resources/js/components'), // Alias adicional para compatibilidad con mayúsculas
            '@/Layouts': path.resolve(__dirname, 'resources/js/layouts'), // Alias adicional para compatibilidad con mayúsculas
            '@images': path.resolve(__dirname, 'public/images'), // Alias para imágenes
        },
    },
    // Configuración para manejar correctamente los assets estáticos
    build: {
        assetsInlineLimit: 0, // Evitar que incruste los assets como base64
    },
});