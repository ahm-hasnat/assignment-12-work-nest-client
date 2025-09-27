import React from "react";
import { NavLink } from "react-router";
import {
  Home,
  PlusCircle,
  ListTodo,
  Coins,
  CreditCard,
  Upload,
  Wallet,
  User,
  ClipboardList,
} from "lucide-react";
import useUserRole from "../../Hooks/useUserRole";

const Sidebar = () => {
  const { role, roleLoading } = useUserRole();
  const activeLink = ({ isActive }) =>
    isActive
      ? "text-green-600 font-bold underline"
      : "text-gray-700 hover:text-green-600";

  return (
    <>
   
    <aside
  className={`
    fixed top-12 md:top-16 lg:top-18 left-0 w-52 lg:w-60
    h-full lg:h-[calc(100vh-4rem)] bg-gray-100 shadow-md p-4 z-50
    transform transition-transform duration-300 
   -translate-x-full lg:translate-x-0
  `}
>
      <h2 className="text-xl font-bold primary mb-3">Dashboard</h2>
      <nav className="flex flex-col space-y-3 ml-2 lg:ml-5">
        <NavLink to="/dashboard" className={activeLink} end>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </div>
        </NavLink>

        {!roleLoading && role === "worker" && (
          <>
            <NavLink to="/dashboard/all-task" className={activeLink}>
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                <span>TaskLists</span>
              </div>
            </NavLink>

            <NavLink to="/dashboard/submission" className={activeLink}>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <span>My Submissions</span>
              </div>
            </NavLink>

            <NavLink to="/dashboard/withdraw" className={activeLink}>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span>Withdrawals</span>
              </div>
            </NavLink>
          </>
        )}

        {/* buyer */}

        {!roleLoading && role === "buyer" && (
          <>
            <NavLink to="/dashboard/add-task" className={activeLink}>
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <span>Add new Tasks</span>
              </div>
            </NavLink>

            <NavLink to="/dashboard/my-tasks" className={activeLink}>
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                <span>My Task’s</span>
              </div>
            </NavLink>

            <NavLink to="/dashboard/purchase-coin" className={activeLink}>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                <span>Purchase Coin</span>
              </div>
            </NavLink>

            <NavLink to="/dashboard/payment-history" className={activeLink}>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment history</span>
              </div>
            </NavLink>
          </>
        )}
        {!roleLoading && role === "admin" && (
          <>
            <NavLink to="/dashboard/manage-user" className={activeLink}>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Manage Users</span>
              </div>
            </NavLink>

            <NavLink to="/dashboard/manage-task" className={activeLink}>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                <span>Manage Tasks</span>
              </div>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
