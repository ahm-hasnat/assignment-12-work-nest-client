import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import noTasksAnimation from "/src/assets/nodata.json";
import {
  FaUser,
  FaCalendarAlt,
  FaCoins,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import Footer from "../../../Components/Footer/Footer";
import Lottie from "lottie-react";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";

const TaskList = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    enabled: !!user && !authLoading, //
    queryFn: async () => {
      const res = await axiosSecure.get(`/allTasks`);
      return res.data;
    },
  });
  const { data: submission = [] } = useQuery({
    queryKey: ["submission"],
    enabled: !!user && !authLoading, //
    queryFn: async () => {
      const res = await axiosSecure.get(`/mySubmits/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  // Filter tasks where required_workers > 0
  const availableTasks = tasks.filter(
    (task) => task.currently_required_workers > 0
  );
  const submittedTasks = submission.filter((s) => s.status === "pending");

  const handleTaskDetails = (id) => {
    navigate(`/dashboard/task-details/${id}`);
  };

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
          <div className="flex flex-col items-center justify-center py-20">
            <Lottie
              animationData={noTasksAnimation}
              loop={true}
              className="w-96 h-96"
            />
            <p className="text-center text-gray-500">No tasks available.</p>
          </div>
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
                <div className="relative">
                  <img
                    src={task.task_image_url}
                    alt={task.task_title}
                    className=" w-full h-52 object-cover p-2 rounded-xl"
                  />
                  {submittedTasks && (
                    <span className="absolute top-1 right-2 badge badge-soft badge-success
                      text-xs font-medium px-2 py-1 rounded-full">
                      submitted
                    </span>
                  )}
                </div>

                {/* Task details */}
                <div className="px-5 space-y-2">
                  <h3 className="text-lg font-bold my-2 primary">
                    {task.task_title.split(" ").slice(0, 3).join(" ")}
                    {task.task_title.split(" ").length > 3 && "..."}
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
                    <span>
                      Workers Needed: {task.currently_required_workers}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleTaskDetails(task._id)}
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
