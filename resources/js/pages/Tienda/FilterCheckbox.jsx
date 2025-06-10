import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FiltroCheckbox({ titulo = 'XXXXX', opciones = [], seleccionados, setSeleccionados }) {
    const [abierto, setAbierto] = useState(true);

    const toggleOpcion = useCallback((valor) => {
        setSeleccionados((prev) =>
            prev.includes(valor)
                ? prev.filter((v) => v !== valor)
                : [...prev, valor]
        );
    }, [setSeleccionados]);

    return (
        <div className="pb-2 mb-4 w-52 text-left">
            <div
                className="flex items-center justify-between cursor-pointer mb-1"
                onClick={() => setAbierto(!abierto)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setAbierto(!abierto);
                    }
                }}
            >
                <h2 className="font-bold text-xl">{titulo}</h2>
                {abierto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            <div className={`transition-all duration-300 ease-in-out ${abierto ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="-space-y-1">
                    {opciones.map((opcion) => (
                        <label
                            key={opcion.valor}
                            className={`w-full flex items-center justify-between py-1.5 group transition-colors cursor-pointer ${
                                seleccionados.includes(opcion.valor)
                                    ? 'text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="checkbox"
                                    checked={seleccionados.includes(opcion.valor)}
                                    onChange={() => toggleOpcion(opcion.valor)}
                                    className="accent-gray-900 w-4 h-4 rounded-full"
                                />
                                {opcion.logo && (
                                    <div className="flex items-center gap-2 flex-1">
                                        <img
                                            src={opcion.logo}
                                            alt={opcion.nombre}
                                            className="w-14 h-10 object-contain rounded bg-white border"
                                        />
                                        <span className="text-sm font-medium">{opcion.nombre}</span>
                                    </div>
                                )}
                                {!opcion.logo && (
                                    <span className="text-sm font-medium">{opcion.nombre}</span>
                                )}
                            </div>
                            <span className={`
                                inline-flex items-center justify-center 
                                w-5 h-5 rounded-lg text-xs ml-2
                                ${seleccionados.includes(opcion.valor)
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                }
                            `}>
                                {opcion.total}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
