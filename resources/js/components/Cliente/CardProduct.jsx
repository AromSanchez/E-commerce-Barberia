import { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiShoppingCart, HiEye } from 'react-icons/hi';

export default function CardProduct({
  name,
  regularPrice,
  salePrice,
  image,
  brand,
  inStock,
  isNew,
  onAddToCart,
  onAddToWishlist,
  onViewProduct
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const regularPriceValue = typeof regularPrice === 'number' ? regularPrice : parseFloat(regularPrice) || 0;
  const salePriceValue = salePrice ? (typeof salePrice === 'number' ? salePrice : parseFloat(salePrice)) : null;

  const discountPercentage = salePriceValue
    ? Math.round(((regularPriceValue - salePriceValue) / regularPriceValue) * 100)
    : 0;

  const finalPrice = salePriceValue || regularPriceValue;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ name, price: finalPrice, image, regularPrice: regularPriceValue, salePrice: salePriceValue });
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist({ name, price: finalPrice, image, isWishlisted: !isWishlisted });
    }
  };

  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct({ name, price: finalPrice, image });
    }
  };

  return (
    <div className="relative group w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">

      {/* Tarjeta del producto */}
      <div className="">

        {/* Imagen */}
        <div className="relative overflow-hidden bg-transparent">
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {isNew && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg">
                NUEVO
              </span>
            )}
            {salePriceValue && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {!inStock && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-gray-500 rounded-full shadow-lg">
                AGOTADO
              </span>
            )}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-white">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-600 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-500 rounded-lg"></div>
              </div>
            )}
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
                setIsImageLoaded(true);
              }}
            />

            {/* Botones en la parte inferior con animación más pegada */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <div className="flex gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <button
                  onClick={handleViewProduct}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors text-gray-700 shadow-md"
                  title="Ver producto"
                >
                  <HiEye className="w-5 h-5" />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`p-2 rounded-full transition-colors shadow-md ${inStock ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  title={inStock ? 'Añadir al carrito' : 'Producto agotado'}
                >
                  <HiShoppingCart className="w-5 h-5" />
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-full transition-colors shadow-md ${isWishlisted ? 'bg-red-100 text-red-600' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                  title={isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  {isWishlisted ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 bg-transparent">

          {/* Marca */}
          {brand && (
            <p className="text-xs font-bold text-black uppercase tracking-wide mb-2 text-center">
              {brand}
            </p>
          )}

          {/* Nombre del producto */}
          <h3 className="text-sm text-center font-bold text-gray-700 mb-1.5 leading-normal">
            {name}
          </h3>

          {/* Precio */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-700">
                S/{finalPrice.toFixed(2)}
              </span>
              {salePriceValue && (
                <span className="text-xs text-gray-500 line-through">
                  S/{regularPriceValue.toFixed(2)}
                </span>
              )}
            </div>
            {salePriceValue && (
              <span className="text-xs text-red-500 font-medium">
                Ahorras S/{(regularPriceValue - salePriceValue).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}