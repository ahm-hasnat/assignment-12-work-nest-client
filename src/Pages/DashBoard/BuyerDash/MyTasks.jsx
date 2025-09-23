import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Footer from "../../../Components/Footer/Footer";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { FaTrash, FaEdit, FaCoins } from "react-icons/fa";
import Lottie from "lottie-react";
import noTasksAnimation from "/src/assets/nodata.json";
import { useState } from "react";
import UpdateTask from "../../../Components/UpdateTask/UpdateTask";

const MyTasks = () => {
  const [selectedTask, setSelectedTask] = useState(null); // task to update

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch my tasks
  const { data: myTasks = [], isLoading } = useQuery({
    queryKey: ["buyerTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/allTasks");
      return res.data
        .filter((task) => task.buyer_email === user.email)
        .sort(
          (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
        );
    },
    enabled: !!user?.email,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/allTasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["buyerTasks", user?.email]); // refresh list
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    },
  });

  // Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <p className="text-center py-5">Loading tasks...</p>;

  return (
    <>
      <div className="max-w-6xl mx-auto p-5 rounded-2xl my-8">
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
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="table table-zebra w-full">
              <thead className="bg-gradient-to-r from-green-100 to-green-50">
                <tr>
                  <th className="text-gray-700">#</th>
                  <th className="text-gray-700">Image</th>
                  <th className="text-gray-700">Title</th>
                  <th className="text-gray-700">Workers</th>
                  <th className="text-gray-700">Pay/Worker</th>
                  <th className="text-gray-700">Completion</th>
                  <th className="text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map((task, idx) => (
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
                        {task.required_workers}
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
                      <span className="badge badge-outline w-24 badge-primary">
                        {task.completion_date}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center justify-center gap-3 ">
                        {/* Update Button */}
                        <button
                          className="btn btn-sm btn-outline btn-info tooltip"
                          data-tip="Update Task"
                          onClick={() => {
                            setSelectedTask(task); // set the current task
                          }}
                        >
                          <FaEdit />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="btn btn-sm btn-outline btn-error tooltip"
                          data-tip="Delete Task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <UpdateTask
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>

      <Footer></Footer>
    </>
  );
};

export default MyTasks;
