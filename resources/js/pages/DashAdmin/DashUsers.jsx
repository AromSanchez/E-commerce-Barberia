import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
// Importamos los iconos necesarios
import { Search, Users, ShoppingCart, X, Package, Calendar, MapPin, CreditCard, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export default function DashUsers() {
    const { users } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Estados para el modal de órdenes
    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    useEffect(() => {
        if (users) {
            setUserList(users);
        }
    }, [users]);

    // Función para ver compras del usuario
    const handleViewPurchases = (user) => {
        setSelectedUser(user);
        setUserOrders(user.orders || []);
        setOrdersModalOpen(true);
    };

    // Función para expandir/contraer items de una orden
    const toggleOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    // Función para cambiar el rol del usuario
    const handleRoleChange = (userId, newRole) => {
        console.log(`Cambiar rol del usuario ${userId} a ${newRole}`);
        
        setUserList(userList.map(user => {
            if (user.id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        }));
  
        router.put(route('dashboard.users.update-role', userId), {
            role: newRole
        });
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setEditDialogOpen(true);
    };

    // Función para cerrar el modal de órdenes
    const closeOrdersModal = () => {
        setOrdersModalOpen(false);
        setSelectedUser(null);
        setUserOrders([]);
        setExpandedOrders(new Set());
    };

    // Función para obtener el color del estado
    const getStatusColor = (status) => {
        const statusColors = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'procesando': 'bg-blue-100 text-blue-800',
            'enviado': 'bg-purple-100 text-purple-800',
            'entregado': 'bg-green-100 text-green-800',
            'cancelado': 'bg-red-100 text-red-800',
            'pagado': 'bg-green-100 text-green-800',
            'fallido': 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    // Filtrar usuarios según el término de búsqueda
    const filteredUsers = userList.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />
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
                                            <Users className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
                                    </div>
                                </div>
                                
                                {/* Barra de búsqueda */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-1/2">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar usuario..." 
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Tabla de usuarios */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Usuario</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Teléfono</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Total Órdenes</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Rol</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user, index) => (
                                                        <tr key={user.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center">
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">{user.phone_number}</td>
                                                            <td className="p-4 text-sm text-gray-600">{user.email}</td>
                                                            <td className="p-4 text-sm text-gray-600">{user.total_orders || 0}</td>
                                                            <td className="p-4">
                                                                <select 
                                                                    value={user.role} 
                                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                                    className="text-sm border rounded-md p-1 px-3 pr-8
                                                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                        bg-white hover:bg-gray-50 transition-colors
                                                                        cursor-pointer"
                                                                >
                                                                    <option value="admin">Admin</option>
                                                                    <option value="user">Cliente</option>
                                                                </select>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    {/* Botón para ver compras */}
                                                                    <button 
                                                                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                                        onClick={() => handleViewPurchases(user)}
                                                                        title="Ver órdenes"
                                                                    >
                                                                        <ShoppingCart className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No hay usuarios disponibles
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

            {/* Modal de Órdenes */}
            {ordersModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header del modal */}
                        <div className="bg-gray-700  text-white p-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                        <ShoppingCart className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Órdenes de {selectedUser?.name}</h3>
                                        <p className="text-blue-100">{selectedUser?.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={closeOrdersModal}
                                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                            {userOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-600 mb-2">Sin órdenes</h4>
                                    <p className="text-gray-500">Este usuario aún no ha realizado ninguna compra.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userOrders.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            {/* Encabezado de la orden */}
                                            <div className="bg-gray-50 p-4 border-b">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-semibold text-lg">#{order.order_number}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                                                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                                                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{new Date(order.created_at).toLocaleDateString('es-ES')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <CreditCard className="h-4 w-4" />
                                                                <span className="font-semibold text-green-600">S/ {parseFloat(order.total_amount).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleOrderExpansion(order.id)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                                                    >
                                                        {expandedOrders.has(order.id) ? (
                                                            <>
                                                                <ChevronUp className="h-4 w-4" />
                                                                Ocultar items
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="h-4 w-4" />
                                                                Ver items ({order.items?.length || 0})
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                
                                                {/* Información de envío */}
                                                <div className="mt-3 p-3 bg-white rounded-lg border">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{order.customer_name}</p>
                                                            <p className="text-sm text-gray-600">{order.customer_phone}</p>
                                                            <p className="text-sm text-gray-600">{order.shipping_address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items de la orden (expandible) */}
                                            {expandedOrders.has(order.id) && (
                                                <div className="p-4 bg-white">
                                                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                                        <Package className="h-4 w-4" />
                                                        Items de la orden
                                                    </h5>
                                                    <div className="space-y-3">
                                                        {order.items && order.items.length > 0 ? (
                                                            order.items.map((item) => (
                                                                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                    <div className="flex items-center gap-3">
                                                                        {item.product?.image && (
                                                                            <img 
                                                                                src={`/storage/${item.product.image}`}
                                                                                alt={item.product.name}
                                                                                className="h-12 w-12 object-cover rounded-lg border"
                                                                            />
                                                                        )}
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{item.product?.name || 'Producto eliminado'}</p>
                                                                            <p className="text-sm text-gray-600">
                                                                                Cantidad: {item.quantity} × S/ {parseFloat(item.price).toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-semibold text-gray-900">
                                                                            S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-500 text-center py-4">No hay items en esta orden</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer del modal */}
                        <div className="bg-gray-50 px-6 py-4 border-t">
                            <div className="flex justify-end">
                                <button 
                                    onClick={closeOrdersModal}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}