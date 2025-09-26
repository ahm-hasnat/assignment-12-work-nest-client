import React, { useState, useEffect } from "react";
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

 
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  const enabled = !!user && !authLoading;
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    enabled,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allTasks`);
      return res.data;
    },
  });

  const { data: submission = [] } = useQuery({
    queryKey: ["submission"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/mySubmits/${user.email}`);
      return res.data;
    },
  });

  console.log(submission);
  
  const availableTasks = tasks.filter(
    (task) => task.currently_required_workers > 0
  );

 
  const submittedTasks = submission.filter(
    (s) => s.status === "pending" || "approved" || "rejected"
  );

  // Pagination logic
  const indexOfLastTask = currentPage * cardsPerPage;
  const indexOfFirstTask = indexOfLastTask - cardsPerPage;
  const currentTasks = availableTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.max(
    Math.ceil(availableTasks.length / cardsPerPage),
    1
  ); 
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleTaskDetails = (id) => {
    navigate(`/dashboard/task-details/${id}`);
  };

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="p-8 w-full max-w-6xl mx-auto mb-8">
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
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTasks.map((task) => {
                const isSubmitted = submittedTasks.some(
                  (s) => s.task_id === task._id
                );
                return (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
                  >
                    {/* Task image */}
                    <div className="relative">
                      {task.task_image_url && (
                        <img
                          src={task.task_image_url}
                          alt={task.task_title}
                          className=" w-full h-52 object-cover p-2 rounded-xl"
                        />
                      )}
                      {isSubmitted && (
                        <span
                          className="absolute top-1 right-2 badge badge-soft badge-success
                      text-xs font-medium px-2 py-1 rounded-full"
                        >
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

                      <button
                        onClick={() => handleTaskDetails(task._id)}
                        className="text-[#29d409] hover:text-[#f8b02f] cursor-pointer mt-2 mb-5 w-fit rounded-xl mx-start flex items-center justify-center gap-2 
                   transition"
                      >
                        View Details <FaArrowRight />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination controls */}

            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Prev
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 rounded ${
                    number === currentPage
                      ? "bg-green-300 text-black"
                      : "bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Next
              </button>

              <div className="flex justify-end items-center ml-4">
                <select
                  value={cardsPerPage}
                  onChange={(e) => {
                    setCardsPerPage(Number(e.target.value));
                    setCurrentPage(1); // reset to first page
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TaskList;
