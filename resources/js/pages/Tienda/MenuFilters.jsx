import React, { useEffect, useState } from 'react';
import CategoryFilter from './CategoryFilter';
import FiltroCheckbox from './FilterCheckbox';
import PriceFilter from './PriceFilter';

export default function MenuFilters({
  open,
  onClose,
  categorias,
  marcas,
  mainCategories = [],
  categoriasSeleccionadas,
  setCategoriasSeleccionadas,
  marcasSeleccionadas,
  setMarcasSeleccionadas,
  precio,
  setPrecio,
  maxPrecio
}) {
  // Mantener montado durante animación de salida
  const [show, setShow] = useState(false);
  // Activar/desactivar animación
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let timeout;
    if (open) {
      setShow(true);
      // Asegura aplicar la animación al siguiente tick
      timeout = setTimeout(() => setAnimating(true), 20);
    } else if (show) {
      setAnimating(false);
      timeout = setTimeout(() => setShow(false), 300);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  // Nuevos handlers para cerrar el panel al seleccionar
  const handleCategorias = (seleccionadas) => {
    setCategoriasSeleccionadas(seleccionadas);
    onClose();
  };

  const handleMarcas = (seleccionadas) => {
    setMarcasSeleccionadas(seleccionadas);
    onClose();
  };

  const handlePrecio = (valor) => {
    setPrecio(valor);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-40
          transition-opacity duration-300
          ${animating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />
      {/* Panel lateral */}
      <div
        className={`
          relative bg-white w-[60%] max-w-64 h-full shadow-lg p-6 overflow-y-auto
          transition-transform duration-300 transform
          ${animating ? 'translate-x-0' : 'translate-x-full'}
          z-50
        `}
        style={{ willChange: 'transform, opacity' }}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Cerrar filtros"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="mb-6">
          <CategoryFilter
            titulo="Categorías"
            opciones={categorias.map(categoria => ({
              nombre: categoria.name,
              valor: categoria.id,
              total: categoria.products_count,
              main_category_id: categoria.main_category_id
            }))}
            seleccionados={categoriasSeleccionadas}
            setSeleccionados={handleCategorias}
            mainCategories={mainCategories}
          />
        </div>
        <div className="mb-6">
          <FiltroCheckbox
            titulo="Marcas"
            opciones={marcas.map(marca => ({
              nombre: marca.name,
              valor: marca.id,
              total: marca.products_count,
              logo: marca.logo ? `/storage/${marca.logo}` : null
            }))}
            seleccionados={marcasSeleccionadas}
            setSeleccionados={handleMarcas}
          />
        </div>
        <div>
          <PriceFilter
            min={0}
            max={maxPrecio}
            value={precio}
            setValue={handlePrecio}
          />
        </div>
      </div>
    </div>
  );
}
