import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaUserShield,
  FaCoins,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaMobileAlt,
  FaDollarSign,
  FaTasks,
} from "react-icons/fa";
import { SiPaypal } from "react-icons/si";
import useAuth from "../../../Hooks/useAuth";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

  // Fetch all users
  const { data: allUsers = [] } = useQuery({
    queryKey: ["allUsers"],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/allUsers");
      return res.data;
    },
  });

  // Fetch all payments
  const { data: allPayments = [] } = useQuery({
    queryKey: ["allPayments"],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });
  // Fetch all payments
  const { data: allTasks = [] } = useQuery({
    queryKey: ["allTasks"],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/allTasks");
      return res.data;
    },
  });

  // Fetch all withdrawal requests
  const { data: allWithdraws = [] } = useQuery({
    queryKey: ["allWithdraws"],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/allWithdraws");
      return res.data;
    },
  });

  // Calculate metrics
  const totalWorkers = allUsers.filter((u) => u.role === "worker").length;
  const totalBuyers = allUsers.filter((u) => u.role === "buyer").length;
  const totalTasks = allTasks.length;
  const totalPaid = allPayments.reduce(
    (sum, p) => sum + (Number(p.payment_amount) || 0),
    0
  );
  // Pie chart data
  const total = totalWorkers + totalBuyers + totalTasks;
  const pieData = [
    { name: "Workers", value: (totalWorkers / total) * 100, icon: <FaUsers /> },
    {
      name: "Buyers",
      value: (totalBuyers / total) * 100,
      icon: <FaUserShield />,
    },
    {
      name: "Tasks",
      value: (totalTasks / total) * 100,
      icon: <FaTasks />,
    },
  ];

  // Mutation to approve withdrawal
  const approveMutation = useMutation({
    mutationFn: async (withdraw) => {
      // Update withdrawal status
      const res = await axiosSecure.put(`/allWithdraws/${withdraw._id}`, {
        status: "approved",
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Withdrawal approved!", "success");
      queryClient.invalidateQueries(["allWithdraws"]);
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["allPayments"]);
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Failed to approve", "error");
    },
  });

  // Helper: get payment system icon
  const getPaymentIcon = (system) => {
    switch (system.toLowerCase()) {
      case "bkash":
        return <FaMobileAlt className="text-green-600" />;
      case "nagad":
        return <FaMobileAlt className="text-purple-600" />;
      case "rocket":
        return <FaMobileAlt className="text-red-500" />;
      case "paypal":
        return <SiPaypal className="text-blue-600" />;
      case "bank":
        return <FaMoneyCheckAlt className="text-gray-600" />;
      default:
        return null;
    }
  };

  const pendingWithdraws = allWithdraws.filter((w) => w.status === "pending");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">All Status</h2>
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
        <div className="p-4 bg-yellow-100 rounded-lg flex flex-col items-center justify-center gap-2">
          <FaTasks className="text-3xl text-gray-600" />
          <p>Total Tasks</p>
          <p className="font-bold">{totalTasks}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg flex flex-col items-center justify-center gap-2">
          <FaUsers className="text-3xl text-blue-700" />
          <p>Total Workers</p>
          <p className="font-bold">{totalWorkers}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg flex flex-col items-center justify-center gap-2">
          <FaUserShield className="text-3xl text-green-700" />
          <p>Total Buyers</p>
          <p className="font-bold">{totalBuyers}</p>
        </div>

        <div className="p-4 bg-orange-100 rounded-lg flex flex-col items-center justify-center gap-2">
          <FaMoneyBillWave className="text-3xl text-orange-600" />
          <p>Total Paid</p>
          <p className="font-bold">
            <span
              className="flex justify-center
             items-center gap-1"
            >
              <FaDollarSign className="text-blue-600" />
              {totalPaid}
            </span>
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-5 rounded-xl shadow-lg mb-5">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Withdrawals Table */}
      <div className=" p-6 ">
        <h3 className="text-2xl font-semibold my-8 text-center">
          Pending Withdrawals
        </h3>
        {pendingWithdraws.length === 0 ? (
          <>
            <p className="animate animate-bounce text-3xl text-center"> 🎉</p>
            <p className=" text-center text-gray-500 font-medium py-6 ">
              No pending withdrawals right now. All caught up!
            </p>
          </>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="table table-zebra w-full text-center">
              <thead>
                <tr className="bg-green-100">
                  <th>#</th>
                  <th>User</th>
                  <th>Coins</th>
                  <th>Amount ($)</th>
                  <th>Payment System</th>
                  <th>Account</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingWithdraws.map((w, idx) => (
                  <tr key={w._id}>
                    <td>{idx + 1}</td>
                    <td>{w.worker_name}</td>
                    <td>
                      <div className="flex justify-center items-center gap-1">
                        <FaCoins className="text-yellow-500"></FaCoins>
                        {w.withdrawal_coin}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center items-center gap-1 badge badge-soft badge-info w-16">
                        <FaDollarSign className="text-blue-600"></FaDollarSign>
                        {w.withdrawal_amount}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center items-center gap-1">
                        {getPaymentIcon(w.payment_system)}
                        {w.payment_system}
                      </div>
                    </td>
                    <td>{w.account_number}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => approveMutation.mutate(w)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
