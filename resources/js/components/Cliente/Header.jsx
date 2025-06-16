import { useState, useEffect, useMemo } from 'react';
import TopInfoBar from './TopInfoBar';
import MainHeader from './MainHeader';
import MobileMenu from './MobileMenu';
import MenuCart from './MenuCart';
import { FaShippingFast, FaClock } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isCartOpen, closeCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Estados para el scroll dinámico - solo MainHeader
  const [showMainHeader, setShowMainHeader] = useState(true); // Inicialmente visible
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true); // Para saber si estamos en la parte superior de la página

  const navLinks = useMemo(() => [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Tienda" },
    { href: "/offers", label: "Ofertas" },
    { href: "/nosotros", label: "Nosotros" },
  ], []);

  const promoMessages = useMemo(() => [
    { text: "Envío GRATIS en compras + S/50", icon: <FaShippingFast className="w-4 h-4" /> },
    { text: "Atención las 24hrs del día", icon: <FaClock className="w-4 h-4" /> },
    { text: "Entrega en Trujillo en 24hrs", icon: <HiOutlineLocationMarker className="w-4 h-4" /> },
    { text: "Consultas: +51 968 899 167", icon: <HiOutlinePhone className="w-4 h-4" /> },
  ], []);

  // Efecto para cambiar el mensaje promocional cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        prevIndex === promoMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [promoMessages.length]);

  // Efecto para mostrar el MainHeader cuando se scrollea hacia arriba o está en el top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Actualizamos si estamos en el top de la página
      setIsAtTop(currentScrollY < 50);
      
      // Mostrar el MainHeader cuando:
      // 1. Está en el top (menos de 50px) O
      // 2. Se scrollea hacia arriba después de haber bajado más de 100px
      if (currentScrollY < 50 || (currentScrollY < lastScrollY && currentScrollY > 100)) {
        setShowMainHeader(true);
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setShowMainHeader(false);  // Ocultar el MainHeader al hacer scroll hacia abajo
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', searchQuery);
  };

  return (
    <header className="relative z-50">
      
      {/* TopInfoBar - solo visible cuando estamos en el top */}
      <div className={`bg-white relative z-40 transition-all duration-300 ${isAtTop ? 'block' : 'hidden'}`}>
        <TopInfoBar 
          promoMessages={promoMessages} 
          currentMessageIndex={currentMessageIndex} 
        />
      </div>

      {/* MainHeader - visible cuando estamos en el top o al scrollear hacia arriba */}
      <div 
        className={`
          ${isAtTop ? 'relative bg-white z-40' : 'fixed top-0 left-0 right-0 z-50 bg-white'} 
          transition-all duration-300 ease-in-out
          ${showMainHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <MainHeader
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isCartOpen={isCartOpen}
          setIsCartOpen={closeCart}
          navLinks={navLinks}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
      
      {/* MobileMenu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
      />

      {/* Carrito */}
      <MenuCart 
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </header>
  );
}
