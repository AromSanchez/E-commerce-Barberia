import React, { useState, useEffect } from 'react';
import { Bell, Search, LogOut, User, Mail, Package, ShoppingBag } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';

const HeadAdmin = () => {
    const { auth, products } = usePage().props; // Obtener productos de las props
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Función para filtrar productos
    const filterProducts = (term) => {
        if (!term.trim()) {
            setFilteredProducts([]);
            return;
        }

        // Si tienes productos en props, úsalos
        if (products && products.length > 0) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase()) ||
                (product.short_description && product.short_description.toLowerCase().includes(term.toLowerCase()))
            ).slice(0, 5); // Limitar a 5 resultados
            setFilteredProducts(filtered);
        } else {
            // Si no tienes productos en props, hacer una petición AJAX
            searchProductsAjax(term);
        }
    };

    // Función para buscar productos via AJAX (opcional)
    const searchProductsAjax = async (term) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/admin/search-products?q=${encodeURIComponent(term)}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setFilteredProducts(data.products || []);
        } catch (error) {
            console.error('Error searching products:', error);
            setFilteredProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto para búsqueda en tiempo real
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm && isSearchActive) {
                filterProducts(searchTerm);
            } else {
                setFilteredProducts([]);
            }
        }, 300); // Debounce de 300ms

        return () => clearTimeout(delayedSearch);
    }, [searchTerm, isSearchActive, products]);

    // Función para cerrar los dropdowns cuando se hace clic fuera
    const handleClickOutside = (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            setIsProfileOpen(false);
        }
        if (!e.target.closest('.notifications-dropdown')) {
            setIsNotificationsOpen(false);
        }
        if (!e.target.closest('.search-dropdown')) {
            setIsSearchActive(false);
            setSearchTerm('');
            setFilteredProducts([]);
        }
    };

    // Efecto para agregar el event listener
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Función para manejar el submit del formulario
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Redirigir a página de resultados completos
            router.get('/admin/products', { search: searchTerm });
        }
    };

    // Función para formatear precio
    const formatPrice = (regularPrice, salePrice) => {
        if (salePrice && salePrice < regularPrice) {
            return (
                <div className="flex items-center space-x-2">
                    <span className="text-red-600 font-semibold">${salePrice}</span>
                    <span className="text-gray-400 line-through text-sm">${regularPrice}</span>
                </div>
            );
        }
        return <span className="font-semibold">${regularPrice}</span>;
    };

    return (
        <div className="bg-white border-b px-6 py-2.5">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-3xl">
                    <form className="relative search-dropdown" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Buscar productos..." 
                            className="w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:border-blue-500"
                            name="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchActive(true)}
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        {isSearchActive && (searchTerm || filteredProducts.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-50">
                                {isLoading ? (
                                    <div className="p-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="text-sm text-gray-500 mt-2">Buscando...</p>
                                    </div>
                                ) : (
                                    <>
                                        {filteredProducts.length > 0 ? (
                                            <>
                                                <div className="p-4 border-b">
                                                    <h3 className="text-sm font-semibold text-gray-700">
                                                        Productos encontrados ({filteredProducts.length})
                                                    </h3>
                                                </div>
                                                <div className="py-2">
                                                    {filteredProducts.map((product) => (
                                                        <Link
                                                            key={product.id}
                                                            href={`/admin/products/${product.id}`}
                                                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                                        >
                                                            <div className="flex-shrink-0 mr-3">
                                                                {product.image ? (
                                                                    <img 
                                                                        src={`/storage/${product.image}`} 
                                                                        alt={product.name}
                                                                        className="h-10 w-10 rounded-lg object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                        {product.name}
                                                                    </h4>
                                                                    <div className="ml-2 flex-shrink-0">
                                                                        {formatPrice(product.regular_price, product.sale_price)}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {product.short_description || 'Sin descripción'}
                                                                    </p>
                                                                    <div className="flex items-center space-x-2 ml-2">
                                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                            product.stock > 0 
                                                                                ? 'bg-green-100 text-green-800' 
                                                                                : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                            Stock: {product.stock}
                                                                        </span>
                                                                        {product.is_featured === 'yes' && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                                Destacado
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className="border-t p-3">
                                                    <button 
                                                        type="submit"
                                                        className="w-full py-2 text-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        Ver todos los resultados para "{searchTerm}"
                                                    </button>
                                                </div>
                                            </>
                                        ) : searchTerm && (
                                            <div className="p-4 text-center">
                                                <ShoppingBag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    No se encontraron productos para "{searchTerm}"
                                                </p>
                                                <button 
                                                    type="submit"
                                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Buscar en todos los productos
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
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