import { Link, usePage } from '@inertiajs/react';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineHeart, AiOutlineClose, AiOutlineDashboard, AiOutlineLogin } from 'react-icons/ai';
import { FiLogOut, FiUserPlus } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function MobileMenu({ isOpen, onClose, navLinks }) {
  const menuRef = useRef(null);
  const { auth } = usePage().props;
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ productos: [], marcas: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

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

  // Búsqueda en vivo
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions({ productos: [], marcas: [] });
      setShowSuggestions(false);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const { data } = await axios.get(route('products.live_search'), {
          params: { q: searchQuery }
        });
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (e) {
        setSuggestions({ productos: [], marcas: [] });
      }
    };
    const timeout = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSuggestions]);

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
          <form className="relative" onSubmit={e => {
            e.preventDefault();
            setShowSuggestions(false);
            window.location.href = route('products.index') + '?q=' + encodeURIComponent(searchQuery);
          }}>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-12 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              aria-label="Buscar producto"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-black focus:text-black focus:outline-none"
              aria-label="Buscar"
            >
              <FiSearch className="w-4 h-4" />
            </button>
            {showSuggestions && searchQuery.trim().length > 0 && (
              <div ref={suggestionsRef} className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-2">
                  <div className="font-semibold text-gray-700 text-xs mb-1 pl-2">Productos</div>
                  <ul>
                    {suggestions.productos.length > 0 ? suggestions.productos.map(p => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="flex items-center w-full text-left py-2 px-2 hover:bg-gray-100 text-sm gap-3"
                          onClick={() => {
                            setShowSuggestions(false);
                            window.location.href = route('products.show', p.slug);
                          }}
                        >
                          <img
                            src={p.image ? (p.image.startsWith('http') ? p.image : `/storage/${p.image}`) : '/images/no-image.png'}
                            alt={p.name}
                            className="w-10 h-10 object-contain rounded mr-2 border bg-white"
                          />
                          <span className="font-medium text-gray-800 text-sm text-left line-clamp-2">{p.name}</span>
                        </button>
                      </li>
                    )) : <li className="text-gray-400 text-sm py-2 pl-2">Sin resultados</li>}
                  </ul>
                </div>
              </div>
            )}
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
                className={`block px-6 py-4 text-sm text-gray-700 border-l-4 border-transparent ${isActive ? 'bg-gray-100 text-black border-gray-700 font-semibold' : ''}`}
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
        <div className="border-t  mt-auto">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Mi Cuenta
            </h3>
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-3 px-6 py-4 w-full text-gray-700 outline-none"
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
                        className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 outline-none"
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
                        className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 outline-none"
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
                      className="flex items-center gap-2 w-full px-6 py-2 text-sm text-red-600 outline-none mt-1"
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
                    className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 outline-none"
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
                    className="flex items-center gap-2 px-6 py-2 text-sm text-gray-700 outline-none"
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
            href="/favoritos"
            className="flex items-center space-x-3 px-6 py-4 text-gray-700 outline-none"
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