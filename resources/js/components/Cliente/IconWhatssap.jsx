import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsAppIcon = () => {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const phoneNumber = '968899167'; // Replace with your phone number

    const handleSendMessage = () => {
        if (message.trim()) {
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            setMessage(''); // Reset message input after sending
            setIsOpen(false); // Close the chat window after sending
        }
    };

    return (
        <div className="fixed bottom-3 right-3 z-50 p-3 bg-green-500 text-white rounded-full shadow-xl flex items-center justify-center space-x-2 hover:bg-green-600 transition-all cursor-pointer sm:bottom-6 sm:right-6">
            <FaWhatsapp className="w-10 h-10 sm:w-10 sm:h-10" onClick={() => setIsOpen(!isOpen)} />

            {/* Popup chat window */}
            {isOpen && (
                <div
                    className="absolute bg-white text-gray-800 px-6 py-5 rounded-lg shadow-xl w-72 sm:w-64 mt-4 transform transition-all duration-300 ease-in-out"
                    style={{
                        bottom: '80px',
                        right: '0px',
                    }}
                >
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-lg text-green-500">Hola 👋</p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                        >
                            ✖
                        </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">¿En qué podemos ayudarte?</p>
                    <textarea
                        className="mt-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Escribe tu mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="mt-3 w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none transition-all"
                    >
                        Enviar
                    </button>
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 shadow-md"></div>
                </div>
            )}
        </div>
    );
};

export default FloatingWhatsAppIcon;
