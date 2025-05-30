import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import CardProduct from '@/components/MainHome/CardProduct'
import FiltroCheckbox from '@/components/MainProducts/FilterCheckbox'
import PriceFilter from '@/components/MainProducts/PriceFilter'
import Main from "../Main/Main";

export default function MainProducts({ productos = [], categorias = [], marcas = [] }) {
    // Obtener el precio máximo al cargar los productos (solo una vez)
    const maxPrecio = Math.round(productos.reduce((max, producto) => {
        const precioProducto = producto.sale_price ?? producto.regular_price;
        return precioProducto > max ? precioProducto : max;
    }, 0));

    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    // Ahora el max es dinámico pero fijo, el min lo puedes dejar en 0 o lo que quieras
    const [precio, setPrecio] = useState({ min: 0, max: maxPrecio });

    const productosFiltrados = productos.filter(producto => {
        const precioProducto = producto.sale_price ?? producto.regular_price;

        return (
            (categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.category_id)) &&
            (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.brand_id)) &&
            precioProducto >= precio.min && precioProducto <= precio.max
        );
    });

    return (
        <Main className="flex justify-center mt-5">
            <div className="flex flex-row gap-6 px-4 py-6 w-[75%] justify-between">
                {/* Filtros: ahora están en columna */}
                <div className="flex flex-col gap-6 w-1/4">
                    <FiltroCheckbox
                        titulo="Categorías"
                        opciones={categorias.map(categoria => ({
                            nombre: categoria.name,
                            valor: categoria.id,
                            total: categoria.products_count
                        }))}
                        seleccionados={categoriasSeleccionadas}
                        setSeleccionados={setCategoriasSeleccionadas}
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

                {/* Lista de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-3/4">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map(producto => (
                            <CardProduct
                                key={producto.id}
                                name={producto.name}
                                regularPrice={producto.regular_price}
                                salePrice={producto.sale_price}
                                image={`/storage/${producto.image}`}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 text-lg">
                            No hay productos que coincidan con los filtros seleccionados.
                        </p>
                    )}
                </div>
            </div>
        </Main>
    );
}
