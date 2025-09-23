import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import {
  FaUser,
  FaCalendarAlt,
  FaCoins,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import Footer from "../../../Components/Footer/Footer";

const TaskList = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allTasks");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  // Filter tasks where required_workers > 0
  const availableTasks = tasks.filter((task) => task.required_workers > 0);

   const handleTaskDetails = (id) => {
     
    navigate(`/dashboard/task-details/${id}`)
   }

  return (
    <>
    <div className="p-8 w-full max-w-6xl mx-auto mb-16">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
      >
        Available Tasks
      </motion.h2>

      {availableTasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
            >
              {/* Task image */}
              {task.task_image_url && (
                <img
                  src={task.task_image_url}
                  alt={task.task_title}
                  className="w-full h-52 object-cover p-2 rounded-xl"
                />
              )}

              {/* Task details */}
              <div className="px-5 space-y-2">
                <h3 className="text-lg font-bold my-2 primary">
                  {task.task_title}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaUser className="text-green-600" />
                  <span>Buyer: {task.added_By}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaCalendarAlt className="text-blue-600" />
                  <span>Complete by: {task.completion_date}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaCoins className="text-yellow-500" />
                  <span>Payment: {task.payable_amount}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaUsers className="text-purple-600" />
                  <span>Workers Needed: {task.required_workers}</span>
                </div>

                {/* Button */}
                <button
                  onClick={() =>handleTaskDetails(task._id) }
                  className="text-[#29d409] hover:text-[#f8b02f] cursor-pointer mt-2 mb-5 w-fit rounded-xl mx-start flex items-center justify-center gap-2 
                   transition"
                >
                  View Details <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    <Footer></Footer>
    </>
  );
};

export default TaskList;
