import { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  CheckCircle,
  DollarSign, 
  Download, 
  Eye, 
  MapPin, 
  Package, 
  RefreshCw, 
  Star, 
  Truck, 
  X 
} from 'lucide-react';
import VerSeguimiento from './VerSeguimiento';
import CustomModal from './CustomModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrdenList({ orders, searchTerm, statusFilter }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, orderId: null, orderNumber: "" });
  
  // Función para alternar la expansión de una orden
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Función para mostrar el modal de seguimiento
  const showTrackingModal = (orderId, orderNumber) => {
    setTrackingModal({ isOpen: true, orderId, orderNumber });
  };

  // Función para cerrar el modal de seguimiento
  const closeTrackingModal = () => {
    setTrackingModal({ isOpen: false, orderId: null, orderNumber: "" });
  };

  // Función para determinar el color del badge según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Función para obtener el icono según el estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'shipped':
        return <Truck className="h-3.5 w-3.5" />;
      case 'pending':
        return <Clock className="h-3.5 w-3.5" />;
      case 'cancelled':
        return <X className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  // Función para obtener el texto según el estado
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'shipped':
        return 'Enviado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  // Función para descargar una factura
  const downloadInvoice = (order) => {
    console.log('Descargando factura para el pedido:', order.id);
    // Implementación pendiente
  };
  // Datos de seguimiento formateados para VerSeguimiento
  const formattedTracking = {
    1: [
      {
        id: 1,
        title: 'Pedido recibido',
        description: 'Hemos recibido tu pedido y lo estamos procesando',
        date: '18/06/2025, 10:30',
        completed: true,
        current: false
      },
      {
        id: 2,
        title: 'Procesando pedido',
        description: 'Tu pedido está siendo preparado para envío',
        date: '19/06/2025, 08:15',
        completed: true,
        current: false
      },
      {
        id: 3,
        title: 'Enviado',
        description: 'Tu pedido ha sido enviado',
        date: '20/06/2025, 14:22',
        completed: true,
        current: false
      },
      {
        id: 4,
        title: 'En ruta',
        description: 'Tu pedido está en camino hacia tu dirección',
        date: '21/06/2025, 09:45',
        completed: false,
        current: true
      },
      {
        id: 5,
        title: 'Entregado',
        description: 'Tu pedido ha sido entregado con éxito',
        date: '',
        completed: false,
        current: false
      }
    ],
    2: [
      {
        id: 1,
        title: 'Pedido recibido',
        description: 'Hemos recibido tu pedido y lo estamos procesando',
        date: '20/06/2025, 10:15',
        completed: true,
        current: false
      },
      {
        id: 2,
        title: 'Procesando pedido',
        description: 'Tu pedido está siendo preparado para envío',
        date: '21/06/2025, 16:30',
        completed: true,
        current: false
      },
      {
        id: 3,
        title: 'Enviado',
        description: 'Tu pedido ha sido enviado',
        date: '22/06/2025, 09:20',
        completed: true,
        current: true
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
        completed: false,
        current: false
      }
    ],
    3: [
      {
        id: 1,
        title: 'Pedido recibido',
        description: 'Hemos recibido tu pedido y lo estamos procesando',
        date: '22/06/2025, 16:45',
        completed: true,
        current: true
      },
      {
        id: 2,
        title: 'Procesando pedido',
        description: 'Tu pedido está siendo preparado para envío',
        date: '',
        completed: false,
        current: false
      },
      {
        id: 3,
        title: 'Enviado',
        description: 'Tu pedido ha sido enviado',
        date: '',
        completed: false,
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
        completed: false,
        current: false
      }
    ]
  };

  // Filtrar pedidos según los criterios de búsqueda y filtro
  const filteredOrders = orders?.filter(order => {
    // Filtro por estado
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchTermLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTermLower))
      );
    }
    
    return true;
  }) || [];  // Ya no necesitamos un componente modal personalizado aquí, usaremos el CustomModal

  return (
    <>
      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pedidos</h3>
                <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                          <Package className="h-5 w-5 text-gray-600" />
                          {order.orderNumber}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.date).toLocaleDateString("es-ES")}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />${order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-gray-600 hover:text-black"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedOrder === order.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4 bg-gray-200" />

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-black flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Productos:
                      </h4>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="relative">                            <img
                              src={item.image || "https://placehold.co/200x200?text=Producto"}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md bg-white border border-gray-200"
                              onError={(e) => { e.target.src = "https://placehold.co/200x200?text=Producto" }}
                            />
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-black flex items-center gap-2">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {item.name}
                            </h5>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-black flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        Dirección de Envío:
                      </h4>
                      <div className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{order.shippingAddress}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className="bg-white text-black border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => downloadInvoice(order)}
                      >
                        <Download className="h-4 w-4" />
                        Descargar Factura
                      </Button>

                      {order.status === "completed" && (
                        <Button
                          variant="outline"
                          className="bg-white text-black border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Volver a Comprar
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="bg-white text-black border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </Button>                      {(order.status === "shipped" || order.status === "pending") && (
                        <Button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 h-10 px-4 py-2 gap-2"
                          onClick={() => showTrackingModal(order.id, order.orderNumber)}
                        >
                          <Truck className="h-4 w-4" />
                          Rastrear Envío
                        </Button>
                      )}

                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancelar Pedido
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}        </div>      {/* Tracking Modal usando nuestro componente CustomModal */}
      <CustomModal
        isOpen={trackingModal.isOpen}
        onClose={closeTrackingModal}
        title={
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Rastreo de Pedido
          </div>
        }
        description="A continuación puedes ver el estado actual de tu envío."
      >
        <VerSeguimiento 
          orderNumber={trackingModal.orderNumber} 
          steps={formattedTracking[trackingModal.orderId] || []} 
        />
      </CustomModal>
    </>
  );
}