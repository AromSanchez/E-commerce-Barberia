import React, { useState } from 'react';
import {  
    Package, 
    Users,  
    ShoppingBag, 
    ChevronDown,
    Grid,
    Layers,
    FilePlus,
    Tag,
    RefreshCw
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

const NavAdmin = ({ isCollapsed, setIsCollapsed }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { url } = usePage();

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg p-4 flex flex-col border-r border-gray-200 relative z-0 overflow-y-auto scrollbar-hide h-screen`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
                {!isCollapsed && (
                    <Link href="/" className="flex items-center">
                        <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
                    </Link>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-gray-400 hover:text-gray-600 p-3"
                >
                    <ChevronDown className={`h-5 w-5 transform ${isCollapsed ? '-rotate-90' : 'rotate-90'}`} />
                </button>
            </div>

            <h2 className={`text-gray-400 text-xs uppercase mb-4 ${isCollapsed ? 'hidden' : ''}`}>PRINCIPAL</h2>

            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center p-3 rounded-lg transition-colors duration-200
                                ${isCollapsed ? 'justify-center' : ''}
                                ${url === '/dashboard' 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-700 hover:bg-blue-50'}
                            `}
                        >
                            <Grid className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                            {!isCollapsed && <span>Dashboard</span>}
                        </Link>
                    </li>
                    
                    {/* Dropdowns y otros elementos */}
                    <li>
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('products')}
                                className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 ${activeDropdown === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <ShoppingBag className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-grow text-left">Productos</span>
                                        <ChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>
                            <div className={`pl-10 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${activeDropdown === 'products' && !isCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link href={route('dashboard.addproduct')} className="block p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Añadir Producto
                                </Link>
                                <Link href={route('dashboard.product')} className="block p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Ver Productos
                                </Link>
                            </div>
                        </div>
                    </li>
                    
                    {/* Orders Dropdown */}
                    <li>
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('orders')}
                                className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 ${activeDropdown === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <FilePlus className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-grow text-left">Order</span>
                                        <ChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${activeDropdown === 'orders' ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>
                            <div className={`pl-10 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${activeDropdown === 'orders' && !isCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link href={route('dashboard.tracking')} className="block p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Seguimiento
                                </Link>
                            </div>
                        </div>
                    </li>

                    {/* Category */}
                    <li>
                        <Link href={route('dashboard.category')} className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <Package className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                            {!isCollapsed && <span>Categorias</span>}
                        </Link>
                    </li>

                    {/* Brand*/}
                    <li>
                        <Link href={route('dashboard.brand')} className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <Layers className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                            {!isCollapsed && <span>Marcas</span>}
                        </Link>
                    </li>

                    <li>
                        <Link href={route('dashboard.coupon')} className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <Tag className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                            {!isCollapsed && <span>Cupones</span>}
                        </Link>
                    </li>

                    {/* Reembolsos */}
                    <li>
                        <Link href={route('dashboard.requests')} className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <RefreshCw className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                            {!isCollapsed && <span>Reembolsos</span>}
                        </Link>
                    </li>

                    <li>
                        <Link href={route('dashboard.users')} className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <Users className={`${isCollapsed ? 'text-2xl' : 'text-lg mr-3'}`} />
                            {!isCollapsed && <span>Usuarios</span>}
                        </Link>
                    </li>

                    
                </ul>
            </nav>
        </div>
    );
};

export default NavAdmin;