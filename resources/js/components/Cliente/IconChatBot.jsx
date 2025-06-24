import React, { useState } from 'react';
import { BsChatDotsFill } from 'react-icons/bs';

const IconChatBot = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };    return (
        <>            {/* Ventana de Chat */}
            {isChatOpen && (
                <div className="fixed bottom-4 right-20 sm:bottom-24 sm:right-24 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
                    {/* Header del chat */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Asistente Virtual</h3>
                        <button 
                            onClick={toggleChat}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Área de mensajes */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="bg-gray-100 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-800">
                                ¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                            </p>
                        </div>
                    </div>
                    
                    {/* Input de mensaje */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Icono flotante */}
            <div
                className="fixed bottom-4 right-4 sm:bottom-24 sm:right-6 z-10 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={toggleChat}
            >
                <div className="bg-blue-600 rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                    <BsChatDotsFill className="h-8 w-8 text-white" />
                </div>
                {/* Tooltip */}
                {!isChatOpen && (
                    <div
                        className={`absolute bottom-full right-0 mb-2 transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-gray-800 text-sm whitespace-nowrap">
                            ¿Necesitas ayuda? 💬
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IconChatBot;