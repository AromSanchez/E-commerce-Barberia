import { useState, useEffect, useMemo, useCallback } from 'react';
import CardProduct from '@/components/Cliente/CardProduct';
import FiltroCheckbox from './FilterCheckbox';
import PriceFilter from './PriceFilter';
import Pagination from '@/components/Cliente/Pagination';
import Breadcrumb from '@/components/Cliente/Breadcrumb';
import Select from 'react-select';
import { TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4 } from 'react-icons/tfi';
import CategoryFilter from './CategoryFilter';
import MenuFilters from './MenuFilters';
import { FiFilter } from 'react-icons/fi';

// Utilidades de persistencia en localStorage (reutilizables)
const getPersisted = (key, defaultValue) => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    try {
        return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const setPersisted = (key, value) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Opciones de ordenamiento
const ORDER_OPTIONS = [
    { value: 'predeterminado', label: 'Orden Predeterminado' },
    { value: 'precioAsc', label: 'Precio: Menor a Mayor' },
    { value: 'precioDesc', label: 'Precio: Mayor a Menor' },
    { value: 'popularidad', label: 'Por popularidad' },
    { value: 'nuevos', label: 'Más recientes' }
];

export default function MainProducts({ productos = [], categorias = [], marcas = [], mainCategories = [] }) {
    // Estados principales (usando persistencia)
    const [columnas, setColumnas] = useState(() => getPersisted('tienda_columnas', 4));
    const [productosPorPagina, setProductosPorPagina] = useState(() => getPersisted('tienda_productosPorPagina', 9));
    const [orden, setOrden] = useState(() => getPersisted('tienda_orden', 'predeterminado'));
    const [currentPage, setCurrentPage] = useState(1);

    // Filtros
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    const [precio, setPrecio] = useState({ min: 0, max: 0 }); // max se define luego
    const [menuFiltersOpen, setMenuFiltersOpen] = useState(false);

    // Determinar el precio máximo real de productos
    const maxPrecio = useMemo(() => {
        if (!productos.length) return 0;
        return Math.round(Math.max(...productos.map(p => p.sale_price ?? p.regular_price)));
    }, [productos]);

    // Sincronizar el filtro de precio cuando cambia el catálogo
    useEffect(() => {
        setPrecio(prev => ({
            min: 0,
            max: maxPrecio,
        }));
    }, [maxPrecio]);

    // Guardar configuración persistente en localStorage
    useEffect(() => { setPersisted('tienda_columnas', columnas); }, [columnas]);
    useEffect(() => { setPersisted('tienda_productosPorPagina', productosPorPagina); }, [productosPorPagina]);
    useEffect(() => { setPersisted('tienda_orden', orden); }, [orden]);

    // Filtrado de productos
    const productosFiltrados = useMemo(() => productos.filter(producto => {
        const precioProducto = producto.sale_price ?? producto.regular_price;
        return (
            (categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.category_id)) &&
            (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.brand_id)) &&
            precioProducto >= precio.min && precioProducto <= precio.max
        );
    }), [productos, categoriasSeleccionadas, marcasSeleccionadas, precio]);

    // Ordenar productos sin mutar el array original
    const ordenarProductos = useCallback((items) => {
        switch (orden) {
            case 'precioAsc':
                return [...items].sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price));
            case 'precioDesc':
                return [...items].sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price));
            case 'popularidad':
                return [...items].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
            case 'nuevos':
                return [...items].reverse();
            default:
                return items;
        }
    }, [orden]);

    // Productos a mostrar en la página actual
    const productosPaginados = useMemo(() => {
        const ordenados = ordenarProductos(productosFiltrados);
        return ordenados.slice((currentPage - 1) * productosPorPagina, currentPage * productosPorPagina);
    }, [productosFiltrados, ordenarProductos, currentPage, productosPorPagina]);

    // Resetear todos los filtros
    const resetAllFilters = () => {
        setCategoriasSeleccionadas([]);
        setMarcasSeleccionadas([]);
        setPrecio({ min: 0, max: maxPrecio });
        setCurrentPage(1);
    };

    // Cambiar número de columnas
    const handleColumnasChange = num => setColumnas(num);

    // Cambiar productos por página
    const handleProductosPorPaginaChange = num => {
        setProductosPorPagina(num);
        setCurrentPage(1);
    };

    // --------- Render principal ----------
    return (
        <div className="flex justify-center items-start min-h-screen bg-gradient-to-t to-gray-50 from-white py-6">
            <div className="max-w-7xl w-full mx-2 px-4">
                {/* Breadcrumb y botón filtros móvil alineados: botón a la izquierda, breadcrumb a la derecha */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 flex justify-start">
                        <Breadcrumb
                            baseItems={['Inicio', 'Tienda']}
                            currentPage={currentPage}
                            onResetFilters={resetAllFilters}
                            onHomeClick={() => window.location.href = '/'}
                        />
                    </div>
                    <button
                        className="flex items-center gap-1 lg:hidden lg:gap-2 px-2 py-1 text-sm text-gray-800 rounded-xl font-medium w-fit mr-2 shadow hover:bg-gray-800 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 lg:px-4 lg:py-2 lg:text-base lg:rounded-2xl"
                        onClick={() => setMenuFiltersOpen(true)}
                    >
                        <FiFilter className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden sm:inline">Filtros</span>
                    </button>
                </div>
                {/* Línea divisoria solo en móvil y tablet */}
                <hr className="block lg:hidden border-t border-gray-200 mb-6" />

                <div className="flex flex-col lg:flex-row gap-7 w-full">
                    {/* Sidebar filtros */}
                    <aside className="hidden lg:block lg:w-1/5">
                        <div className="flex flex-col divide-y-2 divide-gray-100 p-0 h-fit">
                            <CategoryFilter
                                titulo="Categorías"
                                opciones={categorias.map(categoria => ({
                                    nombre: categoria.name,
                                    valor: categoria.id,
                                    total: categoria.products_count,
                                    main_category_id: categoria.main_category_id
                                }))}
                                seleccionados={categoriasSeleccionadas}
                                setSeleccionados={setCategoriasSeleccionadas}
                                mainCategories={mainCategories}
                            />
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
                            <PriceFilter
                                min={0}
                                max={maxPrecio}
                                value={precio}
                                setValue={setPrecio}
                            />
                        </div>
                    </aside>


                    {/* Main productos */}
                    <main className="w-full lg:w-4/5 -mt-2">
                        {/* Controles superiores */}
                        <div className="flex flex-col mb-8">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold font-inter text-gray-900">
                                    Tienda
                                </h1>
                                <div className="flex items-center space-x-4">
                                    {/* Productos por página */}
                                    <div className="items-center gap-3 hidden lg:flex">
                                        <span className="text-sm text-gray-500">Mostrar:</span>
                                        <div className="flex gap-1 items-center">
                                            {[9, 12, 18, 24].map(num => (
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
                                    {/* Selector columnas */}
                                    <div className="items-center border border-gray-300 rounded-md hidden lg:flex">
                                        {[2, 3, 4].map(num => {
                                            const Icon = [TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4][num - 2];
                                            return (
                                                <button
                                                    key={num}
                                                    onClick={() => handleColumnasChange(num)}
                                                    className={`px-2 py-1.5 ${columnas === num ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}${num !== 4 ? ' border-r border-gray-300' : ''}`}
                                                    title={`${num} Columnas`}
                                                >
                                                    <Icon size={16} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Orden selector */}
                                    <div className="flex items-center">
                                        <Select
                                            value={ORDER_OPTIONS.find(option => option.value === orden)}
                                            onChange={opt => setOrden(opt.value)}
                                            options={ORDER_OPTIONS}
                                            classNames={{
                                                control: () => "border z-80 border-gray-300 rounded-md bg-transparent hover:border-gray-400 cursor-pointer min-h-[32px] text-xs px-1 py-0.5",
                                                option: ({ isFocused, isSelected }) =>
                                                    `px-2 py-1 cursor-pointer text-xs sm:text-sm  ${isSelected
                                                        ? "bg-gray-900 text-white"
                                                        : isFocused
                                                            ? "bg-gray-100"
                                                            : "text-gray-900"
                                                    }`,
                                                menu: () => "mt-0 bg-white border border-gray-200 rounded-md shadow-lg relative ",
                                                menuList: () => "max-h-60 overflow-auto text-xs sm:text-sm lg:text-base",
                                                singleValue: () => "text-xs sm:text-sm lg:text-base font-medium text-gray-900",
                                                placeholder: () => "text-xs sm:text-sm lg:text-base font-medium text-gray-500",
                                                input: () => "text-xs sm:text-sm lg:text-base font-medium text-gray-900",
                                                valueContainer: () => "p-1 lg:p-2",
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
                                                        className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500"
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
                                            onClick={() => { setCategoriasSeleccionadas([]); setCurrentPage(1); }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <span className="mr-1">
                                                Categoría: {categorias.find(cat => categoriasSeleccionadas.includes(cat.id))?.name}
                                            </span>
                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                    {marcasSeleccionadas.map(marcaId => (
                                        <button
                                            key={marcaId}
                                            onClick={() => { setMarcasSeleccionadas(prev => prev.filter(id => id !== marcaId)); setCurrentPage(1); }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <span className="mr-1">
                                                Marca: {marcas.find(marca => marca.id === marcaId)?.name}
                                            </span>
                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    ))}
                                    {(precio.min > 0 || precio.max < maxPrecio) && (
                                        <button
                                            onClick={() => { setPrecio({ min: 0, max: maxPrecio }); setCurrentPage(1); }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <span className="mr-1">Precio: S/{precio.min} - S/{precio.max}</span>
                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={resetAllFilters}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 hover:bg-red-200"
                                    >
                                        <span className="mr-1">Eliminar todos los filtros</span>
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Grid de productos */}
                        <div
                            className={`
                            grid gap-6 mx-2 md:max-w-none grid-flow-row-dense
                            ${columnas === 2
                                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2'
                                : columnas === 3
                                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'
                                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'
                            }
                        `}
                        >
                            {productosPaginados.length > 0 ? (
                                productosPaginados.map(producto => (
                                    <div key={producto.id}>
                                        <CardProduct
                                            id={producto.id}
                                            name={producto.name}
                                            slug={producto.slug}
                                            regularPrice={producto.regular_price}
                                            salePrice={producto.sale_price}
                                            image={producto.image}
                                            brand={producto.brand}
                                            inStock={producto.stock > 0}
                                            isNew={producto.is_new === 'yes'}
                                            isFavorite={producto.is_favorite}
                                            onViewProduct={() => route.visit(`/producto/${producto.slug}`)}
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
                                onPageChange={page => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )}
                    </main>
                </div>
            </div>
            <MenuFilters
                open={menuFiltersOpen}
                onClose={() => setMenuFiltersOpen(false)}
                categorias={categorias}
                marcas={marcas}
                mainCategories={mainCategories}
                categoriasSeleccionadas={categoriasSeleccionadas}
                setCategoriasSeleccionadas={setCategoriasSeleccionadas}
                marcasSeleccionadas={marcasSeleccionadas}
                setMarcasSeleccionadas={setMarcasSeleccionadas}
                precio={precio}
                setPrecio={setPrecio}
                maxPrecio={maxPrecio}
            />
        </div>
    );
}
