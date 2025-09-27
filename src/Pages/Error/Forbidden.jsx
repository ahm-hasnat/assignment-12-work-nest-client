import React from "react";
import { Link, useNavigate } from "react-router";
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6">
      
     
      <motion.div
        className="relative w-40 h-40 mb-8"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
       
        <div className="absolute bottom-0 w-full h-32 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
            🤖
          </div>
        </div>
       
        <div className="absolute -left-4 top-10 w-6 h-16 bg-gray-700 rounded-full rotate-[-20deg]"></div>
        <div className="absolute -right-4 top-10 w-6 h-16 bg-gray-700 rounded-full rotate-[20deg]"></div>
      </motion.div>

     
      <h1 className="text-6xl font-extrabold text-purple-700 mb-2">403</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 text-center">
        Access Denied!
      </h2>

      
      <p className="text-center text-gray-600 max-w-lg mb-6">
        Our friendly robot says: “You don’t have permission to access this page. 
        Perhaps try going back or contacting admin for access.”
      </p>

     
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <FaHome /> Go Back
      </button>
         <p className="my-5">Or</p>
          
          <Link className="hover:text-blue-600 cursor-pointer underline mb-5" to={"/auth/login"}>Log in Again</Link>
      
      <motion.div
        className="mt-12 w-32 h-2 bg-purple-300 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </div>
  );
};

export default Forbidden;
