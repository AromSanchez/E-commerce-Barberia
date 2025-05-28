import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import CardProduct from '@/components/MainHome/CardProduct'
import FiltroCheckbox from '@/components/MainProducts/FilterCheckbox'
import Main from "../Main/Main";

export default function MainProducts({ productos = [], categorias = [] }) {
    const [seleccionados, setSeleccionados] = useState([]);

    const productosFiltrados =
        seleccionados.length === 0
            ? productos
            : productos.filter(p => seleccionados.includes(p.category_id));

    return (
        <Main className='flex justify-center mt-5'>
            <div className="flex flex-row gap-6 px-4 py-6 w-[75%] justify-between">
                {/* Filtro */}
                <FiltroCheckbox
                    titulo="Categorías"
                    opciones={categorias.map(categoria => ({
                        nombre: categoria.name,
                        valor: categoria.id,
                        total: categoria.products_count
                    }))}
                    seleccionados={seleccionados}
                    setSeleccionados={setSeleccionados}
                />

                {/* Lista de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {productosFiltrados.map(producto => (
                        <CardProduct
                            key={producto.id}
                            name={producto.name}
                            regularPrice={producto.regular_price}
                            salePrice={producto.sale_price}
                            image={`/storage/${producto.image}`} // Ajusta esto si usas otra ruta
                        />
                    ))}
                </div>
            </div>
        </Main>
    );
}
