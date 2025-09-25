import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { FaClipboardList, FaDollarSign, FaCoins } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Loading from "../../../Components/Loading/Loading";

const WorkerHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch submissions for this worker
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["workerSubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/mySubmits/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  const { data: withdrawals = [] } = useQuery({
    queryKey: ["workerWithdrawals", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allWithdraws/workers/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return <Loading></Loading>;

  // Stats
  const approvedWithdrawals = withdrawals.filter(
    (w) => w.worker_email === user.email && w.status === "approved"
  );

  const totalWithdrawnAmount = approvedWithdrawals.reduce(
    (sum, w) => sum + Number(w.withdrawal_amount || 0),
    0
  );
  // Filter submissions for the current worker
  const workerSubmissions = submissions.filter(
    (s) => s.worker_email === user?.email
  );

  // Stats calculations
  const totalSubmissions = workerSubmissions.length;
  const pendingCount = workerSubmissions.filter(
    (s) => s.status === "pending"
  ).length;
  const approvedCount = workerSubmissions.filter(
    (s) => s.status === "approved"
  ).length;
  const rejectedCount = workerSubmissions.filter(
    (s) => s.status === "rejected"
  ).length;

  const totalEarnings = workerSubmissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + Number(s.payable_amount || 0), 0);

  const maxEarningsCap = 1000;
  const earningsPercent = Math.min((totalEarnings / maxEarningsCap) * 100, 100);

  // Pie chart data
  const pieData = [
    { name: "Pending", value: pendingCount },
    { name: "Approved", value: approvedCount },
    { name: "Rejected", value: rejectedCount },
  ];
  const COLORS = ["#f59e0b", "#22c55e", "#ef4444"]; // Pending / Approved / Rejected

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Filter approved submissions for the table
  const approvedSubmissions = submissions.filter(
    (s) => s.status === "approved"
  );

  return (
    <div className="p-6 max-w-6xl mx-auto mb-10">
      <h1 className="text-3xl font-bold mb-6 text-center">All status</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center gap-4">
          <span className="flex items-center gap-1">
            <FaClipboardList className="text-blue-500 text-3xl" />
            <h3 className="text-gray-600 font-bold text-lg">
              Total Submission
            </h3>
          </span>
          <div>
            <p className="text-2xl font-bold">{totalSubmissions}</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center gap-4">
          <span className="flex items-center gap-1">
            <FaCoins className="text-yellow-500 text-3xl" />
            <h3 className="text-gray-600 font-bold text-lg">Total Earnings</h3>
          </span>
          <div>
            <p className="text-2xl font-bold">{totalEarnings}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center gap-4">
          <span className="flex items-center gap-2">
            <FaDollarSign className="text-green-500 text-3xl" />
            <h3 className="text-gray-600 font-bold text-lg">
              Total Withdrawals
            </h3>
          </span>
          <div>
            <p className="text-2xl font-bold">{totalWithdrawnAmount}</p>
          </div>
        </div>
      </div>

      {/* Submission Status PieChart */}
      <div className="p-6 bg-white rounded-2xl shadow mb-10">
        <h3 className="text-lg font-semibold mb-6 text-center">
          Submission Status
        </h3>
        <div className="h-64 w-full flex items-center justify-center">
          {pieData.every((d) => d.value === 0) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-500 text-center"
            >
              <p className="text-lg font-semibold">📊 No submissions yet!</p>
              <p className="text-sm">
                Start working on tasks to see your progress here.
              </p>
            </motion.div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Earnings Progress Bar */}
      <div className="p-6 bg-white rounded-2xl shadow mb-10">
        <h3 className="text-lg font-semibold mb-4">Earnings Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-green-500 h-6 text-center text-white font-semibold"
            style={{ width: `${earningsPercent}%` }}
          >
            ${totalEarnings}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Earned ${totalEarnings} of ${maxEarningsCap}
        </p>
      </div>

      {/* Approved Submissions Table */}
      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Approved Submissions
        </h3>
        {approvedSubmissions.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-6">
            🎉 No approved submissions yet.
          </p>
        ) : (
          <table className="min-w-full table-auto text-center border border-gray-200">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Task Title</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Buyer Name</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedSubmissions.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-medium">{sub.task_title}</td>
                  <td>
                    <div className="flex items-center justify-center gap-1 w-full">
                      <FaCoins className="text-yellow-500"></FaCoins>
                      {sub.payable_amount}
                    </div>
                  </td>
                  <td className="px-4 py-2">{sub.buyer_name}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full bg-green-200 text-green-800 text-sm font-semibold">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkerHome;
