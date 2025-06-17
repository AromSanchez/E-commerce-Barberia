import { useState, useEffect } from 'react';

export default function Section2() {
    const [currentImage, setCurrentImage] = useState(0);
    
    const images = [
        "/images/des.png",
        "/images/Cera2.png",
        "/images/Cera3.png",
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prevImage) => 
                prevImage === images.length - 1 ? 0 : prevImage + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative  overflow-hidden">
        
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Columna Izquierda - Carrusel */}
                    <div className="relative order-2 lg:order-1">
                        {/* Marco decorativo */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-black via-gray-800 to-black rounded-2xl opacity-10 blur-sm"></div>
                        
                        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden group">
                            {/* Overlay gradient sutil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10"></div>
                            
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform
                                    ${currentImage === index 
                                        ? 'opacity-100 scale-100' 
                                        : 'opacity-0 scale-105'}`}
                                >
                                    <img
                                        src={image}
                                        alt={`Barbería profesional ${index + 1}`}
                                        className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                            
                            {/* Indicadores mejorados */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`transition-all duration-500 rounded-full border-2 hover:scale-110
                                        ${currentImage === index 
                                            ? 'w-12 h-3 bg-white border-white shadow-lg' 
                                            : 'w-3 h-3 bg-white/60 border-white/80 hover:bg-white/80'}`}
                                        onClick={() => setCurrentImage(index)}
                                    />
                                ))}
                            </div>

                            {/* Botones de navegación */}
                            <button
                                onClick={() => setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Columna Derecha - Historia */}
                    <div className="order-1 lg:order-2 space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            10 años en el mercado Peruano
                        </div>
                        
                        {/* Título principal */}
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                                Sobre nuestra
                                <span className="block text-black italic relative">
                                    historia
                                    <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-black to-gray-600 rounded-full"></div>
                                </span>
                            </h2>
                        </div>

                        {/* Contenido */}
                        <div className="space-y-6">
                            <div className="w-16 h-px bg-gradient-to-r from-black to-gray-400"></div>
                            
                            <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
                                <p className="relative pl-6 border-l-2 border-gray-300">
                                    <strong className="text-black font-semibold">Barbershop</strong> nació con un sueño: transformar el cuidado masculino en una experiencia única. Comenzamos en un pequeño local alquilado, con herramientas básicas, muchas gansas y pasión por lo que hacíamos.
                                </p>
                                
                                <p className="text-gray-600">
                                    Los primeros días no fueron fáciles, pero cada corte y cada cliente satisfecho nos impulsaron a seguir adelante. A través del esfuerzo, largas jornadas y la dedicación a nuestro trabajo, logramos construir una reputación que nos permitió crecer.
                                </p>
                                
                                <p className="relative pl-6 border-l-2 border-black">
                                    Con perseverancia y el apoyo de nuestros clientes, abrimos nuestra segunda sede en <strong className="text-black">San Martín de Porres</strong> y, más adelante, llegamos a <strong className="text-black">Huánuco, Llata</strong>.
                                </p>
                                
                                <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-lg border-l-4 border-black">
                                    Hoy contamos con <strong className="text-black">tres sedes</strong> y un equipo comprometido con brindar no solo cortes impecables, sino una experiencia de confianza y estilo auténtico.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-black text-black">10+</div>
                                    <div className="text-sm text-gray-600 font-medium">Años</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-black text-black">3</div>
                                    <div className="text-sm text-gray-600 font-medium">Sedes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-black text-black">1000+</div>
                                    <div className="text-sm text-gray-600 font-medium">Clientes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}