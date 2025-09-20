import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Typewriter from "typewriter-effect";

// Example slides (use local or external URLs)
const slides = [
    {
    heading: "Work from Anywhere of the World",
    subHeading: "Complete tasks from your laptop or phone, anytime, anywhere.",
    image: "https://i.ibb.co.com/4ZSZdbJs/work.jpg",
   
  },
  {
    heading: "Earn Money by Completing Micro Tasks",
    subHeading: "Join as a Worker and start earning from simple tasks instantly.",
    image: "https://i.ibb.co.com/kgxsmc3j/findjob1.jpg", // or external URL
   
  },
  
  {
    heading: "Find Hundreds of Micro Jobs",
    subHeading: "Explore a wide variety of tasks and pick what suits you best.",
    image: "https://i.ibb.co.com/DHkww3NP/findjob.jpg",
   
  },
];

const Slider = () => {
  return (
    <div className="max-w-full mt-18">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={false}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[90vh] w-full flex items-center 
            justify-center text-center">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div
             className="absolute inset-0 bg-gradient-to-t
              from-black/70 via-black/30 to-transparent z-10">

              </div>

              {/* Text Content */}
              <div className="relative z-20 px-4 text-white">
                <h1 className="text-4xl md:text-5xl font-heading 
                font-bold mb-4">
                  <Typewriter
                    options={{
                      strings: [slide.heading],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </h1>
                <p className="text-lg text-gray-300 font-body mt-5">
                  {slide.subHeading}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
