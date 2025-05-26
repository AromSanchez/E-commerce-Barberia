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
        Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // puedes agregarlo si necesitas el nombre del producto
        $table->decimal('regular_price', 10, 2);
        $table->decimal('sale_price', 10, 2)->nullable();
        $table->unsignedBigInteger('category_id');
        $table->unsignedBigInteger('brand_id')->nullable(); // por si no todos los productos tienen marca
        $table->boolean('is_featured')->default(false);
        $table->integer('stock')->default(0);
        $table->string('image')->nullable(); // si solo almacenas el nombre del archivo o ruta
        $table->text('short_description')->nullable();
        $table->longText('long_description')->nullable();
        $table->string('slug')->unique();
        $table->timestamps();

        // Foreign keys (opcional, si ya tienes tablas `categories` y `brands`)
        $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        $table->foreign('brand_id')->references('id')->on('brands')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
