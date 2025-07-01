import React, { useState, useEffect } from "react";
import axios from "axios";

const Tarjeta = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    paidOrders: 0,
    annualRevenue: 0,
    revenueGrowth: 0,
    topProduct: {
      name: "",
      category: "",
      sales: 0,
      image: null
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar la nueva ruta que creamos para obtener estadísticas reales
        const response = await axios.get("/api/dashboard/project-stats");
        console.log("Respuesta de API project-stats:", response.data); // Debug - muestra la respuesta completa
        
        // Verificar específicamente los datos de órdenes
        console.log("Total de órdenes recibidas:", response.data.total_orders);
        
        if (response.data.total_orders === undefined) {
          console.warn("¡Advertencia! No se recibieron datos de órdenes del servidor");
        }
        
        // Mapear la respuesta de la API a la estructura que espera el componente
        setStats({
          productCount: response.data.total_products || 0,
          // Asegurar que orderCount sea un número entero
          orderCount: parseInt(response.data.total_orders) || 0,
          paidOrders: parseInt(response.data.paid_orders) || 0,
          annualRevenue: response.data.annual_income || 0,
          revenueGrowth: response.data.revenue_growth || 0,
          topProduct: {
            name: response.data.best_selling_product?.name || "Sin datos",
            category: "",  // La API no devuelve la categoría directamente
            sales: response.data.best_selling_product?.total_sold || 0,
            image: response.data.best_selling_product?.image || null
          }
        });
        
        // Si tenemos el producto más vendido, intentaremos obtener su categoría
        if (response.data.best_selling_product && response.data.best_selling_product.slug) {
          try {
            // Opcional: hacer una segunda llamada para obtener más detalles del producto
            const productDetails = await axios.get(`/producto/${response.data.best_selling_product.slug}`);
            if (productDetails.data && productDetails.data.category) {
              setStats(prevStats => ({
                ...prevStats,
                topProduct: {
                  ...prevStats.topProduct,
                  category: productDetails.data.category.name || "Sin categoría"
                }
              }));
            }
          } catch (productError) {
            console.error("No se pudo obtener la categoría del producto:", productError);
          }
        }
        
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        // Mostrar información detallada del error para depuración
        if (error.response) {
          console.error('Error de respuesta:', error.response.data);
          console.error('Código de estado:', error.response.status);
        } else if (error.request) {
          console.error('Error de solicitud:', error.request);
        } else {
          console.error('Error:', error.message);
        }
        
        // Establecer datos en cero en caso de error
        setStats({
          productCount: 0,
          orderCount: 0,
          paidOrders: 0,
          annualRevenue: 0,
          revenueGrowth: 0,
          topProduct: {
            name: 'No hay datos disponibles',
            category: 'N/A',
            sales: 0,
            image: null
          }
        });
      }
    };
    
    fetchData();
  }, []);

  // Formato para números grandes
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  // Formato para cantidades monetarias
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };

  return (
    <div className="bg-white p-4 h-full rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-gray-100 py-5">
      {/* Credit Card */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition-transform duration-300">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10"></div>
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm"></div>
          
          {/* Card Content */}
          <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-md tracking-wider mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">VISA</div>
                <div className="text-xs opacity-90 font-medium text-gray-200">PREMIUM</div>
              </div>
              <div className="w-7 h-7 bg-gray-700 rounded-md flex items-center justify-center border border-gray-600">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
            
            <div className="text-md tracking-widest font-mono mb-1 text-gray-100">
              5789 •••• •••• 2847
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-80 uppercase tracking-wide text-gray-300">Titular</div>
                <div className="font-semibold text-sm text-white">Frank Castro</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80 uppercase tracking-wide text-gray-300">Expira</div>
                <div className="font-semibold text-sm text-white">11/28</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 hover:shadow-md transition-all duration-200 border border-gray-200 group">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-800 leading-none mt-2">{stats.productCount}</div>
              <div className="text-xs text-gray-600 font-medium mt-1">Productos</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 hover:shadow-md transition-all duration-200 border border-gray-200 group">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-800 leading-none">{formatNumber(stats.orderCount)}</div>
              <div className="text-xs text-gray-600 font-medium mt-1">Total Órdenes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 mb-4 group">
        <div className="flex items-center justify-center mb-2">
          <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors mr-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(stats.annualRevenue)}</div>
            <div className="text-xs text-gray-600 font-medium">Ingresos Anuales</div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className={`${stats.revenueGrowth >= 0 ? 'bg-gray-800' : 'bg-red-700'} text-white rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-2 shadow-sm`}>
            {stats.revenueGrowth >= 0 ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            Último año {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
          </span>
        </div>
      </div>
      
      {/* Producto Más Vendido */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Top Vendido</div>
          <div className="p-1 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 border border-gray-300 flex items-center justify-center">
            {stats.topProduct && stats.topProduct.image ? (
              <img 
                src={`/storage/${stats.topProduct.image}`} 
                alt={stats.topProduct.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-800 mb-1">{stats.topProduct.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Categoría: {stats.topProduct.category}</span>
              <span className="text-black text-xs px-3 py-0.5 font-medium text-center">
                {formatNumber(stats.topProduct.sales)} ventas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarjeta;