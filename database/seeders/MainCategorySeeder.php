<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MainCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Definir las 6 categorías principales
        $mainCategories = [
            'Equipamientos',
            'Accesorios',
            'Maquinas y partes',
            'Tijeras y navajas',
            'Herramientas',
            'Productos',
        ];

        foreach ($mainCategories as $categoryName) {
            DB::table('main_categories')->insert([
                'name' => $categoryName,
                'description' => 'Categoría principal para ' . strtolower($categoryName),
                'slug' => Str::slug($categoryName),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
