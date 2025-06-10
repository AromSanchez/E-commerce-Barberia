import { Link } from '@inertiajs/react';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineHeart } from 'react-icons/ai';
import { useEffect } from 'react';

export default function MobileMenu({ isOpen, onClose, navLinks }) {
  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuElement = document.getElementById('mobile-menu-content');
      if (isOpen && menuElement && !menuElement.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <div
        id="mobile-menu-content"
        className={`fixed left-0 top-0 h-full w-[80%] sm:w-64 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-expanded={isOpen}
      >
        {/* Búsqueda móvil */}
        <div className="p-2 sm:p-4 border-b">
          <form className="flex">
            <input
              type="text"
              placeholder="Buscar producto"
              className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-l focus:outline-none"
              aria-label="Buscar producto"
            />
            <button
              type="submit"
              className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 border border-gray-300 rounded-r"
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
              className="block px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hover:bg-gray-100"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Enlaces de usuario */}
        <div className="border-t px-4 sm:px-6 py-2 sm:py-4">
          <Link
            href="/account"
            className="flex items-center space-x-2 py-2 sm:py-3 text-gray-600"
            onClick={onClose}
          >
            <AiOutlineUser className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Mi Cuenta</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center space-x-2 py-2 sm:py-3 text-gray-600"
            onClick={onClose}
          >
            <AiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Lista de Deseos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
