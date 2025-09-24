import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/Root';
import Home from '../Pages/Home/Home/Home';
import Auth from '../Layouts/Auth';
import Register from '../Pages/Authentication/Register';
import Login from '../Pages/Authentication/Login';
import Error from '../Pages/Error/Error';
import DashBoardLayout from '../Layouts/DashBoardLayout';
import DashHome from '../Pages/DashBoard/DashBoardHome/DashHome';
import AddTask from '../Pages/DashBoard/BuyerDash/AddTask';
import PurchaseCoin from '../Pages/DashBoard/BuyerDash/PurchaseCoin';
import MyTasks from '../Pages/DashBoard/BuyerDash/MyTasks';
import Payment from '../Pages/DashBoard/BuyerDash/Payment';
import PaymentHistory from '../Pages/DashBoard/BuyerDash/PaymentHistory';
import TaskList from '../Pages/DashBoard/WorkerDash/TaskList';
import TaskDetails from '../Pages/DashBoard/WorkerDash/TaskDetails';
import MySubmissions from '../Pages/DashBoard/WorkerDash/MySubmissions';
import Withdrawals from '../Pages/DashBoard/WorkerDash/WithDrawals';
import ManageUsers from '../Pages/DashBoard/AdminDash/ManageUsers';
import ManageTasks from '../Pages/DashBoard/AdminDash/ManageTasks';

export const Router = createBrowserRouter([
  {
    path: "/",
    Component : Root,
    errorElement:<Error></Error>,
    children:[
        {
            index: true,
            path:'/',
            Component: Home,
        }
    ]
  },
  {

  path:'/auth',
  Component: Auth,
  children:[
    {
      path:'/auth/register',
      Component:Register,
    },
    {
      path:'/auth/login',
      Component: Login,
    }
  ]
  },
  {
    path:'/dashboard',
    element:<DashBoardLayout></DashBoardLayout>,
    children:[
      {
        index:true,
        path: '/dashboard',
        element:<DashHome></DashHome>,

      },
      {
        path:'/dashboard/add-task',
        element:<AddTask></AddTask>,
      },
      {
        path:'/dashboard/my-tasks',
        element:<MyTasks></MyTasks>
      },
      {
        path:'/dashboard/purchase-coin',
        element: <PurchaseCoin></PurchaseCoin>
      },{

        path : '/dashboard/payment/:p/:n/:c',
        element: <Payment></Payment>
      },
      {
        path:'/dashboard/payment-history',
        element:<PaymentHistory></PaymentHistory>,
      },
      // worker dashboard
      {
        path: '/dashboard/all-task',
        element:<TaskList></TaskList>,

      },
      {
        path: '/dashboard/task-details/:id',
        element: <TaskDetails></TaskDetails>
      },
    {

      path: '/dashboard/submission',
      element:<MySubmissions></MySubmissions>
    },
  {
    path:'/dashboard/withdraw',
    element:<Withdrawals></Withdrawals>
  },
  

  // admin dash
  {
    path: '/dashboard/manage-user',
    element:<ManageUsers></ManageUsers>
  },
  {
    path:'/dashboard/manage-task',
    element:<ManageTasks></ManageTasks>
  }

    ]
  },
  {
    path:'/',
    Component:Error,
  }
]);