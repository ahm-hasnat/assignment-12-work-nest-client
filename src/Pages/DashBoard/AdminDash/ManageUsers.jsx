import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCoins } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";
import Footer from "../../../Components/Footer/Footer";
import { useState } from "react";

const ManageUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState("all");


  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/allUsers");
      return res.data;
    },
  });

  
  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.delete(`/allUsers/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "User has been removed.", "success");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Failed to delete user", "error");
    },
  });

  
  const updateRoleMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      const res = await axiosSecure.patch(`/allUsers/${email}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Updated!", "User role has been updated.", "success");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Failed to update role", "error");
    },
  });
 
  const handleRoleChange = (user, newRole) => {
    if (newRole === user.role) return; 

    Swal.fire({
      title: `Change role?`,
      text: `Do you want to change ${user.name}'s role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        updateRoleMutation.mutate({
          email: user.email,
          role: newRole,
        });
      }
    });
  };

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: `Remove ${userName}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Yes, remove!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(userId);
      }
    });
  };

  const filteredUsers = users.filter(user => 
  roleFilter === "all" ? true : user.role === roleFilter
);


  if (isLoading) return <Loading></Loading>;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 mb-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>
        <div className="flex justify-start mb-2">
          <p className="primary text-md mx-1">Filter:</p>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select select-bordered w-24 h-6"
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="buyer">Buyer</option>
              <option value="worker">Worker</option>
            </select>
          </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          

          <table className="table table-zebra w-full text-center">
            <thead className="bg-green-100">
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Coins</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="buyer">Buyer</option>
                      <option value="worker">Worker</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <FaCoins className="text-yellow-500" />
                      {user.coins}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default ManageUsers;
