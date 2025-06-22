import { useState, useEffect, useRef } from 'react';

export default function PriceFilter({
    min,
    max,
    value,
    setValue
}) {
    const sliderRef = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [tempValues, setTempValues] = useState(value);

    // Calcula el porcentaje para la posición del slider
    const porcentaje = (val) => ((val - min) / (max - min)) * 100;

    // Sincroniza tempValues con value externo
    useEffect(() => {
        setTempValues(value);
    }, [value]);

    // Maneja el inicio del drag
    const handleMouseDown = (type) => {
        setDragging(type);
        document.body.style.userSelect = 'none'; // Previene selección de texto
    };

    // Maneja el movimiento del drag (mouse y touch)
    const handleMove = (clientX) => {
        if (!dragging || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const newValue = Math.round(min + (percent / 100) * (max - min));
        setTempValues(prev => {
            let next = { ...prev };
            if (dragging === 'min') {
                next.min = Math.min(newValue, prev.max - 1);
                next.min = Math.max(min, next.min);
            } else {
                next.max = Math.max(newValue, prev.min + 1);
                next.max = Math.min(max, next.max);
            }
            return next;
        });
    };

    // Eventos mouse/touch
    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => {
        if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    // Finaliza el drag
    const handleMouseUp = () => {
        setDragging(null);
        document.body.style.userSelect = '';
    };

    // Listeners globales para drag
    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [dragging]);

    // Cambios manuales por input (si se agregan)
    const handleChange = (e, type) => {
        const newValue = Math.max(min, Math.min(max, +e.target.value));
        setTempValues(prev => {
            let next = { ...prev };
            if (type === 'min') {
                next.min = Math.min(newValue, prev.max - 1);
            } else {
                next.max = Math.max(newValue, prev.min + 1);
            }
            return next;
        });
    };

    // Botón de filtrar
    const handleFilter = () => {
        setValue(tempValues);
    };

    return (
        <div className="pb-2 mb-4 w-52 text-left select-none">
            <h2 className="font-bold text-xl mb-3">Precio</h2>

            <div
                ref={sliderRef}
                className="relative h-1 bg-gray-200 rounded-full cursor-pointer mb-4"
                onClick={e => {
                    // Permite mover el controlador más cercano al hacer click en la barra
                    const rect = sliderRef.current.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                    const val = Math.round(min + (percent / 100) * (max - min));
                    const distMin = Math.abs(val - tempValues.min);
                    const distMax = Math.abs(val - tempValues.max);
                    if (distMin < distMax) {
                        setTempValues(prev => ({ ...prev, min: Math.min(val, prev.max - 1) }));
                    } else {
                        setTempValues(prev => ({ ...prev, max: Math.max(val, prev.min + 1) }));
                    }
                }}
            >
                {/* Barra del filtro */}
                <div
                    className="absolute h-1 bg-gray-900 rounded-full transition-all duration-200"
                    style={{
                        left: `${porcentaje(tempValues.min)}%`,
                        width: `${porcentaje(tempValues.max) - porcentaje(tempValues.min)}%`
                    }}
                />
                {/* Controlador mínimo */}
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                    style={{ left: `${porcentaje(tempValues.min)}%` }}
                    onMouseDown={() => handleMouseDown('min')}
                    onTouchStart={() => handleMouseDown('min')}
                    role="slider"
                    aria-label="Precio mínimo"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={tempValues.min}
                    tabIndex={0}
                />
                {/* Controlador máximo */}
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                    style={{ left: `${porcentaje(tempValues.max)}%` }}
                    onMouseDown={() => handleMouseDown('max')}
                    onTouchStart={() => handleMouseDown('max')}
                    role="slider"
                    aria-label="Precio máximo"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={tempValues.max}
                    tabIndex={0}
                />
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600">
                    S/{tempValues.min} — S/{tempValues.max}
                </span>
                <button
                    onClick={handleFilter}
                    className="bg-gray-900 text-white py-1.5 px-4 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    FILTRAR
                </button>
            </div>
        </div>
    );
}
