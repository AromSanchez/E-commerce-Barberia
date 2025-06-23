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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('shipping_address');
            $table->decimal('total_amount', 10, 2);

            // 👇 Columnas en inglés, pero valores en español
            $table->enum('payment_status', ['pendiente', 'pagado', 'fallido'])->default('pendiente');
            $table->enum('order_status', ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'])->default('pendiente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
