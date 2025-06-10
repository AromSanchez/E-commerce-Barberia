import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 7) {
            // Si hay 7 páginas o menos, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Siempre mostrar primera página
            pageNumbers.push(1);
            
            if (currentPage > 3) {
                pageNumbers.push('...');
            }
            
            // Páginas alrededor de la página actual
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            if (currentPage <= 3) {
                end = 5;
            }
            
            if (currentPage >= totalPages - 2) {
                start = totalPages - 4;
            }
            
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }
            
            // Siempre mostrar última página
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };    return (
        <div className="flex justify-center items-center space-x-1 mt-16 mb-5">
            {/* Botón Anterior */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`h-8 w-8 flex items-center justify-center rounded ${
                    currentPage === 1
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-black hover:bg-gray-100'
                }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Números de página */}
            <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                        disabled={typeof page !== 'number'}
                        className={`h-8 w-8 flex items-center justify-center rounded ${
                            page === currentPage
                                ? 'bg-black text-white'
                                : typeof page === 'number'
                                ? 'text-black hover:bg-gray-100'
                                : 'text-gray-400'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`h-8 w-8 flex items-center justify-center rounded ${
                    currentPage === totalPages
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-black hover:bg-gray-100'
                }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
