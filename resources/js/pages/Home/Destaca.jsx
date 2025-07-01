import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardProduct from '@/components/Cliente/CardProduct';

export default function Destaca() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products/featured');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar productos destacados:', err);
        setError('No se pudieron cargar los productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Función para actualizar el estado de favoritos
  const handleFavoriteToggle = (productId, isFavorite) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, isFavorite } : product
      )
    );
  };
  
  // Recargar los datos cuando se actualice la lista de favoritos
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      const fetchFeaturedProducts = async () => {
        try {
          const response = await axios.get('/api/products/featured');
          setProducts(response.data);
          setError(null);
        } catch (err) {
          console.error('Error al recargar productos destacados:', err);
        }
      };
      
      fetchFeaturedProducts();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-28 px-4 relative overflow-hidden">
      {/* Elementos decorativos mejorados */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gray-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-md"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-md"></div>
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-gray-300 rounded-full opacity-20 blur-sm"></div>
      <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-gray-300 rounded-full opacity-20 blur-sm"></div>
      
      {/* Patrón de puntos decorativos */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="dots-pattern"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Cabecera con diseño mejorado y efectos */}
        <div className="relative flex flex-col items-center justify-center mb-20">
          <div className="w-24 h-1 bg-gray-300 mb-6 rounded-full"></div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg opacity-25 blur-sm"></div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 relative px-8 py-3 text-center">
              PRODUCTOS <span className="relative inline-block">
                DESTACADOS
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400"></span>
              </span>
            </h2>
          </div>
          <div className="w-32 h-1 bg-gray-300 mt-6 rounded-full"></div>
        </div>

        {/* Texto descriptivo mejorado con efectos */}
        <div className="text-center mb-16 max-w-2xl mx-auto bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl p-8 shadow-sm">
          <p className="text-gray-600 text-lg leading-relaxed">
            Descubre nuestra <span className="font-semibold">selección premium</span> para el cuidado masculino. 
            Productos de <span className="italic">calidad superior</span> diseñados para el 
            <span className="ml-1 relative inline-block">
              hombre moderno
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gray-300"></span>
            </span>.
          </p>
        </div>

        {/* Estado de carga con animación mejorada */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-gray-700 border-r-gray-500 border-b-gray-300 border-l-gray-200 shadow-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                Cargando
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error mejorado */}
        {error && (
          <div className="text-center py-8 bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 max-w-xl mx-auto transform transition-all hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Grid de productos con animaciones y efectos mejorados */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex justify-center transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    animation: `fadeIn 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0 
                  }}
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-2 w-full">
                    <CardProduct
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      regularPrice={product.regular_price}
                      salePrice={product.sale_price}
                      image={product.main_image}
                      brand={product.brand}
                      inStock={product.in_stock}
                      isNew={product.is_new}
                      isFavorite={product.isFavorite}
                      showOfferBadge={product.sale_price > 0}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-lg p-8 max-w-xl mx-auto border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-light">No hay productos destacados disponibles actualmente.</p>
                  <div className="mt-4 w-16 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botón para ver más productos con efecto mejorado */}
        <div className="mt-24 text-center">
          <a 
            href="/productos" 
            className="inline-block px-12 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium text-lg tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] rounded-3xl relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-gray-600 to-gray-800 transition-all duration-500 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center">
              Ver todos los productos
              <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </a>
          <div className="mt-4 w-16 h-0.5 bg-gray-200 rounded-full mx-auto"></div>
        </div>
      </div>
      
      {/* Estilos CSS inline para animaciones y decoraciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dots-pattern {
          background-image: radial-gradient(circle, #808080 1px, transparent 1px);
          background-size: 20px 20px;
          width: 100%;
          height: 100%;
          opacity: 0.3;
        }
          width: 100%;
          height: 100%;
          opacity: 0.3;
        }
      `}</style>
    </section>
  );
}
