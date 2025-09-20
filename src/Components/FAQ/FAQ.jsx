import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  {
    id: 1,
    question: "How can I become a worker on the platform?",
    answer:
      "Simply sign up as a Worker, complete your profile, and start browsing available micro-tasks. You can begin earning immediately upon completing tasks.",
  },
  {
    id: 2,
    question: "How do I create tasks as a buyer?",
    answer:
      "After signing up as a Buyer, you can create tasks specifying the requirements, deadlines, and payment. Workers can then accept and complete your tasks.",
  },
  {
    id: 3,
    question: "Is my payment secure?",
    answer:
      "Yes! All transactions are securely processed through our platform. Payments are held in escrow until tasks are successfully completed to ensure trust for both parties.",
  },
  {
    id: 4,
    question: "Can I work from anywhere?",
    answer:
      "Absolutely! Our platform allows workers to complete tasks remotely from any location using a laptop or smartphone.",
  },
];

const FAQ = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className="mb-12 px-5 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 primary">
        FAQ
      </h2>

      <div className="space-y-4">
        {faqData.map(({ id, question, answer }) => (
          <motion.div
            key={id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: id * 0.1 }}
          >
            <button
              onClick={() => toggleFAQ(id)}
              className="w-full flex justify-between items-center
               p-5 text-left focus:outline-none"
            >
              <span className="font-semibold text-lg primary">{question}</span>
              <span className="ml-2">
                {activeId === id ? (
                  <FaMinus className="primary" />
                ) : (
                  <FaPlus className="primary" />
                )}
              </span>
            </button>

            <AnimatePresence>
              {activeId === id && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-gray-600"
                >
                  {answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
