import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';


// Íconos SVG inline
const CheckCircle = (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" /><path d="M9 12l2 2l4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const XCircle = (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Clock = (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" /><path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Eye = (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default function DashRequest() {
    // Aquí deberías obtener los datos reales de Inertia:
    // const { refundRequests } = usePage().props;
    // Por ahora, datos de ejemplo:
    const { refundRequests } = usePage().props;
    const refunds = refundRequests || []; const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [comment, setComment] = useState("");
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);

    const getStatusBadge = (status) => {
        const config = {
            pendiente: { label: "Pendiente", color: "bg-gray-200 text-gray-700", icon: <Clock className="w-3 h-3 mr-1" /> },
            aprobado: { label: "Aprobado", color: "bg-green-200 text-green-700", icon: <CheckCircle className="w-3 h-3 mr-1" /> },
            rechazado: { label: "Rechazado", color: "bg-red-200 text-red-700", icon: <XCircle className="w-3 h-3 mr-1" /> },
        }[status] || { label: status, color: "bg-gray-200", icon: null };
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
                {config.icon}
                {config.label}
            </span>
        );
    };

    const handleAction = (refund, action) => {
        setSelectedRefund(refund);
        setActionType(action);
        setModalOpen(true);
    };

    const confirmAction = () => {
        if (!selectedRefund || !actionType) return;

        Inertia.put(`/dashboard/requests/${selectedRefund.id}/status`, {
            action: actionType,
            admin_response: comment,
        }, {
            onSuccess: () => {
                setModalOpen(false);
                setComment("");
                setSelectedRefund(null);
                setActionType(null);
            }
        });
    };

    const showDetails = (refund) => {
        setSelectedRefund(refund);
        setDetailsModalOpen(true);
    };

    const showComments = (refund) => {
        setSelectedRefund(refund);
        setCommentModalOpen(true);
    };
    console.log(selectedRefund);


    return (
        <AuthenticatedLayout>
            <Head title="Solicitudes de Reembolso" />
            <div className="flex h-screen">
                <div className="fixed left-0 h-full">
                    <NavAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                </div>
                <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <div className="fixed top-0 right-0 z-10 bg-white" style={{ left: isCollapsed ? 80 : 256 }}>
                        <HeadAdmin />
                    </div>
                    <div className="pt-[73px] h-screen bg-[#F2F7FB]">
                        <div className="p-8 h-full">
                            <div className="bg-white p-6 rounded-lg shadow-sm h-[calc(100%-2rem)] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            {/* Ícono de reembolso */}
                                            <svg className="text-blue-600 w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8V4l-8 8 8 8v-4c4.418 0 8-3.582 8-8 0-1.657-.672-3.156-1.757-4.243" /></svg>
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Reembolsos</h2>
                                    </div>
                                </div>
                                {/* Tabla de solicitudes */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">#</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">Fecha</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">Orden</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">Motivo</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">Cliente</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">Estado</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 align-middle">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {refunds.length > 0 ? (
                                                    refunds.map((refund, idx) => (
                                                        <tr key={refund.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600 text-center">{idx + 1}</td>
                                                            <td className="p-4 text-sm text-center">{new Date(refund.created_at).toLocaleDateString('es-ES')}</td>
                                                            <td className="p-4 text-sm text-center">{refund.order?.order_number ?? '-'}</td>
                                                            <td className="p-4 text-sm max-w-[200px] truncate text-center">{refund.reason}</td>
                                                            <td className="p-4 text-sm text-center">
                                                                <div>
                                                                    <div>
                                                                        <div className="font-medium">{refund.order?.customer_name ?? 'Desconocido'}</div>
                                                                        <div className="text-xs text-gray-400">{refund.order?.user?.email ?? '-'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm text-center">{getStatusBadge(refund.status)}</td>
                                                            <td className="p-4 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    <button className="text-gray-500 hover:text-blue-600 p-1" onClick={() => showComments(refund)}><Eye className="w-4 h-4" /></button>
                                                                    {refund.status === 'pendiente' && (
                                                                        <>
                                                                            <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center" onClick={() => handleAction(refund, 'aprobar')}><CheckCircle className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Aprobar</span></button>
                                                                            <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center" onClick={() => handleAction(refund, 'rechazar')}><XCircle className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Rechazar</span></button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No hay solicitudes de reembolso</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* Modal de Confirmación */}
                                {modalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                                            <h3 className="text-lg font-semibold mb-2">{actionType === 'aprobar' ? 'Aprobar Reembolso' : 'Rechazar Reembolso'}</h3>
                                            <p className="mb-4 text-gray-600">
                                                {actionType === 'aprobar'
                                                    ? '¿Estás seguro de que deseas aprobar esta solicitud de reembolso?'
                                                    : '¿Estás seguro de que deseas rechazar esta solicitud de reembolso?'}
                                            </p>
                                            {selectedRefund && (
                                                <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                                                    <div><span className="font-medium">ID:</span> {selectedRefund.id}</div>
                                                    <div><span className="font-medium">Orden:</span> {selectedRefund.order?.order_number ?? '-'}</div>
                                                    <div><span className="font-medium">Cliente:</span> {selectedRefund.order?.customer_name ?? 'Desconocido'}</div>
                                                    <div><span className="font-medium">Monto:</span> S/{selectedRefund.order?.total_amount ? Number(selectedRefund.order.total_amount).toFixed(2) : '-'}</div>
                                                </div>
                                            )}
                                            <textarea
                                                className="w-full border rounded p-2 mb-4"
                                                placeholder="Comentario del administrador (opcional)"
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                rows={3}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button className="px-4 py-2 rounded border" onClick={() => setModalOpen(false)}>Cancelar</button>
                                                <button
                                                    className={`px-4 py-2 rounded text-white ${actionType === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                                    onClick={confirmAction}
                                                >
                                                    {actionType === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Modal de Detalles */}
                                {detailsModalOpen && selectedRefund && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                                            <h3 className="text-lg font-semibold mb-4">Detalles del Reembolso</h3>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="font-medium">ID:</span> {selectedRefund.id}</div>
                                                <div><span className="font-medium">Fecha:</span> {new Date(selectedRefund.created_at).toLocaleDateString('es-ES')}</div>
                                                <div><span className="font-medium">Orden:</span> {selectedRefund.order?.order_number ?? '-'}</div>
                                                <div><span className="font-medium">Motivo:</span> {selectedRefund.reason}</div>
                                                <div><span className="font-medium">Cliente:</span> {selectedRefund.order?.customer_name ?? 'Desconocido'} <span className="block text-xs text-gray-400">{selectedRefund.user_email}</span></div>
                                                <div><span className="font-medium">Monto:</span> S/{selectedRefund.order?.total_amount ? Number(selectedRefund.order.total_amount).toFixed(2) : '-'}</div>
                                                <div><span className="font-medium">Estado:</span> {getStatusBadge(selectedRefund.status)}</div>
                                            </div>
                                            {selectedRefund.status === 'pendiente' && (
                                                <div className="flex gap-2 pt-4">
                                                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded" onClick={() => { setDetailsModalOpen(false); handleAction(selectedRefund, 'aprobar'); }}>
                                                        <CheckCircle className="w-4 h-4 mr-2 inline" /> Aprobar
                                                    </button>
                                                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded" onClick={() => { setDetailsModalOpen(false); handleAction(selectedRefund, 'rechazar'); }}>
                                                        <XCircle className="w-4 h-4 mr-2 inline" /> Rechazar
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex justify-end mt-4">
                                                <button className="px-4 py-2 rounded border" onClick={() => setDetailsModalOpen(false)}>Cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Modal de Comentarios del Usuario */}
                                {commentModalOpen && selectedRefund && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                                            <h3 className="text-lg font-semibold mb-2">Comentarios del Cliente</h3>
                                            <p className="text-gray-500 mb-4">Detalles adicionales proporcionados por el cliente sobre la solicitud de reembolso</p>
                                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded mb-4 text-sm">
                                                <div><span className="font-medium">ID:</span> {selectedRefund.id}</div>
                                                <div><span className="font-medium">Cliente:</span> {selectedRefund.order?.customer_name ?? 'Desconocido'}</div>
                                                <div><span className="font-medium">Orden:</span> {selectedRefund.order?.order_number ?? '-'}</div>
                                                <div><span className="font-medium">Monto:</span> S/{selectedRefund.order?.total_amount ? Number(selectedRefund.order.total_amount).toFixed(2) : '-'}</div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="font-medium mb-1">Motivo Principal:</div>
                                                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">{selectedRefund.reason}</div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="font-medium mb-1">Comentarios Adicionales del Cliente:</div>
                                                <div className="p-4 bg-gray-50 border rounded-lg text-sm whitespace-pre-wrap">{selectedRefund.user_comment || '-'}</div>
                                            </div>
                                            {selectedRefund.status === 'pendiente' && (
                                                <div className="flex gap-2 pt-4 border-t">
                                                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded" onClick={() => { setCommentModalOpen(false); handleAction(selectedRefund, 'aprobar'); }}>
                                                        <CheckCircle className="w-4 h-4 mr-2 inline" /> Aprobar Reembolso
                                                    </button>
                                                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded" onClick={() => { setCommentModalOpen(false); handleAction(selectedRefund, 'rechazar'); }}>
                                                        <XCircle className="w-4 h-4 mr-2 inline" /> Rechazar Reembolso
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex justify-end mt-4">
                                                <button className="px-4 py-2 rounded border" onClick={() => setCommentModalOpen(false)}>Cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
