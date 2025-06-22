import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    mobile: "images/papaRes.jpg",
    desktop: "images/papa.jpg",
    alt: "Oferta cupón",
  },
  {
    mobile: "images/lakmeRes.jpg",
    desktop: "images/lakme.jpg",
    alt: "Oferta 40%",
  },
  {
    mobile: "images/lavaRes.jpg",
    desktop: "images/lavacabeza.jpg",
    alt: "Oferta cupón",
  },
];

export default function CarruBanner() {
  return (
    <div className="bg-black w-full">
      <Swiper
        spaceBetween={30}
        effect="fade"
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="w-full h-full relative 
          [--swiper-pagination-color:#fff] [--swiper-pagination-bullet-inactive-color:#fff]"
        aria-label="Banner de ofertas"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center bg-white w-full h-full">
            <picture>
              <source srcSet={slide.mobile} media="(max-width: 650px)" />
              <img
                src={slide.desktop}
                alt={slide.alt}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
