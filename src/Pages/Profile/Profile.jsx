import React, { useState } from "react";
import { FaCoins, FaUserTie, FaSignOutAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", bio: "" });

  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["userData", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user.email}`);
      return res.data;
    },
    onSuccess: (data) => {
      setFormData({
        name: data?.name || "",
        phone: data?.phone || "",
        address: data?.address || "",
        bio: data?.bio || "",
      });
    },
  });

  const handleLogout = async () => {
    await logOut();
    navigate("/auth/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axiosSecure.put(`/allUsers/${user.email}`, formData);
      queryClient.invalidateQueries(["userData", user.email]);
      setIsEditing(false);
      toast.success("Profile updated successfully! ✅"); // Success toast
    } catch (err) {
      toast.error("Failed to update profile ❌");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      bio: userData?.bio || "",
    });
    setIsEditing(false);
    toast("Editing cancelled", { icon: "⚠️" }); // optional toast for cancel
  };

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mt-16">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white shadow rounded p-8 flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <div className="flex flex-col items-center md:items-start md:w-1/3 gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
            <img
              src={userData?.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{userData?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <p className="flex items-center gap-2 text-gray-700">
            <FaUserTie className="text-green-400" /> {userData?.role || "worker"}
          </p>
          <p className="flex items-center gap-2 text-yellow-500 font-semibold">
            <FaCoins /> {userData?.coins ?? 0} Coins
          </p>

          <button
            onClick={handleLogout}
            className="btn btn-error flex items-center gap-2 justify-center mt-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 bg-gray-50 p-6 rounded-xl shadow-inner space-y-5">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border w-full rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-800">{userData?.name || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Phone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border w-full rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-800">{userData?.phone || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border w-full rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-800">{userData?.address || "Not provided"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="border w-full rounded px-3 py-2"
                rows={3}
              />
            ) : (
              <p className="text-gray-800">{userData?.bio || "No bio yet"}</p>
            )}
          </div>

          {/* Buttons below inputs */}
          <div className="mt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn2 flex items-center gap-2 justify-center"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="btn btn-success flex items-center gap-2 justify-center"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-error flex items-center gap-2 justify-center"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
