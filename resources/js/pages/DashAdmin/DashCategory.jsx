import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import AddCategoryDialog from '@/components/DashCategory/AddCategoryDialog';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import EditCategoryDialog from '@/components/DashCategory/EditCategoryDialog'; // Import the EditCategoryDialog component

export default function DashCategory() {
    const { categories } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

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

    return (
        <AuthenticatedLayout>
            <Head title="Categorías" />
            <div className="flex">
                <NavAdmin />
                <div className="flex-1 p-8">
                    <div className="">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-10">
                                    <h1 className="text-2xl font-semibold text-gray-800">Gestión de Categorías</h1>
                                    <button 
                                        onClick={() => setIsDialogOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Añadir categoría
                                    </button>
                                </div>

                                {/* Tabla de categorías */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Descripción
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {categoryList.length > 0 ? (
                                                categoryList.map((category) => (
                                                    <tr key={category.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-500">{category.description}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                                onClick={() => handleEditCategory(category)}
                                                            >
                                                                <EditIcon />
                                                            </button>
                                                            <button 
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                            >
                                                                <DeleteIcon />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
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

            {/* Diálogo para añadir categoría */}
            <AddCategoryDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                onSave={handleAddCategory} 
            />
            {/* Diálogo para editar categoría */}
            {categoryToEdit && (
                <EditCategoryDialog 
                    isOpen={editDialogOpen} 
                    category={categoryToEdit}
                    onClose={() => setEditDialogOpen(false)} 
                    onSave={handleUpdateCategory} 
                />
            )}
        </AuthenticatedLayout>
    );
}