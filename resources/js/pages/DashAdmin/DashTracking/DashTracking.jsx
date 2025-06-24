import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import HeadAdmin from '@/Layouts/head_admin/HeadAdmin';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState } from "react"
import { Search, Truck, Eye, FileText } from "lucide-react"
import { usePage, router } from '@inertiajs/react';

const statusOptions = ["procesando", "enviado", "entregado", "cancelado"];

const statusLabels = {
  procesando: "Procesando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado"
};

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "procesando":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "enviado":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "entregado":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelado":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export default function OrderTracking() {
  const { orders: ordersFromServer = [] } = usePage().props;
  const [orders, setOrders] = useState(ordersFromServer);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleStatusChange = (orderId, newStatus) => {
    // Actualiza en el frontend inmediatamente (optimista)
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, order_status: newStatus } : order)));
    // Llama a la API para actualizar en la base de datos
    router.patch(route('dashboard.orders.updateStatus', orderId), { order_status: newStatus }, {
      preserveScroll: true,
      onError: () => {
        // Si hay error, recarga los datos originales
        setOrders(ordersFromServer);
      }
    });
  };

  const toggleDropdown = (orderId) => {
    setDropdownOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <Head title="Seguimiento de Pedidos" />
      <div className="flex h-screen">
        <div className="fixed left-0 h-full">
          <NavAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="fixed top-0 right-0 z-10 bg-white" style={{ left: isCollapsed ? 80 : 256 }}>
            <HeadAdmin />
          </div>
          <div className="pt-[73px] h-screen bg-gray-50/50">
            <div className="p-8 h-full">
              <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seguimiento de Pedidos</h1>
                      <p className="text-gray-600">Gestiona y monitorea el estado de todos los pedidos</p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar por número de orden o cliente..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Lista de Pedidos</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {filteredOrders.length} pedidos
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">N° Orden</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado Actual</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Cambiar Estado</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha del Pedido</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                                <td className="py-3 px-4 font-medium text-blue-600">{order.order_number}</td>
                                <td className="py-3 px-4">
                                  <div className="font-medium text-gray-900">{order.customer_name}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeVariant(order.order_status)}`}>
                                    {statusLabels[order.order_status] || order.order_status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <select
                                    value={order.order_status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="w-[140px] px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    {statusOptions.map((status) => (
                                      <option key={status} value={status}>
                                        {statusLabels[status]}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-3 px-4 text-gray-600">
                                  {order.created_at}
                                </td>
                                <td className="py-3 px-4 font-semibold text-gray-900">S/ {order.total_amount.toFixed(2)}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      className="h-8 w-8 p-0 flex items-center justify-center rounded hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                      title="Ver detalles"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      className="h-8 w-8 p-0 flex items-center justify-center rounded hover:bg-green-50 hover:text-green-600 transition-colors"
                                      title="Generar factura"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredOrders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="rounded-full bg-gray-100 p-3 mb-4">
                            <Search className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pedidos</h3>
                          <p className="text-gray-600 max-w-sm">
                            No hay pedidos que coincidan con tu búsqueda. Intenta con otros términos.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {statusOptions.map((status) => {
                      const count = orders.filter((order) => order.order_status === status).length;
                      return (
                        <div key={status} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600">{statusLabels[status]}</p>
                                <p className="text-2xl font-bold text-gray-900">{count}</p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeVariant(status)}`}>
                                {count}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}