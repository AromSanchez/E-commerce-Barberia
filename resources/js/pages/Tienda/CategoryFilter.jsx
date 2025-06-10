import React from 'react';

export default function CategoryFilter({ titulo, opciones = [], seleccionados = [], setSeleccionados }) {
    const handleCategoriaClick = (categoriaId) => {
        setSeleccionados(
            seleccionados.includes(categoriaId) 
                ? seleccionados.filter(id => id !== categoriaId)
                : [categoriaId]
        );
    };

    return (
        <div className="pb-2 mb-4 w-52 text-left">
            <h2 className="font-bold text-xl mb-0">{titulo}</h2>
            <div className="-space-y-1">
                {opciones.map((opcion) => (
                    <button
                        key={opcion.valor}
                        onClick={() => handleCategoriaClick(opcion.valor)}
                        className={`w-full flex items-center justify-between py-1.5 group transition-colors ${
                            seleccionados.includes(opcion.valor)
                                ? 'text-gray-900'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span className="text-sm font-medium">
                            {opcion.nombre}
                        </span>
                        <span className={`
                            inline-flex items-center justify-center 
                            w-5 h-5 rounded-lg text-xs
                            ${seleccionados.includes(opcion.valor)
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            }
                        `}>
                            {opcion.total}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
