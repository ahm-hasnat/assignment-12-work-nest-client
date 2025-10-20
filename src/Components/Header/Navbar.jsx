import { Link, NavLink, useLocation, useNavigate } from "react-router";
import Logo from "../Shared/logo";
import { MdArrowOutward } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import NavLinks from "../Shared/Navlinks";
import { useQuery } from "@tanstack/react-query";
import { FaCoins } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import NavProfile from "../Shared/NavProfile";
import { useState } from "react";

const Navbar = () => {
  const { user, loading: authLoading } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
const isHome = location.pathname === "/";


  const { data: currentUser = [], isLoading } = useQuery({
    queryKey: ["currentUser"],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allUsers/${user.email}`);
      return res.data;
    },
  });

  
  const activeLink = ({ isActive }) =>
    isActive
      ? "text-[#29d409] font-semibold underline"
      : "hover:text-[#29d409]";

  const notUserNav = () => {
    return (
      <>
        <li>
          <NavLink className={activeLink} to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className={activeLink} to="/all-tasks">
            Tasks
          </NavLink>
        </li>

         {isHome && (
        <li>
          <button
            onClick={() => {
              const faqSection = document.getElementById("faq");
              if (faqSection) {
                const navbarHeight =
                  document.querySelector(".navbar").offsetHeight;
                const topPos = faqSection.offsetTop - navbarHeight - 10;
                window.scrollTo({ top: topPos, behavior: "smooth" });
              }
            }}
            className="hover:text-[#29d409]"
          >
            FAQ
          </button>
        </li>
      )}
        <li>
          <NavLink className={activeLink} to="/about">
            About Us
          </NavLink>
        </li>
      </>
    );
  };
  const dev = () => {
    return (
      <ul><li>
        <a
          href="https://github.com/ahm-hasnat/assignment-12-work-nest-client"
          target="_blank"
          rel="noreferrer"
          className=" btn btn1  items-center text-white text-sm"
        >
          Join as Dev{" "}
          <span className=" text-lg font-extrabold">
            <MdArrowOutward />
          </span>
        </a>
      </li></ul>
      
    );
  };

  return (
   <div
  className={`navbar bg-base-100 shadow-sm py-1 px-3 md:px-19 fixed top-0 z-30 
    `}
>

      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost p-1
          lg:hidden"
          >
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
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100
             rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {!user ? notUserNav() : <NavLinks />}
            {dev()}
          </ul>
        </div>
        <Link to="/">
          <div className="flex items-end">
            <span className="hidden md:flex">
              <Logo></Logo>
            </span>

            <h1 className=" md:-ml-3 font-bold text-xl md:text-2xl p-0 primary">
              WorkNest
            </h1>
          </div>
        </Link>
      </div>

      <div className="navbar-end w-full">
        <div className=" hidden lg:flex">
          <ul className="menu menu-horizontal px-1 mr-6 space-x-3 secondary">
            {/* not user */}

            {!user ? notUserNav() : <NavLinks></NavLinks>}
          </ul>
        </div>
        <div className="flex gap-3">
          {!user ? (
            <>
            <ul className="flex gap-3">
              <li>
                <Link
                  to="/auth/login"
                  className=" btn btn2 btn-outline btn-success"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className=" btn btn2 btn-outline btn-success"
                >
                  Register
                </Link>
              </li>
             <span className="hidden lg:flex"> {dev()}</span>

            </ul>
              
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 px-2 py-1 text-yellow-700 rounded-lg font-semibold animate-pulse">
                <FaCoins className="text-yellow-500" />
                {!isLoading && currentUser ? currentUser.coins : "..."}{" "}
                <span className="hidden md:flex">Coins</span>
              </span>

              <span className="hidden lg:flex">{dev()}</span>
              
              <div className="relative group">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-green-400"
                onClick={() => setProfileModalOpen(!profileModalOpen)}
               />
               {profileModalOpen && (
           <NavProfile></NavProfile>
          )}
               
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
