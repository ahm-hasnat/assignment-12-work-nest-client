import React from "react";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    url: "https://www.google.com",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    url: "https://www.microsoft.com",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    url: "https://www.amazon.com",
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg",
    url: "https://www.adobe.com",
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    url: "https://www.ibm.com",
  },
  {
    name: "Intel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg",
    url: "https://www.intel.com",
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    url: "https://www.salesforce.com",
  },
];

const Partners = () => {
  return (
    <section className="py-16 overflow-hidden  max-w-6xl mx-auto px-5">
      <div className="max-w-6xl mx-auto text-center px-6">
        <motion.h2
          className="text-3xl  font-bold primary mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Trusted Partners
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          We’re proud to collaborate with some of the world’s most innovative
          and forward-thinking companies.
        </motion.p>
      </div>

      {/* Marquee Section */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex items-center space-x-16 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center  transition duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 md:h-16 object-contain"
              />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
