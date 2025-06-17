import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function CarruBanner() {
    return (
        <div className="bg-black">
            <Swiper
                spaceBetween={30}
                effect={'fade'}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination, EffectFade]}
                className="w-full h-full relative [--swiper-pagination-color:_#fff] [--swiper-pagination-bullet-inactive-color:_#fff]"
            >
                <SwiperSlide className="text-center bg-white flex justify-center items-center">
                    <img 
                        src="images/papa.jpg" 
                        alt="Oferta_cupon" 
                        className="w-full h-full object-fill"
                    />
                </SwiperSlide>
                <SwiperSlide className="text-center bg-white flex justify-center items-center">
                    <img 
                        src="images/lakme.jpg" 
                        alt="Oferta_40%" 
                        className="w-full h-full object-fill"
                    />
                </SwiperSlide>
                <SwiperSlide className="text-center bg-white flex justify-center items-center">
                    <img 
                        src="images/lavacabeza.jpg" 
                        alt="Oferta_cupon" 
                        className="w-full h-full object-fill"
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}