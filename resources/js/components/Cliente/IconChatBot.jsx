import React, { useState } from 'react';
import { RiRobotFill } from 'react-icons/ri';

const IconChatBot = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="fixed bottom-4 right-4 sm:bottom-24 sm:right-6 z-10 cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-blue-600 rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                <RiRobotFill className="h-8 w-8 text-white" />
            </div>
            {/* Tooltip */}
            <div
                className={`absolute bottom-full right-0 mb-2 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-gray-800 text-sm whitespace-nowrap">
                    ¿Necesitas ayuda? 🤖
                </div>
            </div>
        </div>
    );
};

export default IconChatBot;