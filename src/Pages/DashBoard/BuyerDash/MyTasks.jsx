import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { FaTrash, FaEdit, FaCoins, FaSearch } from "react-icons/fa";
import Lottie from "lottie-react";
import noTasksAnimation from "/src/assets/nodata.json";
import { useMemo, useState } from "react";
import UpdateTask from "../../../Components/UpdateTask/UpdateTask";
import Loading from "../../../Components/Loading/Loading";
import DashFooter from "../../../Components/DashFooter/DashFooter";

const MyTasks = () => {
  const [selectedTask, setSelectedTask] = useState(null); 

  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  
  const { data: myTasks = [], isLoading } = useQuery({
    queryKey: ["buyerTasks", user?.email],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allTasks/buyer/${user.email}`);
      return res.data.sort(
        (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
      );
    },
  });

  
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/allTasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["buyerTasks", user?.email]); 
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    },
  });

 
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };
  const filteredTasks = useMemo(() => {
    
    
    const searchWords = search.toLowerCase().split(/\s+/).filter(Boolean);

    return myTasks.filter((task) => {

      if (!search) return myTasks;
    if (searchWords.includes("completed")) {
      return task.currently_required_workers === 0;
    }
     
      const targetString = `
      ${task.task_title} 
      ${task.completion_date} 
      ${task.currently_required_workers} 
      ${task.payable_amount} 
    `.toLowerCase();

   
      return searchWords.every((word) => targetString.includes(word));
    });
  }, [search, myTasks]);

  if (isLoading) return <Loading></Loading>;

  return (
    <>
      <div className="max-w-6xl mx-auto md:p-5 p-2 rounded-2xl my-8">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          My <span className="text-green-600">Tasks</span>
        </h2>

        {myTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Lottie
              animationData={noTasksAnimation}
              loop={true}
              className="w-96 h-96"
            />
            <p className="mt-4 text-gray-500 text-lg font-medium">
              You have no tasks yet!
            </p>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered pr-10 w-64 md:w-96 text-center"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="table table-zebra w-full">
                <thead className="bg-gradient-to-r from-green-100 to-green-50">
                  <tr>
                    <th className="text-gray-700">#</th>
                    <th className="text-gray-700">Image</th>
                    <th className="text-gray-700">Title</th>
                    <th className="text-gray-700">Need Workers</th>
                    <th className="text-gray-700">Pay/Worker</th>
                    <th className="text-gray-700">Complete By</th>
                    <th className="text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, idx) => (
                    <tr key={task._id} className="hover:bg-green-50">
                      {/* Index */}
                      <td>
                        <span>{idx + 1}</span>
                      </td>

                      {/* Image */}
                      <td>
                        <img
                          src={task.task_image_url}
                          alt={task.task_title}
                          className="w-20 h-14 object-cover rounded-lg"
                        />
                      </td>

                      {/* Title */}
                      <td>
                        <span className="font-medium">{task.task_title}</span>
                      </td>

                      {/* Workers */}
                      <td>
                        <div className="badge badge-soft badge-success w-12 justify-center">
                          {task.currently_required_workers}
                        </div>
                      </td>

                      {/* Payable */}
                      <td>
                        <div className="badge badge-soft badge-warning gap-1">
                          <span className="text-sm font-semibold">
                            {task.payable_amount}
                          </span>
                          <FaCoins className="text-yellow-500" />
                        </div>
                      </td>

                      {/* Completion */}
                      <td>
                        {task.currently_required_workers === 0 ? (
                          <span className="badge badge-soft badge-success w-24">
                            completed
                          </span>
                        ) : (
                          <span className="badge badge-outline w-24 badge-primary">
                            {task.completion_date}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-center gap-3 ">
                          {/* Update Button */}
                          <span
                            className="tooltip"
                            data-tip={
                              task.currently_required_workers === 0
                                ? "Task Completed"
                                : "Update Task"
                            }
                          >
                            <button
                              className={`btn btn-sm btn-outline btn-info ${
                                task.currently_required_workers === 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (task.currently_required_workers === 0)
                                  return; // prevent modal open
                                setSelectedTask(task); // open modal
                              }}
                              disabled={task.currently_required_workers === 0}
                            >
                              <FaEdit />
                            </button>
                          </span>

                          {/* Delete Button */}
                          <span
                            className="tooltip"
                            data-tip={
                               "Delete Task"
                            }
                          >
                            <button
                              onClick={() => {
                                
                                handleDelete(task._id);
                              }}
                              className={`btn btn-sm btn-outline btn-error `}
                              
                            >
                              <FaTrash />
                            </button>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <UpdateTask
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>

      <DashFooter />
    </>
  );
};

export default MyTasks;
