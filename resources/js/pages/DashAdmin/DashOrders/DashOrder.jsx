import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import { Search, FileText } from 'lucide-react';

export default function DashOrder() {
    const { orders } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (orders) {
            setOrderList(orders);
        } else {
            // Datos de ejemplo para mostrar en la tabla si no hay datos reales
            setOrderList([
                { 
                    id: 1, 
                    order_number: 'ORD-001', 
                    customer_name: 'Juan Pérez',
                    phone: '123-456-7890',
                    shipping_address: 'Calle Falsa 123',
                    total: 177.00,
                    status: 'procesando',
                    order_date: '2023-07-15',
                    total_items: 3,
                    delivered_on: null
                },
                { 
                    id: 2, 
                    order_number: 'ORD-002', 
                    customer_name: 'María López',
                    phone: '987-654-3210',
                    shipping_address: 'Av. Siempre Viva 742',
                    total: 236.00,
                    status: 'entregado',
                    order_date: '2023-07-10',
                    total_items: 5,
                    delivered_on: '2023-07-12'
                }
            ]);
        }
    }, [orders]);

    const handleDeleteOrder = (id) => {
        router.delete(route('dashboard.orders.destroy', id), {
            onSuccess: () => {
                setOrderList(orderList.filter(order => order.id !== id));
            }
        });
    };

    const handleEditOrder = (order) => {
        setOrderToEdit(order);
        setEditDialogOpen(true);
    };

    const handleUpdateOrder = (updatedOrder) => {
        router.patch(route('dashboard.orders.update', updatedOrder.id), updatedOrder, {
            onSuccess: () => {
                setOrderList(orderList.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
                ));
                setEditDialogOpen(false);
            }
        });
    };

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Filtrar órdenes según el término de búsqueda
    const filteredOrders = orderList.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.includes(searchTerm) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Órdenes" />
            <div className="flex h-screen">
                <div className="fixed left-0 h-full">
                    <NavAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                </div>
                <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <div className="fixed top-0 right-0 z-10 bg-white" style={{ left: isCollapsed ? 80 : 256 }}>
                        <HeadAdmin />
                    </div>
                    <div className="pt-[73px] h-screen bg-[#F2F7FB]">
                        <div className="p-8 h-full">
                            {/* Encabezado y título */}
                            <div className="bg-white p-6 rounded-lg shadow-sm h-[calc(100%-2rem)] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <FileText className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Órdenes</h2>
                                    </div>
                                </div>
                                
                                {/* Barra de búsqueda */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-1/2">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar orden..." 
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Tabla de órdenes */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">N° Orden</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Cliente</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Teléfono</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Dirección</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Total</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Fecha Orden</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Total Items</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Entregado el</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredOrders.length > 0 ? (
                                                    filteredOrders.map((order) => (
                                                        <tr key={order.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{order.order_number}</td>
                                                            <td className="p-4 text-sm text-gray-600">{order.customer_name}</td>
                                                            <td className="p-4 text-sm text-gray-600">{order.phone}</td>
                                                            <td className="p-4 text-sm text-gray-600">{order.shipping_address}</td>
                                                            <td className="p-4 text-sm text-gray-600">${order.total.toFixed(2)}</td>
                                                            <td className="p-4 text-sm">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                                    order.status === 'entregado' 
                                                                        ? 'text-green-700 bg-green-100' 
                                                                        : order.status === 'procesando'
                                                                            ? 'text-yellow-700 bg-yellow-100'
                                                                            : order.status === 'cancelado'
                                                                                ? 'text-red-700 bg-red-100'
                                                                                : 'text-gray-700 bg-gray-100'
                                                                }`}>
                                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">{order.order_date}</td>
                                                            <td className="p-4 text-sm text-gray-600">{order.total_items}</td>
                                                            <td className="p-4 text-sm text-gray-600">{order.delivered_on || '-'}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button 
                                                                        className="text-green-600 hover:text-green-900 p-1"
                                                                        onClick={() => handleEditOrder(order)}
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button 
                                                                        className="text-red-600 hover:text-red-900 p-1"
                                                                        onClick={() => handleDeleteOrder(order.id)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No hay órdenes disponibles
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aquí podrías añadir componentes de diálogo para editar órdenes si es necesario */}
        </AuthenticatedLayout>
    );
}