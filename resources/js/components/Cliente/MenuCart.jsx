import React, { useEffect, useState } from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from '@inertiajs/react';
import axios from 'axios';

const MenuCart = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await axios.get(route('cart.get'));
            // Asegurarse de que los precios sean números
            const itemsWithNumericPrices = Object.values(response.data.items).map(item => ({
                ...item,
                price: parseFloat(item.price) || 0
            }));
            setCartItems(itemsWithNumericPrices);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await axios.post(route('cart.update'), {
                product_id: productId,
                quantity: newQuantity
            });
            fetchCart();
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.post(route('cart.remove'), {
                product_id: productId
            });
            fetchCart();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const cartElement = document.getElementById('cart-content');
            if (isOpen && cartElement && !cartElement.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div id="cart-content" className={`fixed right-0 top-0 h-full w-[90%] sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-800">Carrito</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX size={14} />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-200px)] p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                        </div>
                    ) : cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 mb-4 border-b pb-4 border-gray-200">
                                <div className="w-20 h-20">
                                    <img 
                                        src={item.image || '/images/no-image.png'} 
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg shadow-sm"
                                        onError={(e) => {
                                            e.target.src = '/images/no-image.png';
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <FiMinus size={12} />
                                            </button>
                                            <span className="text-sm text-gray-600">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <FiPlus size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-1 hover:bg-red-100 text-red-600 rounded-full transition-colors ml-2"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            S/{item.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Tu carrito está vacío</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-800">Subtotal:</span>
                        <span className="text-sm text-gray-800">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <Link
                        href={route('cart.index')}
                        className="block w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 text-center transition-colors"
                    >
                        VER CARRITO
                    </Link>
                    <Link
                        href="/checkout"
                        className="block w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 text-center transition-colors mt-2"
                    >
                        FINALIZAR COMPRA
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MenuCart;
