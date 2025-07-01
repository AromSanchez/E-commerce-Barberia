
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

export default function ListOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/dashboard/recent-orders');
        console.log("Órdenes recientes:", response.data);
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
        
        // Mostrar indicador de scroll si hay más de 7 órdenes
        setShowScrollIndicator(ordersData.length > 7);
        
        setError(null);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
        setError("No se pudieron cargar las órdenes recientes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Formatear moneda
  const formatCurrency = (amount) => {
    return `S/${parseFloat(amount).toFixed(2)}`;
  };

  // Obtener la clase de color para el estado
  const getStatusClass = (color) => {
    const colorClasses = {
      'yellow': 'text-yellow-800 bg-yellow-100',
      'blue': 'text-blue-800 bg-blue-100',
      'green': 'text-green-800 bg-green-100',
      'indigo': 'text-indigo-800 bg-indigo-100',
      'red': 'text-red-800 bg-red-100',
    };
    return colorClasses[color] || 'text-gray-800 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h5 className="text-xl font-bold text-gray-800">Órdenes Recientes</h5>
        <Link href="/dashboard/tracking" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Ver todas
        </Link>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="relative">
            {showScrollIndicator && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
            )}
            <div className="max-h-[480px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}>
            <table className="w-full min-w-[800px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 text-gray-700 shadow-sm">
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">N° Orden</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Teléfono</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Subtotal</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Envío</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{order.order_number}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.customer_phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(order.subtotal)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(order.shipping)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 text-xs font-semibold ${getStatusClass(order.status_color)} rounded-full`}>
                        {order.status_text}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No hay órdenes recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}