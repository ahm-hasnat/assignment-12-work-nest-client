// src/Components/DashBoardNav/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Logo from "../Shared/logo";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import NotificationBell from "../Notification/NotifucationBell";
import Sidebar from "../DashSidebar/Sidebar";
import NavProfile from "../Shared/NavProfile";

const Navbar = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  
  const { data: userData = {} } = useQuery({
    queryKey: ["userData", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user.email}`);
      return res.data;
      
    },
  });

  

  

  // console.log(userData);
  return (
    <>
      <div
        className="flex justify-between items-center bg-white shadow-xs px-3 lg:px-10 py-1 
    sticky top-0 z-20"
      >
        <div className="flex gap-2 items-center">
          <div className="drawer w-fit lg:hidden ">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content ">
              {/* Page content */}
              <label htmlFor="my-drawer" className="btn btn-ghost p-1">
                <div tabIndex={0}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />{" "}
                  </svg>
                </div>
              </label>
            </div>
            <div className="drawer-side ">
              <div
                className="fixed inset-0 bg-black/0 z-40"
                onClick={() => {
                  document.getElementById("my-drawer").checked = false;
                }}
              ></div>
              <Sidebar></Sidebar>
            </div>
          </div>
          <Link to="/">
            <div className="flex items-end">
              <span className="hidden md:flex">
                <Logo></Logo>
              </span>
              <h1 className="btn btn-ghost px-1 py-0 text-lg md:text-2xl font-bold 
              primary md:-mb-1
               md:-ml-3">
                WorkNest
              </h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-8">
          <div className="relative cursor-pointer">
            <NotificationBell></NotificationBell>
          </div>
          <div
            className="flex items-center gap-2 text-black
        rounded-2xl font-medium bg-green-300 px-2 md:px-3 py-1"
          >
            <span className="text-md md:text-xl">🪙 {userData.coins || 0}</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-gray-500">{userData?.role}</span>
              <span className=" text-md md:text-lg font-semibold text-gray-800">
                {userData?.name}
              </span>
            </div>

            <div className="relative md:ml-3">
              <div className="relative md:ml-3 group">
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-[#29d409] cursor-pointer"
               onClick={() => setProfileModalOpen(!profileModalOpen)}
               />

               
                 {/* Profile Modal (same placement as NotificationBell) */}
          {profileModalOpen && (
           <NavProfile></NavProfile>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
