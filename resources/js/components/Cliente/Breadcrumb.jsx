import React from 'react';

export default function Breadcrumb({ 
    baseItems = [], 
    currentPage = 1,
    onResetFilters,
    onHomeClick
}) {
    // Construir los items del breadcrumb dinámicamente
    const buildBreadcrumbItems = () => {
        let items = [...baseItems];

        // Agregar número de página si es mayor a 1
        if (currentPage > 1) {
            items.push(`Página ${currentPage}`);
        }

        return items;
    };

    const handleItemClick = (index, item) => {
        switch(index) {
            case 0: // Inicio
                onHomeClick?.();
                break;
            case 1: // Tienda
                onResetFilters?.();
                break;
            default:
                break;
        }
    };

    const breadcrumbItems = buildBreadcrumbItems();

    return (
        <nav aria-label="Breadcrumb">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 whitespace-nowrap">
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="text-gray-400" aria-hidden="true">›</span>}
                        <span 
                            className={`${
                                index === breadcrumbItems.length - 1 
                                    ? 'text-gray-900' 
                                    : 'hover:text-gray-900 cursor-pointer transition-colors duration-200'
                            }`}
                            onClick={() => handleItemClick(index, item)}
                            role="button"
                            tabIndex={0}
                        >
                            {item}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
}
