import React from "react";
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function TablaProductos({ cart, loading, updating, handleQuantity, handleRemove, showUndo, lastRemoved, handleUndo, undoTimeout, couponCode, setCouponCode, handleApplyCoupon, fullWidth }) {
  return (
    <div className={`flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-xl max-w-5xl ${fullWidth ? 'w-full ml-0 mr-auto' : 'mx-auto'}`}>
      <h2 className="text-2xl font-bold mb-6 text-black">Tu Carrito</h2>
      {/* Headers de la tabla - Solo visible en desktop */}
      <div>
        <div className={`hidden lg:grid grid-cols-6 gap-4 border-b pb-2 mb-4 font-bold text-black text-sm ${fullWidth ? 'w-full' : 'min-w-[900px]'}`}>
          <div className="text-center">PRODUCTO</div>
          <div className="text-center">NOMBRE</div>
          <div className="text-center">PRECIO</div>
          <div className="text-center">CANTIDAD</div>
          <div className="text-center">SUBTOTAL</div>
          <div className="text-center">ACCIONES</div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-500">Cargando carrito...</span>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
            <a 
              href="/productos" 
              className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors"
            >
              Continuar Comprando
            </a>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-1 lg:grid-cols-6 gap-4 items-center border-b px-2 lg:px-6 py-6 text-gray-800 ${fullWidth ? 'w-full' : 'min-w-[900px]'}`}
              >
                {/* Imagen del producto */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 mr-7">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-2xl"
                    onError={(e) => {
                      e.target.src = '/images/no-image.png';
                    }}
                  />
                </div>
                {/* Nombre del producto */}
                <div className="flex items-center justify-center lg:justify-start">
                  <span className="font-medium text-center lg:text-left">{item.name}</span>
                </div>
                {/* Precio */}
                <div className="text-center">
                  {item.oldPrice && (
                    <span className="line-through text-gray-400 text-xs block">
                      S/ {parseFloat(item.oldPrice).toFixed(2)}
                    </span>
                  )}
                  <span className="text-black font-bold">
                    S/ {parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
                {/* Controles de cantidad */}
                <div className="flex items-center border border-gray-300 rounded-2xl w-20 mx-auto justify-center">
                  <button
                    onClick={() => handleQuantity(item.id, -1)}
                    disabled={updating}
                    className="px-1 py-1 text-base text-gray-700 hover:bg-gray-200 rounded-l-2xl disabled:opacity-50 transition-colors"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-0 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.id, 1)}
                    disabled={updating}
                    className="px-1 py-1 text-base text-gray-700 hover:bg-gray-200 rounded-r-2xl disabled:opacity-50 transition-colors"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                {/* Subtotal */}
                <div className="text-center">
                  {item.oldPrice && (
                    <span className="line-through text-gray-400 text-xs block">
                      S/ {(parseFloat(item.oldPrice) * item.quantity).toFixed(2)}
                    </span>
                  )}
                  <span className="text-black font-bold">
                    S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
                {/* Botón eliminar */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleRemove(item)}
                    disabled={updating}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Eliminar producto"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Sección de cupón */}
      {cart.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 mt-6 px-2 pb-2">
          <input
            type="text"
            placeholder="Código de cupón"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-2 flex-1 max-w-xs focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button 
            onClick={handleApplyCoupon}
            disabled={updating || !couponCode.trim()}
            className="bg-black text-white px-6 py-2 rounded-2xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'APLICANDO...' : 'APLICAR CUPÓN'}
          </button>
        </div>
      )}
    </div>
  );
}
