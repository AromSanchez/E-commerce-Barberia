import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Heart, ShoppingCart, Truck, RotateCcw, Shield } from 'lucide-react';
import InnerImageZoom from 'react-inner-image-zoom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '@/contexts/CartContext';
import CardProduct from '@/components/Cliente/CardProduct';
import 'react-inner-image-zoom/lib/styles.min.css';

export default function MainProduct({ product, relatedProducts }) {
    const { openCart } = useCart(); // <- Aquí lo obtienes
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);






    // Crear array de imágenes (imagen principal + imágenes adicionales)
    const allImages = [
        ...(product.image ? [product.image] : []),
        ...(product.images?.map(img => img.image_path) || [])
    ];

    // Calcular descuento si hay precio de oferta
    const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
        : 0;

    const currentPrice = product.sale_price || product.regular_price;

    const handleAddToCart = async () => {
        if (product.stock <= 0 || isAddingToCart) return;

        setIsAddingToCart(true);
        try {
            await axios.post(route('cart.add'), {
                product_id: product.id,
                quantity: quantity, // <-- aquí se usa la cantidad seleccionada
            });

            toast.success('¡Producto agregado al carrito!', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            openCart();
        } catch (error) {
            if (error.response?.status === 422) {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: 1500,
                });
            } else {
                toast.error('No se pudo agregar el producto al carrito', {
                    position: "bottom-right",
                    autoClose: 1500,
                });
            }
            console.error('Error al agregar al carrito:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value)) value = 1;
        if (value < 1) value = 1;
        if (value > product.stock) value = product.stock;
        setQuantity(value);
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    {/* Imagen Principal con Flechas */}
                    <div className="relative w-full max-w-[500px] h-[500px] mx-auto bg-white rounded-2xl overflow-hidden">
                        {allImages.length > 0 ? (
                            <InnerImageZoom
                                src={`/storage/${allImages[selectedImageIndex]}`}
                                zoomSrc={`/storage/${allImages[selectedImageIndex]}`}
                                zoomScale={1.5}
                                zoomType="hover"
                                zoomPreload={true}
                                hideHint={true}
                                className="w-full h-full object-cover object-center rounded-2xl"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span>Sin imagen</span>
                            </div>
                        )}

                        {/* Flecha Izquierda */}
                        {selectedImageIndex > 0 && (
                            <button
                                onClick={() => setSelectedImageIndex(i => Math.max(i - 1, 0))}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {/* Flecha Derecha */}
                        {selectedImageIndex < allImages.length - 1 && (
                            <button
                                onClick={() => setSelectedImageIndex(i => Math.min(i + 1, allImages.length - 1))}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </div>

                    {/* Miniaturas */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {allImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={`/storage/${image}`}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>


                {/* Información del Producto */}
                <div className="space-y-6">
                    {/* Categoría */}
                    {product.category && (
                        <div className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                            {product.category.name}
                        </div>
                    )}

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {product.name}
                    </h1>

                    {/* Precio */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-green-600">
                            S/{currentPrice}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xl text-gray-500 line-through">
                                    S/{product.regular_price}
                                </span>
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                    -{discountPercentage}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Estado de Stock */}
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Sin existencias'}
                        </span>
                    </div>

                    {/* Descripción Corta */}
                    {product.short_description && (
                        <p className="text-gray-600 leading-relaxed">
                            {product.short_description}
                        </p>
                    )}

                    {/* Selector de Cantidad y Botones de Acción */}
                    <div className="space-y-4">
                        {product.stock > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900">Cantidad:</h4>
                                <div className="flex items-center gap-4">
                                    {/* Selector de Cantidad */}
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="text-xl font-medium">-</span>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            className="w-16 h-12 text-center border-0 focus:outline-none focus:ring-0 font-medium"
                                        />
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="text-xl font-medium">+</span>
                                        </button>
                                    </div>

                                    {/* Información de Stock */}
                                    <span className="text-sm text-gray-500">
                                        {product.stock} disponibles
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || isAddingToCart}
                                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${product.stock > 0
                                    ? 'bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart size={22} />
                                <span className="text-lg">
                                    {product.stock > 0 ? (isAddingToCart ? 'AGREGANDO...' : 'AÑADIR AL CARRITO') : 'AGOTADO'}
                                </span>
                            </button>

                            <button
                                onClick={toggleWishlist}
                                className={`px-5 py-4 rounded-lg border-2 transition-all transform hover:scale-105 ${isWishlisted
                                    ? 'border-red-500 bg-red-50 text-red-500 shadow-md'
                                    : 'border-gray-300 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-500'
                                    }`}
                                title={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                                <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Información adicional del carrito */}
                        {product.stock > 0 && (
                            <div className="flex items-center gap-4 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Envío gratis en pedidos superiores a S/50</span>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Beneficios */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Truck size={20} className="text-green-600" />
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">Envío gratis</div>
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Shield size={20} className="text-green-600" />
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">Garantía 30 días</div>
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <RotateCcw size={20} className="text-green-600" />
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">Devolución fácil</div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción Larga */}

                </div>

            </div>
            {product.long_description && (
                <div className="pt-6 border-t mt-10 border-gray-200">
                    <h2 className="font-semibold text-gray-900 mb-3 text-3xl">Descripción detallada</h2>
                    <div
                        className="text-gray-600 leading-relaxed text-xl prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.long_description }}
                    />
                </div>
            )}

            {/* Productos relacionados */}
            {relatedProducts?.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14 mb-14">
                        {relatedProducts.map((producto) => (
                            <CardProduct
                                key={producto.id}
                                id={producto.id}
                                name={producto.name}
                                slug={producto.slug}
                                regularPrice={producto.regular_price}
                                salePrice={producto.sale_price}
                                image={producto.image ? `/storage/${producto.image}` : '/images/no-image.png'}
                                brand={producto.brand?.name || null}
                                inStock={producto.stock > 0}
                                isNew={producto.is_new === 'yes'}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}