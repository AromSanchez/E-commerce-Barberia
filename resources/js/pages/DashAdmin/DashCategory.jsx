import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';

export default function DashCategory() {
    return (
        <AuthenticatedLayout>
            <Head title="Categorías" />
            <NavAdmin /> 
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold text-gray-800">Gestión de Categorías</h1>
                            
                            {/* Aquí irá el contenido para gestionar categorías */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}