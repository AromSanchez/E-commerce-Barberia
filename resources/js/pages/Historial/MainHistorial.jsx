import { ShoppingBag, User, Search, BarChart3, Package, DollarSign, TrendingUp, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Select, { components } from 'react-select';
import OrdenList from './OrdenList';

// Componente personalizado para mostrar el punto de color en el valor seleccionado
const SingleValue = (props) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          display: 'inline-block',
          backgroundColor: props.data.color,
          borderRadius: '50%',
          width: '10px',
          height: '10px',
          marginRight: '8px'
        }}
      />
      {/* Mostramos directamente el label en lugar de props.children para evitar duplicar el punto */}
      {props.data.label}
    </div>
  </components.SingleValue>
);

export default function MainHistorial({ orders, totals }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const mapOrderStatus = (status) => {
    switch (status) {
      case 'procesando':
        return 'pending';
      case 'enviado':
        return 'shipped';
      case 'entregado':
        return 'completed';
      case 'cancelado':
        return 'cancelled';
      default:
        return status;
    }
  };

  const generarTracking = (order) => {
    const createdDate = new Date(order.date);
    const formato = (date) =>
      date.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

    // Mapear el estado real a los pasos visuales
    const mappedStatus = mapOrderStatus(order.status);

    // Determinar el índice del paso actual según el estado
    let currentStep = 0;
    if (mappedStatus === 'pending') currentStep = 1;
    else if (mappedStatus === 'shipped') currentStep = 4;
    else if (mappedStatus === 'completed') currentStep = 5;
    else if (mappedStatus === 'cancelled') currentStep = 0;

    const pasos = [
      {
        id: 1,
        title: 'Pedido recibido',
        description: 'Hemos recibido tu pedido y lo estamos procesando',
        date: formato(createdDate),
        completed: currentStep > 1,
        current: currentStep === 1,
      },
      {
        id: 2,
        title: 'Procesando pedido',
        description: 'Tu pedido está siendo preparado para envío',
        date: mappedStatus !== 'pending' ? formato(new Date(createdDate.getTime() + 1 * 86400000)) : '',
        completed: currentStep > 2,
        current: currentStep === 2,
      },
      {
        id: 3,
        title: 'Enviado',
        description: 'Tu pedido ha sido enviado',
        date: mappedStatus === 'completed' ? formato(new Date(createdDate.getTime() + 2 * 86400000)) : '',
        completed: currentStep > 3,
        current: currentStep === 3,
      },
      {
        id: 4,
        title: 'En ruta',
        description: 'Tu pedido está en camino hacia tu dirección',
        date: '',
        completed: currentStep > 4,
        current: currentStep === 4,
      },
      {
        id: 5,
        title: 'Entregado',
        description: 'Tu pedido ha sido entregado con éxito',
        date: '',
        completed: currentStep === 5,
        current: currentStep === 5,
      },
    ];

    // Si el estado es 'shipped', los pasos 1, 2 y 3 deben estar completados, y el 4 actual
    // Si el estado es 'completed', todos completados y el 5 actual
    // Si el estado es 'pending', solo el 1 actual

    return pasos;
  };

  // Datos de ejemplo para mostrar en el dashboard
  // En un caso real, estos datos vendrían de una API o de Inertia props

  // Datos ficticios de pedidos
  const mockOrders = [
    {
      id: 1,
      orderNumber: 'PED-2025-001',
      date: '2025-06-15T14:30:00',
      total: 89.95,
      status: 'completed',
      items: [
        {
          id: 101,
          name: 'Gel de Fijación Extrafuerte',
          price: 24.99,
          quantity: 2,
          image: 'https://placehold.co/200x200?text=Gel'
        },
        {
          id: 102,
          name: 'Cera Texturizadora para Cabello',
          price: 19.99,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Cera'
        },
        {
          id: 103,
          name: 'Aceite para Barba Premium',
          price: 19.99,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Aceite'
        }
      ],
      shippingAddress: 'Calle Principal 123, Colonia Centro, Ciudad de México, CP 06010'
    },
    {
      id: 2,
      orderNumber: 'PED-2025-015',
      date: '2025-06-19T10:15:00',
      total: 145.50,
      status: 'shipped',
      items: [
        {
          id: 201,
          name: 'Maquina de Afeitar Profesional',
          price: 89.99,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Maquina'
        },
        {
          id: 202,
          name: 'Set de Cepillos para Barba',
          price: 35.50,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Cepillos'
        },
        {
          id: 203,
          name: 'Loción Aftershave Refrescante',
          price: 20.00,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Locion'
        }
      ],
      shippingAddress: 'Av. Insurgentes Sur 1235, Colonia Del Valle, Ciudad de México, CP 03100'
    },
    {
      id: 3,
      orderNumber: 'PED-2025-023',
      date: '2025-06-22T16:45:00',
      total: 67.25,
      status: 'pending',
      items: [
        {
          id: 301,
          name: 'Champú para Barba',
          price: 22.99,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Champu'
        },
        {
          id: 302,
          name: 'Acondicionador para Barba',
          price: 22.99,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Acondicionador'
        },
        {
          id: 303,
          name: 'Tijeras de Precisión para Barbería',
          price: 21.27,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Tijeras'
        }
      ],
      shippingAddress: 'Calle Durango 45, Colonia Roma Norte, Ciudad de México, CP 06700'
    },
    {
      id: 4,
      orderNumber: 'PED-2025-018',
      date: '2025-06-17T11:20:00',
      total: 54.99,
      status: 'cancelled',
      items: [
        {
          id: 401,
          name: 'Kit de Afeitado Tradicional',
          price: 54.99,
          quantity: 1,
          image: 'https://placehold.co/200x200?text=Kit'
        }
      ],
      shippingAddress: 'Av. Universidad 3000, Coyoacán, Ciudad de México, CP 04510'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-8 w-8 text-black" />
            <h1 className="text-3xl font-bold text-black">Historial de Pedidos</h1>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <User className="h-4 w-4" />
            Revisa todos tus pedidos anteriores y su estado actual
          </p>
        </div>


        {/* Filters */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row gap-5">
              {/* Campo de búsqueda */}
              <div className="flex-1 flex flex-col">
                <label htmlFor="search-input" className="mb-2 text-sm text-gray-700 font-medium">Buscar:</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Número de pedido o nombre de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className="mt-1 text-xs text-blue-600">
                    Buscando: "{searchTerm}"
                  </div>
                )}
              </div>

              {/* Selector de estado */}
              <div className="w-full md:w-64 flex flex-col">
                <label htmlFor="status-filter" className="mb-2 text-sm text-gray-700 font-medium">Estado:</label>
                <Select
                  inputId="status-filter"
                  instanceId="status-select"
                  value={{
                    value: statusFilter,
                    label: statusFilter === 'all' ? 'Todos los estados' :
                      statusFilter === 'completed' ? 'Completado' :
                        statusFilter === 'shipped' ? 'Enviado' :
                          statusFilter === 'pending' ? 'Pendiente' : 'Cancelado',
                    color: statusFilter === 'all' ? '#A0AEC0' :
                      statusFilter === 'completed' ? '#10B981' :
                        statusFilter === 'shipped' ? '#3B82F6' :
                          statusFilter === 'pending' ? '#F59E0B' : '#EF4444'
                  }}
                  onChange={(option) => {
                    console.log("Filtro seleccionado:", option.value);
                    setStatusFilter(option.value);
                  }}
                  options={[
                    {
                      value: 'all',
                      label: 'Todos los estados',
                      color: '#A0AEC0' // gray-400
                    },
                    {
                      value: 'completed',
                      label: 'Completado',
                      color: '#10B981' // emerald-500 
                    },
                    {
                      value: 'shipped',
                      label: 'Enviado',
                      color: '#3B82F6' // blue-500
                    },
                    {
                      value: 'pending',
                      label: 'Pendiente',
                      color: '#F59E0B' // amber-500
                    },
                    {
                      value: 'cancelled',
                      label: 'Cancelado',
                      color: '#EF4444' // red-500
                    }
                  ]}
                  isSearchable={false}
                  formatOptionLabel={({ label, color }) => (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      <span>{label}</span>
                    </div>
                  )}
                  components={{
                    SingleValue
                  }}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? '#000' : '#D1D5DB',
                      boxShadow: state.isFocused ? '0 0 0 1px #000' : 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#000',
                      },
                      padding: '1px 8px',
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      zIndex: 50,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }),
                    option: (baseStyles, { isSelected, isFocused, data }) => ({
                      ...baseStyles,
                      backgroundColor: isSelected
                        ? '#F3F4F6'
                        : isFocused
                          ? '#F9FAFB'
                          : undefined,
                      color: '#000',
                      padding: '8px 16px',
                      cursor: 'pointer',
                    }),
                    dropdownIndicator: (baseStyles) => ({
                      ...baseStyles,
                      color: '#6B7280',
                      '&:hover': {
                        color: '#000',
                      },
                    }),
                    indicatorSeparator: () => ({
                      display: 'none',
                    }),
                  }}
                  className="text-sm"
                  placeholder="Seleccionar estado"
                  maxMenuHeight={220}
                />

                {/* Indicador de filtro activo */}
                {statusFilter !== 'all' && (
                  <div className="mt-2 py-1 px-3 bg-blue-50 text-blue-700 text-xs rounded-full inline-flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${statusFilter === 'completed' ? 'bg-emerald-500' :
                      statusFilter === 'shipped' ? 'bg-blue-500' :
                        statusFilter === 'pending' ? 'bg-amber-500' :
                          'bg-red-500'
                      }`}></div>
                    Filtrando por: {
                      statusFilter === 'completed' ? 'Completado' :
                        statusFilter === 'shipped' ? 'Enviado' :
                          statusFilter === 'pending' ? 'Pendiente' :
                            'Cancelado'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Totals */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-6 w-6 text-black" />
            <h2 className="text-xl font-bold text-black">Resumen de Pedidos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Total Pedidos</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{totals.totalOrders}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-4 w-4 text-green-600 font-bold">S/</span>
                      <span className="text-sm font-medium text-gray-600">Total Gastado</span>
                    </div>
                    <p className="text-2xl font-bold text-black">S/{totals.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <span className="h-10 w-10 text-green-600 font-bold">S/</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-600">Promedio</span>
                    </div>
                    <p className="text-2xl font-bold text-black">S/{totals.averageOrder.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-600">Completados</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{totals.completedOrders}</p>
                  </div>
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <OrdenList searchTerm={searchTerm} statusFilter={statusFilter} orders={orders} generarTracking={generarTracking}
        />

      </div>
    </div>
  );
}