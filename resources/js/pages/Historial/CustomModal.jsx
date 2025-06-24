import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function CustomModal({ isOpen, onClose, title, description, children }) {
  // Cerrar modal al presionar Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restaurar scroll cuando el componente se desmonta o el modal se cierra
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Cerrar al hacer clic en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >      <div 
        className="w-120 max-h-[80vh] bg-white rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      ><div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-black">{title}</h2>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          <button 
            className="rounded-full p-1.5 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
          <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
