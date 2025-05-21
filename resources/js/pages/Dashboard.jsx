import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import { TrendingUp, DollarSign, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Ene', ingresos: 0, pedidos: 0 },
    { name: 'Feb', ingresos: 0, pedidos: 0 },
    { name: 'Mar', ingresos: 0, pedidos: 0 },
    { name: 'Abr', ingresos: 0, pedidos: 0 },
    { name: 'May', ingresos: 0, pedidos: 0 },
    { name: 'Jun', ingresos: 37802, pedidos: 28305 },
    { name: 'Jul', ingresos: 25000, pedidos: 20000 },
    { name: 'Ago', ingresos: 0, pedidos: 0 },
    { name: 'Sep', ingresos: 0, pedidos: 0 },
    { name: 'Oct', ingresos: 0, pedidos: 0 },
    { name: 'Nov', ingresos: 0, pedidos: 0 },
    { name: 'Dic', ingresos: 0, pedidos: 0 },
];

import React, { useState } from 'react';

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
                    <div className="pt-[73px] h-screen overflow-y-auto bg-[#F2F7FB]">
                        <div className="p-8">
                            {/* Gráfico de Ingresos */}
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Ingresos y Pedidos</h2>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="flex gap-8 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Ingresos</p>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-bold">$37,802</h3>
                                            <span className="text-green-500 text-sm">+0.56%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pedidos</p>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-bold">$28,305</h3>
                                            <span className="text-green-500 text-sm">+0.56%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="ingresos" name="Ingresos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="pedidos" name="Pedidos" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Cards y tabla existentes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                {/* Primera columna */}
                                <div className="space-y-5">
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <ShoppingBag className="text-blue-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                                                <h4 className="text-2xl font-semibold">3</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <DollarSign className="text-green-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                                                <h4 className="text-2xl font-semibold">481.34</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-orange-50 p-3 rounded-lg">
                                                <ShoppingBag className="text-orange-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
                                                <h4 className="text-2xl font-semibold">3</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Segunda columna */}
                                <div className="space-y-5">
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                <ShoppingBag className="text-purple-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Delivered Orders</p>
                                                <h4 className="text-2xl font-semibold">0</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-lg">
                                                <DollarSign className="text-indigo-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Delivered Orders Amount</p>
                                                <h4 className="text-2xl font-semibold">0.00</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-red-50 p-3 rounded-lg">
                                                <ShoppingBag className="text-red-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Canceled Orders</p>
                                                <h4 className="text-2xl font-semibold">0</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de órdenes recientes */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h5 className="text-lg font-semibold">Recent Orders</h5>
                                    <button className="text-blue-600 hover:text-blue-700">View all</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">OrderNo</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Subtotal</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Tax</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Total</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Order Date</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-4 text-sm text-gray-600">1</td>
                                                <td className="p-4 text-sm text-gray-600">Divyansh Kumar</td>
                                                <td className="p-4 text-sm text-gray-600">1234567891</td>
                                                <td className="p-4 text-sm text-gray-600">$172.00</td>
                                                <td className="p-4 text-sm text-gray-600">$36.12</td>
                                                <td className="p-4 text-sm text-gray-600">$208.12</td>
                                                <td className="p-4 text-sm">
                                                    <span className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                                                        Ordered
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">2024-07-11 00:54:14</td>
                                                <td className="p-4">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
