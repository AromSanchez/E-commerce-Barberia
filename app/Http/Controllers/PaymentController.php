<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'customer_name' => 'required|string|max:255',
                'customer_phone' => 'required|string|max:20',
                'shipping_address' => 'required|string|max:500',
                'products' => 'required|array|min:1',
                'products.*.id' => 'required|integer|exists:products,id',
                'products.*.quantity' => 'required|integer|min:1',
            ]);

            // Verificar que las claves de Stripe estén configuradas
            $stripeKey = config('services.stripe.key');
            $stripeSecret = config('services.stripe.secret');

            if (empty($stripeSecret)) {
                Log::error('Stripe secret key no está configurada');
                return response()->json([
                    'error' => 'Error de configuración de Stripe',
                    'details' => 'La clave secreta de Stripe no está configurada'
                ], 500);
            }

            // Configurar Stripe con la clave secreta
            Stripe::setApiKey($stripeSecret);

            // Convertir el monto de PEN a USD (usando una tasa aproximada de 1 PEN = 0.27 USD)
            // Nota: Deberías usar un servicio de tipos de cambio en tiempo real en producción
            $amountInPEN = $request->amount;
            $exchangeRate = 0.28; // Tasa de cambio PEN a USD (actualizar según sea necesario)
            $amountInUSD = $amountInPEN * $exchangeRate;

            // Log para debugging
            Log::info('Creando PaymentIntent', [
                'amount_pen' => $amountInPEN,
                'amount_usd' => $amountInUSD,
                'exchange_rate' => $exchangeRate
            ]);

            $paymentIntent = PaymentIntent::create([
                'amount' => intval($amountInUSD * 100), // convertir a centavos
                'currency' => 'usd', // Usar USD ya que PEN no está soportado
                'payment_method_types' => ['card'],
                'metadata' => [
                    'order_id' => uniqid('order_'),
                    'customer_ip' => $request->ip(),
                    'original_amount_pen' => $amountInPEN
                ]
            ]);

            Log::info('PaymentIntent creado exitosamente', [
                'payment_intent_id' => $paymentIntent->id
            ]);

            if ($paymentIntent->status === 'requires_confirmation' || $paymentIntent->status === 'requires_payment_method') {
                return response()->json([
                    'clientSecret' => $paymentIntent->client_secret,
                    'publicKey' => $stripeKey,
                    'amountInUSD' => $amountInUSD
                ]);
            }

            // Si el intent ya está confirmado (modo automático), entonces guardamos la orden
            DB::beginTransaction();

            try {
                // Crear orden
                $order = Order::create([
                    'user_id' => auth()->id(), // O null si no hay autenticación
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'shipping_address' => $request->shipping_address,
                    'total_amount' => $amountInPEN,
                    'payment_status' => 'paid',
                    'order_status' => 'pending', // Puedes cambiar luego a "shipped", "completed"
                ]);

                foreach ($request->products as $item) {
                    $product = Product::findOrFail($item['id']);

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->sale_price ?? $product->regular_price,
                    ]);

                    // Reducir el stock
                    $product->decrement('stock', $item['quantity']);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Orden registrada correctamente',
                    'order_id' => $order->id,
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error al guardar la orden: ' . $e->getMessage());

                return response()->json([
                    'error' => 'El pago fue procesado, pero ocurrió un error al registrar la orden',
                    'type' => 'db_error'
                ], 500);
            }
        } catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('Error de API de Stripe', [
                'error' => $e->getMessage(),
                'type' => get_class($e)
            ]);
            return response()->json([
                'error' => 'Error de Stripe: ' . $e->getMessage(),
                'type' => 'stripe_error'
            ], 500);
        } catch (Exception $e) {
            Log::error('Error general en createPaymentIntent', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Error del servidor: ' . $e->getMessage(),
                'type' => 'server_error'
            ], 500);
        }
    }
}
