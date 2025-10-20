import React, { useEffect, useRef } from 'react';
import useAuth from '../../Hooks/useAuth';
import { useNavigate } from 'react-router';

const NavProfile = () => {
const { user,logOut } = useAuth();
const modalRef = useRef();
const navigate = useNavigate();
  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setProfileModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
   const handleLogout = async () => {
      await logOut();
      navigate("/auth/login");
      setProfileModalOpen(false);
    };
  return (
    <div
              ref={modalRef}
              className="absolute -right-8 top-full mt-2 w-72 bg-gray-100 rounded-lg 
              shadow-lg border border-gray-200 py-4 px-3 z-50"
            >
              <div className="flex flex-col items-center gap-3">
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-[#29d409]"
                />
                <h2 className="font-semibold text-lg">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setProfileModalOpen(false);
                  }}
                  className="btn btn2 btn-outline btn-success mt-2 w-1/2"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn1 text-white w-1/2 mt-1"
                >
                  Logout
                </button>
              </div>
            </div>
  );
};

export default NavProfile;