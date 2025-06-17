import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Section3() {
    const teamMembers = [
        {
            id: 1,
            name: "Frank Castro",
            role: "Master Barber",
            image: "https://i0.wp.com/masterbarbersupply.pe/wp-content/uploads/2021/10/about-us-3-team-member-3.jpg?fit=400%2C643&ssl=1",
            description: "Especialista en cortes clásicos y modernos con más de 8 años de experiencia.",
            socials: {
                instagram: "@frankcastro754",
                tiktok: "@brahim18_e",
                whatsapp: "+51968899167"
            }
        },
        {
            id: 2,
            name: "Alicia Yachi",
            role: "Senior Stylist",
            image: "https://i0.wp.com/masterbarbersupply.pe/wp-content/uploads/2021/10/about-us-3-team-member-2.jpg?fit=400%2C643&ssl=1",
            description: "Experto en degradados y estilos urbanos, creando looks únicos para cada cliente.",
            socials: {
                instagram: "@miguel_styles",
                tiktok: "@miguelstyles",
                whatsapp: "+51987654322"
            }
        },
        {
            id: 3,
            name: "Arom Sanchez",
            role: "Creative Director",
            image: "https://i0.wp.com/masterbarbersupply.pe/wp-content/uploads/2021/10/about-us-3-team-member-1.jpg?fit=400%2C643&ssl=1",
            description: "Director creativo con pasión por las tendencias internacionales y técnicas innovadoras.",
            socials: {
                instagram: "@andres_creative",
                tiktok: "@andresvega",
                whatsapp: "+51987654323"
            }
        }
    ];

    return (
        <section className="relative py-20 md:py-20 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16 md:mb-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-semibold mb-6">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        BarberShop Group
                    </div>

                    {/* Título principal */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                        NUESTRO
                        <span className="block text-black relative">
                            GRUPO
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-black via-gray-600 to-black rounded-full"></div>
                        </span>
                    </h1>

                    {/* Descripción */}
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Conoce a nuestro equipo de <span className="font-semibold text-black">expertos en productos</span>, 
                        quienes te ayudarán a encontrar las mejores herramientas y productos para tu barbería.
                    </p>
                </div>

                {/* Products Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {teamMembers.map((expert, index) => (
                        <div key={expert.id} className="group relative">
                            {/* Card Background */}
                            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2"></div>
                            
                            {/* Card Content */}
                            <div className="relative p-6 md:p-8">
                                {/* Imagen */}
                                <div className="relative mb-6 overflow-hidden rounded-2xl">
                                    <img
                                        src={expert.image}
                                        alt={expert.name}
                                        className="w-full h-80 md:h-96 object-contain transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    {/* Overlay con gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                  
                                    {/* Redes sociales overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <div className="flex gap-3">
                                            {/* Instagram */}
                                            <a 
                                                href={`https://instagram.com/${expert.socials.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                                            >
                                                <FaInstagram className="w-6 h-6" />
                                            </a>
                                            
                                            {/* TikTok */}
                                            <a 
                                                href={`https://tiktok.com/${expert.socials.tiktok.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                                            >
                                                <FaTiktok className="w-6 h-6" />
                                            </a>
                                            
                                            {/* WhatsApp */}
                                            <a 
                                                href={`https://wa.me/${expert.socials.whatsapp.replace('+', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                                            >
                                                <FaWhatsapp className="w-6 h-6" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Badge de número */}
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Información del miembro */}
                                <div className="space-y-4">
                                    {/* Nombre y rol */}
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                                            {expert.name}
                                        </h3>
                                        <p className="text-lg font-semibold text-black mt-1">
                                            {expert.role}
                                        </p>
                                    </div>

                                    {/* Línea decorativa */}
                                    <div className="w-16 h-1 bg-gradient-to-r from-black to-gray-400 rounded-full transition-all duration-500 group-hover:w-24"></div>

                                    {/* Descripción */}
                                    <p className="text-gray-600 leading-relaxed">
                                        {expert.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16 md:mt-20 pt-16 border-t border-gray-200">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                        ¿Necesitas asesoría personalizada?
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                        Contáctanos y te ayudaremos a encontrar los mejores productos para tu barbería
                    </p>
                    <a 
                        href="/contacto"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        Contactar expertos
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
