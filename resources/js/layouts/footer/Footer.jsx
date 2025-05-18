import React from 'react';
import { Link } from '@inertiajs/react';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo y descripción */}
                    <div className="col-span-1">
                        <Link href="/">
                            <img 
                                src="/images/logolight.png" 
                                alt="Barber Logo" 
                                className="h-10 mb-4"
                            />
                        </Link>
                        <p className="text-sm mt-4 text-gray-300">
                            Tu destino para productos premium de barbería y cuidado personal.
                        </p>
                    </div>

                    {/* Información */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-medium mb-4">Información</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/acerca-de" className="text-gray-300 hover:text-white text-sm">
                                    Acerca de Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/politica-privacidad" className="text-gray-300 hover:text-white text-sm">
                                    Política & Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href="/terminos-condiciones" className="text-gray-300 hover:text-white text-sm">
                                    Términos & Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Servicio al Cliente */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-medium mb-4">Servicio al Cliente</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/formas-pago" className="text-gray-300 hover:text-white text-sm">
                                    Formas de pago
                                </Link>
                            </li>
                            <li>
                                <Link href="/cambios-devoluciones" className="text-gray-300 hover:text-white text-sm">
                                    Cambios y Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/preguntas-frecuentes" className="text-gray-300 hover:text-white text-sm">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Delivery */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-medium mb-4">Delivery</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/tiempos-costos" className="text-gray-300 hover:text-white text-sm">
                                    Tiempos y Costos de Envío
                                </Link>
                            </li>
                            <li>
                                <Link href="/zona-reparto" className="text-gray-300 hover:text-white text-sm">
                                    Zona de Reparto
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright y redes sociales */}
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        BarberShop© Copyright 2025
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <Twitter size={18} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <Facebook size={18} />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                                <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                                <path d="M15 8v8a4 4 0 0 1-4 4"/>
                                <line x1="15" y1="4" x2="15" y2="12"/>
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}