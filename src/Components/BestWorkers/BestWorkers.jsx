import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaCoins, FaUserTie, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useState, useEffect } from "react";
import useAxios from "../../Hooks/useAxios";

const BestWorkers = () => {
  const axiosInstance = useAxios();
  const { data: workers = [], isLoading } = useQuery({
    queryKey: ["bestWorkers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/best-workers");
      return res.data;
    },
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (workers.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [workers]);

  if (isLoading)
    return <p className="text-center text-gray-500 mt-16">Loading...</p>;

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // delay between each card
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-16 px-5 max-w-6xl mx-auto relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={150} />}

      <h2 className="text-3xl font-bold text-center mb-2 primary">
        Our Best Workers
      </h2>
      <p className="text-center secondary mb-12">
        Meet the top workers who are making the most impact!
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // triggers once when 20% visible
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      >
        {workers.map((worker, index) => (
          <motion.div
            key={worker._id}
            variants={cardVariants}
            className={`relative bg-gradient-to-t from-green-50 to-white 
                rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-2 
                transition-all duration-300 p-5 flex flex-col items-center ${
                  index === 0 ? "border-3 border-green-300" : ""
                }`}
          >
            {index < 3 && (
              <div className="absolute -top-6 right-3 bg-[#f8b02f] rounded-full px-2 py-2.5 shadow-lg text-white flex items-center justify-center">
                <FaCrown className="mr-1" />
                <span className="font-bold">{index + 1}</span>
              </div>
            )}

            <div className="relative w-28 h-28 mb-4">
              <img
                src={worker.photoURL}
                alt={worker.name}
                className="rounded-full w-full h-full object-cover shadow-md"
              />
              <FaUserTie
                className="absolute bottom-0 right-0 text-green-500 bg-white
               rounded-full p-1 shadow-md"
              />
            </div>

            <h3 className="font-semibold text-xl mb-1">{worker.name}</h3>
            <p className="flex items-center text-[#f8b02f] font-bold">
              <FaCoins className="mr-2" /> {worker.coins} Coins
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BestWorkers;
