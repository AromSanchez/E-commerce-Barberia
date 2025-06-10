import { useState } from 'react';
import CardProduct from '@/components/Cliente/CardProduct';
import FiltroCheckbox from './FilterCheckbox';
import PriceFilter from './PriceFilter';
import Pagination from '@/components/Cliente/Pagination';
import Breadcrumb from '@/components/Cliente/Breadcrumb';
import { TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4 } from 'react-icons/tfi';
import CategoryFilter from './CategoryFilter';

export default function MainProducts({ productos = [], categorias = [], marcas = [] }) {
    // Estados y configuración
    const maxPrecio = Math.round(productos.reduce((max, producto) => {
        const precioProducto = producto.sale_price ?? producto.regular_price;
        return precioProducto > max ? precioProducto : max;
    }, 0));

    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    const [precio, setPrecio] = useState({ min: 0, max: maxPrecio });
    const [columnas, setColumnas] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [productosPorPagina, setProductosPorPagina] = useState(12);
    const [orden, setOrden] = useState('predeterminado');

    // Funciones de manejo
    const productosFiltrados = productos.filter(producto => {
        const precioProducto = producto.sale_price ?? producto.regular_price;
        return (
            (categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.category_id)) &&
            (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.brand_id)) &&
            precioProducto >= precio.min && precioProducto <= precio.max
        );
    });

    const handleColumnasChange = (numColumnas) => {
        setColumnas(numColumnas);
    };

    const handleProductosPorPaginaChange = (numProductos) => {
        setProductosPorPagina(numProductos);
        setCurrentPage(1);
    };

    const ordenarProductos = (productos) => {
        switch (orden) {
            case 'precioAsc':
                return productos.sort((a, b) => {
                    const precioA = a.sale_price ?? a.regular_price;
                    const precioB = b.sale_price ?? b.regular_price;
                    return precioA - precioB;
                });
            case 'precioDesc':
                return productos.sort((a, b) => {
                    const precioA = a.sale_price ?? a.regular_price;
                    const precioB = b.sale_price ?? b.regular_price;
                    return precioB - precioA;
                });
            case 'popularidad':
                return productos.sort((a, b) => b.popularity - a.popularity);
            case 'nuevos':
                return productos.reverse();
            default:
                return productos;
        }
    };

    // Renderizado
    return (
        <div className="flex justify-center items-start min-h-screen bg-gradient-to-t to-gray-50 from-white py-6">
            <div className="max-w-7xl w-full mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    {/* Navegación de breadcrumb */}
                    <div className="w-full md:w-1/5">
                        <div className="mb-4">
                            <Breadcrumb 
                                baseItems={['Inicio', 'Tienda']}
                                categoriaSeleccionada={categorias.find(cat => categoriasSeleccionadas.includes(cat.id))}
                                marcaSeleccionada={marcas.find(marca => marcasSeleccionadas.includes(marca.id))}
                                currentPage={currentPage}
                                onResetFilters={() => {
                                    setCategoriasSeleccionadas([]);
                                    setMarcasSeleccionadas([]);
                                    setPrecio({ min: 0, max: maxPrecio });
                                    setCurrentPage(1);
                                }}
                                onCategoriaClick={(categoria) => {
                                    setCategoriasSeleccionadas([categoria.id]);
                                    setMarcasSeleccionadas([]);
                                    setCurrentPage(1);
                                }}
                                onMarcaClick={(marca) => {
                                    setMarcasSeleccionadas([marca.id]);
                                    setCurrentPage(1);
                                }}
                                onHomeClick={() => {
                                    window.location.href = '/';
                                }}
                            />
                        </div>
                        
                        {/* Filtros: Sidebar izquierdo */}
                        <div className="flex flex-col divide-y-2 divide-gray-200 p-5 rounded-2xl border border-gray-300 h-fit">
                            <div className="-mb-3">
                                <CategoryFilter
                                    titulo="Categorías"
                                    opciones={categorias.map(categoria => ({
                                        nombre: categoria.name,
                                        valor: categoria.id,
                                        total: categoria.products_count
                                    }))} 
                                    seleccionados={categoriasSeleccionadas}
                                    setSeleccionados={setCategoriasSeleccionadas}
                                />
                            </div>

                            <div className="py-3 -mb-4">
                                <FiltroCheckbox
                                    titulo="Marcas"
                                    opciones={marcas.map(marca => ({
                                        nombre: marca.name,
                                        valor: marca.id,
                                        total: marca.products_count,
                                        logo: marca.logo ? `/storage/${marca.logo}` : null
                                    }))} 
                                    seleccionados={marcasSeleccionadas}
                                    setSeleccionados={setMarcasSeleccionadas}
                                />
                            </div>

                            <div className="pt-3">
                                <PriceFilter
                                    min={0}
                                    max={maxPrecio}
                                    value={precio}
                                    setValue={setPrecio}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Área principal de productos */}
                    <div className="flex-1 w-full md:w-4/5 mt-8">
                        {/* Controles superiores */}
                        <div className="flex justify-between items-center mb-8">
                            {/* Título dinámico */}
                            <h1 className="text-3xl font-bold font-inter text-gray-900">
                                {categorias.find(cat => categoriasSeleccionadas.includes(cat.id))?.name || 'Tienda'}
                                {marcasSeleccionadas.length > 0 && categorias.find(cat => categoriasSeleccionadas.includes(cat.id)) && (
                                    <span className="text-gray-500 ml-2 font-medium">
                                        × {marcas.find(marca => marcasSeleccionadas.includes(marca.id))?.name}
                                    </span>
                                )}
                            </h1>

                            {/* Contenedor de controles */}
                            <div className="flex items-center space-x-4">
                                {/* Control de productos por página */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">Mostrar:</span>
                                    <div className="flex gap-1 items-center">
                                        {[9, 12, 18, 24].map((num) => (
                                            <button
                                            key={num}
                                            onClick={() => handleProductosPorPaginaChange(num)}
                                            className={`px-2 py-1 text-sm border transition-colors ${
                                                    productosPorPagina === num
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                                } rounded`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Separador vertical */}
                                <div className="w-px h-6 bg-gray-300"></div>

                                {/* Selector de columnas */}
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => handleColumnasChange(2)}
                                        className={`px-2 py-1.5 ${columnas === 2 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'} border-r border-gray-300`}
                                        title="2 Columnas"
                                    >
                                        <TfiLayoutGrid2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleColumnasChange(3)}
                                        className={`px-2 py-1.5 ${columnas === 3 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'} border-r border-gray-300`}
                                        title="3 Columnas"
                                    >
                                        <TfiLayoutGrid3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleColumnasChange(4)}
                                        className={`px-2 py-1.5 ${columnas === 4 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                                        title="4 Columnas"
                                    >
                                        <TfiLayoutGrid4 size={16} />
                                    </button>
                                </div>

                                {/* Separador vertical */}
                                <div className="w-px h-6 bg-gray-300"></div>

                                {/* Selector de orden */}
                                <div className="flex items-center">
                                    <select
                                        value={orden}
                                        onChange={(e) => setOrden(e.target.value)}
                                        className="appearance-none px-3 py-1.5 pr-7 text-sm font-medium text-gray-900 bg-transparent border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none cursor-pointer relative min-w-[180px]"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: '95% center',
                                            backgroundSize: '16px'
                                        }}
                                    >
                                        <option value="predeterminado">Orden Predeterminado</option>
                                        <option value="precioAsc">Precio: Menor a Mayor</option>
                                        <option value="precioDesc">Precio: Mayor a Menor</option>
                                        <option value="popularidad">Por popularidad</option>
                                        <option value="nuevos">Más recientes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Grid de productos */}
                        <div className={`grid gap-4 ${
                            columnas === 2 ? 'grid-cols-2 md:grid-cols-2' :
                            columnas === 3 ? 'grid-cols-2 md:grid-cols-3' :
                            'grid-cols-2 md:grid-cols-4'
                        } grid-flow-row-dense`}>
                            {productosFiltrados.length > 0 ? (
                                ordenarProductos(productosFiltrados)
                                    .slice((currentPage - 1) * productosPorPagina, currentPage * productosPorPagina)
                                    .map(producto => (
                                        <div key={producto.id}>
                                            <CardProduct
                                                name={producto.name}
                                                regularPrice={producto.regular_price}
                                                salePrice={producto.sale_price}
                                                image={producto.image ? `/storage/${producto.image}` : '/images/no-image.png'}
                                                brand={producto.brand ? producto.brand.name : null}
                                                inStock={producto.stock > 0}
                                                isNew={producto.is_new === 'yes' ? true : false}
                                            />
                                        </div>
                                    ))
                            ) : (
                                <div className="col-span-full flex justify-center items-center py-12">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-lg mb-2">
                                            No hay productos disponibles
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Intenta ajustar los filtros de búsqueda
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Paginación */}
                        {productosFiltrados.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(productosFiltrados.length / productosPorPagina)}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
