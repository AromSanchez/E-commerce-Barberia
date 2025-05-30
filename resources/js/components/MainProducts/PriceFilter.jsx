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

    return (
        <div className="mb-6 w-52">
            <h3 className="font-semibold text-lg mb-2">Precio S/</h3>

            <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer mb-4">
                <div
                    className="absolute h-2 bg-black rounded-full"
                    style={{
                        left: `${porcentaje(value.min)}%`,
                        width: `${porcentaje(value.max) - porcentaje(value.min)}%`
                    }}
                />
                <div
                    className="absolute w-4 h-4 bg-white border-2 border-black rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer"
                    style={{ left: `${porcentaje(value.min)}%` }}
                    onMouseDown={() => handleMouseDown('min')}
                />
                <div
                    className="absolute w-4 h-4 bg-white border-2 border-black rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer"
                    style={{ left: `${porcentaje(value.max)}%` }}
                    onMouseDown={() => handleMouseDown('max')}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="number"
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    value={value.min}
                    onChange={(e) =>
                        setValue((prev) => ({
                            ...prev,
                            min: Math.min(Math.max(min, +e.target.value), value.max - 1),
                        }))
                    }
                />
                <span className="text-gray-500">—</span>
                <input
                    type="number"
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    value={value.max}
                    onChange={(e) =>
                        setValue((prev) => ({
                            ...prev,
                            max: Math.max(Math.min(max, +e.target.value), value.min + 1),
                        }))
                    }
                />
            </div>
        </div>
    );
}
