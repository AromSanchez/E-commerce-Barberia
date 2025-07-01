import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Actividad() {
  const [activityData, setActivityData] = useState({
    activities: [],
    growth_percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/dashboard/recent-activity');
        
        // Mostrar información detallada para depuración
        console.log("Datos de actividad recibidos:", response.data);
        
        if (response.data.debug_info) {
          console.log("Información de depuración:", {
            "Actividad mes actual": response.data.debug_info.current_month_activity,
            "Actividad mes anterior": response.data.debug_info.last_month_activity,
            "Porcentaje de crecimiento": response.data.growth_percentage + "%"
          });
        }
        
        setActivityData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos de actividad:", err);
        setError("No se pudo cargar la actividad reciente");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'][date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${hours}:${minutes}`;
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    return `S/${Number(price).toFixed(2)}`;
  };

  // Determinar el color del indicador de crecimiento
  const growthColor = activityData.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600';
  
  // Determinar el icono de flecha para el crecimiento
  const GrowthIcon = () => {
    if (activityData.growth_percentage >= 0) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs">
      <h3 className="text-lg font-semibold mb-1 text-gray-800">Descripción general de la actividad</h3>
      
      <div className={`flex items-center ${growthColor} text-sm font-medium mb-6 gap-1`}>
        <GrowthIcon />
        {activityData && typeof activityData.growth_percentage === 'number' ? Math.abs(activityData.growth_percentage) : 0}% este mes
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-6">{error}</div>
      ) : (
        <ol className="relative border-l border-gray-200 ml-2">
          {activityData.activities.length > 0 ? (
            activityData.activities.map((activity, index) => (
              <li key={index} className={`${index < activityData.activities.length - 1 ? 'mb-8' : ''} ml-4`}>
                <div className={`absolute w-3 h-3 bg-white border-2 rounded-full -left-1.5 mt-1 
                  ${activity.type === 'order' ? 'border-green-500' : 
                    activity.type === 'user' ? 'border-blue-500' : 'border-purple-500'}`}></div>
                <div className="text-gray-800 font-semibold">
                  {activity.type === 'order' && activity.amount && (
                    <span>{formatPrice(activity.amount)}, </span>
                  )}
                  {activity.description}
                </div>
                <div className="text-xs text-gray-400">{formatDate(activity.date)}</div>
              </li>
            ))
          ) : (
            <li className="ml-4 py-4">
              <div className="text-gray-500">No hay actividad reciente</div>
            </li>
          )}
        </ol>
      )}
    </div>
  );
}