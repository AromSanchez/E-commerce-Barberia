import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward, IoArrowForwardOutline } from "react-icons/io5";
import { useSwipeable } from 'react-swipeable';

const slides = [
  {
    id: 1,
    title: "INMORTAL INFUSE\nCERAS CAPILARES",
    description: "PARA TODOS LOS TIPOS DE CABELLO Y GUSTOS",
    productImage: "/images/CeraPrin.png",
    variantIcons: [
      "/images/Cera 1.png", "/images/Cera2.png", "/images/Cera3.png",
      "/images/Cera4.png", "/images/Cera5.png"
    ]
  },
  {
    id: 2,
    title: "POLVOS\nTEXTURIZANTES",
    description: "MIENTRAS DA VOLUMEN A TU CABELLO,\nPROPORCIONA UN ESTILO NATURAL\nGRACIAS A SU FORMULA MATE",
    productImage: "/images/Polvos.png",
    variantIcons: []
  }
];

export default function SectionCarrusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      {...handlers}
      className="w-full relative group bg-gradient-to-b from-gray-100 to-white overflow-hidden"
    >
      <div className="relative w-full h-[650px] md:h-[600px] lg:h-[620px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="container mx-auto h-full px-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10">
              {/* Text Content */}
              <div className="text-center lg:text-left lg:max-w-lg">
                <h2 className="text-3xl md:text-3xl lg:text-5xl font-extrabold uppercase text-gray-800 whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="mt-3 text-sm md:text-base lg:text-lg text-gray-600 whitespace-pre-line max-w-md mx-auto lg:mx-0">
                  {slide.description}
                </p>

                {slide.variantIcons.length > 0 && (
                  <div className="mt-6 flex justify-center lg:justify-start gap-3">
                    {slide.variantIcons.map((icon, i) => (
                      <img
                        key={i}
                        src={icon}
                        alt={`Variante ${i + 1}`}
                        className="w-8 h-8 rounded"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-5 flex justify-center lg:justify-start">
                    <button className="px-6 py-2 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white rounded-full text-base md:text-lg transition-colors duration-300 flex items-center gap-2">
                        Explorar
                        <IoArrowForwardOutline className="text-lg" />
                    </button>
                </div>
              </div>
              {/* Image */}
              <div className="flex justify-center items-center max-h-[400px]">
                <img
                  src={slide.productImage}
                  alt={slide.title}
                  className="max-h-[280px] md:max-h-[270px] lg:max-h-[400px] object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <div
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === idx
                ? "bg-gray-800 scale-125"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-5 z-20 text-2xl p-2 text-gray-800 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <IoChevronBack size={30} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-5 z-20 text-2xl p-2 text-gray-800 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <IoChevronForward size={30} />
      </button>
    </section>
  );
}
