import { ShoppingBag, User, Search, BarChart3, Package, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OrdenList from './OrdenList';

export default function MainHistorial({ orders, totals }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

    const pasos = [
      {
        id: 1,
        title: 'Pedido recibido',
        description: 'Hemos recibido tu pedido y lo estamos procesando',
        date: formato(createdDate),
        completed: true,
        current: order.status === 'pending'
      },
      {
        id: 2,
        title: 'Procesando pedido',
        description: 'Tu pedido está siendo preparado para envío',
        date: order.status !== 'pending' ? formato(new Date(createdDate.getTime() + 1 * 86400000)) : '',
        completed: ['shipped', 'completed'].includes(order.status),
        current: order.status === 'shipped'
      },
      {
        id: 3,
        title: 'Enviado',
        description: 'Tu pedido ha sido enviado',
        date: order.status === 'completed' ? formato(new Date(createdDate.getTime() + 2 * 86400000)) : '',
        completed: order.status === 'completed',
        current: false
      },
      {
        id: 4,
        title: 'En ruta',
        description: 'Tu pedido está en camino hacia tu dirección',
        date: '',
        completed: false,
        current: false
      },
      {
        id: 5,
        title: 'Entregado',
        description: 'Tu pedido ha sido entregado con éxito',
        date: '',
        completed: order.status === 'completed',
        current: false
      }
    ];

    const index = pasos.findIndex(p => p.current);
    if (index === -1) {
      const next = pasos.find(p => !p.completed);
      if (next) next.current = true;
    }

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
        <Card className="mb-6 bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número de pedido o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

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
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Total Gastado</span>
                    </div>
                    <p className="text-2xl font-bold text-black">${totals.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
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
                    <p className="text-2xl font-bold text-black">${totals.averageOrder.toFixed(2)}</p>
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