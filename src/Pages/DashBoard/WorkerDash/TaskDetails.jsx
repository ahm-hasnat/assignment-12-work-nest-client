import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaCoins, FaFlag } from "react-icons/fa";
import Footer from "../../../Components/Footer/Footer";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";

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

  const { data: userSubmission, isLoading: submissionLoading } = useQuery({
    queryKey: ["submission", id, user?.email],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/allSubmits/${task._id}/${user.email}`
      );

      return res.data;
    },
  });

  const submissionMutation = useMutation({
    mutationFn: async (submission) => {
      const res = await axiosSecure.post("/allSubmits", submission);
      return res.data;
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
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
      // Close the modal BEFORE showing alert
      document.getElementById("report_modal").close();

      // Show Swal AFTER modal closes
      setTimeout(() => {
        Swal.fire("Reported!", "Your report has been submitted.", "success");
      }, 100);
    },
    onError: () => {
      document.getElementById("report_modal").close();
      setTimeout(() => {
        Swal.fire("Error", "Failed to submit the report!", "error");
      }, 100);
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

  if (taskLoading) return <Loading></Loading>;

  const isButtonDisabled =
    submissionLoading ||
    userSubmission?.submitted ||
    isSubmitting ||
    submissionMutation.isLoading;

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const reason = e.target.report_reason.value;

    const reportData = {
      task_id: task._id,
      task_title: task.task_title,
      buyer_name: task.added_By,
      buyer_email: task.buyer_email,
      reported_by: user.email,
      reported_by_name: user.displayName,
      reason,
      date: new Date().toISOString(),
    };

    reportMutation.mutate(reportData);
    e.target.reset();
  };

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
                {task.currently_required_workers}
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
              className="btn btn1 mt-3 w-full"
            >
              {isButtonDisabled
                ? "Submitted"
                : submissionMutation.isLoading
                ? "Submitting..."
                : "Submit Work"}
            </button>
            {/* Report Button */}
            <div className="text-center">
              <div className="text-end">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("report_modal").showModal()
                  }
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-700 transition"
                >
                  <FaFlag className="text-red-400" />
                  <span>Report this task</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Report Modal */}
      {/* Report Modal */}
      <dialog id="report_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-600 mb-2">Report Task</h3>
          <p className="text-sm mb-4 text-gray-600">
            Please describe why you are reporting this task. Reports are
            reviewed by the admin.
          </p>
          <form
            method="dialog"
            onSubmit={handleReportSubmit}
            className="space-y-3"
          >
            <textarea
              name="report_reason"
              required
              placeholder="Enter your reason..."
              className="textarea textarea-bordered w-full h-32"
            ></textarea>

            <div className="flex justify-end gap-3">
              <button type="submit" className="btn btn-error">
                Submit Report
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("report_modal").close()}
              >
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
