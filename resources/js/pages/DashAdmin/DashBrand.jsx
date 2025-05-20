import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { Head } from '@inertiajs/react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';

export default function DashBrand() {
    return (
        <AuthenticatedLayout>
            <Head title="Marcas" />
            <div className="flex">
                <NavAdmin />
                <div className="flex-1 p-8">
                    <div className="">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-10">
                                    <h1 className="text-2xl font-semibold text-gray-800">Gestión de Marcas</h1>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Añadir Marca
                                    </button>
                                </div>
                                {/* Tabla de categorías */}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}