import { Link, NavLink, useNavigate } from "react-router";
import Logo from "../Shared/logo";
import { MdArrowOutward } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import NavLinks from "../Shared/Navlinks";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import { FaCoins } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/allUsers");
      return res.data;
    },
    enabled: !!user?.email, // only fetch if user is logged in
  });

  const currentUser = allUsers.find((u) => u.email === user?.email);
  const coins = currentUser?.coins || 0;
  console.log(currentUser);
  const handleLogOut = () => {
    logOut()
      .then(() => {
        navigate("/auth/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // active link style
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
        <li>
          <NavLink className={activeLink} to="/about">
            About Us
          </NavLink>
        </li>
      </>
    );
  };
  const dev = () =>{
    return (
      <>
       <a
            href="https://github.com/ahm-hasnat/assignment-12-work-nest-client"
            target="_blank"
            rel="noreferrer"
            className="btn btn1 flex items-center text-white text-sm"
          >
            Join as Dev
            {" "}
            <span className="text-lg font-extrabold">
              <MdArrowOutward />
            </span>
          </a>
      </>
    );
  };
  return (
    <div className="navbar bg-base-100 shadow-sm py-1 px-10 fixed top-0 z-30">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost 
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
          </ul>
        </div>
        <Link to="/">
          <div className="flex items-end">
            <Logo></Logo>
            <h1 className=" -ml-3 font-bold text-2xl p-0 primary">WorkNest</h1>
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
              <Link
                to="/auth/login"
                className="btn btn2 btn-outline btn-success"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="btn btn2 btn-outline btn-success"
              >
                Register
              </Link>
              {dev()}
            </>
          ) : (
            <>
              <span
                className="flex items-center gap-1 px-2 py-1 
               text-yellow-700 rounded-lg font-semibold animate-pulse"
              >
                <FaCoins className="text-yellow-500" />
                {isLoading ? "..." : coins} Coins
              </span>
              {dev()}
              <button
                onClick={handleLogOut}
                className="btn btn2 btn-outline btn-success"
              >
                LogOut
              </button>
              <div className="relative group">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-green-400"
                />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white
                 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {user.displayName}
                </span>
              </div>
              
            </>
          )}

         
        </div>
      </div>
    </div>
  );
};

export default Navbar;
