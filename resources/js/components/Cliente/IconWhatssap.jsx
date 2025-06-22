import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-10 sm:bottom-6 sm:right-6">
            {/* Main WhatsApp Button */}
            <div 
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            {/* Chat Popup Window */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-20 sm:hidden -z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Chat Window */}
                    <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-72 max-w-[90vw] transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4">
                        {/* Header */}
                        <div className="bg-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <FaWhatsapp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">WhatsApp</h3>
                                    <p className="text-xs text-green-100">En línea</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Content */}
                        <div className="p-4">
                            {/* Welcome Message */}
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-sm text-gray-700">
                                    <span className="text-lg">👋</span> ¡Hola! 
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    ¿En qué podemos ayudarte hoy?
                                </p>
                            </div>

                            {/* Message Input */}
                            <div className="space-y-3">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                                    placeholder="Escribe tu mensaje aquí..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows="3"
                                />
                                
                                {/* Send Button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Enviar mensaje</span>
                                </button>
                            </div>
                        </div>

                        {/* Chat Tail */}
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FloatingWhatsAppIcon;