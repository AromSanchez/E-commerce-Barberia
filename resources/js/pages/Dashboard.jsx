import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import React, { useState } from 'react';
import Cards from '@/components/AdminDash/Cards';
import Barras from '@/components/AdminDash/GraphicBa';
import Lineal from '@/components/AdminDash/Lineal';
import Tarjeta from '@/components/AdminDash/Tarjeta';
import ListOrder from '@/components/AdminDash/ListOrder';
import Actividad from '@/components/AdminDash/Actividad';

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="flex h-screen">
                <div className="fixed left-0 h-full">
                    <NavAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                </div>
                <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <div className="fixed top-0 right-0 z-10 bg-white" style={{ left: isCollapsed ? 80 : 256 }}>
                        <HeadAdmin />
                    </div>
                    <div className="pt-[70px] h-screen overflow-y-auto bg-gray-50/50">
                        <div className="grid grid-cols-4 grid-rows-[auto_auto_1fr] gap-4 p-5">

                            <Cards />

                            <div className="col-span-3">
                                <Barras />
                            </div>
                            
                            <div className="col-span-3 row-start-2">
                                <Lineal />
                            </div>

                            <div className='col-span row-start-2'>
                                <Tarjeta />
                            </div>

                            <div className='col-span row-start-3'>
                                <Actividad />
                            </div>

                            <div className="col-span-4 row-start-3">
                                <ListOrder />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
