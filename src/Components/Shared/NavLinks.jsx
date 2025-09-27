// src/components/Navbar/NavLinks.jsx
import { MdArrowOutward } from "react-icons/md";
import { NavLink } from "react-router";

const NavLinks = () => {
  const activeLink = ({ isActive }) =>
    isActive ? "text-[#29d409] font-semibold underline" : "hover:text-[#29d409]";

  return (
    <>
      <li>
        <NavLink to="/" className={activeLink}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" className={activeLink}>
          Dashboard
        </NavLink>
      </li>
      <a
                  href="https://github.com/ahm-hasnat/assignment-12-work-nest-client"
                  target="_blank"
                  rel="noreferrer"
                  className="md:hidden btn btn1 flex items-center text-white text-sm"
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

export default NavLinks;
