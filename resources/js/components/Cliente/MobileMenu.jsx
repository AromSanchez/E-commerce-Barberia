import { Link, usePage } from '@inertiajs/react';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineHeart, AiOutlineClose, AiOutlineDashboard, AiOutlineLogin } from 'react-icons/ai';
import { FiLogOut, FiUserPlus } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';

export default function MobileMenu({ isOpen, onClose, navLinks }) {
  const menuRef = useRef(null);
  const { auth } = usePage().props;
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Animación de salida: mantener el overlay para transición
  // Eliminado el return anticipado para evitar problemas de doble clic

  // Obtener la ruta actual para resaltar el enlace activo
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
    >
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Panel del menú */}
      <div
        ref={menuRef}
        className={`fixed left-0 top-0 h-full w-[85%] max-w-80 bg-white shadow-xl transform transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
        role="menu"
      >
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Cerrar menú"
          >
            <AiOutlineClose className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Búsqueda móvil */}
        <div className="p-4 border-b" role="search">
          <form className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-12 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              aria-label="Buscar producto"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-black focus:text-black focus:outline-none"
              aria-label="Buscar"
            >
              <FiSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Enlaces de navegación */}
        <nav className="py-2">
          {navLinks.map((link, index) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={index}
                href={link.href}
                className={`block px-6 py-4 text-sm text-gray-700 border-l-4 border-transparent focus:outline-none focus:bg-gray-100 focus:text-black ${isActive ? 'bg-gray-100 text-black border-gray-700 font-semibold' : ''}`}
                onClick={() => {
                  setShowUserDropdown(false);
                  onClose();
                }}
                role="menuitem"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Enlaces de usuario */}
        <div className="border-t bg-gray-50 mt-auto">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Mi Cuenta
            </h3>
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-3 px-6 py-4 w-full text-gray-700 focus:bg-white focus:text-black focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setShowUserDropdown((v) => !v);
              }}
              aria-haspopup="true"
              aria-expanded={showUserDropdown}
              tabIndex={0}
            >
              <AiOutlineUser className="w-5 h-5" />
              <span className="text-sm font-medium">Cuenta</span>
              <svg className={`ml-auto w-4 h-4 transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {/* Dropdown integrado al panel */}
            <div
              className={`w-full transition-all duration-300 ease-in-out
                ${showUserDropdown ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
                overflow-hidden bg-gray-50`}
            >
              {auth?.user ? (
                <>
                  <div className="px-6 pt-2 pb-1">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{auth.user.name}</p>
                    <p className="text-xs text-gray-500 leading-tight">{auth.user.email}</p>
                  </div>
                  <div className="mt-1">
                    {auth.user.role === 'admin' ? (
                      <Link
                        href={route('dashboard')}
                        className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black focus:outline-none"
                        onClick={() => {
                          setShowUserDropdown(false);
                          onClose();
                        }}
                      >
                        <AiOutlineDashboard className="w-5 h-5 text-gray-400" />
                        <span>Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black focus:outline-none"
                        onClick={() => {
                          setShowUserDropdown(false);
                          onClose();
                        }}
                      >
                        <AiOutlineUser className="w-5 h-5 text-gray-400" />
                        <span>Mi Perfil</span>
                      </Link>
                    )}
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="flex items-center gap-2 w-full px-6 py-2 text-sm text-red-600 focus:bg-gray-100 focus:text-black focus:outline-none mt-1"
                      onClick={() => {
                        setShowUserDropdown(false);
                        onClose();
                      }}
                    >
                      <FiLogOut className="w-5 h-5 text-red-400" />
                      <span>Cerrar Sesión</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="py-2">
                  <Link
                    href={route('login')}
                    className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black focus:outline-none"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onClose();
                    }}
                  >
                    <AiOutlineLogin className="w-5 h-5 text-gray-400" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    href={route('register')}
                    className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black focus:outline-none"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onClose();
                    }}
                  >
                    <FiUserPlus className="w-5 h-5 text-gray-400" />
                    <span>Registrarse</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <Link
            href="/wishlist"
            className="flex items-center space-x-3 px-6 py-4 text-gray-700 focus:bg-white focus:text-black focus:outline-none"
            onClick={onClose}
            role="menuitem"
          >
            <AiOutlineHeart className="w-5 h-5" />
            <span className="text-sm font-medium">Lista de Deseos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}