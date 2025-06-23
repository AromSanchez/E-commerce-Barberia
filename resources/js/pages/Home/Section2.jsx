export default function Section2() {
    const categories = [
        {
            id: 1,
            name: 'Equipamientos',
            slug: 'equipamientos',
            image: '/images/lavaCate.jpg',
            alt: 'Equipamientos de barbería'
        },
        {
            id: 2,
            name: 'Accesorios',
            slug: 'accesorios',
            image: '/images/papa.jpg',
            alt: 'Accesorios de barbería'
        },
        {
            id: 3,
            name: 'Tijeras y Navajas',
            slug: 'tijeras-navajas',
            image: '/images/lakme.jpg',
            alt: 'Tijeras y Navajas'
        },
        {
            id: 4,
            name: 'Máquinas y Partes',
            slug: 'maquinas-partes',
            image: '/images/lakmeRes.jpg',
            alt: 'Máquinas y Partes'
        },
        {
            id: 5,
            name: 'Herramientas',
            slug: 'herramientas',
            image: '/images/des.png',
            alt: 'Herramientas de barbería'
        },
        {
            id: 6,
            name: 'Productos',
            slug: 'productos',
            image: '/images/CeraPrin.png',
            alt: 'Productos de barbería'
        }    ];

    return (
        <section className="py-12 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8">Nuestras Categorías</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.reduce((acc, category, index) => {
                        const columnIndex = Math.floor(index / 2);
                        if (!acc[columnIndex]) {
                            acc[columnIndex] = [];
                        }
                        acc[columnIndex].push(
                            <a 
                                key={category.id}
                                href={`/categorias/${category.slug}`} 
                                className="relative overflow-hidden rounded-lg shadow-lg group"
                            >
                                <div className="aspect-w-1 aspect-h-1">
                                    <img 
                                        src={category.image}
                                        alt={category.alt}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                                </div>
                            </a>
                        );
                        return acc;
                    }, []).map((column, index) => (
                        <div key={index} className="grid gap-6">
                            {column}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}