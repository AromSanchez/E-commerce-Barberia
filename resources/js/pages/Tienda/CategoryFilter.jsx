import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoryFilter({ titulo, opciones = [], seleccionados = [], setSeleccionados, mainCategories = [] }) {
    const [abierto, setAbierto] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [loadingGroup, setLoadingGroup] = useState(null);

    // Agrupar las opciones por categoría principal
    const categoriasPorGrupo = useMemo(() => {
        const grupos = {};
        
        // Por defecto, todas las principales están colapsadas (cambiado de expandidas a colapsadas)
        if (!Object.keys(expandedGroups).length && mainCategories.length) {
            const initialExpanded = {};
            mainCategories.forEach(cat => {
                initialExpanded[cat.id] = false; // Inicialmente colapsadas
            });
            setExpandedGroups(initialExpanded);
        }
        
        // Crear un grupo "Sin clasificar" para categorías sin categoría principal
        grupos['sin_clasificar'] = [];
        
        // Agrupar las opciones por su main_category_id
        opciones.forEach(opcion => {
            const mainCategoryId = opcion.main_category_id;
            
            if (mainCategoryId) {
                if (!grupos[mainCategoryId]) {
                    grupos[mainCategoryId] = [];
                }
                grupos[mainCategoryId].push(opcion);
            } else {
                grupos['sin_clasificar'].push(opcion);
            }
        });
        
        return grupos;
    }, [opciones, mainCategories, expandedGroups]);

    // Calcular el total de productos por categoría principal
    const totalPorCategoriaPrincipal = useMemo(() => {
        const totales = {};
        
        mainCategories.forEach(cat => {
            const subcategorias = categoriasPorGrupo[cat.id] || [];
            totales[cat.id] = subcategorias.reduce((sum, opcion) => sum + opcion.total, 0);
        });
        
        // Total para "Sin clasificar"
        totales['sin_clasificar'] = (categoriasPorGrupo['sin_clasificar'] || [])
            .reduce((sum, opcion) => sum + opcion.total, 0);
            
        return totales;
    }, [categoriasPorGrupo, mainCategories]);

    // Manejar clic en una categoría
    const handleCategoriaClick = (categoriaId) => {
        setSeleccionados(
            seleccionados.includes(categoriaId) 
                ? seleccionados.filter(id => id !== categoriaId)
                : [categoriaId]
        );
    };
    
    // Alternar visibilidad de un grupo
    const toggleGroup = (groupId) => {
        // Si se está cerrando, no mostrar carga
        if (expandedGroups[groupId]) {
            setExpandedGroups(prev => ({
                ...prev,
                [groupId]: false
            }));
            return;
        }
        
        // Mostrar indicador de carga
        setLoadingGroup(groupId);
        
        // Simular carga con un pequeño retraso
        setTimeout(() => {
            setExpandedGroups(prev => ({
                ...prev,
                [groupId]: true
            }));
            setLoadingGroup(null);
        }, 800); // 800ms de "carga" para que sea más visible
    };

    // Renderizar un elemento de categoría
    const renderCategoryItem = (opcion) => (
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
    );

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
                <h2 className="font-bold text-xl ">{titulo}</h2>
                {abierto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            <div className={`transition-all duration-300 ease-in-out ${abierto ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {mainCategories && mainCategories.length > 0 ? (
                    <div className="space-y-2">
                        {mainCategories.map((mainCategory) => (
                            <div key={mainCategory.id} className="mb-1">
                                {/* Título de la categoría principal como botón clicable */}
                                <div 
                                    className={`flex items-center justify-between cursor-pointer py-1.5 transition-colors group ${
                                        loadingGroup === mainCategory.id || expandedGroups[mainCategory.id]
                                            ? 'text-gray-900 bg-gray-100 rounded-md px-1' 
                                            : 'text-gray-800 hover:text-gray-900'
                                    }`}
                                    onClick={() => toggleGroup(mainCategory.id)}
                                >
                                    <span className="text-sm font-semibold">{mainCategory.name}</span>
                                    <div className="flex items-center gap-2">
                                        {/* Contador de elementos */}
                                        <span className={`
                                            inline-flex items-center justify-center w-5 h-5 rounded-lg text-xs
                                            ${loadingGroup === mainCategory.id || expandedGroups[mainCategory.id]
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                            }
                                        `}>
                                            {totalPorCategoriaPrincipal[mainCategory.id] || 0}
                                        </span>
                                        {/* Icono de expansión o loading */}
                                        {loadingGroup === mainCategory.id ? (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                                        ) : expandedGroups[mainCategory.id] ? (
                                            <ChevronUp size={16} className="text-gray-500" />
                                        ) : (
                                            <ChevronDown size={16} className="text-gray-500" />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Subcategorías - con animación al expandirse */}
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    expandedGroups[mainCategory.id] 
                                        ? 'max-h-[500px] opacity-100' 
                                        : 'max-h-0 opacity-0'
                                }`}>
                                    {loadingGroup === mainCategory.id ? (
                                        <div className="pl-2 border-l border-gray-200 ml-1 mt-1 py-3 flex justify-center">
                                            <div className="w-6 h-6 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                                        </div>
                                    ) : categoriasPorGrupo[mainCategory.id] && (
                                        <div className="pl-2 border-l border-gray-200 ml-1 mt-1 space-y-1">
                                            {categoriasPorGrupo[mainCategory.id].map(renderCategoryItem)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Categorías sin clasificar */}
                        {categoriasPorGrupo['sin_clasificar'] && categoriasPorGrupo['sin_clasificar'].length > 0 && (
                            <div className="mt-2">
                                <div 
                                    className={`flex items-center justify-between cursor-pointer py-1 transition-colors group ${
                                        loadingGroup === 'sin_clasificar' || expandedGroups['sin_clasificar']
                                            ? 'text-gray-900 bg-gray-100 rounded-md px-1'
                                            : 'text-gray-800 hover:text-gray-900'
                                    }`}
                                    onClick={() => toggleGroup('sin_clasificar')}
                                >
                                    <span className="text-sm font-semibold">Otras</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`
                                            inline-flex items-center justify-center w-5 h-5 rounded-lg text-xs
                                            ${loadingGroup === 'sin_clasificar' || expandedGroups['sin_clasificar']
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                            }
                                        `}>
                                            {totalPorCategoriaPrincipal['sin_clasificar'] || 0}
                                        </span>
                                        {loadingGroup === 'sin_clasificar' ? (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                                        ) : expandedGroups['sin_clasificar'] ? (
                                            <ChevronUp size={16} className="text-gray-500" />
                                        ) : (
                                            <ChevronDown size={16} className="text-gray-500" />
                                        )}
                                    </div>
                                </div>
                                
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    expandedGroups['sin_clasificar'] 
                                        ? 'max-h-[500px] opacity-100' 
                                        : 'max-h-0 opacity-0'
                                }`}>
                                    {loadingGroup === 'sin_clasificar' ? (
                                        <div className="pl-2 border-l border-gray-200 ml-1 mt-1 py-3 flex justify-center">
                                            <div className="w-6 h-6 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <div className="pl-2 border-l border-gray-200 ml-1 mt-1 space-y-1">
                                            {categoriasPorGrupo['sin_clasificar'].map(renderCategoryItem)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="-space-y-1">
                        {opciones.map(renderCategoryItem)}
                    </div>
                )}
            </div>
        </div>
    );
}
