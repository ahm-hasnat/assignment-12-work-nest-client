import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDollarSign,
  FaCoins,
  FaBoxOpen,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";
import DashFooter from "../../../Components/DashFooter/DashFooter";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const [search, setSearch] = useState("");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
     enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/buyer/${user?.email}`);
      return res.data;
    },
  });

  
  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) => p.transactionId && p.transactionId.trim() !== "") 
      .filter(
        (p) =>
          p.packageName.toLowerCase().includes(search.toLowerCase()) ||
          p.transactionId.toLowerCase().includes(search.toLowerCase())
      );
  }, [payments, search]);

  if (isLoading)
    return <Loading></Loading>;

  return (
    <>
      <div className="md:p-6 p-2 w-full max-w-6xl mx-auto mb-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
        >
          Payment History
        </motion.h2>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by package or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Table */}
        <div className="shadow-lg rounded-xl border border-gray-200 overflow-x-auto">
          <table className="min-w-full table-fixed text-center">
            <thead className="bg-green-600 text-white">
              <tr>
                {[
                  { name: "", key: "index", icon: <FaHashtag /> },

                  { name: "Package", key: "packageName", icon: <FaBoxOpen /> },

                  { name: "Price", key: "price", icon: <FaDollarSign /> },
                  { name: "Coins", key: "coins", icon: <FaCoins /> },
                  { name: "Transaction ID", key: "transactionId" },
                  {
                    name: "Payment Date",
                    key: "date",
                    icon: <FaCalendarAlt />,
                  },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-4 text-sm font-semibold uppercase select-none"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {col.icon && col.icon}
                      {col.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {filteredPayments.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No payments found
                    </td>
                  </motion.tr>
                )}

                {filteredPayments.map((payment, idx) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={idx % 2 === 0 ? "bg-blue-50/20" : "bg-white"}
                  >
                    {/* Index */}
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {idx + 1}
                    </td>

                   
                    <td className="px-6 py-5 text-sm text-gray-700">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {payment.packageName}
                      </span>
                    </td>
                    

                   
                    <td className="px-6 py-5 text-sm text-gray-700">
                      <span
                        className="inline-flex items-center justify-center gap-1 px-3 
                    py-1 bg-green-100 text-green-800 rounded-full text-xs
                     font-semibold w-16"
                      >
                        <FaDollarSign className="text-green-600" />
                        {payment.price}
                      </span>
                    </td>
                   
                    <td>
                      <div className="px-6 py-5 text-sm text-gray-700">
                        <span
                          className="inline-flex items-center justify-center gap-1 
                    px-3 py-1 w-20 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold"
                        >
                          <FaCoins className="text-yellow-500" />
                          {payment.coins}
                        </span>
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-6 py-5 text-sm text-gray-700 font-mono">
                      {payment.transactionId}
                    </td>

                    {/* Payment Date */}
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {new Date(payment.date).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      <DashFooter></DashFooter>
    </>
  );
};

export default PaymentHistory;
