import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';

export default function DashCategory() {
    return (
        <AuthenticatedLayout>
            <Head title="Categorías" />
            <div className="flex">
                <NavAdmin />
                <div className="flex-1 p-8">
                    <div className="">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h1 className="text-2xl font-semibold text-gray-800">Gestión de Categorías</h1>
                                <h1>HOLAAAAAAAAA</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}