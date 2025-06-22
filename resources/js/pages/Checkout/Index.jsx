import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import MainLayout from '@/layouts/MainLayout';

export default function Checkout({ total, stripeKey }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Pago exitoso</h1>
        <p>Gracias por tu compra.</p>
      </div>
    );
  }

  return (
    <>
      <MainLayout title="Checkout" >
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="mb-4">Total a pagar: S/ {total}</p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Selecciona método de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="stripe">Stripe</option>
          </select>
        </div>

        {paymentMethod === 'stripe' && (
          <PaymentForm stripeKey={stripeKey} amount={total} onSuccess={() => setPaymentSuccess(true)} />
        )}
      </div>
      </MainLayout>
    </>
  );
}
