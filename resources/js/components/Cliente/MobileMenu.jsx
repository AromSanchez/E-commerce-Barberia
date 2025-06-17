import { Link } from '@inertiajs/react';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineHeart } from 'react-icons/ai';
import { useEffect, useRef } from 'react';

export default function MobileMenu({ isOpen, onClose, navLinks }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="lg:hidden fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Panel del menú */}
      <div
        ref={menuRef}
        className="fixed left-0 top-0 h-full w-[80%] sm:w-64 bg-white transform overflow-y-auto"
        role="menu"
      >
        {/* Búsqueda móvil */}
        <div className="p-2 sm:p-4 border-b" role="search">
          <form className="flex">
            <input
              type="text"
              placeholder="Buscar producto"
              className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Buscar producto"
            />
            <button
              type="submit"
              className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 border border-gray-300 rounded-r hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Buscar"
            >
              <FiSearch className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
          </form>
        </div>

        {/* Enlaces de navegación */}
        <nav className="py-2 sm:py-4">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="block px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
              onClick={onClose}
              role="menuitem"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Enlaces de usuario */}
        <div className="border-t px-4 sm:px-6 py-2 sm:py-4">
          <Link
            href="/account"
            className="flex items-center space-x-2 py-2 sm:py-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
            onClick={onClose}
            role="menuitem"
          >
            <AiOutlineUser className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Mi Cuenta</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center space-x-2 py-2 sm:py-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
            onClick={onClose}
            role="menuitem"
          >
            <AiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Lista de Deseos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
