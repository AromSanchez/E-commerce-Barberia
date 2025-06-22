import React, { useEffect, useState, useCallback } from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiShoppingCart } from 'react-icons/hi';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MenuCart = ({ isOpen, onClose, auth }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({}); // Track which items are being updated

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('cart.get'));
            const itemsWithNumericPrices = Object.values(response.data.items).map(item => ({
                ...item,
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 0
            }));
            setCartItems(itemsWithNumericPrices);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            toast.error('Error al cargar el carrito', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, fetchCart]);

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Check stock limit before updating
        const item = cartItems.find(item => item.id === productId);
        if (newQuantity > item.stock) {
            toast.warning(`Stock disponible: ${item.stock} unidades`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true
            });
            return;
        }

        // Optimistic UI update
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );

        // Mark item as updating
        setUpdating(prev => ({ ...prev, [productId]: true }));

        try {
            await axios.post(route('cart.update'), {
                product_id: productId,
                quantity: newQuantity
            });
            
            toast.success('Cantidad actualizada', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        } catch (error) {
            // Revert optimistic update on error
            await fetchCart();
            
            if (error.response?.status === 422) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true
                });
            } else {
                toast.error('Error al actualizar la cantidad', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true
                });
            }
            console.error('Error al actualizar cantidad:', error);
        } finally {
            // Remove updating state
            setUpdating(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
        }
    };

    const handleRemoveItem = async (productId) => {
        setUpdating(prev => ({ ...prev, [productId]: true }));
        
        try {
            await axios.post(route('cart.remove'), {
                product_id: productId
            });
            
            toast.success('Producto eliminado', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true
            });
            
            // Remove item from local state immediately
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            toast.error('Error al eliminar el producto', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true
            });
        } finally {
            setUpdating(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Handle click outside to close cart
    useEffect(() => {
        const handleClickOutside = (event) => {
            const cartElement = document.getElementById('cart-content');
            if (isOpen && cartElement && !cartElement.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when cart is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle escape key to close cart
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [isOpen, onClose]);

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
        >
            <div 
                id="cart-content" 
                className={`fixed right-0 top-0 h-full w-[85%] max-w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 id="cart-title" className="text-xl font-medium text-gray-800">
                        Carrito ({cartItems.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        aria-label="Cerrar carrito"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="overflow-y-auto h-[calc(100vh-200px)] p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                        </div>
                    ) : cartItems.length > 0 ? (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`flex gap-4 pb-4 border-b border-gray-200 ${
                                        updating[item.id] ? 'opacity-60 pointer-events-none' : ''
                                    }`}
                                >
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <img
                                            src={item.image || '/images/no-image.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-lg shadow-sm"
                                            onError={(e) => {
                                                e.target.src = '/images/no-image.png';
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-800 leading-tight mb-1">
                                            {item.name}
                                        </h3>
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updating[item.id]}
                                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    <FiMinus size={12} />
                                                </button>

                                                <span className="text-sm text-gray-600 min-w-[20px] text-center">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock || updating[item.id]}
                                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    <FiPlus size={12} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={updating[item.id]}
                                                    className="p-1 hover:bg-red-100 text-red-600 rounded-full transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
                                                    aria-label="Eliminar producto"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-800">
                                                    S/{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    S/{item.price.toFixed(2)} c/u
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-8 px-4">
                            <div className="flex flex-col items-center justify-center flex-1">
                                <div className="mb-6 text-gray-400 relative">
                                    <HiShoppingCart className="h-32 w-32" />
                                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
                                        <span className="text-2xl leading-none">×</span>
                                    </div>
                                </div>
                                <p className="text-xl text-center font-medium text-gray-800 mb-4">
                                    No hay productos en el carrito.
                                </p>
                                <Link
                                    href={route('products.index')}
                                    onClick={onClose}
                                    className="bg-black text-white text-sm px-6 py-2 rounded-md hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                                >
                                    RETORNAR A LA TIENDA
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with totals and actions */}
                {cartItems.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-800">Subtotal:</span>
                            <span className="text-lg font-semibold text-gray-800">
                                S/ {subtotal.toFixed(2)}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            <Link
                                href={route('carrito')}
                                onClick={onClose}
                                className="block w-full bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 text-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                VER CARRITO
                            </Link>
                            <button
                                onClick={() => {
                                    onClose();
                                    if (!auth?.user) {
                                        window.location.href = route('login');
                                    } else {
                                        window.location.href = route('checkout');
                                    }
                                }}
                                className="block w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 text-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-600"
                            >
                                FINALIZAR COMPRA
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuCart;