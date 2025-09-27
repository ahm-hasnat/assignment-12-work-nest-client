import React, { useState } from "react";
import Navbar from "../Components/DashBoardNav/Navbar";
import { Outlet } from "react-router";

import Sidebar from "../Components/DashSidebar/Sidebar";

const DashBoardLayout = () => {
  
  return (
    <div className="flex flex-col min-h-screen">
     <Navbar  />

      <div className="flex flex-1">
       
           <Sidebar />
      
        <main className="flex-1 bg-gray-50 lg:ml-60 overflow-y-auto">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default DashBoardLayout;
