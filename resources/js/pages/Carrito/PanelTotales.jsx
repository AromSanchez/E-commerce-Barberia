

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PanelTotales({
  cart,
  subtotal,
  updating,
  handleCheckout
}) {
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  // Obtener información del carrito, incluido el descuento aplicado
  useEffect(() => {
    const getCartDetails = async () => {
      try {
        const response = await axios.get(route('cart.get'));
        if (response.data && response.data.discount !== undefined) {
          setDiscount(parseFloat(response.data.discount) || 0);
        }
        if (response.data && response.data.coupon) {
          setCoupon(response.data.coupon);
        } else {
          // Si no hay cupón, asegúrate de limpiar el estado previo
          setCoupon(null);
          setDiscount(0);
        }
      } catch (error) {
        console.error('Error al obtener detalles del carrito:', error);
      }
    };

    getCartDetails();
  }, [cart, subtotal]); // Observar también los cambios en subtotal
  if (cart.length === 0) return null;

  const costoEnvioBase = 10.00;
  const envioGratis = subtotal >= 50;
  const costoEnvio = envioGratis ? 0 : costoEnvioBase;

  const totalConDescuento = Math.max(0, subtotal - discount);
  const totalConEnvio = totalConDescuento + costoEnvio;

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-xs xl:w-80 bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 sm:p-5 lg:p-6 h-max shadow-lg">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">RESUMEN DEL PEDIDO</h2>
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="font-medium">Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex flex-col">
            <div className="flex justify-between text-green-600 font-semibold text-sm sm:text-base">
              <span className="truncate pr-2">Descuento ({coupon?.code})</span>
              <span className="flex-shrink-0">-S/ {discount.toFixed(2)}</span>
            </div>
            <button 
              onClick={async () => {
                try {
                  await axios.post(route('cart.removeCoupon'));
                  setDiscount(0);
                  setCoupon(null);
                  toast.success('Cupón eliminado correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true
                  });
                  
                  // Disparar evento personalizado para notificar la actualización del carrito
                  window.dispatchEvent(new Event('cartUpdated'));
                } catch (error) {
                  console.error('Error al eliminar el cupón:', error);
                  toast.error('Error al eliminar el cupón', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true
                  });
                }
              }}
              className="text-xs text-red-600 hover:underline mt-1 self-end"
            >
              Eliminar cupón
            </button>
          </div>
        )}

        <hr className="my-2 sm:my-3" />

        <div className="space-y-2 ">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Envío:</h3>
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span>Envío a domicilio</span>
            {envioGratis ? (
              <span className="ml-auto text-green-600 font-semibold">GRATIS</span>
            ) : (
              <span className="ml-auto">S/ {costoEnvio.toFixed(2)}</span>
            )}
          </div>
          {!envioGratis && (
            <p className="text-xs text-center sm:text-xs text-gray-500">
              Envío gratis en compras mayores a S/ 50.00
              {subtotal > 0 && (
                <span className="block mt-1">
                  Te faltan S/ {(50 - subtotal).toFixed(2)} para envío gratis
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex justify-between font-bold text-base sm:text-lg pt-2">
          <span>Total</span>
          <span>S/ {totalConEnvio.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => handleCheckout(totalConEnvio)}
        disabled={updating || cart.length === 0}
        className="w-full bg-black text-white py-2.5 sm:py-3 rounded-xl lg:rounded-2xl hover:bg-gray-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {updating ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}
      </button>

      {envioGratis ? (
        <p className="text-xs sm:text-sm text-green-600 text-center mt-2 font-medium">
          ¡Felicidades! Tu compra incluye envío GRATIS
        </p>
      ) : (
        <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
          El total incluye S/ {costoEnvio.toFixed(2)} de envío
        </p>
      )}

      <a
        href="/productos"
        className="block w-full text-center text-gray-600 py-2 mt-2 sm:mt-3 hover:text-black transition-colors text-sm sm:text-base"
      >
        ← Continuar comprando
      </a>
    </div>
  );
}