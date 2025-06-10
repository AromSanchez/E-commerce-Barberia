import React from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaTwitter, 
  FaFacebook, 
  FaTiktok, 
  FaInstagram,
  FaInfoCircle,
  FaShieldAlt,
  FaFileContract,
  FaCreditCard,
  FaExchangeAlt,
  FaQuestionCircle,
  FaTruck,
  FaMapMarkedAlt
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 border-t border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          
          {/* Logo y descripción */}
          <div className="col-span-1 flex flex-col items-center sm:items-start">
            <Link href="/" className="group transition duration-300">
              <img 
                src="/images/logolight.png" 
                alt="Barber Logo" 
                className="h-14 mb-4 opacity-90 group-hover:opacity-100"
              />
            </Link>
            <p className="text-sm text-gray-400 text-center sm:text-left max-w-xs leading-relaxed">
              Productos profesionales para barbería y cuidado masculino.
            </p>
            <div className="mt-6 flex space-x-5">
              {[
                { icon: FaTwitter, label: "Twitter" },
                { icon: FaFacebook, label: "Facebook" },
                { icon: FaTiktok, label: "TikTok" },
                { icon: FaInstagram, label: "Instagram" }
              ].map(({ icon: Icon, label }, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  aria-label={label}
                  className="text-gray-500 hover:text-white transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Información */}
          <div className="col-span-1 flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-medium mb-4 text-white flex items-center">
              <FaInfoCircle className="mr-2 text-gray-500" />
              Información
            </h3>
            <ul className="space-y-3">
              {[
                { icon: FaInfoCircle, text: "Acerca de Nosotros", href: "/acerca-de" },
                { icon: FaShieldAlt, text: "Política & Privacidad", href: "/politica-privacidad" },
                { icon: FaFileContract, text: "Términos & Condiciones", href: "/terminos-condiciones" }
              ].map(({ icon: Icon, text, href }, idx) => (
                <li key={idx}>
                  <Link 
                    href={href} 
                    className="flex items-center text-gray-400 hover:text-white text-sm transition duration-300 group"
                  >
                    <Icon className="mr-2 text-gray-600 group-hover:text-gray-300" size={14} />
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicio al Cliente */}
          <div className="col-span-1 flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-medium mb-4 text-white flex items-center">
              <FaQuestionCircle className="mr-2 text-gray-500" />
              Servicio al Cliente
            </h3>
            <ul className="space-y-3">
              {[
                { icon: FaCreditCard, text: "Formas de pago", href: "/formas-pago" },
                { icon: FaExchangeAlt, text: "Cambios y Devoluciones", href: "/cambios-devoluciones" },
                { icon: FaQuestionCircle, text: "Preguntas Frecuentes", href: "/preguntas-frecuentes" }
              ].map(({ icon: Icon, text, href }, idx) => (
                <li key={idx}>
                  <Link 
                    href={href} 
                    className="flex items-center text-gray-400 hover:text-white text-sm transition duration-300 group"
                  >
                    <Icon className="mr-2 text-gray-600 group-hover:text-gray-300" size={14} />
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery */}
          <div className="col-span-1 flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-medium mb-4 text-white flex items-center">
              <FaTruck className="mr-2 text-gray-500" />
              Delivery
            </h3>
            <ul className="space-y-3">
              {[
                { icon: FaTruck, text: "Tiempos y Costos", href: "/tiempos-costos" },
                { icon: FaMapMarkedAlt, text: "Zona de Reparto", href: "/zona-reparto" }
              ].map(({ icon: Icon, text, href }, idx) => (
                <li key={idx}>
                  <Link 
                    href={href} 
                    className="flex items-center text-gray-400 hover:text-white text-sm transition duration-300 group"
                  >
                    <Icon className="mr-2 text-gray-600 group-hover:text-gray-300" size={14} />
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-xs text-gray-500 tracking-wide">
            BARBERSHOP © {new Date().getFullYear()} | TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>
      </div>
    </footer>
  );
}