// src/Components/DashBoardNav/Navbar.jsx
import React from "react";
import { FaBell } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Logo from "../Shared/logo";
import { Link } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import NotificationBell from "../Notification/NotifucationBell";

const Navbar = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch user details including coins, role
  const { data: userData = {} } = useQuery({
    queryKey: ["userData", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user.email}`);
      return res.data;
      // assuming API returns array
    },
  });
  // console.log(userData);
  return (
    <div
      className="flex justify-between items-center bg-white shadow-xs px-10 py-1 
    sticky top-0 z-20"
    >
      <Link to="/">
        <div className="flex items-end">
          <Logo></Logo>
          <h1 className="text-2xl font-bold primary -ml-3">WorkNest</h1>
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <div className="relative cursor-pointer">
          <NotificationBell></NotificationBell>
        </div>
        <div
          className="flex items-center gap-2 text-black
        rounded-2xl font-medium bg-green-300 px-3 py-1"
        >
          <span className="text-xl">🪙 {userData.coins || 0}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-gray-500">{userData?.role}</span>
            <span className="font-semibold text-gray-800">
              {userData?.name}
            </span>
          </div>

          <div className="relative ml-3">
            <div className="relative ml-3 group">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-[#29d409] cursor-pointer"
              />

              {/* Custom tooltip */}
              <div
                className="absolute top-full -left-3 transform -translate-x-1/2 mt-2 
                  hidden group-hover:block bg-gray-100 text-black text-xs rounded px-2 py-1 whitespace-nowrap"
              >
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
