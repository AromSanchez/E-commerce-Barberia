import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "@/layouts/MainLayout";
import { toast } from 'react-toastify';
import TablaProductos from "./Carrito/TablaProductos";
import PanelTotales from "./Carrito/PanelTotales";
import axios from 'axios';
import Breadcrumb from "@/components/Cliente/Breadcrumb";
import PaymentForm from '@/components/PaymentForm';

export default function VerCarrito() {
  const [cart, setCart] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Función para obtener el carrito con manejo de errores mejorado
  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get(route('cart.get'));

      // Validar que la respuesta tenga la estructura esperada
      if (!response.data || !response.data.items) {
        throw new Error('Respuesta del servidor inválida');
      }

      const itemsWithNumericPrices = Object.values(response.data.items).map(item => ({
        ...item,
        id: item.id || item.product_id, // Asegurar que hay un ID válido
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        name: item.name || 'Producto sin nombre',
        image: item.image || '/images/no-image.png'
      }));

      setCart(itemsWithNumericPrices);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      toast.error('Error al cargar el carrito. Por favor, recarga la página.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setCart([]); // Establecer carrito vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }
    };
  }, [undoTimeout]);

  // Calcular subtotal con validación
  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + (price * quantity);
  }, 0);

  // Calcular total incluyendo envío (gratis si el subtotal >= 50 soles)
  const shippingCostBase = 10.00;
  const isFreeShipping = subtotal >= 50;
  const shippingCost = isFreeShipping ? 0 : shippingCostBase;
  const total = subtotal + shippingCost;

  const handleRemove = async (item) => {
    if (!item.id) {
      toast.error('Error: ID de producto inválido');
      return;
    }

    // Eliminar confirmación para eliminar producto
    setUpdating(true);
    try {
      await axios.post(route('cart.remove'), { product_id: item.id });
      setLastRemoved(item);
      setShowUndo(true);
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }
      const newTimeout = setTimeout(() => {
        setShowUndo(false);
        setLastRemoved(null);
      }, 8000);
      setUndoTimeout(newTimeout);
      toast.success('Producto eliminado correctamente', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true
      });
      await fetchCart();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto. Inténtalo de nuevo.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUndo = async () => {
    if (!lastRemoved || !lastRemoved.id) {
      toast.error('No se puede deshacer: información del producto no disponible');
      return;
    }

    setUpdating(true);
    try {
      // Usar cart.add para restaurar el producto eliminado
      await axios.post(route('cart.add'), {
        product_id: lastRemoved.id,
        quantity: lastRemoved.quantity || 1
      });
      setShowUndo(false);
      setLastRemoved(null);
      if (undoTimeout) {
        clearTimeout(undoTimeout);
        setUndoTimeout(null);
      }
      toast.success('Producto restaurado', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true
      });
      await fetchCart();
    } catch (error) {
      console.error('Error al deshacer eliminación:', error);
      toast.error('No se pudo restaurar el producto', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantity = async (id, delta) => {
    if (!id) {
      toast.error('Error: ID de producto inválido');
      return;
    }

    const item = cart.find(i => i.id === id);
    if (!item) {
      toast.error('Producto no encontrado en el carrito');
      return;
    }

    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      // Si la cantidad sería 0 o negativa, preguntar si quiere eliminar
      if (window.confirm('¿Deseas eliminar este producto del carrito?')) {
        await handleRemove(item);
      }
      return;
    }

    setUpdating(true);

    try {
      await axios.post(route('cart.update'), {
        product_id: id,
        quantity: newQuantity
      });

      await fetchCart();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error('Error al actualizar la cantidad', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning('Por favor, ingresa un código de cupón', { position: "top-right", autoClose: 2000 });
      return;
    }

    setUpdating(true);

    try {
      const response = await axios.post(route('cart.applyCoupon'), { code: couponCode });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000
      });

      // Actualizar el carrito para reflejar el descuento del cupón inmediatamente
      await fetchCart();
      setCouponCode(''); // Limpiar el campo después de aplicar el cupón
      
      // Disparar evento personalizado para notificar la actualización del carrito
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error('Error al aplicar cupón:', error);

      toast.error(error.response?.data?.message || 'Cupón inválido', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = (totalConEnvio) => {
    if (cart.length === 0) {
      toast.warning('No hay productos en el carrito', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true
      });
      return;
    }

    window.location.href = route('checkout', { total: totalConEnvio });
  };

  return (
    <MainLayout title="Carrito de Compras">
      <div className="justify-center items-start bg-gradient-to-t to-gray-50 from-white">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
          <Breadcrumb baseItems={["Inicio", "Carrito"]} onHomeClick={() => window.location.href = '/'} />
        </div>
        {/* Notificación de deshacer */}
        {showUndo && lastRemoved && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="w-full max-w-4xl mx-auto bg-red-400 text-black px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between rounded-xl shadow-md">
              <span className="text-center sm:text-left w-full">
                <span className="font-bold mr-2">✓</span>
                "{lastRemoved.name}" eliminado del carrito.
              </span>
              <button
                onClick={handleUndo}
                disabled={updating}
                className="underline font-semibold hover:text-gray-800 mt-3 sm:mt-0 sm:ml-4 disabled:opacity-50"
              >
                {updating ? 'Restaurando...' : 'Deshacer'}
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mx-auto mb-10 max-w-7xl w-full items-start justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full lg:flex-1 lg:min-w-0 flex justify-center">
            <div className="w-full max-w-4xl">
              <TablaProductos
                cart={cart}
                loading={loading}
                updating={updating}
                handleQuantity={handleQuantity}
                handleRemove={handleRemove}
                showUndo={showUndo}
                lastRemoved={lastRemoved}
                handleUndo={handleUndo}
                undoTimeout={undoTimeout}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleApplyCoupon={handleApplyCoupon}
                fullWidth // Prop extra para ajustar la tabla al contenedor
              />
            </div>
          </div>
          <div className="w-full lg:w-80 flex justify-center lg:justify-start">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-80">
              <PanelTotales
                cart={cart}
                subtotal={subtotal}
                total={total}
                updating={updating}
                handleCheckout={handleCheckout}
              />
              {/* Eliminado el formulario de pago embebido */}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
