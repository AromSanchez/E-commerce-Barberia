import { useState, useEffect, useRef } from 'react';

export default function PriceFilter({
    min,
    max,
    value,
    setValue
}) {
    const sliderRef = useRef(null);
    const [dragging, setDragging] = useState(null);

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
            setValue((prev) => ({ ...prev, min: Math.min(newValue, value.max - 1) }));
        } else {
            setValue((prev) => ({ ...prev, max: Math.max(newValue, value.min + 1) }));
        }
    };

    const handleMouseUp = () => setDragging(null);

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
        if (type === 'min') {
            setValue(prev => ({ ...prev, min: Math.min(newValue, value.max - 1) }));
        } else {
            setValue(prev => ({ ...prev, max: Math.max(newValue, value.min + 1) }));
        }
    };

    return (
        <div className="w-full md:w-48 mb-4">
            <h3 className="font-semibold text-lg mb-2">Precio S/</h3>

            <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer mb-4">
                {/* Barra del filtro */}
                <div
                    className="absolute h-2 bg-black rounded-full transition-all duration-200"
                    style={{
                        left: `${porcentaje(value.min)}%`,
                        width: `${porcentaje(value.max) - porcentaje(value.min)}%`
                    }}
                />
                {/* Controlador mínimo */}
                <div
                    className="absolute w-4 h-4 bg-white border-2 border-black rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer"
                    style={{ left: `${porcentaje(value.min)}%` }}
                    onMouseDown={() => handleMouseDown('min')}
                    role="slider"
                    aria-label="Precio mínimo"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value.min}
                />
                {/* Controlador máximo */}
                <div
                    className="absolute w-4 h-4 bg-white border-2 border-black rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer"
                    style={{ left: `${porcentaje(value.max)}%` }}
                    onMouseDown={() => handleMouseDown('max')}
                    role="slider"
                    aria-label="Precio máximo"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value.max}
                />
            </div>

            {/* Entrada de los valores de precio */}
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                    value={value.min}
                    onChange={(e) => handleChange(e, 'min')}
                    min={min}
                    max={value.max - 1}
                    aria-label="Precio mínimo"
                />
                <span className="text-gray-500">—</span>
                <input
                    type="number"
                    className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                    value={value.max}
                    onChange={(e) => handleChange(e, 'max')}
                    min={value.min + 1}
                    max={max}
                    aria-label="Precio máximo"
                />
            </div>
        </div>
    );
}
