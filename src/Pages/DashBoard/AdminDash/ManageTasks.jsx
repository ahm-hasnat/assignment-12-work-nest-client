import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCoins, FaTasks } from "react-icons/fa";
import Footer from "../../../Components/Footer/Footer";
import useAuth from "../../../Hooks/useAuth";

const ManageTasks = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["allTasks"],
    enabled: !!user && !authLoading,  
    queryFn: async () => {
      const res = await axiosSecure.get("/allTasks");
      return res.data;
    },
  });

  // Delete task mutation
 const deleteMutation = useMutation({
  mutationFn: async (Id) => {
    const res = await axiosSecure.delete(`/allTasks/${Id}`);
    return res.data;
  },
  onSuccess: (data) => {
    Swal.fire("Deleted!", data.message || "Task has been removed.", "success");
    queryClient.invalidateQueries(["allTasks"]);
    
  },
  onError: (err) => {
    Swal.fire("Error", err.response?.data?.message || err.message || "Failed to delete task", "error");
  },
});

  const handleDelete = (Id, taskTitle) => {
    Swal.fire({
      title: `Delete "${taskTitle}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(Id);
      }
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading tasks...</p>;

  return (
    <>
    
    <div className="max-w-6xl mx-auto p-6 mb-8">
      <h2 className="text-3xl font-bold mb-8 mt-5 text-center">Manage Tasks</h2>
       {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FaTasks className="text-6xl text-green-400 mb-4 animate-bounce" />
            <h3 className="text-xl font-semibold">No Tasks Found</h3>
            <p className="text-sm mt-2">
              Looks like there are no tasks available at the moment.
            </p>
          </div>
        ) : (
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table table-zebra w-full text-center">
          <thead>
            <tr className="bg-green-100">
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Buyer</th>
              <th>Need Workers</th>
              <th>Pay/Worker</th>
              <th>Total Payable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={task.task_image_url}
                    alt={task.task_title}
                    className="w-16 h-12 rounded-lg object-cover mx-auto"
                  />
                </td>
                <td>{task.task_title}</td>
                <td>{task.buyer_email}</td>
                <td>
                  <span className="badge badge-soft badge-success w-10">
                    {" "}
                    {task.currently_required_workers}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <FaCoins className="text-yellow-500" />
                    {task.payable_amount}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <FaCoins className="text-yellow-500" />
                    {task.total_payable_amount}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(task._id, task.task_title)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       )}
    </div>
    
    <Footer></Footer>
    </>
  );
};

export default ManageTasks;
