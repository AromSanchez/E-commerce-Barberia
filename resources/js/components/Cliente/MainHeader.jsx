import { FiSearch, FiMenu, FiX, FiLogIn, FiLogOut, FiUserPlus, FiTag, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineUser, AiOutlineDashboard } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { Link, usePage } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const MainHeader = ({
  isMenuOpen,
  setIsMenuOpen,
  navLinks
}) => {
  const { openCart } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ productos: [], marcas: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { categories, brands, auth } = usePage().props;
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const suggestionsRef = useRef(null);
  const timeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);
  const { favoriteCount } = usePage().props; // ¡Aquí está la magia!


  const fetchCartInfo = async () => {
    const response = await axios.get(route('cart.get'));
    const items = Object.values(response.data.items || {});
    setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  };

  useEffect(() => {
    fetchCartInfo();
    const interval = setInterval(fetchCartInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleUserMouseEnter = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
    }
    setShowUserDropdown(true);
  };

  const handleUserMouseLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setShowUserDropdown(false);
    }, 200);
  };

  // Buscador en vivo
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

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (href) => {
    setShowSuggestions(false);
    window.location.href = href;
  };

  const renderDropdownContent = () => (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-1/2 transform -translate-x-1/2 w-[520px] bg-white shadow-xl rounded-lg 
                  transition-all duration-300 ease-out border border-gray-100
                  ${showDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                  z-50 mt-2`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        {/* Header */}
        <div className="text-center pb-3 mb-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Nuestros Productos</h3>
          <p className="text-sm text-gray-500">Explora por categorías y marcas</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Categorías */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <BiCategory className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Categorías</h3>
            </div>
            <ul className="space-y-1">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={route('products.category', category.slug)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-all duration-200 group"
                  >
                    <FiTag className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    <span className="group-hover:text-gray-900">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marcas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <MdOutlineLocalOffer className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Marcas</h3>
            </div>
            <ul className="space-y-1">
              {brands?.map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={route('products.brand', brand.slug)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-all duration-200 group"
                  >
                    <FiTag className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    <span className="group-hover:text-gray-900">{brand.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <Link
            href={route('products.index')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Ver todos los productos →
          </Link>
        </div>
      </div>
    </div>
  );

  const renderUserDropdownContent = () => (
    <div
      ref={userDropdownRef}
      className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-xl rounded-lg 
                  transition-all duration-300 ease-out border border-gray-100
                  ${showUserDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                  z-50 mt-2`}
      onMouseEnter={handleUserMouseEnter}
      onMouseLeave={handleUserMouseLeave}
    >
      {auth?.user ? (
        <div className="p-3">
          <div className="px-3 py-2 border-b border-gray-100 mb-2">
            <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
            <p className="text-xs text-gray-500">{auth.user.email}</p>
          </div>
          {auth.user.role === 'admin' ? (
            <>
              <Link
                href={route('dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 group"
              >
                <AiOutlineDashboard className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span>Dashboard</span>
              </Link>
              <Link
                href={route('dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 group"
              >
                <FiClock className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span>Ver Pedidos</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={route('profile.edit')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 group"
              >
                <CgProfile className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span>Mi Perfil</span>
              </Link>
              <Link
                href={route('profile.edit')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 group"
              >
                <FiClock className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span>Ver Pedidos</span>
              </Link>
            </>
          )}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 group"
            >
              <FiLogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />
              <span>Cerrar Sesión</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-3 space-y-1">
          <Link
            href={route('login')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 group"
          >
            <FiLogIn className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            <span>Iniciar Sesión</span>
          </Link>
          <Link
            href={route('register')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 group"
          >
            <FiUserPlus className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            <span>Registrarse</span>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between h-12 lg:h-16 gap-4 lg:gap-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-1 text-gray-600 focus:outline-none"
          aria-label="Abrir menú"
        >
          <FiMenu size={24} />
        </button>

        {/* Logo */}
        <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start items-center">
          <Link href="/" className="w-28 lg:w-32">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-7 lg:h-8 object-contain"
              loading="eager"
            />
          </Link>
        </div>

        {/* Navegación desktop */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-4 lg:space-x-6">
            {navLinks.map((link, index) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname === link.href;
              const isTienda = link.label.toLowerCase() === 'tienda';

              return (
                <li key={index} className="relative">
                  <Link
                    href={link.href}
                    className={`group relative text-sm font-medium px-1 py-2 transition-all duration-200
                      ${isActive ? 'text-black scale-105' : 'text-gray-700'}
                      hover:text-black hover:scale-105
                      focus:outline-none
                    `}
                    onMouseEnter={() => isTienda && handleMouseEnter()}
                    onMouseLeave={() => isTienda && handleMouseLeave()}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {/* Subrayado animado tipo slide */}
                    <span
                      className={`absolute left-0 bottom-1 w-full h-0.5 rounded bg-black origin-left transition-transform duration-300
                        ${isActive ? 'scale-x-100' : 'scale-x-0'}
                        group-hover:scale-x-100
                      `}
                      aria-hidden="true"
                      style={{ display: 'block' }}
                    />
                  </Link>
                  {isTienda && renderDropdownContent()}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Barra de búsqueda en desktop */}
        <div className="hidden lg:flex flex-1 max-w-3xl mx-4 relative">
          <form onSubmit={e => { e.preventDefault(); window.location.href = route('products.index') + '?q=' + encodeURIComponent(searchQuery); }} className="flex w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar producto"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
              onFocus={() => searchQuery && setShowSuggestions(true)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-r hover:bg-gray-200 transition-colors"
            >
              <FiSearch size={18} className="text-gray-600" />
            </button>
          </form>
          {showSuggestions && (searchQuery.trim().length > 0) && (
            <div ref={suggestionsRef} className="absolute left-1/2 top-full -translate-x-1/2 w-[600px] bg-white shadow-xl rounded-b-lg border border-gray-100 z-50 mt-1 p-6">
              {/* Sugerencias de búsqueda y marcas */}
              <div className="flex gap-8 mb-4">
                <div className="flex-1">
                  <ul className="mb-2">
                    {suggestions.productos.length > 0 ? suggestions.productos.map(p => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="block w-full text-left py-1.5 px-2 hover:bg-gray-100 text-base"
                          onClick={() => window.location.href = route('products.index') + '?q=' + encodeURIComponent(p.name)}
                        >
                          {p.name.split(' ').slice(0, 3).join(' ')}
                        </button>
                      </li>
                    )) : <span className="text-gray-400 text-base">Sin resultados</span>}
                  </ul>
                </div>
                <div className="w-40">
                  <div className="font-bold text-gray-800 mb-2">Marcas</div>
                  <ul className="grid grid-cols-1 gap-x-4">
                    {suggestions.marcas.length > 0 ? suggestions.marcas.map(m => (
                      <li key={m.id}>
                        <button type="button" className="block w-full text-left py-1.5 px-2 hover:bg-gray-100 text-base" onClick={() => window.location.href = route('products.brand', m.slug)}>
                          {m.name}
                        </button>
                      </li>
                    )) : <span className="text-gray-400 text-base">-</span>}
                  </ul>
                </div>
              </div>
              {/* Carrusel de productos relacionados */}
              <div className="mt-2">
                <div className="font-bold text-gray-800 mb-2">TE PODRÍA INTERESAR</div>
                <div className="relative">
                  <button type="button" onClick={() => {
                    const el = document.getElementById('carousel-sugerencias');
                    if (el) {
                      const distance = 180;
                      const duration = 400; // ms
                      const start = el.scrollLeft;
                      const end = start - distance;
                      let startTime = null;
                      function animateScroll(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // easeInOutQuad
                        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                        el.scrollLeft = start + (end - start) * ease;
                        if (progress < 1) {
                          requestAnimationFrame(animateScroll);
                        }
                      }
                      requestAnimationFrame(animateScroll);
                    }
                  }} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 border border-gray-300 rounded-full shadow p-1 hover:bg-gray-200 transition-colors flex items-center justify-center w-6 h-6">
                    <FiChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <div
                    id="carousel-sugerencias"
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-4"
                    style={{scrollbarWidth:'none'}} 
                    onWheel={e => {
                      const el = e.currentTarget;
                      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        el.scrollLeft += e.deltaY;
                        e.preventDefault();
                      }
                    }}
                  >
                    {suggestions.productos.length > 0 ? suggestions.productos.map(p => (
                      <div key={p.id} className="w-[150px] h-[200px] bg-white border rounded shadow-sm flex-shrink-0 flex flex-col">
                        <button type="button" onClick={() => window.location.href = route('products.show', p.slug)} className="w-full text-left h-full flex flex-col">
                          <img src={p.image || '/images/logo.png'} alt={p.name} className="w-full h-[140px] object-contain rounded-t" />
                          <div className="p-2 flex-1 flex flex-col justify-between">
                            <div className="font-bold text-gray-800 text-xs uppercase truncate">{p.brand}</div>
                            <div className="text-xs text-gray-700 truncate mb-2">{p.name}</div>
                          </div>
                        </button>
                      </div>
                    )) : <span className="text-gray-400 text-base">Sin productos</span>}
                  </div>
                  <button type="button" onClick={() => {
                    const el = document.getElementById('carousel-sugerencias');
                    if (el) {
                      const distance = 180;
                      const duration = 400; // ms
                      const start = el.scrollLeft;
                      const end = start + distance;
                      let startTime = null;
                      function animateScroll(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // easeInOutQuad
                        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                        el.scrollLeft = start + (end - start) * ease;
                        if (progress < 1) {
                          requestAnimationFrame(animateScroll);
                        }
                      }
                      requestAnimationFrame(animateScroll);
                    }
                  }} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 border border-gray-300 rounded-full shadow p-1 hover:bg-gray-200 transition-colors flex items-center justify-center w-6 h-6">
                    <FiChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Iconos de usuario */}
        <div className="flex items-center space-x-2">
          <div className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <button
                className="p-1 text-gray-600 hover:text-black transition-colors focus:outline-none"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
                aria-label="Menú de usuario"
              >
                <AiOutlineUser size={20} />
              </button>
              {renderUserDropdownContent()}
            </div>
            <Link href="/favoritos" className="p-1 text-gray-600 hover:text-black transition-colors relative">
              <AiOutlineHeart size={20} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center shadow">
                  {favoriteCount}
                </span>
              )}
            </Link>
          </div>
          {/* Carrito siempre visible */}
          <button
            onClick={openCart}
            className="flex items-center text-gray-600 hover:text-black transition-colors focus:outline-none"
            aria-label="Abrir carrito"
          >
            <div className="relative p-1">
              <AiOutlineShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-sm ml-1 font-medium">
              S/{cartTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
