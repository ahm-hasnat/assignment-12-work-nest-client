import { NavLink } from "react-router";
import Logo from "../Shared/logo";
import { MdArrowOutward } from "react-icons/md";

const Navbar = () => {
  // active link style
  const activeLink = ({ isActive }) =>
  isActive ? "text-[#29d409] font-semibold underline" : "hover:text-[#29d409]";

const notUserNav = () => {
  return (
    <>
      <li>
        <NavLink className={activeLink} to="/">Home</NavLink>
      </li>
      <li>
        <NavLink className={activeLink} to="/about">About Us</NavLink>
      </li>
      <li>
        <NavLink className={activeLink} to="/faq">FAQ</NavLink>
      </li>
    </>
  );
};

  return (
    <div className="navbar bg-base-100 shadow-sm px-10 fixed top-0 z-30">
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
            {/* not user */}

            {notUserNav()}
          </ul>
        </div>

        <Logo></Logo>
      </div>

      <div className="navbar-end w-full">
        <div className=" hidden lg:flex">
          <ul className="menu menu-horizontal px-1 mr-6 space-x-3 secondary">
            {/* not user */}

            {notUserNav()}
          </ul>
        </div>
        <div className="flex gap-3">
          <button className="btn btn2 btn-outline btn-success">Login</button>
          <button className="btn btn2 btn-outline btn-success">Register</button>
          <a
            href="https://github.com/ahm-hasnat/assignment-12-work-nest-client"
            target="_blank"
            rel="noreferrer"
            className="btn btn1 flex items-center text-white"
          >
            Join as Developer{" "}
            <span className="text-lg font-extrabold">
              <MdArrowOutward />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
