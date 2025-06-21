import React from 'react';
import CardProduct from '@/components/Cliente/CardProduct';
import { router } from '@inertiajs/react';

export default function MainFavoritos({ favorites }) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Tus Productos Favoritos ❤️
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Aquí puedes ver todos los productos que marcaste como favoritos. ¡Haz clic para ver más detalles o añadir al carrito!
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 mb-10 md:grid-cols-3 xl:grid-cols-4 gap-8">
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
              onViewProduct={() => router.visit(`/producto/${producto.slug}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9.75L12 4.5l8.25 5.25M4.5 10.5v6.75a1.5 1.5 0 001.5 1.5H9m6 0h3a1.5 1.5 0 001.5-1.5V10.5M4.5 10.5L12 15l7.5-4.5"
            />
          </svg>
          <p className="text-lg text-gray-600 mb-2">Aún no tienes productos favoritos</p>
          <a
            href="/tienda"
            className="inline-block px-4 py-2 mt-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            Ir a la tienda
          </a>
        </div>
      )}
    </section>
  );
}
