import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Datos iniciales para el estado mientras se cargan los datos reales
const datosIniciales = [
  { mes: 'Ene', ventas: 0, ganancia: 0 },
  { mes: 'Feb', ventas: 0, ganancia: 0 },
  { mes: 'Mar', ventas: 0, ganancia: 0 },
  { mes: 'Abr', ventas: 0, ganancia: 0 },
  { mes: 'May', ventas: 0, ganancia: 0 },
  { mes: 'Jun', ventas: 0, ganancia: 0 },
  { mes: 'Jul', ventas: 0, ganancia: 0 },
  { mes: 'Ago', ventas: 0, ganancia: 0 },
  { mes: 'Sep', ventas: 0, ganancia: 0 },
  { mes: 'Oct', ventas: 0, ganancia: 0 },
  { mes: 'Nov', ventas: 0, ganancia: 0 },
  { mes: 'Dic', ventas: 0, ganancia: 0 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[150px] shadow-lg">
      <p className="text-gray-800 font-semibold mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center mb-1">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-800 font-semibold mr-2">
            {entry.name === 'ganancia' 
              ? `S/${Number(entry.value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
              : Number(entry.value).toLocaleString('es-PE')}
          </span>
          <span className="text-gray-500 text-sm">
            {entry.name === 'ventas' ? 'Ventas' : 'Ganancia'}
          </span>
        </div>
      ))}
    </div>
  );
}


export default function Lineal() {
  // Estados para manejar los datos y la animación
  const [ventasData, setVentasData] = useState(datosIniciales);
  const [mesActual, setMesActual] = useState(1);
  const [animando, setAnimando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visualizacion, setVisualizacion] = useState('mensual');
  const [resumen, setResumen] = useState({
    ventasTotal: 0,
    gananciaTotal: 0,
    ventasPorcentaje: 0,
    gananciaPorcentaje: 0
  });

  // Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Añadimos el parámetro de visualización a la URL
        const response = await axios.get(`/api/dashboard/sales-performance?view=${visualizacion}`);
        
        if (response.data && response.data.data) {
          setVentasData(response.data.data);
          if (response.data.summary) {
            setResumen(response.data.summary);
          }
          
          // Resetear la animación cuando cambian los datos
          setMesActual(1);
          setTimeout(() => {
            setAnimando(true);
          }, 500);
        }
      } catch (error) {
        console.error('Error al cargar datos de rendimiento de ventas:', error);
        // En caso de error, mantenemos los datos iniciales
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visualizacion]); // Ahora el efecto se ejecuta cuando cambia la visualización

  // Manejar la animación
  useEffect(() => {
    if (animando && mesActual < ventasData.length) {
      const timer = setTimeout(() => {
        setMesActual((prev) => prev + 1);
      }, visualizacion === 'mensual' ? 800 : 400); // Velocidad de la animación (más rápida para vista anual)
      return () => clearTimeout(timer);
    }
  }, [mesActual, animando, ventasData.length, visualizacion]);

  // Preparar datos para mostrar según la vista actual y la animación
  const data = ventasData.slice(0, mesActual);

  const handleDescargar = () => {
    // Generar y descargar CSV con datos reales
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Mes,Ventas,Ganancia\n" + 
      ventasData.map(row => `${row.mes},${row.ventas},${row.ganancia}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDate = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `rendimiento_ventas_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-gray-800 w-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
          <div className="text-gray-800">Cargando datos...</div>
        </div>
      )}
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="text-2xl font-bold">Rendimiento de ventas</h2>
          <p className="text-gray-600 mb-2">
            {visualizacion === 'mensual'
              ? `Visualiza el rendimiento mensual de ventas en ${new Date().getFullYear()}`
              : 'Visualiza el rendimiento anual de ventas de los últimos 5 años'}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleDescargar}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Excel
          </button>
          {/* Selector Mensual/Anual */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setVisualizacion('mensual')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                visualizacion === 'mensual' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Mensual
            </button>
            <button 
              onClick={() => setVisualizacion('anual')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                visualizacion === 'anual' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Anual
            </button>
          </div>
        </div>
      </div>
      
      {/* Resumen de datos */}
      <div className="flex mb-4 space-x-8">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Total ventas</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{resumen.ventasTotal.toLocaleString('es-PE')}</span>
            <span className={`text-sm font-semibold ${resumen.ventasPorcentaje >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {resumen.ventasPorcentaje >= 0 ? '+' : ''}{resumen.ventasPorcentaje}%
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Total ganancias</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">S/{resumen.gananciaTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`text-sm font-semibold ${resumen.gananciaPorcentaje >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {resumen.gananciaPorcentaje >= 0 ? '+' : ''}{resumen.gananciaPorcentaje}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Leyenda de colores */}
      <div className="flex gap-6 mb-4 justify-start">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#1677ff' }}></span>
          <span className="text-gray-700 text-sm font-medium">Ventas (eje izquierdo)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#7e6eea' }}></span>
          <span className="text-gray-700 text-sm font-medium">Ganancia (eje derecho)</span>
        </div>
      </div>
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1677ff" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1677ff" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gananciaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7e6eea" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7e6eea" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              tick={{ fill: '#9ca3af', fontSize: 13 }} 
              axisLine={false} 
              tickLine={false} 
            />
            {/* Eje Y para ventas (izquierda) */}
            <YAxis 
              yAxisId="left"
              stroke="#1677ff"
              tickFormatter={value => {
                if (value === 0) return '0';
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
              tick={{ fill: '#1677ff', fontSize: 13 }} 
              axisLine={false} 
              tickLine={false} 
              width={40}
              domain={[0, 'auto']}
              allowDecimals={false}
              orientation="left"
            />
            {/* Eje Y para ganancias (derecha) */}
            <YAxis 
              yAxisId="right"
              stroke="#7e6eea"
              tickFormatter={value => {
                if (value === 0) return '0';
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
              tick={{ fill: '#7e6eea', fontSize: 13 }} 
              axisLine={false} 
              tickLine={false} 
              width={40}
              domain={[0, 'auto']}
              allowDecimals={false}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ventas"
              stroke="#1677ff"
              strokeWidth={2}
              fill="url(#ventasGradient)"
              fillOpacity={1}
              isAnimationActive={true}
              animationDuration={400}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="ganancia"
              stroke="#7e6eea"
              strokeWidth={2}
              fill="url(#gananciaGradient)"
              fillOpacity={1}
              isAnimationActive={true}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}