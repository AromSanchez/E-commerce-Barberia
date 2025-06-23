import Breadcrumb from "@/components/Cliente/Breadcrumb";
import CardProduct from "@/components/Cliente/CardProduct";
import Pagination from "@/components/Cliente/Pagination";
import { useState, useMemo } from "react";
import Select from 'react-select';

export default function ProductsOfertas({ productos = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(
        () => parseInt(localStorage.getItem('productsPerPage')) || 9
    );
    const [orden, setOrden] = useState(
        () => localStorage.getItem('ordenProductos') || 'predeterminado'
    );

    // Actualizar el localStorage cuando cambian las preferencias
    const handleProductsPerPageChange = (num) => {
        setProductsPerPage(num);
        setCurrentPage(1);
        localStorage.setItem('productsPerPage', num);
    };

    const handleOrdenChange = (selectedOption) => {
        setOrden(selectedOption.value);
        localStorage.setItem('ordenProductos', selectedOption.value);
    };

    const options = [
        { value: 'predeterminado', label: 'Orden Predeterminado' },
        { value: 'descuentoDesc', label: 'Mayor descuento' },
        { value: 'precioAsc', label: 'Precio: Menor a Mayor' },
        { value: 'precioDesc', label: 'Precio: Mayor a Menor' }
    ];

    // Ordenar productos según selección
    const ordenarProductos = (productos) => {
        switch (orden) {
            case 'descuentoDesc':
                return productos.slice().sort((a, b) => {
                    const descuentoA = ((a.regular_price - a.sale_price) / a.regular_price) * 100;
                    const descuentoB = ((b.regular_price - b.sale_price) / b.regular_price) * 100;
                    return descuentoB - descuentoA;
                });
            case 'precioAsc':
                return productos.slice().sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price));
            case 'precioDesc':
                return productos.slice().sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price));
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
        <div className="flex overflow-y-hidden min-h-screen bg-gradient-to-t to-gray-50 from-white py-3 md:py-6">
            <div className="w-full max-w-7xl mt-4 mx-auto px-3 sm:px-4 md:px-6 lg:px-8"> 

                 {/* Controles */}              
                <div className="flex flex-col gap-4 px-1 mb-9">
                    {/* Contenedor superior con breadcrumb e información */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                        <div className="flex-shrink-0">
                            <Breadcrumb 
                                baseItems={['Inicio', 'Ofertas']}
                                separator=">"
                                onHomeClick={() => {
                                    window.location.href = '/';
                                }}
                            />
                        </div>
                        
                        {/* Información de resultados responsive */}
                        <div className="text-sm text-gray-600">
                            {productosEnOferta.length > 0 && (
                                <span>
                                   Mostrando: {((currentPage - 1) * productsPerPage) + 1}—{Math.min(currentPage * productsPerPage, productosEnOferta.length)} de {productosEnOferta.length} resultados
                                </span>
                            )}
                        </div>
                    </div>                   

                    {/* Contenedor de título y selector de orden */}
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 lg:text-left mb-0">
                            Ofertas Especiales
                        </h1>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Mostrar Productos */}                     
                            <div className="hidden lg:flex items-center gap-3">
                                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Mostrar:</span>
                                <div className="flex gap-1.5 items-center">
                                    {[9, 12, 18, 24].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleProductsPerPageChange(num)}
                                            className={`px-2 py-1 text-sm border transition-colors ${
                                                productsPerPage === num
                                                    ? 'border-gray-900 bg-gray-900 text-white font-bold'
                                                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                            } rounded`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Selector de orden en móvil/tablet */}
                            <div className="mt-0">
                                <Select
                                    value={options.find(option => option.value === orden)}
                                    onChange={handleOrdenChange}
                                    options={options}
                                    classNames={{
                                        control: () => "border border-gray-300 rounded-md hover:border-gray-400 cursor-pointer shadow-sm",
                                        option: ({ isFocused, isSelected }) =>
                                            `px-3 py-2 cursor-pointer ${
                                                isSelected
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : isFocused
                                                        ? "bg-gray-100"
                                                        : "text-gray-900"
                                            }`,
                                        menu: () => "mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50",
                                        menuList: () => "max-h-60 overflow-auto text-sm z-10",
                                        singleValue: () => "text-sm font-medium text-gray-900",
                                        placeholder: () => "text-sm font-medium text-gray-500",
                                        input: () => "text-sm font-medium text-gray-900",
                                        valueContainer: () => "px-3 py-2",
                                        indicatorsContainer: () => "px-2",
                                        indicatorSeparator: () => "bg-gray-300",
                                        dropdownIndicator: () => "text-gray-500 hover:text-gray-800"
                                    }}
                                    unstyled
                                    isSearchable={false}
                                    components={{
                                        IndicatorSeparator: () => null,
                                        DropdownIndicator: () => (
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
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

                {/* Grid de productos con responsividad fija */}
                <div className="grid gap-4 md:gap-6 mb-6 md:mb-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center px-4 sm:px-3 lg:px-0">
                    {currentProducts.map(producto => (
                        <div key={producto.id} className="w-full max-w-sm">
                            <CardProduct
                                id={producto.id}
                                slug={producto.slug}
                                name={producto.name}
                                salePrice={producto.sale_price}
                                regularPrice={producto.regular_price}
                                brand={producto.brand ? producto.brand.name : null}
                                image={producto.image}
                                inStock={producto.stock > 0}
                                showOfferBadge={!!producto.sale_price && producto.sale_price > 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                {productosEnOferta.length > 0 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Mensaje cuando no hay productos */}
                {productosEnOferta.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">No hay ofertas disponibles</div>
                        <div className="text-gray-400 text-sm">Vuelve pronto para ver nuestras ofertas especiales</div>
                    </div>
                )}
            </div>
        </div>
    );
}