import Breadcrumb from "@/components/Cliente/Breadcrumb";
import CardProduct from "@/components/Cliente/CardProduct";
import Pagination from "@/components/Cliente/Pagination";
import { useState, useMemo } from "react";
import Select from 'react-select';
import { TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4 } from 'react-icons/tfi';

export default function ProductsOfertas({ productos = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [columnas, setColumnas] = useState(4);
    const [productsPerPage, setProductsPerPage] = useState(8); // Cambia a estado para control dinámico
    const [orden, setOrden] = useState('predeterminado');

    const options = [
        { value: 'predeterminado', label: 'Orden Predeterminado' },
        { value: 'precioAsc', label: 'Precio: Menor a Mayor' },
        { value: 'precioDesc', label: 'Precio: Mayor a Menor' },
        { value: 'popularidad', label: 'Por popularidad' },
        { value: 'nuevos', label: 'Más recientes' }
    ];

    // Ordenar productos según selección
    const ordenarProductos = (productos) => {
        switch (orden) {
            case 'precioAsc':
                return productos.slice().sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price));
            case 'precioDesc':
                return productos.slice().sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price));
            case 'popularidad':
                return productos.slice().sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            case 'nuevos':
                return productos.slice().reverse();
            default:
                return productos;
        }
    };

    // Filtrar solo productos con sale_price definido y mayor a 0
    const productosEnOferta = (productos || []).filter(p => p.sale_price && p.sale_price > 0);

    // Calcular productos para la página current
    const currentProducts = useMemo(() => {
        const productosOrdenados = ordenarProductos(productosEnOferta);
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        return productosOrdenados.slice(indexOfFirstProduct, indexOfLastProduct);
    }, [productosEnOferta, currentPage, productsPerPage, orden]);

    // Calcular número total de páginas
    const totalPages = Math.ceil(productosEnOferta.length / productsPerPage);

    // Manejar el cambio de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex overflow-y-hidden min-h-screen bg-gradient-to-t to-gray-50 from-white py-6">
            <div className="w-[75%] mx-auto">
                <Breadcrumb 
                    baseItems={['Inicio', 'Ofertas']}
                    separator=">"
                    onHomeClick={() => {
                        window.location.href = '/';
                    }}
                />
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    Ofertas Especiales
                </h1>

                {/* Controles superiores */}
                <div className="flex flex-col mb-8">
                    <div className="flex justify-between items-center">
                        {/* Mostrando X–Y de Z resultados */}
                        <div className="text-sm text-gray-600 min-w-[200px]">
                            {productosEnOferta.length > 0 && (
                                <span>
                                    Mostrando {((currentPage - 1) * productsPerPage) + 1}
                                    –
                                    {Math.min(currentPage * productsPerPage, productosEnOferta.length)}
                                    {' '}de {productosEnOferta.length} resultados
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Control de productos por página */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Mostrar:</span>
                                <div className="flex gap-1 items-center">
                                    {[9, 12, 18, 24].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => { setProductsPerPage(num); setCurrentPage(1); }}
                                            className={`px-2 py-1 text-sm border transition-colors ${productsPerPage === num
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                            } rounded`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-px h-6 bg-gray-300"></div>
                            {/* Selector de columnas */}
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setColumnas(2)}
                                    className={`px-2 py-1.5 ${columnas === 2 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'} border-r border-gray-300`}
                                    title="2 Columnas"
                                >
                                    <TfiLayoutGrid2 size={16} />
                                </button>
                                <button
                                    onClick={() => setColumnas(3)}
                                    className={`px-2 py-1.5 ${columnas === 3 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'} border-r border-gray-300`}
                                    title="3 Columnas"
                                >
                                    <TfiLayoutGrid3 size={16} />
                                </button>
                                <button
                                    onClick={() => setColumnas(4)}
                                    className={`px-2 py-1.5 ${columnas === 4 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                                    title="4 Columnas"
                                >
                                    <TfiLayoutGrid4 size={16} />
                                </button>
                            </div>
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
                                        menu: () => "mt-0 bg-white border border-gray-200 rounded-md shadow-lg relative ",
                                        menuList: () => "max-h-60 overflow-auto text-sm",
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
                </div>

                {/* Grid de productos */}
                <div className={`grid gap-6 ${columnas === 2 ? 'grid-cols-2 md:grid-cols-2' : columnas === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'} grid-flow-row-dense justify-items-center`}>
                    {currentProducts.map(producto => (
                        <CardProduct
                            key={producto.id}
                            id={producto.id}
                            slug={producto.slug}
                            name={producto.name}
                            salePrice={producto.sale_price}
                            regularPrice={producto.regular_price}
                            brand={producto.brand ? producto.brand.name : null}
                            image={producto.image ? `/storage/${producto.image}` : '/images/no-image.png'}
                            isNew={producto.is_new === 'yes'}
                            inStock={producto.stock > 0}
                        />
                    ))}
                </div>
                {productosEnOferta.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}