
import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router";
import errorAnimation from "/src/assets/404.json"

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen
     bg-gray-50 px-6">
     
      <div className="w-[280px] md:w-[400px]">
       
          <Lottie animationData={errorAnimation} loop={true} />
        
      </div>

     
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mt-10 mb-10">
        Page Not Found
      </h1>
      

      
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-[#29d409] text-white font-medium 
        rounded shadow-md hover:bg-[#f8b02f] transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Error;
