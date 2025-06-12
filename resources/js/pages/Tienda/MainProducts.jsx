import { useState, useEffect } from 'react';
import CardProduct from '@/components/Cliente/CardProduct';
import FiltroCheckbox from './FilterCheckbox';
import PriceFilter from './PriceFilter';
import Pagination from '@/components/Cliente/Pagination';
import Breadcrumb from '@/components/Cliente/Breadcrumb';
import Select from 'react-select';
import { TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4 } from 'react-icons/tfi';
import CategoryFilter from './CategoryFilter';

export default function MainProducts({ productos = [], categorias = [], marcas = [] }) {

    const options = [
        { value: 'predeterminado', label: 'Orden Predeterminado' },
        { value: 'precioAsc', label: 'Precio: Menor a Mayor' },
        { value: 'precioDesc', label: 'Precio: Mayor a Menor' },
        { value: 'popularidad', label: 'Por popularidad' },
        { value: 'nuevos', label: 'Más recientes' }
    ];

    // Estados y configuración
    const [maxPrecio, setMaxPrecio] = useState(0);

    useEffect(() => {
        if (productos.length > 0) {
            const nuevoMax = Math.round(
                Math.max(...productos.map(p => p.sale_price ?? p.regular_price))
            );
            setMaxPrecio(nuevoMax);
            setPrecio(prev => ({ ...prev, max: nuevoMax })); // Opcional, si quieres sincronizar
        }
    }, [productos]);

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
                                onHomeClick={() => {
                                    window.location.href = '/';
                                }}
                            />
                        </div>

                        {/* Filtros: Sidebar izquierdo */}
                        <div className="flex flex-col divide-y-2 divide-gray-100 p-5 h-fit">
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
                    <div className="flex-1 w-full md:w-4/5 mt-12">
                        {/* Controles superiores */}
                        <div className="flex flex-col mb-8">
                            {/* Título y controles */}
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold font-inter text-gray-900">
                                    {categorias.find(cat => categoriasSeleccionadas.includes(cat.id))?.name || 'Tienda'}
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
                                                    className={`px-2 py-1 text-sm border transition-colors ${productosPorPagina === num
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
                                        <Select
                                            value={options.find(option => option.value === orden)}
                                            onChange={(selectedOption) => setOrden(selectedOption.value)}
                                            options={options}
                                            classNames={{
                                                control: () => "border z-80 border-gray-300 rounded-md bg-transparent hover:border-gray-400 cursor-pointer",
                                                option: ({ isFocused, isSelected }) =>
                                                    `px-3 py-1.5 cursor-pointer ${
                                                        isSelected
                                                            ? "bg-gray-900 text-white"
                                                            : isFocused
                                                            ? "bg-gray-100"
                                                            : "text-gray-900"
                                                    }`,
                                                menu: () => "mt-0 bg-white border border-gray-200 rounded-md shadow-lg relative ", // Añadido z-50
                                                menuList: () => "max-h-60 overflow-auto text-sm", // Añadido para scroll si hay muchas opciones
                                                singleValue: () => "text-sm font-medium text-gray-900",
                                                placeholder: () => "text-sm font-medium text-gray-500",
                                                input: () => "text-xs font-medium text-gray-900",
                                                valueContainer: () => "p-2",
                                                indicatorsContainer: () => "px-1",
                                                indicatorSeparator: () => "bg-gray-300",
                                                dropdownIndicator: () => "text-gray-500 hover:text-gray-800"
                                            }}
                                            unstyled
                                            isSearchable={false}
                                            components={{
                                                IndicatorSeparator: () => null,
                                                DropdownIndicator: () => (
                                                    <svg 
                                                        className="w-5 h-5 text-gray-500" 
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filtros activos */}
                            {(categoriasSeleccionadas.length > 0 || marcasSeleccionadas.length > 0 || precio.min > 0 || precio.max < maxPrecio) && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {categoriasSeleccionadas.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setCategoriasSeleccionadas([]);
                                                setCurrentPage(1);
                                            }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <span className="mr-1">Categoría: {categorias.find(cat => categoriasSeleccionadas.includes(cat.id))?.name}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}

                                    {marcasSeleccionadas.map(marcaId => (
                                        <button
                                            key={marcaId}
                                            onClick={() => {
                                                setMarcasSeleccionadas(prev => prev.filter(id => id !== marcaId));
                                                setCurrentPage(1);
                                            }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <span className="mr-1">Marca: {marcas.find(marca => marca.id === marcaId)?.name}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    ))}

                                    {(precio.min > 0 || precio.max < maxPrecio) && (
                                        <button
                                            onClick={() => {
                                                setPrecio({ min: 0, max: maxPrecio });
                                                setCurrentPage(1);
                                            }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <span className="mr-1">Precio: S/{precio.min} - S/{precio.max}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setCategoriasSeleccionadas([]);
                                            setMarcasSeleccionadas([]);
                                            setPrecio({ min: 0, max: maxPrecio });
                                            setCurrentPage(1);
                                        }}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 hover:bg-red-200"
                                    >
                                        <span className="mr-1">Eliminar todos los filtros</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Grid de productos */}
                        <div className={`grid gap-4 ${columnas === 2 ? 'grid-cols-2 md:grid-cols-2' :
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
