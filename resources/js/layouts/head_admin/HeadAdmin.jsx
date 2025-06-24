import React, { useState } from 'react';
import { Bell, Search, LogOut, Settings, User, Mail, FileText, Headphones, Package } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

const HeadAdmin = () => {
    const { auth } = usePage().props;
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Función para cerrar los dropdowns cuando se hace clic fuera
    const handleClickOutside = (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            setIsProfileOpen(false);
        }
        if (!e.target.closest('.notifications-dropdown')) {
            setIsNotificationsOpen(false);
        }
    };

    // Efecto para agregar el event listener
    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white border-b px-6 py-2.5">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-3xl">
                    <form className="relative">
                        <input 
                            type="text" 
                            placeholder="Buscar aquí..." 
                            className="w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:border-blue-500"
                            name="search"
                            onClick={() => setIsSearchActive(true)}
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        {isSearchActive && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border p-4">
                                <h3 className="text-sm font-semibold mb-3">Productos más vendidos</h3>
                                <div className="border-t border-gray-200 my-2"></div>
                                {/* Lista de productos */}
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notificaciones */}
                    <div className="relative notifications-dropdown">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors duration-200"
                        >
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                1
                            </span>
                            <Bell className="h-5 w-5 text-gray-600" />
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <div className="h-8 w-8 flex items-center justify-center">
                                                    <span className="text-blue-500">%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Discount available</h4>
                                                <p className="text-xs text-gray-500">Morbi sapien massa, ultricies at rhoncus at, ullamcorper nec diam</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <div className="h-8 w-8 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-purple-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Account has been verified</h4>
                                                <p className="text-xs text-gray-500">Mauris libero ex, iaculis vitae rhoncus et</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <div className="h-8 w-8 flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-green-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Order shipped successfully</h4>
                                                <p className="text-xs text-gray-500">Integer aliquam eros nec sollicitudin sollicitudin</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                                            <div className="bg-orange-100 p-2 rounded-lg">
                                                <div className="h-8 w-8 flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-orange-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">Order pending: <span className="text-orange-500">ID 305830</span></h4>
                                                <p className="text-xs text-gray-500">Ultricies at rhoncus at ullamcorper</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 py-2 text-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                                        View all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Perfil de usuario */}
                    <div className="relative profile-dropdown">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">{auth?.user?.name || 'Usuario'}</span>
                                <span className="text-xs text-gray-500">Administrador</span>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                                <div className="py-2">
                                    <Link href={route('profile.edit')} className="flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200">
                                        <User className="h-5 w-5 text-gray-500 mr-3" />
                                        <span className="text-sm text-gray-700">Cuenta</span>
                                    </Link>
                                    <Link href="#" className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                            <span className="text-sm text-gray-700">Inbox</span>
                                        </div>
                                        <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                            27
                                        </span>
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <Link 
                                        href={route('logout')} 
                                        method='post'
                                        className="flex items-center px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors duration-200"
                                    >
                                        <LogOut className="h-5 w-5 mr-3" />
                                        <span className="text-sm">Log out</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadAdmin;