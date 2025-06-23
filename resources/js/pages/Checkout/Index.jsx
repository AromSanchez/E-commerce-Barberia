import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import { useCart } from '@/contexts/CartContext'

import MainLayout from '@/layouts/MainLayout';

export default function Checkout({ total, stripeKey, cart }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    shipping_address: '',
  });
  const validateFields = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'El nombre es obligatorio';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'El teléfono es obligatorio';
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'La dirección es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  if (!total || total <= 0) {
    return (
      <MainLayout title="Error">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-600">No hay productos en el carrito para procesar el pago.</p>
        </div>
      </MainLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <MainLayout title="Pago Exitoso">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Pago exitoso</h1>
          <p>Gracias por tu compra.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Checkout">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Finalizar Compra</h1>

        {/* Formulario del cliente */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}

            />
            {errors.customer_name && <p className="text-sm text-red-600 mt-1">{errors.customer_name}</p>}

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
            />
            {errors.customer_phone && <p className="text-sm text-red-600 mt-1">{errors.customer_phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de envío</label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.shipping_address}
              onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
            ></textarea>
            {errors.shipping_address && <p className="text-sm text-red-600 mt-1">{errors.shipping_address}</p>}
          </div>
        </div>

        {/* Total y método de pago */}
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-800">Total a pagar: <span className="text-blue-600">S/ {Number(total).toFixed(2)}</span></p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona método de pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="stripe">Tarjeta de Débito o Crédito</option>
            </select>
          </div>
        </div>

        {/* Componente de Stripe */}
        {paymentMethod === 'stripe' && (
          <PaymentForm
            stripeKey={stripeKey}
            total={total}
            onSuccess={() => setPaymentSuccess(true)}
            customerData={formData}
            products={
              Array.isArray(cart)
                ? cart
                : cart && typeof cart === 'object'
                  ? Object.values(cart)
                  : []
            } formErrors={errors}

          />
        )}
      </div>
    </MainLayout>
  );
}
