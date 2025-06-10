import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { Link } from '@inertiajs/react';

const MainHeader = ({ isMenuOpen, setIsMenuOpen, navLinks, searchQuery, setSearchQuery, handleSearch }) => (
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex items-center justify-between h-12 lg:h-16 gap-4 lg:gap-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-1 text-gray-600 focus:outline-none"
        aria-label="Abrir menú"
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors px-1 py-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Barra de búsqueda en desktop */}
      <div className="hidden lg:flex flex-1 max-w-md mx-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-r hover:bg-gray-200 transition-colors"
          >
            <FiSearch size={18} className="text-gray-600" />
          </button>
        </form>
      </div>

      {/* Iconos de usuario */}
      <div className="flex items-center space-x-2">
        <div className="hidden lg:flex items-center space-x-2">
          <Link href="/account" className="p-1 text-gray-600 hover:text-black transition-colors">
            <AiOutlineUser size={20} />
          </Link>
          <Link href="/wishlist" className="p-1 text-gray-600 hover:text-black transition-colors relative">
            <AiOutlineHeart size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white text-[10px] rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
        {/* Carrito siempre visible */}
        <Link href="/cart" className="flex items-center text-gray-600 hover:text-black transition-colors">
          <div className="relative p-1">
            <AiOutlineShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white text-[10px] rounded-full flex items-center justify-center">
              0
            </span>
          </div>
          <span className="hidden lg:inline text-sm ml-1 font-medium">S/45.00</span>
        </Link>
      </div>
    </div>
  </div>
);

export default MainHeader;
