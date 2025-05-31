import { Heart, Eye, ShoppingCart } from 'lucide-react';

const CardProduct = ({
  name: initialName,
  regularPrice: initialRegularPrice,
  salePrice,
  image: initialImage,
}) => {
  // Default values for props if not provided
  const productName = initialName || "Apple iMac 27\", 1TB HDD, Retina 5K Display, M3 Max";
  const productImage = initialImage || "/images/maquina.png";
     
  // Use a default for regularPrice if it's falsy
  const regularPriceValue = initialRegularPrice === undefined || initialRegularPrice === null ? 1699 : initialRegularPrice;
 
  const formattedRegular = parseFloat(regularPriceValue).toFixed(2);
  const formattedSale = salePrice ? parseFloat(salePrice).toFixed(2) : null;
     
  return (
    <div className="w-full max-w-xs rounded-lg border border-gray-100 bg-white shadow-lg flex flex-col animate-scaleIn">
      {/* Imagen */}
      <div className="relative p-4">
      <img
      className="custom-fade-mask w-full [aspect-ratio:1/1] object-contain rounded-lg transition-transform duration-700 ease-in-out hover:scale-125 cursor-pointer" // Ejemplo con aspect-ratio cuadrado
      src={productImage}
      alt={productName}
    />
    
        
        {/* Etiqueta de En oferta */}
{formattedSale && (
  <div className="absolute bottom-[-27px] left-3.5"> {/* <-- Añadida animación */}
    <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      En oferta
    </span>
  </div>
)}

        {/* Iconos de acción - más abajo */}
        <div className="absolute bottom-[-30px] right-3.5 flex gap-2 ">
          <button 
            type="button"
            aria-label="View product"
            className="rounded-lg bg-zinc-200 p-2 text-gray-700 shadow-sm hover:bg-white hover:text-gray-900 transition-all duration-200 ease-in-out transform hover:scale-110 hover:-translate-y-1  active:scale-95"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            type="button"
            aria-label="Add to wishlist"
            className="rounded-lg bg-zinc-200 p-2 text-gray-700 shadow-sm hover:bg-white hover:text-gray-900 transition-all duration-200 ease-in-out transform hover:scale-110 hover:-translate-y-1 active:scale-95"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contenido con altura fija */}
      <div className="p-4 pt-2 flex flex-col flex-grow">
        {/* Nombre del producto con altura fija */}
        <div className="h-14 mt-8 mb-2">
          <h3 className="text-sm font-semibold leading-snug text-gray-900 overflow-hidden">
            {productName}
          </h3>
        </div>

        {/* Precio y botón - siempre en la parte inferior */}
<div className="flex items-start justify-between mt-0"> {/* Changed items-center to items-start */}
  <div className="flex flex-col">
    {formattedSale ? (
      <>
        <span className="text-xl font-bold text-gray-900">
          S/{formattedSale}
        </span>
        <span className="text-xs text-gray-500 line-through">
          S/{formattedRegular}
        </span>
      </>
    ) : (
      <span className="text-xl font-bold text-gray-900">
        S/{formattedRegular}
      </span>
    )}
  </div>

  <button 
    type="button"
    className="group relative inline-flex items-center justify-center rounded-lg bg-black px-2 py-2 text-xs font-medium text-white hover:bg-yellow-600 transition-all duration-300 overflow-hidden active:scale-95 active:shadow-inner"
  >
    {/* Icono del carrito que aparece desde abajo con fondo amarillo */}
    <div className="absolute inset-0 flex items-center justify-center bg-yellow-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      <ShoppingCart className="h-3.5 w-3.5 text-white" />
    </div>
    
    {/* Texto que desaparece completamente hacia arriba */}
    <span className="transform transition-transform duration-300 group-hover:-translate-y-8 group-hover:opacity-0">
      Añadir al carrito
    </span>
  </button>
</div>
      </div>
    </div>
  );
};

export default CardProduct;