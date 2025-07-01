<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Usuario normal de prueba
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        
        // Usuario administrador
        User::factory()->create([
            'name' => 'Administrador',
            'last_name' => 'Sistema',
            'email' => 'admin@barberia.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);
        
        // Ejecutar el seeder para las categorías principales
        $this->call([
            MainCategorySeeder::class,
        ]);
    }
}
