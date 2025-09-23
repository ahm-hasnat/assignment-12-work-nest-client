import { useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaCoins } from "react-icons/fa";
import Footer from "../../../Components/Footer/Footer";

const TaskDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch single task
  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allTasks/${id}`);
      return res.data;
    },
  });

  // Fetch submission for this task and user
  const { data: userSubmission, isLoading: submissionLoading } = useQuery({
    queryKey: ["submission", id, user?.email],
    enabled: !!task && !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allSubmits/${task._id}/${user.email}`);


      return res.data;
      // Assuming API returns an array
    },
    
  });

  // Mutation for submission
  const submissionMutation = useMutation({
    mutationFn: async (submission) => {
      const res = await axiosSecure.post("/allSubmits", submission);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Submitted!", "Your submission has been sent.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Something went wrong!", "error");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionDetails = e.target.submission_details.value;

    const submissionData = {
      task_id: task._id,
      task_title: task.task_title,
      task_image: task.task_image_url,
      payable_amount: task.payable_amount,
      worker_email: user.email,
      worker_name: user.displayName,
      submission_details: submissionDetails,
      buyer_name: task.added_By,
      buyer_email: task.buyer_email,
    };

    submissionMutation.mutate(submissionData);
    e.target.reset();
  };

  if (taskLoading) return <p className="text-center py-10">Loading task...</p>;

 const isButtonDisabled =
  submissionLoading || userSubmission?.submitted;


  return (
    <>
      <h1 className="text-3xl font-bold text-center primary my-10">
        Task Details
      </h1>
      <div className="max-w-3xl mx-auto p-5 mb-10 bg-[#ffffff] shadow-xl rounded-xl">
        {/* Task Info */}
        <img
          src={task.task_image_url}
          alt={task.task_title}
          className="w-full h-96 object-cover rounded-2xl mb-5"
        />
        <div className="p-3">
          <h2 className="text-xl font-bold mb-2 text-start primary">
            {task.task_title}
          </h2>
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">
                <span className="font-semibold">Buyer:</span> {task.added_By}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Completion Date:</span>{" "}
                {task.completion_date}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Submission Info:</span>{" "}
                {task.submission_info}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <span className="font-semibold">Payment:</span>
                <span className="badge badge-success badge-soft gap-2 px-3 py-2">
                  {task.payable_amount}
                  <FaCoins className="text-yellow-500" />
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Required Workers:</span>{" "}
                {task.required_workers}
              </p>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block font-bold primary">
              Submission Details:
            </label>
            <textarea
              name="submission_details"
              required
              placeholder="Enter your proof or details..."
              className="textarea textarea-bordered w-full h-32"
              disabled={isButtonDisabled}
            />

            <button
              type="submit"
              disabled={submissionMutation.isLoading || isButtonDisabled}
              className="btn btn1 w-full mt-3"
            >
              {isButtonDisabled
                ? "Submitted"
                : submissionMutation.isLoading
                ? "Submitting..."
                : "Submit Work"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TaskDetails;
