import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import { Head, usePage, router } from '@inertiajs/react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import { useState, useEffect } from 'react';
import { Search, Layers } from 'lucide-react';
import AddBrandDialog from '@/components/DashBrand/addBrandDialog';
import EditBrandDialog from '@/components/DashBrand/editBrandDialog';

export default function DashBrand() {
    const { brands } = usePage().props; // Obtener las marcas desde las props
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandList, setBrandList] = useState(brands || []); // Inicializar con las marcas obtenidas
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [brandToEdit, setBrandToEdit] = useState(null);
    
    useEffect(() => {
        if (brands) {
            setBrandList(brands);
        }
    }, [brands]);

    // Filtrar marcas según el término de búsqueda
    const filteredBrands = brandList.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveBrand = (formData) => {
        router.post(route('dashboard.brand.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsDialogOpen(false);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleDeleteBrand = (brandId) => {
        router.delete(route('dashboard.brand.destroy', brandId), {
            onSuccess: () => {
                setBrandList(brandList.filter(brand => brand.id !== brandId));
            },
            onError: (errors) => {
                console.error(errors);
            }
        })
    }

    const handleEditBrand = (brand) => {
        setBrandToEdit(brand);
        setIsEditDialogOpen(true);
    };

    const handleUpdateBrand = (updatedBrand) => {
        setBrandList(brandList.map(brand => 
            brand.id === updatedBrand.id ? updatedBrand : brand
        ));
    };

    return (

        <AuthenticatedLayout>
            
            <Head title="Marcas" />
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
                                            <Layers className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Marcas</h2>
                                    </div>
                                </div>

                                {/* Barra de búsqueda y botón de añadir */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="Buscar marca..."
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Añadir nueva
                                    </button>
                                </div>

                                {/* Tabla de marcas */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Descripción</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Productos</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredBrands.length > 0 ? (
                                                    filteredBrands.map((brand, index) => (
                                                        <tr key={brand.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center">
                                                                    {brand.logo ? (
                                                                        <img
                                                                            src={`/storage/${brand.logo}`}
                                                                            alt={brand.name}
                                                                            className="w-10 h-10 rounded-md mr-3 object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                                                                            <Layers className="w-6 h-6 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                    <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">{brand.description || 'Sin descripción'}</td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                <div className="flex items-center">
                                                                    <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                                                        <span className="font-medium text-gray-700">{brand.products_count || 0}</span>
                                                                    </div>
                                                                    <span className="text-gray-600">{brand.products_count === 1 ? 'producto' : 'productos'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        className="text-green-600 hover:text-green-900 p-1"
                                                                        onClick={() => handleEditBrand(brand)}
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-600 hover:text-red-900 p-1" onClick={() => handleDeleteBrand(brand.id)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No hay marcas disponibles
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
            <AddBrandDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSaveBrand}
            />
            <EditBrandDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleUpdateBrand}
                brand={brandToEdit}
            />
        </AuthenticatedLayout>
    );
}

