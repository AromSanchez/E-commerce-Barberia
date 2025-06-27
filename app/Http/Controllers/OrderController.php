<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::with('items.product')
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
                        'price' => (float) $item->price, // 👈 aquí la magia
                        'quantity' => $item->quantity,
                        'image' => $item->product->image ?? 'https://placehold.co/200x200?text=Producto'
                    ]),
                    'shippingAddress' => $order->shipping_address
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
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $request->amount,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'payment_status' => 'pagado', 
                'order_status' => 'pendiente', 
            ]);
            // Generar número personalizado
            $orderNumber = 'PED-' . now()->year . '-' . str_pad($order->id, 3, '0', STR_PAD_LEFT);
            $order->order_number = $orderNumber;
            $order->save();

            Log::debug('Orden creada: ' . $order->id);


            foreach ($request->products as $item) {
                $product = Product::findOrFail($item['id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->sale_price ?? $product->regular_price,
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            DB::commit();

            Log::info('Orden guardada con éxito');
            // AQUI ES DONDE GENERAMOS EL PDF DE LA ORDEN
            Log::debug('Generando PDF para la orden: ' . $order->id);

            $order->load('items.product');

            $pdf = Pdf::loadView('pdf.boleta', ['order' => $order]);

            $filename = $order->order_number . '.pdf'; // 👈 aquí usas el número
            $path = 'facturas/' . $filename;

            Storage::disk('public')->makeDirectory('facturas'); // crea carpeta si no existe
            Storage::disk('public')->put($path, $pdf->output());

            // Guarda la ruta en la orden
            $order->update(['invoice_path' => $path]);
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
    public function indexAdmin()
    {

        $orders = Order::with('items.product', 'user')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'phone' => $order->customer_phone,
                    'shipping_address' => $order->shipping_address,
                    'total' => (float) $order->total_amount,
                    'status' => $order->order_status,
                    'order_date' => $order->created_at->toDateString(),
                    'delivered_on' => $order->order_status === 'entregado' ? $order->updated_at->toDateString() : null,
                    'total_items' => $order->items->sum('quantity'),
                ];
            });

        return Inertia::render('DashAdmin/DashOrders/DashOrder', [
            'orders' => $orders,
        ]);
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
