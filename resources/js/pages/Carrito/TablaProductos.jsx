import React from "react";
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function TablaProductos({ cart, loading, updating, handleQuantity, handleRemove, showUndo, lastRemoved, handleUndo, undoTimeout, couponCode, setCouponCode, handleApplyCoupon, fullWidth }) {
  return (
    <div className={`flex-1 bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-xl w-full max-w-none lg:max-w-5xl ${fullWidth ? 'w-full ml-0 mr-auto' : 'mx-auto'}`}>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-black">Tu Carrito</h2>
      {/* Headers de la tabla - Solo visible en desktop */}
      <div>
        <div className="hidden lg:grid grid-cols-6 gap-4 border-b pb-2 mb-4 font-bold text-black text-sm">
          <div className="text-center">PRODUCTO</div>
          <div className="text-center">NOMBRE</div>
          <div className="text-center">PRECIO</div>
          <div className="text-center">CANTIDAD</div>
          <div className="text-center">SUBTOTAL</div>
          <div className="text-center">ACCIONES</div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-10 lg:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-500 text-sm sm:text-base">Cargando carrito...</span>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-8 sm:py-10 lg:py-12">
            <div className="text-gray-400 text-4xl sm:text-5xl lg:text-6xl mb-3 lg:mb-4">🛒</div>
            <p className="text-gray-500 text-base sm:text-lg mb-3 lg:mb-4">Tu carrito está vacío</p>
            <a 
              href="/productos" 
              className="bg-black text-white px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl lg:rounded-2xl hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Continuar Comprando
            </a>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 py-4 lg:py-6"
              >
                {/* Layout móvil y tablet */}
                <div className="block lg:hidden">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Imagen del producto */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg sm:rounded-xl"
                        onError={(e) => {
                          e.target.src = '/images/no-image.png';
                        }}
                      />
                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black text-sm sm:text-base mb-2 line-clamp-2">{item.name}</h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-left">
                          {item.oldPrice && (
                            <span className="line-through text-gray-400 text-xs block">
                              S/ {parseFloat(item.oldPrice).toFixed(2)}
                            </span>
                          )}
                          <span className="text-black font-bold text-sm sm:text-base">
                            S/ {parseFloat(item.price).toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Botón eliminar - móvil */}
                        <button
                          onClick={() => handleRemove(item)}
                          disabled={updating}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Eliminar producto"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Controles de cantidad */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantity(item.id, -1)}
                            disabled={updating}
                            className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded-l-lg disabled:opacity-50 transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantity(item.id, 1)}
                            disabled={updating}
                            className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded-r-lg disabled:opacity-50 transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        
                        {/* Subtotal */}
                        <div className="text-right">
                          {item.oldPrice && (
                            <span className="line-through text-gray-400 text-xs block">
                              S/ {(parseFloat(item.oldPrice) * item.quantity).toFixed(2)}
                            </span>
                          )}
                          <span className="text-black font-bold text-sm sm:text-base">
                            S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout desktop */}
                <div className="hidden lg:grid grid-cols-6 gap-4 items-center text-gray-800">
                  {/* Imagen del producto */}
                  <div className="flex items-center justify-center">
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
                  <div className="flex items-center justify-center">
                    <span className="font-medium text-center">{item.name}</span>
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
              </div>
            ))}
          </>
        )}
      </div>
      {/* Sección de cupón */}
      {cart.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 lg:mt-6 px-0 sm:px-2 pb-2">
          <input
            type="text"
            placeholder="Código de cupón"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border border-gray-300 rounded-lg lg:rounded-2xl px-3 sm:px-4 py-2 flex-1 max-w-none sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
          />
          <button 
            onClick={handleApplyCoupon}
            disabled={updating || !couponCode.trim()}
            className="bg-black text-white px-4 sm:px-5 lg:px-6 py-2 rounded-lg lg:rounded-2xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
          >
            {updating ? 'APLICANDO...' : 'APLICAR CUPÓN'}
          </button>
        </div>
      )}
    </div>
  );
}
