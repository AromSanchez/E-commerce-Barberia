import { Link } from '@inertiajs/react';

export default function Section1() {
    return (
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
                    
                    {/* Columna Izquierda - Hero Content */}
                    <div className="lg:col-span-1 flex flex-col justify-center space-y-8 text-center lg:text-left">
                        {/* Badge superior */}
                        <div className="inline-flex items-center justify-center lg:justify-start">
                            <div className="relative px-6 py-3 bg-black text-white rounded-full text-sm font-semibold tracking-wide overflow-hidden group">
                                <span className="relative z-10 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    Tu barbería online de confianza
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </div>
                        </div>

                        {/* Título principal */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight">
                                SOMOS
                            </h1>
                            <div className="relative">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-none tracking-tight">
                                    ECOMMERCE
                                    <span className="block bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                                        BARBERSHOP
                                    </span>
                                </h2>
                                {/* Línea decorativa */}
                                <div className="absolute -bottom-4 left-0 lg:left-0 w-32 h-1 bg-gradient-to-r from-black via-gray-600 to-transparent rounded-full"></div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                            Encuentra productos de <span className="font-semibold text-black">calidad premium</span> y recibe 
                            <span className="font-semibold text-black"> asesoría experta</span> personalizada.
                        </p>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Link 
                                href="/productos"
                                className="group relative inline-flex items-center justify-center px-10 py-4 bg-black text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Explorar productos
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                
                                {/* Efectos de brillo */}
                                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </Link>
                        </div>
                    </div>

                    {/* Columna Central - Objetivo */}
                    <div className="group relative">
                        {/* Fondo con gradiente sutil */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 transition-all duration-500 group-hover:shadow-2xl group-hover:border-gray-300"></div>
                        
                        {/* Contenido */}
                        <div className="relative p-8 md:p-10 h-full flex flex-col">
                            {/* Icono decorativo */}
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Título */}
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
                                Objetivo del
                                <span className="block text-black">negocio</span>
                            </h3>

                            {/* Línea decorativa */}
                            <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-400 rounded-full mb-6 transition-all duration-500 group-hover:w-32"></div>

                            {/* Contenido */}
                            <p className="text-gray-700 leading-relaxed text-lg font-medium flex-grow">
                                Ser el <strong className="text-black">líder</strong> en la venta online de productos de barbería profesional, 
                                brindando una <strong className="text-black">experiencia única</strong> y asesoría experta para que 
                                nuestros clientes encuentren los productos perfectos.
                            </p>

                            {/* Badge inferior */}
                            <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                Liderazgo en calidad
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Visión */}
                    <div className="group relative">
                        {/* Fondo con gradiente sutil */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 transition-all duration-500 group-hover:shadow-2xl group-hover:border-gray-300"></div>
                        
                        {/* Contenido */}
                        <div className="relative p-8 md:p-10 h-full flex flex-col">
                            {/* Icono decorativo */}
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Título */}
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
                                Nuestra
                                <span className="block text-black">visión</span>
                            </h3>

                            {/* Línea decorativa */}
                            <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-black rounded-full mb-6 transition-all duration-500 group-hover:w-32"></div>

                            {/* Contenido */}
                            <p className="text-gray-700 leading-relaxed text-lg font-medium flex-grow">
                                <strong className="text-black">Revolucionar</strong> el mundo del cuidado personal masculino, 
                                satisfaciendo las necesidades con un enfoque <strong className="text-black">innovador</strong>, 
                                atención integral que inspire <strong className="text-black">seguridad y autenticidad</strong>.
                            </p>

                            {/* Badge inferior */}
                            <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
                                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                Innovación constante
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de estadísticas */}
                <div className="mt-20 pt-16 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-black mb-2">10K+</div>
                            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Productos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-black mb-2">50K+</div>
                            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Clientes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-black mb-2">99%</div>
                            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Satisfacción</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-black mb-2">24/7</div>
                            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Soporte</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}