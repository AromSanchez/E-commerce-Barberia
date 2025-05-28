import { Heart } from 'lucide-react'; // Import the Heart icon 

const CardProduct = ({ name, price, image }) => {
  // Valores por defecto por si las props no se pasan
  const productName = name || "Nombre del Producto";
  const productPrice = price || "0.00";
  const productImage = image || "/images/maquina.png"; // Placeholder

  return (
    <div className="
      flex flex-col items-center gap-4       /* display, flex-direction, align-items, gap (16px) */
      flex-1 min-w-[200px]                  
      w-full max-w-[268px]                  /* width: 100%, max-width: 268px */
      h-[408px]                             /* height: 408px (fixed) */
      py-6 px-4                             /* padding: 24px (py-6) 16px (px-4) */
      bg-[#c0bfbf]                          /* background: #F6F6F6 */
      rounded-[9px]                         /* border-radius: 9px */
      shadow-md                             /* Sombra suave para dar profundidad */
      overflow-hidden                       /* Para asegurar que el contenido se ajuste */
    ">
      {/* Contenedor de la Imagen y Botón de Favorito */}
      <div className="relative w-full h-48 top-8"> {/* Altura fija para la imagen */}
        <img 
          src={productImage} 
          alt={productName} 
          className="w-full h-full object-contain rounded-lg" /* object-contain para ver toda la imagen, rounded-lg más suave que rounded-xl */
        />
        <button 
          className="absolute top-[-20px] right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Añadir a favoritos"
        >
          <Heart className="w-5 h-5 text-gray-500 hover:text-red-500" strokeWidth={1.5} /> {/* Icono Heart de Lucide React */}
        </button>
      </div>

      {/* Nombre del Producto */}
      <h3 className="text-base font-semibold text-gray-800 text-center leading-tight mt-8 px-2"> 
        {productName}
      </h3>

      {/* Precio del Producto */}
      <p className="text-2xl font-bold text-black text-center">
        ${productPrice} 
      </p>

      {/* Botón de Comprar */}
      <button className="mt-auto bg-black text-white py-2.5 px-6 rounded-lg w-full hover:bg-gray-800 transition-colors text-sm font-medium">
        Añador al Carrito
      </button>
    </div>
  );
};

export default CardProduct;
