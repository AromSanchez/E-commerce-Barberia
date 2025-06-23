import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Inicializar stripe después de obtener la clave pública del servidor
let stripePromise = null;

const CheckoutForm = ({ total = 0, amount = 0, onSuccess, customerData = {}, products = [] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [amountInUSD, setAmountInUSD] = useState(null);

  // Usar amount si está disponible, si no usar total
  const paymentAmount = amount || total;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      setError('El monto a pagar no es válido');
      setProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post(route('payment.create-intent'), {
        amount: paymentAmount,
        customer_name: customerData.customer_name,
        customer_phone: customerData.customer_phone,
        shipping_address: customerData.shipping_address,
        products: products.map(p => ({
          id: p.id,
          quantity: p.quantity
        }))
      });

      if (!data.clientSecret) {
        throw new Error('No se recibió el client secret del servidor');
      }

      setAmountInUSD(data.amountInUSD);

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        toast.error('Error en el pago: ' + paymentResult.error.message);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          await axios.post(route('order.store'), {
            amount: paymentAmount,
            customer_name: customerData.customer_name,
            customer_phone: customerData.customer_phone,
            shipping_address: customerData.shipping_address,
            products: products.map(p => ({
              id: p.id,
              quantity: p.quantity
            }))
          });

          setSuccess(true);
          toast.success('¡Pago realizado y orden guardada!');
          if (onSuccess) onSuccess();
        }
      }

    } catch (err) {
      console.error('Error en el pago:', err);
      setError(err.response?.data?.error || 'Error al procesar el pago');
      toast.error(err.response?.data?.error || 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentAmount || paymentAmount <= 0) {
    return (
      <div className="mt-4 p-4 border rounded-lg shadow-sm">
        <p className="text-red-600">No hay un monto válido para procesar el pago</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Pagar con tarjeta</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Monto en Soles: S/ {Number(paymentAmount).toFixed(2)}</p>
        {amountInUSD && (
          <p className="text-sm text-gray-600">Monto aproximado en USD: $ {Number(amountInUSD).toFixed(2)}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <CardElement className="p-3 border rounded" options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
        <button
          type="submit"
          disabled={
            !stripe ||
            processing ||
            !paymentAmount ||
            !customerData.customer_name?.trim() ||
            !customerData.customer_phone?.trim() ||
            !customerData.shipping_address?.trim()
          }
          className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-900 disabled:opacity-50"
        >
          {processing ? 'Procesando...' : `Pagar S/ ${Number(paymentAmount).toFixed(2)}`}
        </button>
        {error && <div className="mt-2 text-red-600">{error}</div>}
        {success && <div className="mt-2 text-green-600">¡Pago realizado con éxito!</div>}
      </form>
    </div>
  );
};

const PaymentForm = ({ total = 0, amount = 0, stripeKey, customerData = {}, products = [], onSuccess }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const paymentAmount = amount || total;

  useEffect(() => {
    if (!stripePromise && stripeKey) {
      stripePromise = loadStripe(stripeKey);
      setStripeLoaded(true);
    }
  }, [stripeKey]);

  if (!stripeLoaded) {
    return <div>Cargando...</div>;
  }

  if (!paymentAmount || paymentAmount <= 0) {
    return <div>No hay un monto válido para procesar</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm total={total}
        amount={amount}
        onSuccess={onSuccess}
        customerData={customerData}
        products={products}
      />
    </Elements>
  );
};

export default PaymentForm;
