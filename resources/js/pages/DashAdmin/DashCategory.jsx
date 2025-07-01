import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import AddCategoryDialog from '@/components/DashCategory/AddCategoryDialog';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import EditCategoryDialog from '@/components/DashCategory/EditCategoryDialog';
import { Search, Package } from 'lucide-react';

export default function DashCategory() {
    const { categories, mainCategories } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (categories) {
            setCategoryList(categories);
        }
    }, [categories]);

    const handleAddCategory = (newCategory) => {
        setCategoryList([...categoryList, newCategory]);
    };

    const handleDeleteCategory = (id) => {
        router.delete(route('dashboard.category.destroy', id), {
            onSuccess: () => {
                setCategoryList(categoryList.filter(category => category.id !== id));
            }
        });
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setEditDialogOpen(true);
    };

    const handleUpdateCategory = (updatedCategory) => {
        router.patch(route('dashboard.category.update', updatedCategory.id), updatedCategory, {
            onSuccess: () => {
                setCategoryList(categoryList.map(category => 
                    category.id === updatedCategory.id ? updatedCategory : category
                ));
                setEditDialogOpen(false);
            }
        });
    };

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Filtrar categorías según el término de búsqueda
    const filteredCategories = categoryList.filter(category => 
        category && (
            (category.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (category.description?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    return (
        <AuthenticatedLayout>
            <Head title="Categorías" />
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
                                            <Package className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
                                    </div>
                                </div>
                                
                                {/* Barra de búsqueda y botón de añadir */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-1/2">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar categoría..." 
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
                                        Añadir nueva
                                    </button>
                                </div>

                                {/* Tabla de categorías */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Descripción</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Categoría Principal</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Productos</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map((category, index) => (
                                                        <tr key={category.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center">
                                                                    
                                                                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {category.description ? (
                                                                    <div className="max-w-xs truncate">{category.description}</div>
                                                                ) : (
                                                                    <span className="text-gray-400">Sin descripción</span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                {category.main_category ? (
                                                                    <div>{category.main_category.name}</div>
                                                                ) : (
                                                                    <span className="text-gray-400">N/A</span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">
                                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                                                    {category.products_count} {category.products_count === 1 ? 'producto' : 'productos'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button 
                                                                        className="text-green-600 hover:text-green-900 p-1"
                                                                        onClick={() => handleEditCategory(category)}
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-600 hover:text-red-900 p-1"
                                                                        onClick={() => handleDeleteCategory(category.id)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No hay categorías disponibles
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

            {/* Diálogo para añadir categoría */}
            <AddCategoryDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                onSave={handleAddCategory}
                mainCategories={mainCategories}
            />
            {/* Diálogo para editar categoría */}
            {categoryToEdit && (
                <EditCategoryDialog 
                    isOpen={editDialogOpen} 
                    category={categoryToEdit}
                    onClose={() => setEditDialogOpen(false)} 
                    onSave={handleUpdateCategory}
                    mainCategories={mainCategories} 
                />
            )}
        </AuthenticatedLayout>
    );
}