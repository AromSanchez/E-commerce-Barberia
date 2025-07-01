import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import { useCart } from '@/contexts/CartContext'

import MainLayout from '@/layouts/MainLayout';

export default function Checkout({ total, stripeKey, cart, includesShipping = true, isFreeShipping = false }) {
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">No hay productos en el carrito para procesar el pago.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <MainLayout title="Pago Exitoso">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Pago exitoso</h1>
            <p className="text-gray-600">Gracias por tu compra.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Checkout">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
            <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-900 px-8 py-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <span className="text-sm font-medium">Información</span>
                </div>
                <div className="flex-1 h-px bg-gray-700 mx-4"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <span className="text-sm font-medium">Pago</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Formulario del cliente */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información del Cliente
                </h2>
                
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 transition-colors duration-200 placeholder-gray-400"
                      placeholder="Ingresa tu nombre completo"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                    {errors.customer_name && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.customer_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 transition-colors duration-200 placeholder-gray-400"
                      placeholder="Ingresa tu número de teléfono"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    />
                    {errors.customer_phone && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.customer_phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Dirección de envío *
                    </label>
                    <textarea
                      rows="3"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 transition-colors duration-200 placeholder-gray-400 resize-none"
                      placeholder="Ingresa tu dirección completa de envío"
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    ></textarea>
                    {errors.shipping_address && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.shipping_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200"></div>

              {/* Total y método de pago */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Resumen de Pago
                </h2>

                {/* Resumen del total */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-700">Total a pagar:</span>
                    <span className="text-3xl font-bold text-gray-900">S/ {Number(total).toFixed(2)}</span>
                  </div>
                  {includesShipping && (
                    <div className="flex items-center justify-center">
                      {isFreeShipping ? (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Incluye envío GRATIS
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200">
                          *Incluye S/ 10.00 de costo de envío
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Método de pago */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Método de pago
                  </label>
                  <div className="space-y-3">
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        paymentMethod === 'stripe' 
                          ? 'border-gray-900 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                            paymentMethod === 'stripe' 
                              ? 'border-gray-900 bg-gray-900' 
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'stripe' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Tarjeta de Débito o Crédito</p>
                            <p className="text-sm text-gray-500">Pago seguro con Stripe</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
                            <rect x="0" y="4" width="40" height="16" rx="4" fill="#1434CB"/>
                            <rect x="2" y="6" width="36" height="12" rx="2" fill="white"/>
                            <text x="20" y="15" textAnchor="middle" className="text-xs font-bold fill-current text-blue-600">VISA</text>
                          </svg>
                          <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
                            <circle cx="15" cy="12" r="8" fill="#EB001B"/>
                            <circle cx="25" cy="12" r="8" fill="#F79E1B"/>
                            <path d="M20 6.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5c-1.5-1.5-2.5-3.5-2.5-5.5s1-4 2.5-5.5z" fill="#FF5F00"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Componente de Stripe */}
              {paymentMethod === 'stripe' && (
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                    Información de Pago
                  </h2>
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
                    } 
                    formErrors={errors}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}