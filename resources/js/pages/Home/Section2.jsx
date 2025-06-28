import { useFilter } from '@/contexts/FilterContext';

export default function Section2() {
    const { addMainCategoryFilter } = useFilter();
    const categories = [
        {
            id: 1,
            name: 'Equipamientos',
            slug: 'equipamientos',
            image: '/images/lavaCate.jpg',
            alt: 'Equipamientos de barbería',
            description: 'Mobiliario y equipos para tu barbería'
        },
        {
            id: 2,
            name: 'Accesorios',
            slug: 'accesorios',
            image: '/images/accesorios.jpg',
            alt: 'Accesorios de barbería',
            description: 'Complementos esenciales para el barbero profesional'
        },
        {
            id: 3,
            name: 'Máquinas y Partes',
            slug: 'maquinas-partes',
            image: '/images/maquina.jpg',
            alt: 'Máquinas y Partes',
            description: 'Cortadoras y repuestos de calidad profesional'
        },
        {
            id: 4,
            name: 'Tijeras y Navajas',
            slug: 'tijeras-navajas',
            image: '/images/tijerac.jpg',
            alt: 'Tijeras y Navajas',
            description: 'Herramientas de corte de alta precisión'
        },
        {
            id: 5,
            name: 'Herramientas',
            slug: 'herramientas',
            image: '/images/herramientas.png',
            alt: 'Herramientas de barbería',
            description: 'Instrumentos profesionales para el cuidado masculino'
        },
        {
            id: 6,
            name: 'Productos',
            slug: 'productos',
            image: '/images/CeraPrin.png',
            alt: 'Productos de barbería',
            description: 'Productos de cuidado y estilizado premium'
        }
    ];    return (
        <section className="py-16 relative overflow-hidden">
            
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header mejorado */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Nuestras Categorías
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubre nuestra amplia gama de productos profesionales para barbería
                    </p>
                </div>

                {/* Grid de categorías mejorado */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`transform transition-all duration-500 hover:scale-105 ${
                                index % 2 === 0 ? 'animate-fade-in-up' : 'animate-fade-in-up delay-200'
                            }`}
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            <a
                                href={"/productos"}
                                onClick={e => {
                                    e.preventDefault();
                                    // Guardar la categoría principal seleccionada en sessionStorage
                                    sessionStorage.setItem('mainCategoryToExpand', category.id);
                                    window.location.href = "/productos";
                                }}
                                className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Imagen con overlay mejorado */}
                                <div className="relative h-80 overflow-hidden">
                                    <img 
                                        src={category.image}
                                        alt={category.alt}
                                        className="object-contain w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    
                                    {/* Gradiente overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    
                                    {/* Efecto de brillo al hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                </div>

                                {/* Contenido de texto mejorado */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <div className="transform transition-all duration-300 group-hover:translate-y-[-8px]">
                                        <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-gray-100">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            {category.description}
                                        </p>
                                        
                                        {/* Botón CTA */}
                                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                            <span className="inline-flex items-center px-4 py-2 bg-gray-800 bg-opacity-80 text-white text-sm font-medium rounded-lg hover:bg-opacity-100 transition-all duration-200">
                                                Ver productos
                                                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Badge de categoría */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-gray-900 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                        {category.name}
                                    </span>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}