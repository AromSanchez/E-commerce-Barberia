import React from 'react';
import { 
    Home, 
    Package, 
    Scissors, 
    Users, 
    UserCheck, 
    ShoppingBag, 
    Bell, 
    Settings,
    ChevronLeft,
    LogOut,
    User
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

const NavAdmin = () => {
    const user = usePage().props.auth.user;
    return (
        <div className="h-screen w-64 bg-gray-900 text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Scissors className="text-xl mr-2" />
                    <h1 className="text-xl font-bold">BarberShop</h1>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <ChevronLeft className="text-xl" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col justify-between">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <Home className="mr-3 text-lg" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/products" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <Package className="mr-3 text-lg" />
                            <span>Productos</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={route('dashboard.category')} className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <Scissors className="mr-3 text-lg" />
                            <span>Categorías</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/clients" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <Users className="mr-3 text-lg" />
                            <span>Clientes</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/employees" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <UserCheck className="mr-3 text-lg" />
                            <span>Empleados</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/orders" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <ShoppingBag className="mr-3 text-lg" />
                            <span>Pedidos</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/notifications" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <Bell className="mr-3 text-lg" />
                            <span>Notificaciones</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/settings" className="flex items-center p-3 rounded-md hover:bg-gray-800">
                            <Settings className="mr-3 text-lg" />
                            <span>Configuración</span>
                        </Link>
                    </li>
                    
                </ul>
                
                {/* User Profile Dropdown - Posicionado en la parte inferior */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="flex items-center w-full p-3 rounded-md hover:bg-gray-800 text-white">
                                <User className="mr-3 text-lg" />
                                <span className="flex-grow text-left">{user.name}</span>
                                <svg 
                                    className="h-4 w-4" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                Perfil
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Cerrar Sesión
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>
        </div>
    );
};

export default NavAdmin;