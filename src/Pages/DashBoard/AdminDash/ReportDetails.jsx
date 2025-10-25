import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import DashFooter from "../../../Components/DashFooter/DashFooter";


const ReportDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch all reports
const { data: reports = [], isLoading: loadingReport } = useQuery({
  queryKey: ["allReports"],
  queryFn: async () => {
    const res = await axiosSecure.get("/reports");
    return res.data;
  },
});

// Get the selected report by ID
const report = reports.length
  ? reports.find((r) => r._id === id)
  : null;
  const { data: tasks = [], isLoading: loadingTask } = useQuery({
    queryKey: ["task", report?.task_id],
    enabled: !!report,
    queryFn: async () => {
      const res = await axiosInstance.get(`/allTasks`);
      return res.data;
    },
  });
  const task = report && tasks.length
  ? tasks.find((t) => t._id === report.task_id)
  : null;

  if (loadingReport || loadingTask) return <Loading />;

  if (!report)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <h2 className="text-2xl font-semibold mb-4">Report Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-success"
        >
          Go Back
        </button>
      </div>
    );

  const handleWarnBuyer = () => {
    Swal.fire("Warning Sent", "Buyer has been warned successfully.", "success");
  };

  const handleDeleteTask = () => {
    Swal.fire({
      title: `Delete "${report.task_title}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Task deleted successfully!", "success");
      }
    });
  };

  return (
    <>
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 transition"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-3xl font-bold text-center flex-1">
          Report & Task Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Report Info */}
        <div className="bg-gray-50 p-6 rounded-lg shadow border-t-4 border-green-500">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Report Information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Task Title:</strong> {report.task_title}
            </p>
            <p>
              <strong>Buyer:</strong> {report.buyer_name}
            </p>
            <p>
              <strong>Buyer Email:</strong> {report.buyer_email}
            </p>
            <p>
              <strong>Reported By:</strong> {report.reported_by_name}
            </p>
            <p>
              <strong>Reporter Email:</strong> {report.reported_by}
            </p>
            <p>
              <strong>Reason:</strong> {report.reason}
            </p>
            <p>
              <strong>Reported On:</strong>{" "}
              {new Date(report.report_date).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Task Info */}
        <div className="bg-gray-50 p-6 rounded-lg shadow border-t-4 border-green-500">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Related Task Information
          </h3>
          {task ? (
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Details:</strong> {task.task_detail}
              </p>
              <p>
                <strong>Payable Amount:</strong> ${task.payable_amount}
              </p>
              <p>
                <strong>Required Workers:</strong> {task.required_workers}
              </p>
              <p>
                <strong>Currently Required:</strong>{" "}
                {task.currently_required_workers}
              </p>
              <p>
                <strong>Completion Date:</strong> {task.completion_date}
              </p>
              <p>
                <strong>Submission Info:</strong> {task.submission_info}
              </p>
              <img
                src={task.task_image_url}
                alt={task.task_title}
                className="w-full h-48 object-cover rounded mt-3 shadow-md"
              />
            </div>
          ) : (
            <p className="text-red-500">Task not found or deleted.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-5 pt-4">
        <button
          onClick={handleWarnBuyer}
          className="btn btn-success btn-sm px-6 py-2"
        >
          Warn Buyer
        </button>
        <button
          onClick={handleDeleteTask}
          className="btn btn-error btn-sm px-6 py-2"
        >
          Delete Task
        </button>
      </div>
    </div>
    <DashFooter />
    </>
  );
};

export default ReportDetails;
