import { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiShoppingCart, HiEye } from 'react-icons/hi';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '@/contexts/CartContext';

export default function CardProduct({
  id,
  name,
  slug,
  regularPrice,
  salePrice,
  image,
  brand,
  inStock,
  isNew,
  isFavorite,     
}) {
  const [isWishlisted, setIsWishlisted] = useState(isFavorite || false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { openCart } = useCart();

  const regularPriceValue = typeof regularPrice === 'number' ? regularPrice : parseFloat(regularPrice) || 0;
  const salePriceValue = salePrice && salePrice > 0 ? (typeof salePrice === 'number' ? salePrice : parseFloat(salePrice)) : null;

  const discountPercentage = salePriceValue && salePriceValue > 0
    ? Math.round(((regularPriceValue - salePriceValue) / regularPriceValue) * 100)
    : 0;

  const finalPrice = salePriceValue || regularPriceValue;

  const handleAddToCart = async () => {
    if (!inStock || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const response = await axios.post(route('cart.add'), {
        product_id: id,
        quantity: 1
      });

      toast.success('¡Producto agregado al carrito!', {
        position: "top-right",
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
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true
        });
      } else {
        toast.error('No se pudo agregar el producto al carrito', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true
        });
      }
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await axios.post(`/favorites/${id}/toggle`);
      setIsWishlisted(!isWishlisted);

      toast.success(
        isWishlisted ? 'Eliminado de favoritos' : 'Agregado a favoritos',
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
        }
      );
    } catch (error) {
      toast.error('Error al actualizar favoritos', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
      });
      console.error(error);
    }
  };

  const handleViewProduct = () => {
    router.visit(`/producto/${slug}`);
  };

  return (
    <div className="relative group w-full mb-3 sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg transform transition-all duration-300 ease-in-out hover:translate-y-[-8px] hover:shadow-xl hover:z-10">

      {/* Tarjeta del producto */}
      <div className='absolute inset-[-15px_-15px_-50px_-15px] invisible border border-transparent rounded-md bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out'></div>

      <div className={`${!inStock ? 'opacity-60 grayscale' : ''} transform transition-transform duration-300`}>
        {/* Imagen */}
        <div className="relative overflow-hidden bg-white rounded-lg items-start shadow-md">
          <div className="absolute top-3 left-3 flex flex-col flex-auto gap-2">
            {isNew && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-black rounded-full shadow-lg z-10">
                NUEVO
              </span>
            )}
            {!inStock && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-gray-500 rounded-full shadow-lg z-10">
                AGOTADO
              </span>
            )}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-600 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-500 rounded-lg"></div>
              </div>
            )}
            <img
              src={`/storage/${image}`}
              alt={name}
              className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
                setIsImageLoaded(true);
              }}
            />


          </div>
        </div>

        {/* Contenido */}
        <div className="p-3 relative group-hover transition-shadow duration-300">

          {/* Marca */}
          {brand && (
            <p className="text-xs font-bold text-black uppercase tracking-wide mb-2 text-left">
              {brand?.name}
            </p>
          )}

          {/* Nombre del producto */}
          <h3 className="text-sm text-left font-black text-gray-700 mb-1.5 leading-normal">
            {name}
          </h3>

          {/* Precio */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-black">
                  S/{finalPrice.toFixed(2)}
                </span>
                {salePriceValue && (
                  <span className="text-xs text-gray-500 line-through">
                    S/{regularPriceValue.toFixed(2)}
                  </span>
                )}
              </div>
              {salePriceValue && (
                <span className="px-2 py-0.5 mt-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Botones en la parte inferior */}
          <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <div className="flex gap-7 backdrop-blur-sm p-2">
              <button
                onClick={handleViewProduct}
                className="p-2 hover:text-opacity-30 transition-colors text-black"
                title="Ver producto"
              >
                <HiEye className="w-5 h-5" />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`p-2 transition-colors ${inStock ? 'hover:text-opacity-30 text-black' : 'text-gray-800 cursor-not-allowed'}`}
                title={inStock ? 'Añadir al carrito' : 'Producto agotado'}
              >
                <HiShoppingCart className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 transition-colors ${isWishlisted ? 'text-red-600' : 'hover:text-opacity-30 text-gray-700'
                  }`}
                title={isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                {isWishlisted ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}