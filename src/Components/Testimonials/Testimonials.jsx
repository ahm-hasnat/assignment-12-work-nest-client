import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";


const testimonials = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Worker",
    image: "https://i.pravatar.cc/200?img=5",
    feedback:
      "This platform has been amazing! I can complete micro tasks anytime and earn quickly. Highly recommend to everyone!",
    rating: 5,
  },
  {
    id: 2,
    name: "Brian Smith",
    role: "Buyer",
    image: "https://i.pravatar.cc/200?img=17",
    feedback:
      "Finding reliable workers has never been easier. The platform is smooth, intuitive, and efficient.",
    rating: 4,
  },
  {
    id: 3,
    name: "Clara Lee",
    role: "Worker",
    image: "https://i.pravatar.cc/200?img=25",
    feedback:
      "I love working from anywhere with this platform. The tasks are simple, and payments are fast!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 mb-8 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-12 primary">What Our Users Say</h1>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="max-w-2xl mx-auto"
      >
        {testimonials.map(({ id, name, role, image, feedback, rating }) => (
          <SwiperSlide key={id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center px-6"
            >
              <img
                src={image}
                alt={name}
                className="w-32 h-32 object-cover rounded-full shadow-md mb-6"
              />
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-yellow-600 font-medium mb-2">{role}</p>

              {/* Star Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="italic secondary text-lg leading-relaxed">
                “{feedback}”
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
