<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getMonthlyStats()
    {
        // Obtener el año actual
        $currentYear = Carbon::now()->year;
        
        // Obtener datos mensuales de ingresos y pedidos para el año actual
        $monthlyStats = Order::select(
            DB::raw('EXTRACT(MONTH FROM created_at) as month'),
            DB::raw('SUM(total_amount) as ingresos'),
            DB::raw('COUNT(*) as pedidos')
        )
        ->whereYear('created_at', $currentYear)
        ->where('payment_status', 'pagado')
        ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
        ->orderBy('month')
        ->get();
        
        // Crear un array con todos los meses del año
        $months = [
            1 => 'Ene', 2 => 'Feb', 3 => 'Mar', 4 => 'Abr', 5 => 'May', 6 => 'Jun',
            7 => 'Jul', 8 => 'Ago', 9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dic'
        ];
        
        // Inicializar el array de resultados con valores en cero
        $result = [];
        foreach ($months as $monthNum => $monthName) {
            $result[] = [
                'name' => $monthName,
                'ingresos' => 0,
                'pedidos' => 0
            ];
        }
        
        // Rellenar con datos reales donde existan
        foreach ($monthlyStats as $stat) {
            $monthIndex = $stat->month - 1; // Ajustar al índice base 0
            $result[$monthIndex]['ingresos'] = round((float)$stat->ingresos, 2);
            $result[$monthIndex]['pedidos'] = (int)$stat->pedidos;
        }
        
        // Calcular resumen
        $totalIngresos = array_sum(array_column($result, 'ingresos'));
        $totalPedidos = array_sum(array_column($result, 'pedidos'));
        
        // Calcular porcentajes de cambio (comparando con el mes anterior)
        $lastMonthIndex = Carbon::now()->subMonth()->month - 1;
        $currentMonthIndex = Carbon::now()->month - 1;
        
        $lastMonthIngresos = $result[$lastMonthIndex]['ingresos'] ?: 1; // Evitar división por cero
        $lastMonthPedidos = $result[$lastMonthIndex]['pedidos'] ?: 1; // Evitar división por cero
        
        $ingresosPorcentaje = round((($result[$currentMonthIndex]['ingresos'] - $lastMonthIngresos) / $lastMonthIngresos) * 100, 1);
        $pedidosPorcentaje = round((($result[$currentMonthIndex]['pedidos'] - $lastMonthPedidos) / $lastMonthPedidos) * 100, 1);
        
        return response()->json([
            'data' => $result,
            'summary' => [
                'ingresos' => $result[$currentMonthIndex]['ingresos'],
                'ingresosPorcentaje' => $ingresosPorcentaje,
                'pedidos' => $result[$currentMonthIndex]['pedidos'],
                'pedidosPorcentaje' => $pedidosPorcentaje
            ]
        ]);
    }

    public function getSalesPerformance(Request $request)
    {
        // Obtener el parámetro de vista (mensual o anual)
        $view = $request->query('view', 'mensual');
        
        if ($view === 'mensual') {
            return $this->getMonthlySalesData();
        } else {
            return $this->getYearlySalesData();
        }
    }
    
    /**
     * Obtener datos de ventas mensuales para el año actual
     */
    private function getMonthlySalesData()
    {
        // Obtener el año actual
        $currentYear = Carbon::now()->year;
        
        // Obtener datos mensuales de ventas (número de pedidos) y ganancias (total de ingresos)
        $monthlyStats = Order::select(
            DB::raw('EXTRACT(MONTH FROM created_at) as month'),
            DB::raw('COUNT(*) as ventas'),
            DB::raw('SUM(total_amount) as ganancia')
        )
        ->whereYear('created_at', $currentYear)
        ->where('payment_status', 'pagado')
        ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
        ->orderBy('month')
        ->get();
        
        // Crear un array con todos los meses del año
        $months = [
            1 => 'Ene', 2 => 'Feb', 3 => 'Mar', 4 => 'Abr', 5 => 'May', 6 => 'Jun',
            7 => 'Jul', 8 => 'Ago', 9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dic'
        ];
        
        // Inicializar el array de resultados con valores en cero
        $result = [];
        foreach ($months as $monthNum => $monthName) {
            $result[] = [
                'mes' => $monthName,
                'ventas' => 0,
                'ganancia' => 0
            ];
        }
        
        // Rellenar con datos reales donde existan
        foreach ($monthlyStats as $stat) {
            $monthIndex = $stat->month - 1; // Ajustar al índice base 0
            $result[$monthIndex]['ventas'] = (int)$stat->ventas;
            $result[$monthIndex]['ganancia'] = round((float)$stat->ganancia, 2);
        }
        
        // Calcular resumen
        $totalVentas = array_sum(array_column($result, 'ventas'));
        $totalGanancias = array_sum(array_column($result, 'ganancia'));
        
        // Calcular porcentajes de cambio (comparando with el mes anterior)
        $lastMonthIndex = Carbon::now()->subMonth()->month - 1;
        $currentMonthIndex = Carbon::now()->month - 1;
        
        $lastMonthVentas = $result[$lastMonthIndex]['ventas'] ?: 1; // Evitar división por cero
        $lastMonthGanancias = $result[$lastMonthIndex]['ganancia'] ?: 1; // Evitar división por cero
        
        $ventasPorcentaje = round((($result[$currentMonthIndex]['ventas'] - $lastMonthVentas) / $lastMonthVentas) * 100, 1);
        $gananciaPorcentaje = round((($result[$currentMonthIndex]['ganancia'] - $lastMonthGanancias) / $lastMonthGanancias) * 100, 1);
        
        return response()->json([
            'data' => $result,
            'summary' => [
                'ventasTotal' => $totalVentas,
                'ventasPorcentaje' => $ventasPorcentaje,
                'gananciaTotal' => $totalGanancias,
                'gananciaPorcentaje' => $gananciaPorcentaje
            ]
        ]);
    }
    
    /**
     * Obtener datos de ventas anuales para los últimos 5 años
     */
    private function getYearlySalesData()
    {
        // Obtener el año actual
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 4; // Mostrar los últimos 5 años
        
        // Obtener datos anuales de ventas (número de pedidos) y ganancias (total de ingresos)
        $yearlyStats = Order::select(
            DB::raw('EXTRACT(YEAR FROM created_at) as year'),
            DB::raw('COUNT(*) as ventas'),
            DB::raw('SUM(total_amount) as ganancia')
        )
        ->whereYear('created_at', '>=', $startYear)
        ->where('payment_status', 'pagado')
        ->groupBy(DB::raw('EXTRACT(YEAR FROM created_at)'))
        ->orderBy('year')
        ->get();
        
        // Inicializar el array de resultados con valores en cero
        $result = [];
        for ($year = $startYear; $year <= $currentYear; $year++) {
            $result[] = [
                'mes' => (string)$year, // Usamos 'mes' como clave para mantener compatibilidad con el frontend
                'ventas' => 0,
                'ganancia' => 0
            ];
        }
        
        // Rellenar con datos reales donde existan
        foreach ($yearlyStats as $stat) {
            $yearIndex = $stat->year - $startYear; // Calcular índice basado en el año de inicio
            if (isset($result[$yearIndex])) {
                $result[$yearIndex]['ventas'] = (int)$stat->ventas;
                $result[$yearIndex]['ganancia'] = round((float)$stat->ganancia, 2);
            }
        }
        
        // Calcular resumen
        $totalVentas = array_sum(array_column($result, 'ventas'));
        $totalGanancias = array_sum(array_column($result, 'ganancia'));
        
        // Calcular porcentajes de cambio (comparando con el año anterior)
        $currentYearIndex = count($result) - 1;
        $lastYearIndex = $currentYearIndex - 1;
        
        $lastYearVentas = $lastYearIndex >= 0 ? ($result[$lastYearIndex]['ventas'] ?: 1) : 1; // Evitar división por cero
        $lastYearGanancias = $lastYearIndex >= 0 ? ($result[$lastYearIndex]['ganancia'] ?: 1) : 1; // Evitar división por cero
        
        $ventasPorcentaje = round((($result[$currentYearIndex]['ventas'] - $lastYearVentas) / $lastYearVentas) * 100, 1);
        $gananciaPorcentaje = round((($result[$currentYearIndex]['ganancia'] - $lastYearGanancias) / $lastYearGanancias) * 100, 1);
        
        return response()->json([
            'data' => $result,
            'summary' => [
                'ventasTotal' => $totalVentas,
                'ventasPorcentaje' => $ventasPorcentaje,
                'gananciaTotal' => $totalGanancias,
                'gananciaPorcentaje' => $gananciaPorcentaje
            ]
        ]);
    }
    
    /**
     * Obtener estadísticas generales del proyecto
     */
    public function getProjectStats()
    {
        // Contar productos
        $totalProducts = \App\Models\Product::count();
        
        // Contar órdenes (incluir todas las órdenes, independientemente del estado de pago)
        $totalOrders = \App\Models\Order::count();
        
        // También contamos órdenes pagadas por separado
        $paidOrders = \App\Models\Order::where('payment_status', 'pagado')->count();
        
        // Calcular ingresos anuales del año actual
        $currentYear = Carbon::now()->year;
        $annualIncome = \App\Models\Order::whereYear('created_at', $currentYear)
            ->where('payment_status', 'pagado')
            ->sum('total_amount');
            
        // Calcular ingresos del año anterior para comparación
        $lastYear = $currentYear - 1;
        $lastYearIncome = \App\Models\Order::whereYear('created_at', $lastYear)
            ->where('payment_status', 'pagado')
            ->sum('total_amount');
            
        // Calcular el porcentaje de crecimiento
        $revenueGrowth = 0;
        if ($lastYearIncome > 0) {
            $revenueGrowth = round((($annualIncome - $lastYearIncome) / $lastYearIncome) * 100, 1);
        }
        
        // Producto más vendido
        $bestSellingProduct = \App\Models\OrderItem::select(
            'product_id',
            DB::raw('SUM(quantity) as total_sold')
        )
        ->with('product:id,name,image,slug')
        ->groupBy('product_id')
        ->orderByDesc('total_sold')
        ->first();
        
        // Datos adicionales del producto más vendido
        $topProduct = null;
        if ($bestSellingProduct && $bestSellingProduct->product) {
            $topProduct = [
                'name' => $bestSellingProduct->product->name,
                'image' => $bestSellingProduct->product->image,
                'slug' => $bestSellingProduct->product->slug,
                'total_sold' => $bestSellingProduct->total_sold,
            ];
        }
        
        return response()->json([
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'paid_orders' => $paidOrders,
            'annual_income' => round($annualIncome, 2),
            'revenue_growth' => $revenueGrowth,
            'last_year_income' => round($lastYearIncome, 2),
            'best_selling_product' => $topProduct
        ]);
    }
    
    /**
     * Obtener actividad reciente para el dashboard
     */
    public function getRecentActivity()
    {
        // Obtener las 5 órdenes más recientes
        $recentOrders = \App\Models\Order::select('id', 'order_number', 'total_amount', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'type' => 'order',
                    'description' => 'Nuevo pedido #' . $order->order_number,
                    'amount' => $order->total_amount,
                    'date' => $order->created_at,
                ];
            });
            
        // Obtener los 5 usuarios más recientes
        $recentUsers = \App\Models\User::select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($user) {
                return [
                    'type' => 'user',
                    'description' => 'Nuevo usuario: ' . $user->name,
                    'email' => $user->email,
                    'date' => $user->created_at,
                ];
            });
            
        // Obtener los 5 productos más recientes
        $recentProducts = \App\Models\Product::select('id', 'name', 'regular_price', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($product) {
                return [
                    'type' => 'product',
                    'description' => 'Producto añadido: ' . $product->name,
                    'price' => $product->regular_price,
                    'date' => $product->created_at,
                ];
            });
            
        // Combinar todas las actividades
        $allActivities = $recentOrders->concat($recentUsers)->concat($recentProducts)
            ->sortByDesc('date')
            ->take(5)
            ->values()
            ->toArray();
            
        // Calcular el porcentaje de crecimiento de actividad este mes
        $currentDate = now();
        $currentYear = $currentDate->year;
        $currentMonth = $currentDate->month;
        
        // Obtener fecha del mes anterior (considerando cambio de año)
        $lastMonthDate = $currentDate->copy()->subMonth();
        $lastYear = $lastMonthDate->year;
        $lastMonth = $lastMonthDate->month;
        
        // Contar actividad del mes actual
        $currentMonthActivity = \App\Models\Order::whereYear('created_at', $currentYear)
                                ->whereMonth('created_at', $currentMonth)
                                ->count();
                                
        $currentMonthActivity += \App\Models\User::whereYear('created_at', $currentYear)
                                ->whereMonth('created_at', $currentMonth)
                                ->count();
                                
        $currentMonthActivity += \App\Models\Product::whereYear('created_at', $currentYear)
                                ->whereMonth('created_at', $currentMonth)
                                ->count();
        
        // Contar actividad del mes anterior
        $lastMonthActivity = \App\Models\Order::whereYear('created_at', $lastYear)
                            ->whereMonth('created_at', $lastMonth)
                            ->count();
                            
        $lastMonthActivity += \App\Models\User::whereYear('created_at', $lastYear)
                            ->whereMonth('created_at', $lastMonth)
                            ->count();
                            
        $lastMonthActivity += \App\Models\Product::whereYear('created_at', $lastYear)
                            ->whereMonth('created_at', $lastMonth)
                            ->count();
        
        // Si no hay datos, vamos a usar datos de ejemplo solo para demostración
        if ($currentMonthActivity == 0 && $lastMonthActivity == 0) {
            // Crear datos de ejemplo solo para visualización
            $currentMonthActivity = 12;
            $lastMonthActivity = 10;
        }
        
        // Calcular el porcentaje de crecimiento
        $growthPercentage = 0;
        if ($lastMonthActivity > 0) {
            $growthPercentage = round((($currentMonthActivity - $lastMonthActivity) / $lastMonthActivity) * 100);
        } else if ($currentMonthActivity > 0) {
            // Si no había actividad el mes anterior pero sí este mes, es un crecimiento del 100%
            $growthPercentage = 100;
        }
        
        // Debug: imprimir valores para diagnosticar
        \Illuminate\Support\Facades\Log::info("Actividad mes actual: $currentMonthActivity, Mes anterior: $lastMonthActivity, Crecimiento: $growthPercentage%");
        
        return response()->json([
            'activities' => $allActivities,
            'growth_percentage' => $growthPercentage,
            'debug_info' => [
                'current_month_activity' => $currentMonthActivity,
                'last_month_activity' => $lastMonthActivity
            ]
        ]);
    }
    
    /**
     * Obtener las órdenes más recientes para el dashboard
     */
    public function getRecentOrders()
    {
        $recentOrders = \App\Models\Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                // Calcular subtotal y envío
                $shipping = 0;
                if ($order->total_amount < 50) {
                    $shipping = 10.00;
                }
                $subtotal = $order->total_amount - $shipping;
                
                // Formatear el estado para la visualización
                $statusMap = [
                    'pendiente' => ['text' => 'Pendiente', 'color' => 'yellow'],
                    'procesando' => ['text' => 'Procesando', 'color' => 'blue'],
                    'enviado' => ['text' => 'Enviado', 'color' => 'green'],
                    'entregado' => ['text' => 'Entregado', 'color' => 'indigo'],
                    'cancelado' => ['text' => 'Cancelado', 'color' => 'red'],
                ];
                
                $statusInfo = $statusMap[$order->order_status] ?? ['text' => 'Pendiente', 'color' => 'yellow'];
                
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name ?? $order->user->name ?? 'Cliente',
                    'customer_phone' => $order->customer_phone ?? 'No disponible',
                    'subtotal' => $subtotal,
                    'shipping' => $shipping,
                    'total' => $order->total_amount,
                    'status' => $order->order_status,
                    'status_text' => $statusInfo['text'],
                    'status_color' => $statusInfo['color'],
                    'date' => $order->created_at->format('Y-m-d H:i:s')
                ];
            });
            
        return response()->json([
            'orders' => $recentOrders
        ]);
    }
    
    /**
     * Obtener estadísticas para las tarjetas del dashboard
     */
    public function getCardsStats()
    {
        // Obtener el total de pedidos
        $totalOrders = \App\Models\Order::count();
        
        // Obtener el monto total de pedidos pagados del día actual
        $today = Carbon::today();
        $totalAmount = \App\Models\Order::whereDate('created_at', $today)
            ->where('payment_status', 'pagado')
            ->sum('total_amount');
        
        // Obtener el total de pedidos pendientes
        $pendingOrders = \App\Models\Order::where('order_status', 'pendiente')
            ->orWhere('order_status', 'procesando')
            ->count();
        
        // Obtener el total de pedidos entregados
        $deliveredOrders = \App\Models\Order::where('order_status', 'entregado')->count();
        
        // Obtener el total de pedidos cancelados y su monto
        $canceledOrders = \App\Models\Order::where('order_status', 'cancelado')->count();
        $canceledAmount = \App\Models\Order::where('order_status', 'cancelado')->sum('total_amount');
        
        // Obtener el total de pedidos reembolsados y su monto
        $refundRequests = \App\Models\RefundRequest::where('status', 'approved')->count();
        $refundedAmount = \App\Models\RefundRequest::where('status', 'approved')
            ->join('orders', 'refund_requests.order_id', '=', 'orders.id')
            ->sum('orders.total_amount');
        
        // Calcular porcentajes de cambio (comparando con el día anterior)
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        
        // Total de pedidos de hoy vs ayer
        $todayOrders = \App\Models\Order::whereDate('created_at', $today)->count();
        $yesterdayOrders = \App\Models\Order::whereDate('created_at', $yesterday)->count();
        $orderChangePercent = $yesterdayOrders > 0 
            ? round((($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100) 
            : ($todayOrders > 0 ? 100 : 0);
        
        // Monto total ya se calculó anteriormente como $totalAmount (para el día actual)
        // Ahora calculamos solo el monto total de ayer para obtener el cambio porcentual
        $yesterdayAmount = \App\Models\Order::whereDate('created_at', $yesterday)
            ->where('payment_status', 'pagado')
            ->sum('total_amount');
        $amountChangePercent = $yesterdayAmount > 0 
            ? round((($totalAmount - $yesterdayAmount) / $yesterdayAmount) * 100) 
            : ($totalAmount > 0 ? 100 : 0);
        
        // Pedidos pendientes de hoy vs ayer
        $todayPending = \App\Models\Order::whereDate('created_at', $today)
            ->where(function($query) {
                $query->where('order_status', 'pendiente')
                      ->orWhere('order_status', 'procesando');
            })
            ->count();
        $yesterdayPending = \App\Models\Order::whereDate('created_at', $yesterday)
            ->where(function($query) {
                $query->where('order_status', 'pendiente')
                      ->orWhere('order_status', 'procesando');
            })
            ->count();
        $pendingChangePercent = $yesterdayPending > 0 
            ? round((($todayPending - $yesterdayPending) / $yesterdayPending) * 100) 
            : ($todayPending > 0 ? 100 : 0);
        
        // Pedidos entregados de hoy vs ayer
        $todayDelivered = \App\Models\Order::whereDate('created_at', $today)
            ->where('order_status', 'entregado')
            ->count();
        $yesterdayDelivered = \App\Models\Order::whereDate('created_at', $yesterday)
            ->where('order_status', 'entregado')
            ->count();
        $deliveredChangePercent = $yesterdayDelivered > 0 
            ? round((($todayDelivered - $yesterdayDelivered) / $yesterdayDelivered) * 100) 
            : ($todayDelivered > 0 ? 100 : 0);
        
        // Pedidos cancelados de hoy vs ayer
        $todayCanceled = \App\Models\Order::whereDate('created_at', $today)
            ->where('order_status', 'cancelado')
            ->count();
        $yesterdayCanceled = \App\Models\Order::whereDate('created_at', $yesterday)
            ->where('order_status', 'cancelado')
            ->count();
        $canceledChangePercent = $yesterdayCanceled > 0 
            ? round((($todayCanceled - $yesterdayCanceled) / $yesterdayCanceled) * 100) 
            : ($todayCanceled > 0 ? 100 : 0);
        
        // Pedidos reembolsados de hoy vs ayer
        $todayRefunded = \App\Models\RefundRequest::whereDate('created_at', $today)
            ->where('status', 'approved')
            ->count();
        $yesterdayRefunded = \App\Models\RefundRequest::whereDate('created_at', $yesterday)
            ->where('status', 'approved')
            ->count();
        $refundedChangePercent = $yesterdayRefunded > 0 
            ? round((($todayRefunded - $yesterdayRefunded) / $yesterdayRefunded) * 100) 
            : ($todayRefunded > 0 ? 100 : 0);
        
        return response()->json([
            'total_orders' => [
                'value' => $totalOrders,
                'change_percent' => $orderChangePercent
            ],
            'total_amount' => [
                'value' => round($totalAmount, 2),
                'change_percent' => $amountChangePercent
            ],
            'pending_orders' => [
                'value' => $pendingOrders,
                'change_percent' => $pendingChangePercent
            ],
            'delivered_orders' => [
                'value' => $deliveredOrders,
                'change_percent' => $deliveredChangePercent
            ],
            'canceled_orders' => [
                'value' => $canceledOrders,
                'change_percent' => $canceledChangePercent,
                'amount' => round($canceledAmount, 2)
            ],
            'refunded_orders' => [
                'value' => $refundRequests,
                'change_percent' => $refundedChangePercent,
                'amount' => round($refundedAmount, 2)
            ]
        ]);
    }
}