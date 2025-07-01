

export default function PanelTotales({
  cart,
  subtotal,
  discount = 0,
  coupon = null,
  updating,
  handleCheckout
}) {
  if (cart.length === 0) return null;

  const costoEnvioBase = 10.00;
  const envioGratis = subtotal >= 50;
  const costoEnvio = envioGratis ? 0 : costoEnvioBase;

  const totalConDescuento = Math.max(0, subtotal - discount);
  const totalConEnvio = totalConDescuento + costoEnvio;

  return (
    <div className="w-full max-w-xs lg:w-80 bg-white rounded-2xl border border-gray-200 p-6 h-max shadow-lg lg:ml-0 lg:mr-0">
      <h2 className="text-xl font-bold mb-4 text-black">RESUMEN DEL PEDIDO</h2>
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Descuento ({coupon?.code})</span>
            <span>-S/ {discount.toFixed(2)}</span>
          </div>
        )}

        <hr className="my-3" />

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Envío:</h3>
          <div className="flex items-center justify-between">
            <span>Envío a domicilio</span>
            {envioGratis ? (
              <span className="ml-auto text-green-600 font-semibold">GRATIS</span>
            ) : (
              <span className="ml-auto">S/ {costoEnvio.toFixed(2)}</span>
            )}
          </div>
          {!envioGratis && (
            <p className="text-xs text-gray-500">
              Envío gratis en compras mayores a S/ 50.00
              {subtotal > 0 && (
                <span className="block mt-1">
                  Te faltan S/ {(50 - subtotal).toFixed(2)} para envío gratis
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>S/ {totalConEnvio.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => handleCheckout(totalConEnvio)}
        disabled={updating || cart.length === 0}
        className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updating ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}
      </button>

      {envioGratis ? (
        <p className="text-xs text-green-600 text-center mt-2 font-medium">
          ¡Felicidades! Tu compra incluye envío GRATIS
        </p>
      ) : (
        <p className="text-xs text-gray-500 text-center mt-2">
          El total incluye S/ {costoEnvio.toFixed(2)} de envío
        </p>
      )}

      <a
        href="/productos"
        className="block w-full text-center text-gray-600 py-2 mt-3 hover:text-black transition-colors"
      >
        ← Continuar comprando
      </a>
    </div>
  );
}