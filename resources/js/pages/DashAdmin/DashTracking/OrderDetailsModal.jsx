import React from "react";
import { FiUser, FiCalendar, FiMapPin, FiInfo, FiShoppingCart, FiBox, FiHash, FiDollarSign, FiCheckCircle } from "react-icons/fi";

export default function OrderDetailsModal({ open, onClose, order }) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl p-6 md:p-10 relative mx-2 md:mx-0 border border-blue-100">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition-colors"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-2xl">
            <FiShoppingCart />
          </span>
          <h2 className="text-xl md:text-2xl font-bold">Detalles del Pedido <span className="text-blue-600">{order.order_number}</span></h2>
        </div>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex items-center gap-2"><FiUser className="text-blue-500" /><span className="font-semibold">Cliente:</span> {order.customer_name}</div>
          <div className="flex items-center gap-2"><FiCalendar className="text-blue-500" /><span className="font-semibold">Fecha:</span> {order.created_at}</div>
          <div className="flex items-center gap-2"><FiInfo className="text-blue-500" /><span className="font-semibold">Estado:</span> <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{order.order_status}</span></div>
          <div className="flex items-center gap-2"><FiMapPin className="text-blue-500" /><span className="font-semibold">Dirección:</span> {order.shipping_address}</div>
        </div>
        <div className="mb-6 overflow-x-auto">
          <h3 className="font-semibold mb-2 flex items-center gap-2"><FiBox className="text-blue-500" />Productos</h3>
          <table className="min-w-[400px] w-full text-sm border rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-2 py-1"><FiHash className="inline text-blue-400 mr-1" />Producto</th>
                <th className="text-center px-2 py-1"><FiCheckCircle className="inline text-blue-400 mr-1" />Cantidad</th>
                <th className="text-right px-2 py-1"><FiDollarSign className="inline text-blue-400 mr-1" />Precio Unit.</th>
                <th className="text-right px-2 py-1"><FiDollarSign className="inline text-blue-400 mr-1" />Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="px-2 py-1 flex items-center gap-2">
                    <FiBox className="text-gray-400" />
                    {item.product_name}
                  </td>
                  <td className="text-center px-2 py-1">{item.quantity}</td>
                  <td className="text-right px-2 py-1">S/ {item.unit_price?.toFixed(2)}</td>
                  <td className="text-right px-2 py-1 font-semibold">S/ {item.total_price?.toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-2">No hay productos</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center border-t pt-4">
          <span className="text-lg font-bold text-blue-600 flex items-center gap-2">
            Total del Pedido: S/ {order.total_amount?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
