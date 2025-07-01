import React, { useState, useEffect } from 'react';
import {
  MdShoppingBag,
  MdAttachMoney,
  MdListAlt,
  MdCheckCircle,
  MdCancel,
  MdSwapHoriz,
} from 'react-icons/md';
import axios from 'axios';

export default function Cards() {
  const [cardsData, setCardsData] = useState([
    {
      title: 'Total de Pedidos',
      value: '0',
      change: '+0%',
      changeColor: 'text-gray-500',
      bgColor: 'white',
      icon: MdShoppingBag,
    },
    {
      title: 'Ventas de Hoy',
      value: 'S/0.00',
      change: '+0%',
      changeColor: 'text-gray-500',
      bgColor: 'white', 
      icon: MdAttachMoney,
    },
    {
      title: 'Pedidos Pendientes',
      value: '0',
      change: '+0%',
      changeColor: 'text-gray-500',
      bgColor: 'white', 
      icon: MdListAlt,
    },
    {
      title: 'Pedidos Entregados',
      value: '0',
      change: '+0%',
      changeColor: 'text-gray-500',
      bgColor: 'white', 
      icon: MdCheckCircle,
    },
    {
      title: 'Pedidos Cancelados',
      value: '0',
      change: '+0%',
      changeColor: 'text-gray-500',
      bgColor: 'white',
      icon: MdCancel,
    },
    {
      title: 'Pedidos Reembolsados',
      value: 'S/0.00',
      change: '+0%',
      changeColor: 'text-gray-500',
      bgColor: 'white',
      icon: MdSwapHoriz,
    },
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/dashboard/cards-stats');
        const data = response.data;
        
        // Actualizar los datos de las tarjetas con la información real
        const updatedCardsData = [...cardsData];
        
        // Total de pedidos
        updatedCardsData[0] = {
          ...updatedCardsData[0],
          value: data.total_orders.value.toString(),
          change: `${data.total_orders.change_percent >= 0 ? '+' : ''}${data.total_orders.change_percent}%`,
          changeColor: getChangeColor(data.total_orders.change_percent)
        };
        
        // Monto total
        updatedCardsData[1] = {
          ...updatedCardsData[1],
          value: `S/${parseFloat(data.total_amount.value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${data.total_amount.change_percent >= 0 ? '+' : ''}${data.total_amount.change_percent}%`,
          changeColor: getChangeColor(data.total_amount.change_percent)
        };
        
        // Pedidos pendientes
        updatedCardsData[2] = {
          ...updatedCardsData[2],
          value: data.pending_orders.value.toString(),
          change: `${data.pending_orders.change_percent >= 0 ? '+' : ''}${data.pending_orders.change_percent}%`,
          changeColor: getChangeColor(data.pending_orders.change_percent, true) // Para pendientes, un aumento es negativo
        };
        
        // Pedidos entregados
        updatedCardsData[3] = {
          ...updatedCardsData[3],
          value: data.delivered_orders.value.toString(),
          change: `${data.delivered_orders.change_percent >= 0 ? '+' : ''}${data.delivered_orders.change_percent}%`,
          changeColor: getChangeColor(data.delivered_orders.change_percent)
        };
        
        // Pedidos cancelados
        updatedCardsData[4] = {
          ...updatedCardsData[4],
          value: data.canceled_orders.value.toString(),
          change: `${data.canceled_orders.change_percent >= 0 ? '+' : ''}${data.canceled_orders.change_percent}%`,
          changeColor: getChangeColor(data.canceled_orders.change_percent, true) // Para cancelados, un aumento es negativo
        };
        
        // Pedidos reembolsados
        updatedCardsData[5] = {
          ...updatedCardsData[5],
          value: `S/${parseFloat(data.refunded_orders.amount).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${data.refunded_orders.change_percent >= 0 ? '+' : ''}${data.refunded_orders.change_percent}%`,
          changeColor: getChangeColor(data.refunded_orders.change_percent, true) // Para reembolsados, un aumento es negativo
        };
        
        setCardsData(updatedCardsData);
      } catch (error) {
        console.error('Error al cargar datos de tarjetas:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para determinar el color basado en el porcentaje de cambio
  const getChangeColor = (percent, inverse = false) => {
    if (percent === 0) return 'text-gray-500';
    
    if (inverse) {
      // Para métricas donde un aumento es negativo (cancelaciones, reembolsos, etc.)
      return percent >= 0 ? 'text-red-500' : 'text-green-500';
    } else {
      // Para métricas donde un aumento es positivo (ventas, entregas, etc.)
      return percent >= 0 ? 'text-green-500' : 'text-red-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
          <div className="text-gray-800 font-medium">Cargando datos...</div>
        </div>
      )}
      
      {error && (
        <div className="col-span-1 md:col-span-2 p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-600">
          Error al cargar datos. Por favor, recarga la página.
        </div>
      )}
      
      {cardsData.map((card, idx) => {
        const Icon = card.icon;
        // Colores de fondo para los iconos, uno distinto por tarjeta
        const iconBgColors = [
          '#2563eb', // azul
          '#22c55e', // verde
          '#f59e42', // naranja
          '#8b5cf6', // morado
          '#ef4444', // rojo
          '#64748b', // gris
        ];
        const iconBg = iconBgColors[idx % iconBgColors.length];
        return (
          <div
            key={idx}
            style={{ backgroundColor: card.bgColor }}
            className={"p-2 rounded-xl flex flex-col items-center transition-all duration-200 shadow-lg border border-gray-200 w-full mx-auto hover:shadow-xl"}
          >
            <div className="flex flex-col items-center w-full">
              <div className="flex justify-center w-full mt-4">
                <div
                  className="rounded-full p-2 flex items-center justify-center shadow-none border border-gray-200"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon className="text-white w-5 h-5" />
                </div>
              </div>
              <div className="text-xl font-bold text-[#1A2343] text-center my-1">{card.value}</div>
              <div className="text-xs text-[#3B4256] font-medium text-center mb-0">{card.title}</div>
              <div className={`text-xs ${card.changeColor} text-center mt-0`}>Último día {card.change}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
