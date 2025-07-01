import { Box, Typography, IconButton, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <Box sx={{
      bgcolor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      boxShadow: 3,
      p: 2,
      minWidth: 150,
      fontFamily: 'shatoshi, sans-serif',
    }}>
      <Typography variant="subtitle2" sx={{ fontFamily: 'shatoshi, sans-serif', mb: 1, fontWeight: 600 }}>{label}</Typography>
      {payload.map((entry, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color, mr: 1 }} />
          <Typography variant="body2" sx={{ fontFamily: 'shatoshi, sans-serif', color: '#222', fontWeight: 600 }}>
            {entry.name === 'Ingresos' 
              ? `S/${Number(entry.value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
              : Number(entry.value).toLocaleString('es-PE')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}



export default function Barras() {
  // Estado para almacenar los datos de la gráfica
  const [data, setData] = useState([
    { name: 'Ene', ingresos: 0, pedidos: 0 },
    { name: 'Feb', ingresos: 0, pedidos: 0 },
    { name: 'Mar', ingresos: 0, pedidos: 0 },
    { name: 'Abr', ingresos: 0, pedidos: 0 },
    { name: 'May', ingresos: 0, pedidos: 0 },
    { name: 'Jun', ingresos: 0, pedidos: 0 },
    { name: 'Jul', ingresos: 0, pedidos: 0 },
    { name: 'Ago', ingresos: 0, pedidos: 0 },
    { name: 'Sep', ingresos: 0, pedidos: 0 },
    { name: 'Oct', ingresos: 0, pedidos: 0 },
    { name: 'Nov', ingresos: 0, pedidos: 0 },
    { name: 'Dic', ingresos: 0, pedidos: 0 },
  ]);
  
  // Estado para almacenar el resumen
  const [summary, setSummary] = useState({
    ingresos: 0,
    ingresosPorcentaje: 0,
    pedidos: 0,
    pedidosPorcentaje: 0
  });

  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  // Estado para controlar el valor máximo del eje Y
  const [yAxisMax, setYAxisMax] = useState(null);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/dashboard/monthly-stats');
        const chartData = response.data.data;
        setData(chartData);
        setSummary(response.data.summary);
        
        // Calcular el valor máximo para el eje Y
        const maxValue = Math.max(...chartData.map(item => Math.max(item.ingresos, item.pedidos)));
        
        // Ajustar el máximo a un valor redondeado hacia arriba para que se vea mejor
        // y calcular los intervalos óptimos para los ticks del eje Y
        let roundedMax;
        if (maxValue <= 5) {
          roundedMax = 5;
        } else if (maxValue <= 10) {
          roundedMax = 10;
        } else if (maxValue <= 50) {
          roundedMax = Math.ceil(maxValue / 10) * 10;
        } else if (maxValue <= 100) {
          roundedMax = Math.ceil(maxValue / 20) * 20;
        } else if (maxValue <= 500) {
          roundedMax = Math.ceil(maxValue / 100) * 100;
        } else if (maxValue <= 1000) {
          roundedMax = Math.ceil(maxValue / 200) * 200;
        } else if (maxValue <= 5000) {
          roundedMax = Math.ceil(maxValue / 1000) * 1000;
        } else if (maxValue <= 10000) {
          roundedMax = Math.ceil(maxValue / 2000) * 2000;
        } else {
          // Para valores muy grandes, redondear a múltiplos de 5000 o 10000
          roundedMax = Math.ceil(maxValue / 5000) * 5000;
        }
        
        setYAxisMax(roundedMax);
      } catch (error) {
        console.error('Error al cargar datos de ventas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 3, position: 'relative' }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 10,
          borderRadius: 2,
        }}>
          <Typography variant="body1" sx={{ fontFamily: 'shatoshi, sans-serif' }}>Cargando datos...</Typography>
        </Box>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'shatoshi, sans-serif' }}>Ingresos y Pedidos</Typography>
        <IconButton
          aria-label="Descargar CSV"
          size="small"
          sx={{ border: '1px solid #e5e7eb', bgcolor: 'white', '&:hover': { bgcolor: '#f3f4f6' }, p: 1 }}
          onClick={() => {
            // Generar y descargar CSV con datos reales
            const csvContent = "data:text/csv;charset=utf-8," + 
              "Mes,Ingresos,Pedidos\n" + 
              data.map(row => `${row.name},${row.ingresos},${row.pedidos}`).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            const currentDate = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `ingresos_pedidos_${currentDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <DownloadIcon sx={{ color: '#1677ff' }} />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={4} mt={0} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'shatoshi, sans-serif' }}>Ingresos</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1677ff' }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'shatoshi, sans-serif' }}>
              S/{summary.ingresos.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                fontFamily: 'shatoshi, sans-serif', 
                color: summary.ingresosPorcentaje >= 0 ? '#25db09' : 'error.main',
                fontWeight: 600
              }}
            >
              {summary.ingresosPorcentaje >= 0 ? '+' : ''}{summary.ingresosPorcentaje}%
            </Typography>
          </Stack>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'shatoshi, sans-serif' }}>Pedidos</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#937AEA' }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'shatoshi, sans-serif' }}>
              {summary.pedidos.toLocaleString('es-PE')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                fontFamily: 'shatoshi, sans-serif', 
                color: summary.pedidosPorcentaje >= 0 ? '#25db09' : 'error.main',
                fontWeight: 600
              }}
            >
              {summary.pedidosPorcentaje >= 0 ? '+' : ''}{summary.pedidosPorcentaje}%
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ width: '100%', maxWidth: '100vw', height: 300, marginLeft: '1%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="1 6" stroke="#9ca3af" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            {/* Eje Y para ingresos (izquierda) */}
            <YAxis 
              yAxisId="left"
              stroke="#1677ff"
              tickFormatter={value => {
                if (value === 0) return '0';
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
              tick={{ fill: '#1677ff', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
              domain={[0, 'auto']}
              allowDecimals={false}
              orientation="left"
            />
            {/* Eje Y para pedidos (derecha) */}
            <YAxis 
              yAxisId="right"
              stroke="#937AEA"
              tickFormatter={value => value}
              tick={{ fill: '#937AEA', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={30}
              domain={[0, 'auto']}
              allowDecimals={false}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ingresos" yAxisId="left" name="Ingresos" fill="#1677ff" radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="pedidos" yAxisId="right" name="Pedidos" fill="#937AEA" radius={[4, 4, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}