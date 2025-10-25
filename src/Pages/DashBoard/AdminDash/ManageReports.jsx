import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import DashFooter from "../../../Components/DashFooter/DashFooter";
import { FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router";

const ManageReports = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ["allReports"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allTasks");
      return res.data;
    },
  });


  const filteredReports = useMemo(() => {
    const q = search.toLowerCase();
    return reports.filter(
      (r) =>
        r.task_title.toLowerCase().includes(q) ||
        r.buyer_name.toLowerCase().includes(q) ||
        r.reported_by.toLowerCase().includes(q)
    );
  }, [reports, search]);

  if (loadingReports || loadingTasks) return <Loading />;

  const getTaskDetails = (taskId) => tasks.find((t) => t._id === taskId);


  return (
    <>
      <div className="max-w-6xl mx-auto p-2 md:p-6 mb-8">
        <h2 className="text-3xl font-bold mb-8 mt-5 text-center">
          Manage Reports
        </h2>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FaExclamationTriangle className="text-6xl text-green-400 mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold">No Reports Found</h3>
            <p className="text-sm mt-2">
              Looks like there are no reports submitted yet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="input input-bordered pr-10 w-96 text-center"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded">
              <table className="table table-zebra w-full text-center">
                <thead>
                  <tr className="bg-green-100">
                    <th>#</th>
                    <th>Task Title</th>
                    <th>Buyer</th>
                    <th>Buyer Email</th>
                    <th>Reported By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr key={report._id}>
                      <td>{index + 1}</td>
                      <td>{report.task_title}</td>
                      <td>{report.buyer_name}</td>
                      <td>{report.buyer_email}</td>
                      <td>{report.reported_by}</td>
                      <td>
                        {new Date(report.report_date).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/dashboard/report-details/${report._id}`}>
                          <button className="btn btn-success btn-sm">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <DashFooter />

      
    </>
  );
};

export default ManageReports;
