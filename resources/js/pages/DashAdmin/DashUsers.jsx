import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/Layouts/head_admin/HeadAdmin';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
// Importamos los iconos necesarios
import { Search, Users, ShoppingCart, Mail } from 'lucide-react';

export default function DashUsers() {
    const { users } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (users) {
            setUserList(users);
        }
    }, [users]);

    // Cambiamos la función para ver compras en lugar de eliminar
    const handleViewPurchases = (userId) => {
        // Aquí puedes implementar la navegación a la vista de compras del usuario
        console.log(`Ver compras del usuario ${userId}`);
        // Por ejemplo: router.get(route('dashboard.users.purchases', userId));
    };

    // Función para cambiar el rol del usuario
    const handleRoleChange = (userId, newRole) => {
        // Aquí implementarías la lógica para actualizar el rol en la base de datos
        console.log(`Cambiar rol del usuario ${userId} a ${newRole}`);
        
        // Actualizar el estado local para reflejar el cambio inmediatamente
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
                                                    {/* Nueva columna para el rol */}
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
                                                            {/* Nueva celda para el selector de rol */}
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
                                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                                        onClick={() => handleViewPurchases(user.id)}
                                                                    >
                                                                        <ShoppingCart className="h-5 w-5" />
                                                                    </button>
                                                                    {/* Nuevo botón para enviar email */}
                                                                    <button 
                                                                        className="text-purple-600 hover:text-purple-900 p-1"
                                                                        onClick={() => handleSendEmail(user.id, user.email)}
                                                                    >
                                                                        <Mail className="h-5 w-5" />
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

            {/* Aquí podrías añadir componentes de diálogo para editar usuarios si es necesario */}
        </AuthenticatedLayout>
    );
}

