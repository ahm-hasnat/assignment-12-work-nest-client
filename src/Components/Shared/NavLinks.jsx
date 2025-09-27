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
     
    </>
  );
};

export default NavLinks;
