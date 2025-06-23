<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            // Relación con la orden
            $table->foreignId('order_id')->constrained()->onDelete('cascade');

            // Relación con el producto
            $table->foreignId('product_id')->constrained()->onDelete('cascade');

            // Cantidad de ese producto comprado
            $table->integer('quantity');

            // Precio unitario en ese momento (en PEN)
            $table->decimal('price_pen', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
