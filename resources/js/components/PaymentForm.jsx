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

const CheckoutForm = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      // Usar el total del carrito
      const amount = total || 10.00;

      // Crear PaymentIntent en backend usando la ruta correcta
      const { data } = await axios.post(route('payment.create-intent'), { 
        amount: amount
      });

      if (!data.clientSecret) {
        throw new Error('No se recibió el client secret del servidor');
      }

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
          setSuccess(true);
          toast.success('¡Pago realizado con éxito!');
          if (onSuccess) {
            onSuccess();
          }
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

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Pagar con tarjeta</h3>
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
          }}/>
        </div>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Procesando...' : `Pagar S/ ${total ? total.toFixed(2) : ''}`}
        </button>
        {error && <div className="mt-2 text-red-600">{error}</div>}
        {success && <div className="mt-2 text-green-600">¡Pago realizado con éxito!</div>}
      </form>
    </div>
  );
};

const PaymentForm = ({ total, stripeKey }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // Inicializar Stripe con la clave pública recibida como prop
    if (!stripePromise && stripeKey) {
      stripePromise = loadStripe(stripeKey);
      setStripeLoaded(true);
    }
  }, [stripeKey]);

  if (!stripeLoaded) {
    return <div>Cargando...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm total={total} />
    </Elements>
  );
};

export default PaymentForm;
