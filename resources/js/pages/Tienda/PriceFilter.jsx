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

    const porcentaje = (val) => ((val - min) / (max - min)) * 100;

    const handleMouseDown = (type) => {
        setDragging(type);
    };

    const handleMouseMove = (e) => {
        if (!dragging || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const newValue = Math.round(min + (percent / 100) * (max - min));

        if (dragging === 'min') {
            setTempValues(prev => ({ ...prev, min: Math.min(newValue, value.max - 1) }));
        } else {
            setTempValues(prev => ({ ...prev, max: Math.max(newValue, value.min + 1) }));
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
        setValue(tempValues);
    };

    useEffect(() => {
        setTempValues(value);
    }, [value]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging]);

    const handleChange = (e, type) => {
        const newValue = Math.max(min, Math.min(max, +e.target.value));
        const newTempValues = { ...tempValues };
        
        if (type === 'min') {
            newTempValues.min = Math.min(newValue, tempValues.max - 1);
        } else {
            newTempValues.max = Math.max(newValue, tempValues.min + 1);
        }
        setTempValues(newTempValues);
    };

    const handleFilter = () => {
        setValue(tempValues);
    };

    return (
        <div className="pb-2 mb-4 w-52 text-left">
            <h2 className="font-bold text-xl mb-3">Precio</h2>

            <div ref={sliderRef} className="relative h-1 bg-gray-200 rounded-full cursor-pointer mb-4">
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
                    className="absolute w-3 h-3 bg-white border border-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ left: `${porcentaje(tempValues.min)}%` }}
                    onMouseDown={() => handleMouseDown('min')}
                    role="slider"
                    aria-label="Precio mínimo"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={tempValues.min}
                />
                {/* Controlador máximo */}
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ left: `${porcentaje(tempValues.max)}%` }}
                    onMouseDown={() => handleMouseDown('max')}
                    role="slider"
                    aria-label="Precio máximo"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={tempValues.max}
                />
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600">
                    S/{tempValues.min} — S/{tempValues.max}
                </span>
                <button
                    onClick={handleFilter}
                    className="bg-gray-900 text-white py-1.5 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    FILTRAR
                </button>
            </div>
        </div>
    );
}
