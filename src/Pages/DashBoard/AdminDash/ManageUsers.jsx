import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCoins } from "react-icons/fa";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allUsers");
      return res.data;
    },
  });

  // Delete user mutation
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

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      const res = await axiosSecure.put(`/allUsers/upsert/${email}`, { role });
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

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: `Remove ${userName}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(userId);
      }
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>
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
            {users.map((user, index) => (
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
                    onChange={(e) =>
                      updateRoleMutation.mutate({
                        email: user.email,
                        role: e.target.value,
                      })
                    }
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
  );
};

export default ManageUsers;
