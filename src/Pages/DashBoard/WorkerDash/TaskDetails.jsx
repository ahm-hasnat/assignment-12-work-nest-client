import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaCoins, FaFlag, FaUser, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import DashFooter from "../../../Components/DashFooter/DashFooter";

const TaskDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ["task", id],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allTasks/${id}`);
      return res.data;
    },
  });

  const { data: userSubmission } = useQuery({
    queryKey: ["submission", id, user?.email],
    enabled: !!user && !!task,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allSubmits/${task._id}/${user.email}`);
      return res.data;
    },
  });

  const submissionMutation = useMutation({
    mutationFn: async (submission) => {
      const res = await axiosSecure.post("/allSubmits", submission);
      return res.data;
    },
    onMutate: () => setIsSubmitting(true),
    onSuccess: () => {
      Swal.fire("Submitted!", "Your submission has been sent.", "success");
      queryClient.invalidateQueries(["submission", id, user?.email]);
      queryClient.invalidateQueries(["task", id]);
    },
    onError: () => {
      Swal.fire("Error", "Something went wrong!", "error");
      setIsSubmitting(false);
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (reportData) => {
      const res = await axiosSecure.post("/reports", reportData);
      return res.data;
    },
    onSuccess: () => {
      document.getElementById("report_modal").close();
      setTimeout(() => Swal.fire("Reported!", "Your report has been submitted.", "success"), 100);
    },
    onError: () => {
      document.getElementById("report_modal").close();
      setTimeout(() => Swal.fire("Error", "Failed to submit the report!", "error"), 100);
    },
  });

  const handleSubmit = (e) => {
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

  if (taskLoading) return <Loading />;

  const isButtonDisabled = userSubmission?.submitted || isSubmitting || submissionMutation.isLoading;

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const reason = e.target.report_reason.value;

    reportMutation.mutate({
      task_id: task._id,
      task_title: task.task_title,
      buyer_name: task.added_By,
      buyer_email: task.buyer_email,
      reported_by: user.email,
      reported_by_name: user.displayName,
      reason,
      date: new Date().toISOString(),
    });

    e.target.reset();
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center primary my-10">Task Details</h1>

      <div className="max-w-3xl mx-auto p-5 mb-10 bg-white shadow rounded">
        <img
          src={task.task_image_url}
          alt={task.task_title}
          className="w-full h-96 object-cover rounded mb-5"
        />
        <div className="p-3 space-y-4">
          <h2 className="text-2xl font-bold primary">{task.task_title}</h2>

          {/* Task Info in two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <p className="flex items-center gap-2 text-gray-700">
              <FaUser className="text-green-500" /> <span className="font-bold">Buyer:</span> {task.added_By}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaCalendarAlt className="text-blue-500" /> <span className="font-bold">Completion Date:</span> {task.completion_date}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaCoins className="text-yellow-500" /> <span className="font-bold">Payment:</span> {task.payable_amount}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaUsers className="text-purple-500" /> <span className="font-bold">Required Workers:</span> {task.currently_required_workers}
            </p>
          </div>

          {/* Submission Info */}
          <p className="secondary text-md">
            <span className="font-bold">Submission Info:</span> {task.submission_info}
          </p>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="font-bold text-gray-800">Submission Details:</label>
            <textarea
              name="submission_details"
              placeholder="Enter your proof or details..."
              className="textarea textarea-bordered w-full h-32 mt-4"
              disabled={isButtonDisabled}
              required
            />

            <button type="submit" className="btn btn1 w-full" disabled={isButtonDisabled}>
              {isButtonDisabled ? "Submitted" : submissionMutation.isLoading ? "Submitting..." : "Submit Work"}
            </button>

            <div className="text-end mt-2">
              <button
                type="button"
                onClick={() => document.getElementById("report_modal").showModal()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-700 transition"
              >
                <FaFlag className="text-red-400" /> Report this task
              </button>
            </div>
          </form>
        </div>
      </div>

      <DashFooter />

      {/* Report Modal */}
      <dialog id="report_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-600 mb-2">Report Task</h3>
          <p className="text-sm mb-4 text-gray-600">
            Please describe why you are reporting this task. Reports are reviewed by the admin.
          </p>
          <form method="dialog" onSubmit={handleReportSubmit} className="space-y-3">
            <textarea
              name="report_reason"
              required
              placeholder="Enter your reason..."
              className="textarea textarea-bordered w-full h-32"
            ></textarea>

            <div className="flex justify-end gap-3">
              <button type="submit" className="btn btn-error">Submit Report</button>
              <button type="button" className="btn" onClick={() => document.getElementById("report_modal").close()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default TaskDetails;
