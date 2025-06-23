<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Exception;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
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
            $exchangeRate = 0.27; // Tasa de cambio PEN a USD (actualizar según sea necesario)
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

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'publicKey' => $stripeKey,
                'amountInUSD' => $amountInUSD
            ]);

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
