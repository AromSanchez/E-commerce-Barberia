import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const socialLinks = [
  { icon: <FaFacebookF className="w-4 h-4" />, href: "https://facebook.com" },
  { icon: <FaInstagram className="w-4 h-4" />, href: "https://instagram.com" },
  { icon: <FaTiktok className="w-4 h-4" />, href: "https://tiktok.com" }
];

const TopInfoBar = ({ promoMessages, currentMessageIndex }) => (
  <div className="bg-black text-white text-xs py-2 lg:py-3 transition-all duration-300">
    <div className="max-w-6xl mx-auto px-4">
      {/* Versión móvil - Solo mensaje promocional */}
      <div className="lg:hidden">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-400">
            {promoMessages[currentMessageIndex].icon}
          </span>
          <span>{promoMessages[currentMessageIndex].text}</span>
        </div>
      </div>

      {/* Versión desktop */}
      <div className="hidden lg:flex justify-between items-center">
        <div className="flex-1 flex items-center space-x-8">
          {promoMessages.map((message, index) => (
            <div key={index} className={`flex items-center space-x-2 transition-all duration-300 ${currentMessageIndex === index ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-gray-400">{message.icon}</span>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        
        {/* Social links - Solo visible en desktop */}
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm">Síguenos en:</span>
          <div className="flex space-x-3">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TopInfoBar;

