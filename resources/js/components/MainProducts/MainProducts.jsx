import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import CardProduct from '@/components/MainHome/CardProduct'
import FiltroCheckbox from '@/components/MainProducts/FilterCheckbox'
import Main from "../Main/Main";

export default function MainProducts({ productos = [], categorias = [], marcas = [] }) {
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);


    const productosFiltrados = productos.filter(producto => {
        const pasaCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.category_id);
        const pasaMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(producto.brand_id);
        return pasaCategoria && pasaMarca;
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
