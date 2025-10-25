import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { Link } from "react-router";
import useAuth from "../../Hooks/useAuth";

const slides = [
  {
    heading: "Work from Anywhere of the World",
    subHeading: "Complete tasks from your laptop or phone, anytime, anywhere.",
    image: "https://i.ibb.co.com/4ZSZdbJs/work.jpg",
  },
  {
    heading: "Earn Money Completing Micro Tasks",
    subHeading: "Join as a Worker and start earning from simple tasks instantly.",
    image: "https://i.ibb.co.com/kgxsmc3j/findjob1.jpg",
  },
  {
    heading: "Find Hundreds of Micro Jobs Instantly",
    subHeading: "Explore a wide variety of tasks and pick what suits you best.",
    image: "https://i.ibb.co.com/DHkww3NP/findjob.jpg",
  },
];

const Slider = () => {

  const { user } = useAuth();
  return (
    <div className="max-w-full mt-18">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={false}
        effect="fade"
        speed={1000}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden px-4">
              <img
                src={slide.image}
                alt={slide.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
              <div className="relative z-20 flex flex-col items-center text-center">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-5 text-left"
                  style={{ minWidth: "550px" }}
                >
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mx-auto text-white">
                    <Typewriter
                      options={{
                        strings: [slide.heading],
                        autoStart: true,
                        loop: true,
                        delay: 60,
                        deleteSpeed: 20,
                      }}
                    />
                  </h1>
                </motion.div>
                <p className="font-body text-[#ffffffee] mb-6">{slide.subHeading}</p>

                
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                  <Link
                    to={user ? "/dashboard/all-task" : "/all-tasks"}
                    className="btn btn1 text-white font-semibold px-6 py-3 rounded shadow-none border-0 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
