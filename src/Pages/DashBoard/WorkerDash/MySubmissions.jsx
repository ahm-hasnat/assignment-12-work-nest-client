import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import Loading from "../../../Components/Loading/Loading";
import DashFooter from "../../../Components/DashFooter/DashFooter";

const MySubmissions = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("");

  
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions", user?.email],
   enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/mySubmits/${user.email}`);
      return res.data;
    },
  });

  if (isLoading)
    return <Loading></Loading>;

  
  const filteredSubmissions = statusFilter
    ? submissions.filter((sub) => sub.status === statusFilter)
    : submissions;

  return (
    <>
      <div className="max-w-6xl mx-auto md:p-6 p-2 my-10 mb-10">
        <h2 className="text-3xl font-bold mb-5 text-center primary">
          My Submissions
        </h2>

        
         {/* Search by Status */}
        <div className="max-w-4xl mx-auto flex justify-start mb-2">
            <p className="text-gray-500 font-light">Filter:</p>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-32 h-4 ml-2 "
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="max-w-4xl mx-auto overflow-x-auto shadow rounded p-1">
          <table className="table table-zebra text-center align-middle w-full">
            <thead>
              <tr className="bg-gray-100 text-start">
                <th>#</th>
                <th className="text-start pl-8">Image</th>
                <th className="text-start pl-8">Task Title</th>
                <th>Payment</th>
                <th>Submitted On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, index) => (
                  <tr key={sub._id}>
                    <td className="font-semibold">{index + 1}</td>
                    <td>
                      <img
                        src={sub.task_image}
                        alt={sub.task_title}
                        className="w-20 h-14 object-cover rounded-lg shadow"
                      />
                    </td>
                    <td className="text-start">{sub.task_title}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <span>{sub.payable_amount}</span>
                        <FaCoins className="text-yellow-500 text-lg" />
                      </div>
                    </td>
                    <td>{new Date(sub.current_date).toLocaleDateString()}</td>
                    <td>
                      {sub.status === "pending" && (
                        <span className="badge badge-warning px-3 py-2">
                          Pending
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span className="badge badge-success px-3 py-2">
                          Approved
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span className="badge badge-error px-3 py-2">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DashFooter />
    </>
  );
};

export default MySubmissions;
