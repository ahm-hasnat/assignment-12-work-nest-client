// src/Pages/Profile/Profile.jsx
import React from "react";
import { FaCoins, FaUser, FaUserTie, FaSignOutAlt, FaEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: userData = {} } = useQuery({
    queryKey: ["userData", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user.email}`);
      return res.data;
    },
  });

  const handleLogout = async () => {
    await logOut();
    navigate("/auth/login");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 mt-16">
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

          <div className="flex flex-col w-full mt-4 gap-2">
            <button
              onClick={() => navigate("/profile/edit")}
              className="btn btn-outline flex items-center gap-2 justify-center"
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-error flex items-center gap-2 justify-center"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 bg-gray-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            <li className="flex justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition">
              <span>Completed Task: Build a Logo</span>
              <span className="text-green-500 font-semibold">+5 Coins</span>
            </li>
            <li className="flex justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition">
              <span>Task Purchased: Design Banner</span>
              <span className="text-red-500 font-semibold">-10 Coins</span>
            </li>
            <li className="flex justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition">
              <span>Referral Bonus</span>
              <span className="text-green-500 font-semibold">+20 Coins</span>
            </li>
            {/* Add more activity dynamically if needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
