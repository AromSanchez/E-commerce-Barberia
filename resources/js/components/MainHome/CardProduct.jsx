import { Heart } from 'lucide-react';

const CardProduct = ({ name, regularPrice, salePrice, image }) => {
  const productName = name || "Nombre del Producto";
  const productImage = image || "/images/maquina.png"; // Imagen por defecto

  const formattedRegular = parseFloat(regularPrice).toFixed(2);
  const formattedSale = salePrice ? parseFloat(salePrice).toFixed(2) : null;

  return (
    <div className="
      flex flex-col items-center gap-4
      flex-1 min-w-[200px]
      w-full max-w-[268px]
      h-[408px]
      py-6 px-4
      bg-[#ebe9e9]
      rounded-[9px]
      shadow-md
      overflow-hidden
    ">
      {/* Imagen + botón de favorito */}
      <div className="relative w-full h-48 top-8">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-contain rounded-lg"
        />
        <button
          className="absolute top-[-20px] right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Añadir a favoritos"
        >
          <Heart className="w-5 h-5 text-gray-500 hover:text-red-500" strokeWidth={1.5} />
        </button>
      </div>

      {/* Nombre */}
      <h3 className="text-base font-semibold text-gray-800 text-center leading-tight mt-8 px-2">
        {productName}
      </h3>

      {/* Precios */}
      <div className="text-center">
        {formattedSale ? (
          <>
            <span className="text-sm text-gray-500 line-through mr-2">
              S/{formattedRegular}
            </span>
            <span className="text-2xl font-bold text-red-600">
              S/{formattedSale}
            </span>
          </>
        ) : (
          <span className="text-2xl font-bold text-black">
            S/{formattedRegular}
          </span>
        )}
      </div>

      {/* Botón */}
      <button className="mt-auto bg-black text-white py-2.5 px-6 rounded-lg w-full hover:bg-gray-800 transition-colors text-sm font-medium">
        Añadir al Carrito
      </button>
    </div>
  );
};

export default CardProduct;
