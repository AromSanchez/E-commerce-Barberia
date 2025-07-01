import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import { Search, Tag } from 'lucide-react';
import AddCouponDialog from '@/components/Dialogs/AddCouponDialog';
import EditCouponDialog from '@/components/Dialogs/EditCouponDialog';
import Swal from 'sweetalert2';

export default function DashCoupon() {
    const { coupons, brands, categories } = usePage().props;
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
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                
                Toast.fire({
                    icon: 'success',
                    title: '¡Cupón creado exitosamente!'
                })
                router.reload({ only: ['coupons'] });
            },
            onError: (errors) => {
                console.error('Error adding coupon:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo crear el cupón. Por favor, revisa los campos e intenta nuevamente.',
                })
            }
        });
    };

    const handleDeleteCoupon = (id) => {
        Swal.fire({
            title: '¿Eliminar cupón?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('coupons.destroy', id), {
                    onSuccess: () => {
                        Swal.fire(
                            '¡Eliminado!',
                            'El cupón ha sido eliminado correctamente.',
                            'success'
                        );
                        router.reload({ only: ['coupons'] });
                    },
                    onError: (errors) => {
                        console.error('Error deleting coupon:', errors);
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar el cupón',
                            'error'
                        );
                    }
                });
            }
        });
    };

    const handleEditCoupon = (coupon) => {
        setCouponToEdit(coupon);
        setEditDialogOpen(true);
    };

    const handleUpdateCoupon = (updatedCoupon) => {
        router.put(route('coupons.update', updatedCoupon.id), updatedCoupon, {
            onSuccess: () => {
                setEditDialogOpen(false);
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                
                Toast.fire({
                    icon: 'success',
                    title: '¡Cupón actualizado exitosamente!'
                });
                router.reload({ only: ['coupons'] });
            },
            onError: (errors) => {
                console.error('Error updating coupon:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el cupón. Por favor, revisa los campos e intenta nuevamente.',
                });
            }
        });
    };

    // Función para mostrar las restricciones del cupón (marcas/categorías)
    const displayRestrictions = (coupon) => {
        const hasBrands = coupon.brands && coupon.brands.length > 0;
        const hasCategories = coupon.categories && coupon.categories.length > 0;
        
        if (!hasBrands && !hasCategories) {
            return "Todos los productos";
        }
        
        let restrictions = [];
        
        if (hasBrands) {
            const brandsText = coupon.brands.length > 1 
                ? `${coupon.brands.length} marcas` 
                : coupon.brands[0].name;
            restrictions.push(`Marcas: ${brandsText}`);
        }
        
        if (hasCategories) {
            const categoriesText = coupon.categories.length > 1 
                ? `${coupon.categories.length} categorías` 
                : coupon.categories[0].name;
            restrictions.push(`Categorías: ${categoriesText}`);
        }
        
        return restrictions.join(', ');
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
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Restricciones</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Usos</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Expira El</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Activo</th>
                                                    <th className="p-4 text-center text-sm font-semibold text-gray-600">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCoupons.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="10" className="text-center p-4 text-gray-500">No hay cupones para mostrar</td>
                                                    </tr>
                                                ) : (
                                                    filteredCoupons.map((coupon, index) => (
                                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                                <span className="px-2 py-1 bg-gray-100 rounded-md">{coupon.code}</span>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {coupon.type === 'fixed' ? (
                                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                                        Monto Fijo
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                                        Porcentaje
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {coupon.type === 'fixed' ? `S/ ${coupon.value}` : `${coupon.value}%`}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {coupon.min_amount ? `S/ ${coupon.min_amount}` : '-'}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                <span className="text-xs text-gray-500">
                                                                    {displayRestrictions(coupon)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {coupon.usage_count} / {coupon.usage_limit || '∞'}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'No expira'}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    coupon.is_active 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {coupon.is_active ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                <div className="flex justify-center gap-2">
                                                                    <button 
                                                                        onClick={() => handleEditCoupon(coupon)}
                                                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                                    >
                                                                        <EditIcon className="h-5 w-5" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteCoupon(coupon.id)}
                                                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                                                    >
                                                                        <DeleteIcon className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
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

            {/* Diálogos para añadir/editar cupones */}
            <AddCouponDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                onAddCoupon={handleAddCoupon}
                brands={brands}
                categories={categories}
            />

            <EditCouponDialog 
                isOpen={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)} 
                coupon={couponToEdit} 
                onUpdateCoupon={handleUpdateCoupon}
                brands={brands}
                categories={categories}
            />
        </AuthenticatedLayout>
    );
}