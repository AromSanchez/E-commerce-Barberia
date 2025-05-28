import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, User, Search, LogOut } from 'lucide-react';

export default function Header() {
    const { auth } = usePage().props;
    const [showUserMenu, setShowUserMenu] = useState(false);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <header className="flex px-40 py-4 justify-between items-center w-full border-b bg-white" style={{ borderBottomColor: '#B5B5B5' }}>
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/">
                    <img 
                        src="/images/logo.png" 
                        alt="Barber Logo" 
                        className="h-10"
                    />
                </Link>
            </div>

            {/* Barra de búsqueda */}
            <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
                <input 
                    type="text" 
                    placeholder="Buscar Productos" 
                    className="w-full py-2 px-4 rounded-md focus:outline-none text-sm"
                    style={{ border: '1px solid #989898' }}
                />
                <Search className="absolute right-3 h-5 w-5" style={{ color: '#989898' }} />
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-black hover:text-black transition-colors text-sm font-medium">
                    Inicio
                </Link>
                <Link href="/quienes-somos" className="hover:text-black transition-colors text-sm font-medium" style={{ color: '#656565' }}>
                    Quienes Somos
                </Link>
                <Link href="/productos" className="hover:text-black transition-colors text-sm font-medium" style={{ color: '#656565' }}>
                    Productos
                </Link>
                <Link href="/faq" className="hover:text-black transition-colors text-sm font-medium" style={{ color: '#656565' }}>
                    FAQ
                </Link>
            </nav>

            {/* Iconos de acción */}
            <div className="flex items-center space-x-4">
                <Link href="/favoritos" className="hover:opacity-75 transition-opacity" style={{ color: '#656565' }}>
                    <Heart className="h-5 w-5" />
                </Link>
                <Link href="/carrito" className="hover:opacity-75 transition-opacity relative" style={{ color: '#656565' }}>
                    <ShoppingCart className="h-5 w-5" />
                </Link>
                <div className="relative">
                    <button 
                        onClick={toggleUserMenu} 
                        className="hover:opacity-75 transition-opacity focus:outline-none flex items-center"
                        style={{ color: '#656565' }}
                    >
                        <User className="h-5 w-5" />
                    </button>
                    
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border" style={{ borderColor: '#B3B3B3' }}>
                            {auth?.user ? (
                                <>
                                    <Link 
                                        href={route('profile.edit')} 
                                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                                        style={{ color: '#656565' }}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Mi Perfil
                                    </Link>
                                    {auth.user.role === 'admin' && (
                                        <Link 
                                            href={route('dashboard')} 
                                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                                            style={{ color: '#656565' }}
                                        > 
                                            Dashboard 
                                        </Link>
                                    )}
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button"
                                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        style={{ color: '#656565' }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Cerrar Sesión
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        href={route('login')} 
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        style={{ color: '#656565' }}
                                    > 
                                        Log in 
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        style={{ color: '#656565' }}
                                    > 
                                        Register 
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}