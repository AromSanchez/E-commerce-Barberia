import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/Layouts/head_admin/HeadAdmin';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import { Search, ShoppingBag, Eye, X, Tag, Package, Star, Calendar, Info } from 'lucide-react';

export default function DashProduct() {
    const { products } = usePage().props;
    const [productList, setProductList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [productToView, setProductToView] = useState(null);

    useEffect(() => {
        if (products) {
            setProductList(products);
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
        router.visit(route('dashboard.products.edit', product.id));
    };

    const handleViewProduct = (product) => {
        setProductToView(product);
        setViewModalOpen(true);
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
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        || product.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                                    <button onClick={() => router.visit(route('dashboard.addproduct'))}
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
                                                                            src={`/storage/${product.image}`}
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
                                                            <td className="p-4 text-sm text-gray-600">S/{product.regular_price ? Number(product.regular_price).toFixed(2) : '0.00'}</td>
                                                            <td className="p-4 text-sm text-gray-600">S/{product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.category?.name || "Sin Categoría"}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.brand?.name || "Sin Marca"}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.is_featured === "yes" ? "Si" : "No"}</td>
                                                            <td className="p-4 text-sm text-gray-600">{product.stock}</td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-md transition-colors"
                                                                        onClick={() => handleViewProduct(product)}
                                                                        title="Ver detalles"
                                                                    >
                                                                        <Eye className="h-5 w-5" />
                                                                    </button>
                                                                    <button
                                                                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded-md transition-colors"
                                                                        onClick={() => handleEditProduct(product)}
                                                                        title="Editar producto"
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-md transition-colors"
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                        title="Eliminar producto"
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

            {/* Modal de Vista del Producto */}
            {viewModalOpen && productToView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header del Modal */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <Eye className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Detalles del Producto</h3>
                                </div>
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Contenido del Modal */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Columna Izquierda - Imagen */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center h-80">
                                        {productToView.image ? (
                                            <img
                                                src={`/storage/${productToView.image}`}
                                                alt={productToView.name}
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">Sin imagen</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2 flex-wrap">
                                        {productToView.is_featured === 'yes' && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                Destacado
                                            </span>
                                        )}
                                        {productToView.is_new === 'yes' && (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                                                Nuevo
                                            </span>
                                        )}
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${productToView.stock > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {productToView.stock > 0 ? 'En Stock' : 'Agotado'}
                                        </span>
                                    </div>
                                </div>

                                {/* Columna Derecha - Información */}
                                <div className="space-y-6">
                                    {/* Nombre y Slug */}
                                    <div>
                                        <h4 className="text-2xl font-bold text-gray-800 mb-2">{productToView.name}</h4>
                                        <p className="text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-md inline-block">
                                            {productToView.slug}
                                        </p>
                                    </div>

                                    {/* Precios */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Precio Regular</p>
                                                <p className="text-2xl font-bold text-gray-800">
                                                    S/{productToView.regular_price ? Number(productToView.regular_price).toFixed(2) : '0.00'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Precio de Venta</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    S/{productToView.sale_price ? Number(productToView.sale_price).toFixed(2) : '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información de Categoría y Marca */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-gray-700">Categoría</span>
                                            </div>
                                            <p className="text-gray-800 font-medium">
                                                {productToView.category?.name || "Sin Categoría"}
                                            </p>
                                        </div>

                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm font-medium text-gray-700">Marca</span>
                                            </div>
                                            <p className="text-gray-800 font-medium">
                                                {productToView.brand?.name || "Sin Marca"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stock */}
                                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm font-medium text-gray-700">Stock Disponible</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-600">{productToView.stock} unidades</p>
                                    </div>

                                    {/* Descripciones */}
                                    {productToView.short_description && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Info className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">Descripción Corta</span>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {productToView.short_description}
                                            </p>
                                        </div>
                                    )}

                                    {productToView.long_description && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Info className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">Descripción Detallada</span>
                                            </div>
                                            <div className="text-gray-700 text-sm leading-relaxed max-h-32 overflow-y-auto">
                                                {productToView.long_description}
                                            </div>
                                        </div>
                                    )}

                                    {/* Información de Fechas */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">Información de Fechas</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                            <p>Creado: {new Date(productToView.created_at).toLocaleDateString()}</p>
                                            <p>Actualizado: {new Date(productToView.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer del Modal */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white border border-gray-300 rounded-lg transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        setViewModalOpen(false);
                                        handleEditProduct(productToView);
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <EditIcon className="w-4 h-4" />
                                    Editar Producto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Aquí podrías añadir los componentes de diálogo para añadir y editar productos */}
            {/* Similar a AddCategoryDialog y EditCategoryDialog */}
        </AuthenticatedLayout>
    );
}