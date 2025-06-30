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
        Schema::create('refund_requests', function (Blueprint $table) {
            $table->id();
            // Relación con la orden
            $table->foreignId('order_id')->constrained()->onDelete('cascade');

            // Motivo general (seleccionado del dropdown)
            $table->string('reason'); // No nullable: se debe seleccionar

            // Comentario adicional del usuario (opcional)
            $table->text('user_comment')->nullable();

            // Estado del reembolso
            $table->enum('status', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente');

            // Respuesta del administrador (opcional)
            $table->text('admin_response')->nullable();

            // Cuándo se procesó (aprobó o rechazó)
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refund_requests');
    }
};
