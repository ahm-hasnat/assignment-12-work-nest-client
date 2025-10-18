import React from "react";
import AdminHome from "../AdminDash/AdminHome";
import useUserRole from "../../../Hooks/useUserRole"; 
import BuyerHome from "../BuyerDash/BuyerHome";
import WorkerHome from "../WorkerDash/WorkerHome";
import Loading from "../../../Components/Loading/Loading";
import DashFooter from "../../../Components/DashFooter/DashFooter";

const DashHome = () => {
  const { role: userRole, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      {userRole === "admin" && <AdminHome />}
      {userRole === "buyer" && 
        <BuyerHome></BuyerHome>
      }
      {userRole === "worker" && 
        <WorkerHome></WorkerHome>
      }

      <footer>
        <DashFooter />
      </footer>
    </div>
  );
};

export default DashHome;
