import React, { useState } from 'react';
import axios from 'axios';

export default function Boletin() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Por favor, ingresa tu correo electrónico' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            // Aquí iría la llamada a la API para suscribir al usuario
            const response = await axios.post('/api/newsletter/subscribe', { email });
            
            setMessage({ type: 'success', text: '¡Gracias por suscribirte! Pronto recibirás nuestras promociones exclusivas.' });
            setEmail('');
        } catch (error) {
            console.error('Error al suscribirse:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gradient-to-br from-gray-100 to-white py-20 px-4 relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gray-200 rounded-full opacity-30 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gray-200 rounded-full opacity-30 translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Columna izquierda con ilustración/imagen */}
                        <div className="bg-gray-800 text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center items-center text-center">
                            <div className="mb-6">
                                <img 
                                    src='/images/logolight.png' 
                                    alt="Logo de la barbería" 
                                    className="h-16 md:h-20 w-auto object-contain mx-auto"
                                />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">Únete a nuestra comunidad</h2>
                            <div className="w-16 h-1 bg-gray-300 mb-4 mx-auto rounded-full"></div>
                            <p className="text-gray-300 mb-6 md:mb-0">
                                Sé el primero en recibir ofertas exclusivas, novedades sobre productos y consejos de estilo personalizados.
                            </p>
                        </div>

                        {/* Columna derecha con formulario */}
                        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Suscríbete a nuestro boletín</h3>
                            <p className="text-gray-600 mb-6">
                                Recibe promociones exclusivas y mantente al día con las últimas tendencias.
                                <span className="block mt-1 text-sm">No te preocupes, no hacemos spam.</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Tu correo electrónico"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 outline-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center relative overflow-hidden group"
                                >
                                    <span className="absolute inset-0 w-0 bg-gray-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                                    <span className="relative flex items-center">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Suscribirse
                                                <svg className="ml-2 -mr-1 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            {message.text && (
                                <div className={`mt-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                    <div className="flex items-center">
                                        {message.type === 'error' ? (
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                        )}
                                        {message.text}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-6">
                                Al suscribirte, aceptas recibir correos electrónicos de marketing de nuestra empresa. 
                                Puedes cancelar la suscripción en cualquier momento.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
