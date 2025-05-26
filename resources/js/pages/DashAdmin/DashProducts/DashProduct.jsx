import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/Layouts/head_admin/HeadAdmin';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import { Search, ShoppingBag, Eye } from 'lucide-react';

export default function DashProduct() {
    const { products } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productList, setProductList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (products) {
            setProductList(products);
        } else {
            // Datos de ejemplo para mostrar en la tabla si no hay datos reales
            setProductList([
                { 
                    id: 6, 
                    name: 'Product6', 
                    slug: 'product6',
                    price: 128.00,
                    sale_price: 110.00,
                    category: 'Category3',
                    brand: 'Brand2',
                    featured: 'Yes',
                    stock: 11,
                    image: null
                }
            ]);
        }
    }, [products]);

    const handleAddProduct = (newProduct) => {
        setProductList([...productList, newProduct]);
    };

    const handleDeleteProduct = (id) => {
        router.delete(route('dashboard.products.destroy', id), {
            onSuccess: () => {
                setProductList(productList.filter(product => product.id !== id));
            }
        });
    };

    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setEditDialogOpen(true);
    };

    const handleUpdateProduct = (updatedProduct) => {
        router.patch(route('dashboard.products.update', updatedProduct.id), updatedProduct, {
            onSuccess: () => {
                setProductList(productList.map(product => 
                    product.id === updatedProduct.id ? updatedProduct : product
                ));
                setEditDialogOpen(false);
            }
        });
    };

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Filtrar productos según el término de búsqueda
    const filteredProducts = productList.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Productos" />
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
                                            <ShoppingBag className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Gestión de Productos</h2>
                                    </div>
                                </div>
                                
                                {/* Barra de búsqueda y botón de añadir */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-1/2">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar producto..." 
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

                                {/* Tabla de productos */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full overflow-y-auto">
                                        <table className="min-w-full">
                                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                                <tr>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">#</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Precio</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">PrecioVenta</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Categoría</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Marca</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Destacado</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Stock</th>
                                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredProducts.length > 0 ? (
                                                    filteredProducts.map((product, index) => (
                                                        <tr key={product.id} className="hover:bg-gray-50">
                                                            <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center">
                                                                    {product.image ? (
                                                                        <img 
                                                                            src={product.image} 
                                                                            alt={product.name} 
                                                                            className="w-10 h-10 rounded-md mr-3 object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                                                                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                                        <p className="text-xs text-gray-500">{product.slug}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm text-gray-600">S/{product.price?.toFixed(2)}</td>
                                                            <td className="p-4 text-sm text-gray-600">S/{product.sale_price?.toFixed(2)}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.category}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.brand}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.featured}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.stock}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button 
                                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                                    >
                                                                        <Eye className="h-5 w-5" />
                                                                    </button>
                                                                    <button 
                                                                        className="text-green-600 hover:text-green-900 p-1"
                                                                        onClick={() => handleEditProduct(product)}
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button 
                                                                        className="text-red-600 hover:text-red-900 p-1"
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="11" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No hay productos disponibles
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

            {/* Aquí podrías añadir los componentes de diálogo para añadir y editar productos */}
            {/* Similar a AddCategoryDialog y EditCategoryDialog */}
        </AuthenticatedLayout>
    );
}