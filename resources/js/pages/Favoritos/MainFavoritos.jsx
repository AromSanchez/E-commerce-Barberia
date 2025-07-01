import React, { useState } from 'react';
import CardProduct from '@/components/Cliente/CardProduct';
import { router } from '@inertiajs/react';

export default function MainFavoritos({ favorites: initialFavorites }) {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleFavoriteToggle = (productId, isNowFavorite) => {
    if (!isNowFavorite) {
      // Si ya no es favorito, remover de la lista
      setFavorites(prev => prev.filter(product => product.id !== productId));
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="px-4 py-8 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
            <svg 
              className="w-8 h-8 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 tracking-tight">
            Tus Productos Favoritos
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Aquí puedes ver todos los productos que marcaste como favoritos. 
            <span className="block sm:inline"> ¡Haz clic para ver más detalles o añadir al carrito!</span>
          </p>
          
          {/* Stats */}
          {favorites.length > 0 && (
            <div className="mt-8 inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {favorites.length} {favorites.length === 1 ? 'producto favorito' : 'productos favoritos'}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {favorites.map((producto) => (
              <CardProduct
                key={producto.id}
                id={producto.id}
                name={producto.name}
                slug={producto.slug}
                regularPrice={producto.regular_price}
                salePrice={producto.sale_price}
                image={producto.image}
                brand={producto.brand}
                inStock={producto.stock > 0}
                isNew={producto.is_new === 'yes'}
                isFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
                onViewProduct={() => router.visit(`/producto/${producto.slug}`)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="relative mb-8">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gray-100 rounded-full blur-3xl opacity-50 scale-150"></div>
              
              {/* Main icon */}
              <div className="relative bg-white border-2 border-gray-200 rounded-full p-6 sm:p-8">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
            </div>
            
            <div className="text-center max-w-md mx-auto px-4">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                Aún no tienes productos favoritos
              </h3>
              <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
                Explora nuestra tienda y marca como favoritos los productos que más te gusten. 
                Así podrás encontrarlos fácilmente más tarde.
              </p>
              
              <a
                href="/productos"
                className="inline-flex items-center px-6 py-3 text-sm sm:text-base font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
                Explorar tienda
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}