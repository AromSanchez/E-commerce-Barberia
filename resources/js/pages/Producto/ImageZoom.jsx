import { useRef, useState } from 'react';

export default function ImageZoom({ src, alt }) {
  const zoomRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handleMouseEnter = () => {
    zoomRef.current.style.backgroundSize = '200%'; // Zoom cuando entra
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    zoomRef.current.style.backgroundPosition = 'center';
    zoomRef.current.style.backgroundSize = '100%'; // Volver a normal
    setIsZoomed(false);
  };

  return (
    <div
      ref={zoomRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full bg-no-repeat bg-center transition-all duration-300 ease-in-out rounded-2xl"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: '100%',
      }}
    >
      <img src={src} alt={alt} className="opacity-0 w-full h-full" />
    </div>
  );
}

