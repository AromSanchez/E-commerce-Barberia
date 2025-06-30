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
  X,
  Mail,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { route } from 'ziggy-js';
import VerSeguimiento from './VerSeguimiento';
import CustomModal from './CustomModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import { Inertia } from '@inertiajs/inertia';

export default function OrdenList({ orders, searchTerm, statusFilter, generarTracking }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState({
    isOpen: false,
    orderNumber: '',
    steps: []
  });
  // Estados para el modal de cancelación
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    order: null
  });
  // Estado para el modal de respuesta del admin
  const [adminResponseModal, setAdminResponseModal] = useState({
    isOpen: false,
    refundRequest: null
  });
  const [refundReason, setRefundReason] = useState('');
  const [comments, setComments] = useState('');
  const cancelReasons = [
    'No recibí mi pedido',
    'El pedido nunca llegó en la fecha estimada',
    'Información incorrecta en mi pedido',
    'Producto Incorrecto',
    'Otro motivo'
  ];

  // Función para alternar la expansión de una orden
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Función para mostrar el modal de seguimiento
  const showTrackingModal = (order) => {
    setTrackingModal({
      isOpen: true,
      orderNumber: order.orderNumber,
      steps: generarTracking(order)
    });
  };

  // Función para cerrar el modal de seguimiento
  const closeTrackingModal = () => {
    setTrackingModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Función para abrir el modal de cancelación
  const openCancelModal = (order) => {
    setCancelModal({ isOpen: true, order });
    setRefundReason('');
    setComments('');
  };

  // Función para cerrar el modal de cancelación
  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, order: null });
    setRefundReason('');
    setComments('');
  };

  // Función para abrir el modal de respuesta del admin
  const openAdminResponseModal = (refundRequest) => {
    setAdminResponseModal({ isOpen: true, refundRequest });
  };

  // Función para cerrar el modal de respuesta del admin
  const closeAdminResponseModal = () => {
    setAdminResponseModal({ isOpen: false, refundRequest: null });
  };

  // Simular envío de cancelación
  const handleSubmitCancel = (e) => {
    e.preventDefault();
    if (!refundReason) {
      toast.error('Por favor selecciona un motivo para cancelar el pedido');
      return;
    }

    Inertia.post('/refund-requests', {
      order_id: cancelModal.order.id,
      reason: refundReason,
      user_comment: comments || null,
    }, {
      onSuccess: () => {
        toast.success('Tu solicitud de reembolso ha sido enviada correctamente. Te contactaremos pronto.');
        closeCancelModal();
      },
      onError: (errors) => {
        toast.error(errors.reason || 'Ocurrió un error al enviar la solicitud.');
      }
    });
  };

  // Función para obtener el estado del reembolso de una orden
  // BACKEND: En el controlador, incluir la relación refundRequest en cada orden
  const getRefundStatus = (order) => {
    // order.refund_request debería venir del backend con los datos de la solicitud
    return order.refund_request;
  };

  // Función para obtener el badge del estado de reembolso
  const getRefundStatusBadge = (refundRequest) => {
    if (!refundRequest) return null;

    const config = {
      pendiente: { 
        label: "Reembolso Pendiente", 
        color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
        icon: <Clock className="w-3 h-3" /> 
      },
      aprobado: { 
        label: "Reembolso Aprobado", 
        color: "bg-green-100 text-green-700 border-green-200", 
        icon: <CheckCircle className="w-3 h-3" /> 
      },
      rechazado: { 
        label: "Reembolso Rechazado", 
        color: "bg-red-100 text-red-700 border-red-200", 
        icon: <XCircle className="w-3 h-3" /> 
      },
    }[refundRequest.status] || { 
      label: refundRequest.status, 
      color: "bg-gray-100 text-gray-700 border-gray-200", 
      icon: <AlertCircle className="w-3 h-3" /> 
    };

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
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
      case 'processing':
      case 'procesando':
        return 'bg-yellow-100 text-yellow-700';
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
      case 'processing':
      case 'procesando':
        return <RefreshCw className="h-3.5 w-3.5" />;
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
      case 'processing':
      case 'procesando':
        return 'Procesando';
      default:
        // Mostrar el valor real capitalizado si no está mapeado
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
    }
  };

  // Función para descargar una factura
  const downloadInvoice = (order) => {
    // Usar route() para generar la URL correcta
    const url = route('orders.download-invoice', { order: order.id });
    window.open(url, '_blank');
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
  }) || [];

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
          filteredOrders.map((order) => {
            const refundRequest = getRefundStatus(order);
            
            return (
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
                            <span>S/ {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </Badge>
                      
                      {/* Badge del estado de reembolso */}
                      {refundRequest && getRefundStatusBadge(refundRequest)}
                      
                      {/* Icono de carta para ver respuesta del admin */}
                      {refundRequest && refundRequest.status !== 'pendiente' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openAdminResponseModal(refundRequest)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2"
                          title="Ver respuesta del administrador"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      
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
                      {order.items.map((item) => {
                        console.log("Ruta imagen:", item.image);

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="relative">
                              <img
                                src={`http://localhost:8000/storage/${item.image}`}
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
                                <span className="font-semibold text-green-600 text-sm">S/</span>
                                {item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
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

                    {/* Mostrar información del reembolso si existe */}
                    {refundRequest && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          Estado del Reembolso:
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">
                              Solicitud enviada el: {new Date(refundRequest.created_at).toLocaleDateString('es-ES')}
                            </span>
                            {getRefundStatusBadge(refundRequest)}
                          </div>
                          <p className="text-sm text-blue-800">
                            <strong>Motivo:</strong> {refundRequest.reason}
                          </p>
                          {refundRequest.status !== 'pendiente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAdminResponseModal(refundRequest)}
                              className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-100"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Ver respuesta del administrador
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

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

                      {order.status !== "cancelled" && (
                        <Button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 h-10 px-4 py-2 gap-2"
                          onClick={() => setTrackingModal({
                            isOpen: true,
                            orderId: order.id,
                            orderNumber: order.orderNumber,
                            steps: generarTracking(order)
                          })}
                        >
                          <Truck className="h-4 w-4" />
                          Rastrear Envío
                        </Button>
                      )}

                      {/* Solo mostrar botón de solicitar reembolso si no hay solicitud o fue rechazada */}
                      {(order.status === "pending" || order.status === "processing") && 
                       (!refundRequest || refundRequest.status === 'rechazado') && (
                        <Button
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 flex items-center gap-2"
                          onClick={() => openCancelModal(order)}
                        >
                          <X className="h-4 w-4" />
                          {refundRequest?.status === 'rechazado' ? 'Nueva Solicitud' : 'Solicitar Reembolso'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>

      {/* Tracking Modal usando nuestro componente CustomModal */}
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
          steps={trackingModal.steps}
        />
      </CustomModal>

      {/* Refund Request Modal */}
      <CustomModal
        isOpen={cancelModal.isOpen}
        onClose={closeCancelModal}
        title={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </span>
            <span className="text-xl font-bold text-gray-900">Solicitar Reembolso</span>
          </div>
        }
        description={
          <span className="text-gray-500 text-base">Por favor, selecciona el motivo de tu solicitud de reembolso.</span>
        }
      >
        <form onSubmit={handleSubmitCancel} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo del reembolso <span className="text-blue-500">*</span></label>
            <div className="relative">
              <select
                className={`w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm ${refundReason ? 'ring-1 ring-blue-400 border-blue-400' : ''}`}
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                required
              >
                <option value="" disabled>Selecciona un motivo</option>
                {cancelReasons.map((reason, idx) => (
                  <option key={idx} value={reason}>{reason}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
              </span>
            </div>
            {refundReason && (
              <div className="mt-2 text-xs text-blue-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" /> Motivo seleccionado
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comentarios adicionales</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm placeholder-gray-400 resize-none min-h-[80px]"
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={3}
              placeholder="¿Quieres agregar algún detalle? (opcional)"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={closeCancelModal} className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-black transition-all">Cerrar</Button>
            <Button type="submit" variant="destructive" className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-500 transition-all">Enviar Solicitud</Button>
          </div>
        </form>
      </CustomModal>

      {/* Admin Response Modal */}
      <CustomModal
        isOpen={adminResponseModal.isOpen}
        onClose={closeAdminResponseModal}
        title={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
              adminResponseModal.refundRequest?.status === 'aprobado' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {adminResponseModal.refundRequest?.status === 'aprobado' ? 
                <CheckCircle className="h-6 w-6 text-green-600" /> : 
                <XCircle className="h-6 w-6 text-red-600" />
              }
            </span>
            <span className="text-xl font-bold text-gray-900">
              {adminResponseModal.refundRequest?.status === 'aprobado' ? 
                'Reembolso Aprobado' : 'Reembolso Rechazado'
              }
            </span>
          </div>
        }
        description={
          <span className="text-gray-500 text-base">
            {adminResponseModal.refundRequest?.status === 'aprobado' ? 
              'Tu solicitud de reembolso ha sido aprobada por nuestro equipo.' :
              'Tu solicitud de reembolso ha sido revisada por nuestro equipo.'
            }
          </span>
        }
      >
        {adminResponseModal.refundRequest && (
          <div className="space-y-4">
            {/* Información de la solicitud */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">Detalles de tu solicitud:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Fecha de solicitud:</span> 
                  <span className="ml-2 text-gray-600">
                    {new Date(adminResponseModal.refundRequest.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Motivo:</span> 
                  <span className="ml-2 text-gray-600">{adminResponseModal.refundRequest.reason}</span>
                </div>
                {adminResponseModal.refundRequest.user_comment && (
                  <div>
                    <span className="font-medium text-gray-700">Tus comentarios:</span> 
                    <span className="ml-2 text-gray-600">{adminResponseModal.refundRequest.user_comment}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Respuesta del administrador */}
            <div className={`p-4 rounded-lg border-l-4 ${
              adminResponseModal.refundRequest.status === 'aprobado' ? 
                'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
            }`}>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Respuesta del Administrador:
              </h4>
              <div className="text-sm text-gray-700">
                {adminResponseModal.refundRequest.admin_response || 
                  (adminResponseModal.refundRequest.status === 'aprobado' ? 
                    'Tu reembolso ha sido procesado exitosamente.' : 
                    'Tu solicitud no cumple con nuestros criterios de reembolso.'
                  )
                }
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Respondido el: {new Date(adminResponseModal.refundRequest.updated_at).toLocaleDateString('es-ES')}
              </div>
            </div>

            {/* Información adicional según el estado */}
            {adminResponseModal.refundRequest.status === 'aprobado' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">¿Qué sigue?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• El reembolso será procesado en los próximos 3-5 días hábiles</li>
                  <li>• Recibirás una confirmación por email cuando se complete</li>
                  <li>• El monto aparecerá en tu método de pago original</li>
                </ul>
              </div>
            )}

            {adminResponseModal.refundRequest.status === 'rechazado' && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">¿No estás de acuerdo?</h4>
                <p className="text-sm text-orange-800 mb-2">
                  Si consideras que tu solicitud debe ser reconsiderada, puedes:
                </p>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Contactar a nuestro servicio al cliente</li>
                  <li>• Enviar una nueva solicitud con información adicional</li>
                  <li>• Llamar a nuestra línea de atención: (01) 123-4567</li>
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={closeAdminResponseModal}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Entendido
              </Button>
            </div>
          </div>
        )}
      </CustomModal>
    </>
  );
}
