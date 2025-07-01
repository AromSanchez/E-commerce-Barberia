import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/Layouts/head_admin/HeadAdmin';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import { Search, Tag } from 'lucide-react';
import AddCouponDialog from '@/components/Dialogs/AddCouponDialog';

export default function DashCoupon() {
    const { coupons } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [couponList, setCouponList] = useState(coupons || []);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [couponToEdit, setCouponToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setCouponList(coupons);
    }, [coupons]);

    const handleAddCoupon = (newCoupon) => {
        router.post(route('coupons.store'), newCoupon, {
            onSuccess: () => {
                setIsDialogOpen(false);
                router.reload({ only: ['coupons'] });
            },
            onError: (errors) => {
                console.error('Error adding coupon:', errors);
            }
        });
    };

    const handleDeleteCoupon = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
            router.delete(route('coupons.destroy', id), {
                onSuccess: () => {
                    router.reload({ only: ['coupons'] });
                },
                onError: (errors) => {
                    console.error('Error deleting coupon:', errors);
                }
            });
        }
    };

    const handleEditCoupon = (coupon) => {
        setCouponToEdit(coupon);
        setEditDialogOpen(true);
    };

    const handleUpdateCoupon = (updatedCoupon) => {
        router.put(route('coupons.update', updatedCoupon.id), updatedCoupon, {
            onSuccess: () => {
                setEditDialogOpen(false);
                router.reload({ only: ['coupons'] });
            },
            onError: (errors) => {
                console.error('Error updating coupon:', errors);
            }
        });
    };

    const filteredCoupons = couponList.filter(coupon => 
        coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.value?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.min_amount?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.expires_at?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Cupones" />
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
                            {/* Encabezado y título */}
                            <div className="bg-white p-6 rounded-lg shadow-sm h-[calc(100%-2rem)] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <Tag className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Cupones</h2>
                                    </div>
                                </div>
                                
                                {/* Barra de búsqueda y botón de añadir */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-1/2">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar cupón..." 
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                    <button 
                                        onClick={() => setIsDialogOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Añadir nuevo
                                    </button>
                                </div>

                                {/* Tabla de cupones */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Código</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Tipo</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Valor</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Monto Mínimo</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Límite de Uso</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Usos</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Expira El</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Activo</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredCoupons.length > 0 ? (
                                                    filteredCoupons.map((coupon, index) => (
                                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center">
                                                                    <div className="w-10 h-10 bg-blue-100 rounded-md mr-3 flex items-center justify-center">
                                                                        <Tag className="w-6 h-6 text-blue-600" />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-900">{coupon.code}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.type}</td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.value}</td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.min_amount || 'N/A'}</td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.usage_limit || 'Unlimited'}</td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.usage_count}</td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'N/A'}</td>
                                                            <td className="p-4 text-sm text-gray-600">{coupon.is_active ? 'Yes' : 'No'}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button 
                                                                        className="text-green-600 hover:text-green-900 p-1"
                                                                        onClick={() => handleEditCoupon(coupon)}
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button 
                                                                        className="text-red-600 hover:text-red-900 p-1"
                                                                        onClick={() => handleDeleteCoupon(coupon.id)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No hay cupones disponibles
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddCouponDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                onAddCoupon={handleAddCoupon} 
            />

            {/* <EditCouponDialog 
                isOpen={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)} 
                coupon={couponToEdit} 
                onUpdateCoupon={handleUpdateCoupon} 
            /> */}
        </AuthenticatedLayout>
    );
}