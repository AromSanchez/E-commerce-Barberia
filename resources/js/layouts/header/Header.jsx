import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, User, Search } from 'lucide-react';

export default function Header() {
    const { auth } = usePage().props;
    const [showUserMenu, setShowUserMenu] = useState(false);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <header className="w-full py-4 border-b border-gray-200">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        {/* Aquí colocarás tu imagen de logo */}
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
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <Search className="absolute right-3 h-5 w-5 text-gray-400" />
                </div>

                {/* Navegación */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-gray-700 hover:text-black transition-colors">
                        Inicio
                    </Link>
                    <Link href="/quienes-somos" className="text-gray-700 hover:text-black transition-colors">
                        Quienes Somos
                    </Link>
                    <Link href="/productos" className="text-gray-700 hover:text-black transition-colors">
                        Productos
                    </Link>
                    <Link href="/faq" className="text-gray-700 hover:text-black transition-colors">
                        FAQ
                    </Link>
                </nav>

                {/* Iconos de acción */}
                <div className="flex items-center space-x-4">
                    <Link href="/favoritos" className="text-gray-700 hover:text-black transition-colors">
                        <Heart className="h-6 w-6" />
                    </Link>
                    <Link href="/carrito" className="text-gray-700 hover:text-black transition-colors relative">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            0
                        </span>
                    </Link>
                    <div className="relative">
                        <button 
                            onClick={toggleUserMenu} 
                            className="text-gray-700 hover:text-black transition-colors focus:outline-none"
                        >
                            <User className="h-6 w-6" />
                        </button>
                        
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                {auth?.user ? (
                                    <Link 
                                        href={route('dashboard')} 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    > 
                                        Dashboard 
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href={route('login')} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        > 
                                            Log in 
                                        </Link>
                                        <Link 
                                            href={route('register')} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        > 
                                            Register 
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}