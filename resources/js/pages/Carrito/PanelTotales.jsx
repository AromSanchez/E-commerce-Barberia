import React from "react";

export default function PanelTotales({ cart, subtotal, shippingOption, setShippingOption, total, updating, handleCheckout }) {
  if (cart.length === 0) return null;
  return (
    <div className="w-full max-w-xs lg:w-80 bg-white rounded-2xl border border-gray-200 p-6 h-max shadow-lg lg:ml-0 lg:mr-0">
      <h2 className="text-xl font-bold mb-4 text-black">RESUMEN DEL PEDIDO</h2>
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <hr className="my-3" />
        {/* Opciones de envío */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Opciones de entrega:</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="envio" 
              value="pickup"
              checked={shippingOption === 'pickup'}
              onChange={(e) => setShippingOption(e.target.value)}
              className="accent-black" 
            />
            <span>Recogida en tienda</span>
            <span className="text-green-600 font-semibold ml-auto">Gratis</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="envio" 
              value="delivery"
              checked={shippingOption === 'delivery'}
              onChange={(e) => setShippingOption(e.target.value)}
              className="accent-black" 
            />
            <span>Envío a domicilio</span>
            <span className="ml-auto">S/ 10.00</span>
          </label>
        </div>
        {shippingOption === 'delivery' && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p>Envío a <span className="font-semibold text-black">Trujillo</span></p>
            <button className="text-blue-600 underline text-sm mt-1 hover:text-blue-800">
              Cambiar dirección
            </button>
          </div>
        )}
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>
      <button 
        onClick={handleCheckout}
        disabled={updating || cart.length === 0}
        className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updating ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}
      </button>
      <a 
        href="/productos" 
        className="block w-full text-center text-gray-600 py-2 mt-3 hover:text-black transition-colors"
      >
        ← Continuar comprando
      </a>
    </div>
  );
}
