import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FiltroCheckbox({ titulo = 'XXXXX', opciones = [], seleccionados, setSeleccionados }) {
    const [abierto, setAbierto] = useState(true)

    const toggleOpcion = (valor) => {
        setSeleccionados((prev) =>
            prev.includes(valor)
                ? prev.filter((v) => v !== valor)
                : [...prev, valor]
        )
    }

    return (
        <div className="border-b pb-2 mb-4 w-52">
            {/* Encabezado */}
            <div
                className="flex items-center justify-between mb-4 border-b pb-2 border-[#B5B5B5] cursor-pointer select-none"
                onClick={() => setAbierto(!abierto)}
            >
                <h3 className="font-semibold text-lg">{titulo}</h3>
                {abierto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {/* Lista de opciones */}
            {abierto && (
                <div className="mt-2 flex flex-col gap-2">
                    {opciones.map((opcion, index) => (
                        <label
                            key={index}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={seleccionados.includes(opcion.valor)}
                                onChange={() => toggleOpcion(opcion.valor)}
                                className="accent-black w-4 h-4"
                            />
                            <span className="text-sm text-black font-medium">
                                {opcion.nombre}
                            </span>
                            <span className="text-sm text-gray-500">{opcion.total}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}