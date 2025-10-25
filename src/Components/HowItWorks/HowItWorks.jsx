import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ClipboardCheck, Coins, UserCheck } from "lucide-react";

const steps = [
  {
    icon: <UserCheck className="w-10 h-10 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Sign up as a Worker or Buyer in seconds using secure Firebase authentication.",
  },
  {
    icon: <Briefcase className="w-10 h-10 text-green-600" />,
    title: "2. Browse or Create Tasks",
    description:
      "Workers can explore tasks that match their skills, while Buyers can create new micro-tasks with ease.",
  },
  {
    icon: <ClipboardCheck className="w-10 h-10 text-yellow-600" />,
    title: "3. Complete & Review Work",
    description:
      "Workers submit their completed tasks for approval, and Buyers review submissions before payment.",
  },
  {
    icon: <Coins className="w-10 h-10 text-purple-600" />,
    title: "4. Earn or Pay Securely",
    description:
      "Receive or send payments securely using Stripe and withdraw earned coins anytime.",
  },
];

const HowItWorks = () => {
  return (
    <section className="pt-16 overflow-hidden" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl  font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Worknest makes earning and outsourcing effortless. Whether you’re a
          Worker completing micro-tasks or a Buyer managing projects, getting
          started is quick and rewarding.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
