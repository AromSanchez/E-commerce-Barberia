<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Mail\OrderReceiptMail;
use App\Services\PDFService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::with(['items.product', 'refundRequest'])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'orderNumber' => $order->order_number,
                    'date' => $order->created_at->toISOString(),
                    'total' => (float) $order->total_amount,
                    'status' => match ($order->order_status) {
                        'pendiente' => 'pending',
                        'procesando' => 'processing',
                        'enviado' => 'shipped',
                        'entregado' => 'completed',
                        'cancelado' => 'cancelled',
                        default => 'pending'
                    },
                    'items' => $order->items->map(fn($item) => [
                        'id' => $item->product_id,
                        'name' => $item->product->name,
                        'price' => (float) $item->price,
                        'quantity' => $item->quantity,
                        'image' => $item->product->image ?? 'https://placehold.co/200x200?text=Producto'
                    ]),
                    'shippingAddress' => $order->shipping_address,
                    'refund_request' => $order->refundRequest ? [
                        'id' => $order->refundRequest->id,
                        'status' => $order->refundRequest->status,
                        'reason' => $order->refundRequest->reason,
                        'user_comment' => $order->refundRequest->user_comment,
                        'admin_response' => $order->refundRequest->admin_response,
                        'created_at' => $order->refundRequest->created_at,
                        'updated_at' => $order->refundRequest->updated_at,
                    ] : null,
                ];
            });

        $totalSpent = $orders->sum('total');
        $completedOrders = $orders->where('status', 'completed')->count();

        return Inertia::render('Historial', [
            'orders' => $orders,
            'totals' => [
                'totalOrders' => $orders->count(),
                'totalSpent' => $totalSpent,
                'averageOrder' => $orders->count() > 0 ? round($totalSpent / $orders->count(), 2) : 0,
                'completedOrders' => $completedOrders
            ]
        ]);
    }
    public function store(Request $request)
    {
        Log::debug('Datos recibidos:', $request->all()); // ✅ Ver qué llega
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $userId = $user?->id;
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            Log::debug('Creando orden...');
            
            // Obtener cupón de la sesión si existe
            $coupon = session()->get('coupon');
            $discount = 0;
            $couponId = null;

            // Calcular el total sin descuentos
            $total = 0;
            foreach ($request->products as $item) {
                $product = Product::findOrFail($item['id']);
                $price = $product->sale_price ?? $product->regular_price;
                $total += $price * $item['quantity'];
            }
            
            // Aplicar descuento del cupón si existe
            if ($coupon) {
                if ($coupon['type'] === 'fixed') {
                    $discount = $coupon['value'];
                } elseif ($coupon['type'] === 'percentage') {
                    $discount = $total * ($coupon['value'] / 100);
                }
                $couponId = $coupon['id'];
                
                // Actualizar contador de uso del cupón
                $couponModel = \App\Models\Coupon::find($couponId);
                if ($couponModel) {
                    $couponModel->increment('usage_count');
                }
            }

            // Total final después del descuento
            $finalTotal = max(0, $total - $discount);
            
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $finalTotal,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'payment_status' => 'pagado',
                'order_status' => 'pendiente',
                'coupon_id' => $couponId,
                'discount_amount' => $discount,
            ]);
            
            // Generar número personalizado
            $orderNumber = 'PED-' . now()->year . '-' . str_pad($order->id, 3, '0', STR_PAD_LEFT);
            $order->order_number = $orderNumber;
            $order->save();

            Log::debug('Orden creada: ' . $order->id);

            // Limpiar el cupón de la sesión después de usar
            session()->forget('coupon');

            foreach ($request->products as $item) {
                $product = Product::findOrFail($item['id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->sale_price ?? $product->regular_price,
                ]);

                // Reducir stock si no se hizo en PaymentController
                $product->decrement('stock', $item['quantity']);
            }

            // Generar la boleta PDF
            try {
                $pdfService = new PDFService();
                $pdfPath = $pdfService->generateReceiptPDF($order);

                // Guardar ruta del PDF en la orden
                $order->invoice_path = $pdfPath;
                $order->save();

                // Enviar correo con la boleta si tenemos un usuario con email
                if ($user && $user->email) {
                    Mail::to($user->email)->send(new OrderReceiptMail($order, $pdfPath));
                    Log::info('Boleta enviada por correo a: ' . $user->email);
                } else if ($request->has('customer_email') && filter_var($request->customer_email, FILTER_VALIDATE_EMAIL)) {
                    // Si no hay usuario pero tenemos un email en la solicitud
                    Mail::to($request->customer_email)->send(new OrderReceiptMail($order, $pdfPath));
                    Log::info('Boleta enviada por correo a: ' . $request->customer_email);
                }
            } catch (\Exception $e) {
                // Si hay un error en la generación o envío del PDF, lo registramos pero no fallamos la orden
                Log::error('Error al generar/enviar la boleta: ' . $e->getMessage());
            }

            DB::commit();

            Log::info('Orden guardada con éxito');
            return response()->json(['message' => 'Orden guardada con éxito'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar la orden: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al guardar la orden',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function indexSeguimiento()
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'customer_phone' => $order->customer_phone,
                    'shipping_address' => $order->shipping_address,
                    'total_amount' => (float) $order->total_amount,
                    'order_status' => $order->order_status,
                    'created_at' => $order->created_at->toDateString(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->price,
                            'total_price' => (float) $item->price * $item->quantity,
                        ];
                    }),
                ];
            });

        return Inertia::render('DashAdmin/DashTracking/DashTracking', [
            'orders' => $orders,
        ]);
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'order_status' => 'required|in:pendiente,procesando,enviado,entregado,cancelado',
        ]);

        $order = Order::findOrFail($id);
        $order->order_status = $request->order_status;
        $order->save();
    }
}
