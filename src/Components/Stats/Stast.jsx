import React from "react";
import CountUp from "react-countup";
import { FaBriefcase, FaTasks, FaUsers, FaDollarSign } from "react-icons/fa";
import { motion } from "framer-motion";

const statsData = [
  {
    id: 1,
    icon: <FaBriefcase className="text-4xl mb-2 text-green-500" />,
    number: 718,
    label: "TOTAL JOB POSTS",
  },
  {
    id: 2,
    icon: <FaTasks className="text-4xl mb-2 text-green-500" />,
    number: 1278,
    label: "COMPLETED PROJECTS",
  },
  {
    id: 3,
    icon: <FaUsers className="text-4xl mb-2 text-green-500" />,
    number: 83000,
    label: "REGISTERED WORKERS",
  },
  {
    id: 4,
    icon: <FaDollarSign className="text-4xl mb-2 text-green-500" />,
    number: 500000,
    label: "TOTAL EARNINGS (USD)",
  },
];

// Helper function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${Math.floor(num / 1000)}K+`;
  return `${num}+`;
};

const Stats = () => {
  const calcDuration = (num) => {
    if (num <= 1000) return 5;   // small numbers finish quick
  if (num <= 10000) return 10;  // medium numbers
  if (num <= 100000) return 15; // larger numbers
  if (num <= 1000000) return 20; 
  return 25;  
  };

  return (
    <section className="my-16">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2
       md:grid-cols-4 gap-8 text-center ">
        {statsData.map(({ id, icon, number, label }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: id * 0.1 }}
            className="rounded-xl shadow-lg p-8 flex flex-col items-center
             transition-transform transform hover:-translate-y-2 hover:shadow-2xl
                       bg-gradient-to-tr from-[#ffffff] to-[#dfcb842b]"
          >
            {icon}
            <motion.span
              className="text-4xl md:text-4xl font-bold text-primary my-5 mb-2"
              animate={{ color: [ "#facc15", "#14b8a6", "#ec4899"] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <CountUp
                start={0}
                end={number}
                duration={calcDuration(number)}
                separator=","
                formattingFn={formatNumber}
              />
            </motion.span>
            <p className="secondary font-medium">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
