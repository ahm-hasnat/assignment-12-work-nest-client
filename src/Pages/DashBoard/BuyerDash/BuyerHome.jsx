import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import {
  FaClipboardList,
  FaUsers,
  
  FaTimes,
  FaCheck,
  FaCoins,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Swal from "sweetalert2";

const BuyerHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
const queryClient = useQueryClient();
  // Fetch buyer's tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["buyerTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allTasks/buyer/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch submissions for buyer's tasks
  const { data: submissions = [] } = useQuery({
    queryKey: ["buyerSubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions`);
      return res.data;
    },
    enabled: !!user?.email,
  });

   const approveMutation = useMutation({
    mutationFn: async (submissionId) => {
      const res = await axiosSecure.post(`/submissions/approve/${submissionId}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Approved!", "Submission approved successfully.", "success");
      queryClient.invalidateQueries(["buyerSubmissions", user?.email]);
      queryClient.invalidateQueries(["buyerTasks", user?.email]);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to approve submission.", "error");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (submissionId) => {
      const res = await axiosSecure.patch(`/submissions/reject/${submissionId}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Rejected!", "Submission rejected successfully.", "info");
      queryClient.invalidateQueries(["buyerSubmissions", user?.email]);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to reject submission.", "error");
    },
  });

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id);
  };

  // Stats calculations
  const totalTasks = tasks.length;
  const totalWorkers = tasks.reduce(
    (sum, t) => sum + Number(t.currently_required_workers || 0),
    0
  );
  const totalPayment = submissions
  .filter((s) => s.status === "approved") // only approved submissions
  .reduce((sum, s) => sum + Number(s.payable_amount || 0), 0);

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter(
    (s) => s.status === "approved"
  ).length;
  const rejectedCount = submissions.filter(
    (s) => s.status === "rejected"
  ).length;
  const totalSubmissions = submissions.length || 1;

  const pendingPercent = (pendingCount / totalSubmissions) * 100;
  const approvedPercent = (approvedCount / totalSubmissions) * 100;
  const rejectedPercent = (rejectedCount / totalSubmissions) * 100;

  // For payment progress bar
  const maxPaymentCap = 1000; // example max, can be dynamic
  const paymentPercent = Math.min((totalPayment / maxPaymentCap) * 100, 100);

  return (
    <div className="p-6 max-w-6xl mx-auto mb-10">
      <h1 className="text-3xl font-bold mb-6 text-center ">All Status</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center gap-4">
          <span className="flex items-center gap-1"><FaClipboardList className="text-blue-500 text-3xl" />
           <h3 className="text-gray-600 font-bold text-lg">Total Tasks</h3></span>
          <div>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
        </div>
        
            <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center gap-4">
          <span className="flex items-center gap-1"><FaUsers className="text-green-500 text-3xl" />
           <h3 className="text-gray-600 font-bold text-lg">Need Workers</h3></span>
          <div>
            <p className="text-2xl font-bold">{totalWorkers}</p>
          </div>
          
        </div>
            <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center gap-4">
          <span className="flex items-center gap-2"><FaCoins className="text-yellow-500 text-3xl" />
           <h3 className="text-gray-600 font-bold text-lg">Payment Done</h3></span>
          <div>
            <p className="text-2xl font-bold">{totalPayment}</p>
          </div>
          
        </div>
       
      </div>

      {/* Circular Progress for submissions */}
      <div className="p-6 bg-white rounded-2xl shadow mb-10">
        <h3 className="text-lg font-semibold mb-6 text-center">
          Submission Status
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={pendingPercent}
              text={`${pendingPercent.toFixed(0)}%`}
              styles={buildStyles({
                textColor: "#f59e0b",
                pathColor: "#f59e0b",
                trailColor: "#eee",
              })}
            />
            <p className="mt-2 text-sm font-semibold text-gray-600">Pending</p>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={approvedPercent}
              text={`${approvedPercent.toFixed(0)}%`}
              styles={buildStyles({
                textColor: "#22c55e",
                pathColor: "#22c55e",
                trailColor: "#eee",
              })}
            />
            <p className="mt-2 text-sm font-semibold text-gray-600">Approved</p>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={rejectedPercent}
              text={`${rejectedPercent.toFixed(0)}%`}
              styles={buildStyles({
                textColor: "#ef4444",
                pathColor: "#ef4444",
                trailColor: "#eee",
              })}
            />
            <p className="mt-2 text-sm font-semibold text-gray-600">Rejected</p>
          </div>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="p-6 bg-white rounded-2xl shadow mb-10">
        <h3 className="text-lg font-semibold mb-4">Total Payment Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-yellow-500 h-6 text-center text-white font-semibold"
            style={{ width: `${paymentPercent}%` }}
          >
            ${totalPayment}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Spent ${totalPayment} of ${maxPaymentCap}
        </p>
      </div>

      {/* Pending submissions table */}
      
      <h3 className="text-2xl font-semibold my-8 text-center">Pending Submissions</h3>
      {submissions.filter((s) => s.status === "pending").length === 0 ? (
  <p className="text-center text-gray-500 font-medium py-6">
    🎉 No pending submissions right now. All caught up!
  </p>
       ) : (
      
        <div className=" rounded-2xl shadow-lg mt-5">
          

          <table className="table table-zebra w-full">
            <thead className="bg-gradient-to-r from-green-100 to-green-50">
              <tr>
                <th className="text-gray-700">#</th>
                <th className="text-gray-700">Worker</th>
                <th className="text-gray-700">Task</th>
                <th className="text-gray-700">Coins/Worker</th>

                <th className="text-gray-700">Submission Date</th>
                <th className="text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions
                .filter((s) => s.status === "pending")
                .map((s, idx) => (
                  <tr key={s._id} className="hover:bg-green-50">
                    {/* Index */}
                    <td>{idx + 1}</td>

                    {/* Worker */}
                    <td className="flex items-center justify-center gap-2">
                      <span>{s.worker_name}</span>
                    </td>

                    {/* Task */}
                    <td>
                      <span className="font-medium">{s.task_title}</span>
                    </td>

                    {/* Coins per Worker */}
                    <td>
                      <div className="badge badge-soft badge-warning gap-1">
                        <span className="text-sm font-semibold">
                          {s.payable_amount}
                        </span>
                        <FaCoins className="text-yellow-500" />
                      </div>
                    </td>

                    {/* Submission Date */}
                    <td>
                      <span className="badge badge-outline w-28 badge-primary">
                        {new Date(s.current_date).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="btn btn-sm btn-outline btn-success tooltip"
                          data-tip="Approve Submission"
                          onClick={() => handleApprove(s._id)}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-error tooltip"
                          data-tip="Reject Submission"
                          onClick={() => handleReject(s._id)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
       )}
      </div>
              
  );
};

export default BuyerHome;
