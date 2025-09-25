import React from "react";
import Footer from "../../../Components/Footer/Footer";
import AdminHome from "../AdminDash/AdminHome";
import useUserRole from "../../../Hooks/useUserRole"; // your custom hook
import BuyerHome from "../BuyerDash/BuyerHome";
import WorkerHome from "../WorkerDash/WorkerHome";
import Loading from "../../../Components/Loading/Loading";

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
        <Footer />
      </footer>
    </div>
  );
};

export default DashHome;
