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
                <div className="fixed bottom-20 left-4 right-4 sm:bottom-24 sm:left-auto sm:right-6 sm:w-80 lg:right-24 lg:w-96 h-[60vh] sm:h-96 lg:h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
                    {/* Header del chat */}
                    <div className="bg-blue-600 text-white p-2 sm:p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold text-xs sm:text-base">Asistente Virtual</h3>
                        <button 
                            onClick={toggleChat}
                            className="text-white hover:text-gray-200 transition-colors text-base sm:text-base p-1 sm:p-0"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Área de mensajes */}
                    <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                        <div className="bg-gray-100 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-gray-800">
                                ¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                            </p>
                        </div>
                    </div>
                    
                    {/* Input de mensaje */}
                    <div className="p-2 sm:p-4 border-t border-gray-200">
                        <div className="flex space-x-1 sm:space-x-2">
                            <input
                                type="text"
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Icono flotante */}
            <div
                className="fixed bottom-20 right-4 z-10 sm:bottom-24 sm:right-6 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={toggleChat}
            >
                <div className="bg-blue-600 rounded-full p-3 sm:p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                    <BsChatDotsFill className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                {/* Tooltip */}
                {!isChatOpen && (
                    <div
                        className={`absolute bottom-full right-0 mb-4 transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg shadow-lg text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                            <span className="hidden sm:inline">¿Necesitas ayuda? 💬</span>
                            <span className="sm:hidden">Ayuda 💬</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IconChatBot;