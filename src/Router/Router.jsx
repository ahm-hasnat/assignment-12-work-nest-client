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
import PrivateRoute from '../Routes/PrivateRoute';
import AdminRoute from '../Routes/AdminRoutes';
import BuyerRoute from '../Routes/BuyerRoute';
import WorkerRoute from '../Routes/WorkerRoute';
import Forbidden from '../Pages/Error/Forbidden';
import profile from '../Layouts/profile';
import Profile from '../Pages/Profile/Profile';




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
        },
        {
          path:'/all-tasks',
          element: <TaskList></TaskList>,
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
    path:'/profile',
    Component: profile,
    children:[
      {
        index:true,
        element:<PrivateRoute><Profile /></PrivateRoute>
      }
    ],
  },
  {
    path:'/dashboard',
    element:<DashBoardLayout></DashBoardLayout>,
    children:[
      {
        index:true,
        path: '/dashboard',
        element:<PrivateRoute><DashHome></DashHome></PrivateRoute>

      },
      {
        path:'/dashboard/add-task',
        element:<BuyerRoute><AddTask></AddTask></BuyerRoute>
      },
      {
        path:'/dashboard/my-tasks',
        element:<BuyerRoute><MyTasks></MyTasks></BuyerRoute>
      },
      {
        path:'/dashboard/purchase-coin',
        element: <BuyerRoute><PurchaseCoin></PurchaseCoin></BuyerRoute>
      },{

        path : '/dashboard/payment/:p/:n/:c',
        element: <BuyerRoute><Payment></Payment></BuyerRoute>
      },
      {
        path:'/dashboard/payment-history',
        element:<BuyerRoute><PaymentHistory></PaymentHistory></BuyerRoute>
      },
      // worker dashboard
      {
        path: '/dashboard/all-task',
        element:<WorkerRoute><TaskList></TaskList></WorkerRoute>

      },
      {
        path: '/dashboard/task-details/:id',
        element: <PrivateRoute><TaskDetails></TaskDetails></PrivateRoute>
      },
    {

      path: '/dashboard/submission',
      element:<WorkerRoute><MySubmissions></MySubmissions></WorkerRoute>
    },
  {
    path:'/dashboard/withdraw',
    element:<WorkerRoute><Withdrawals></Withdrawals></WorkerRoute>
  },
  

  // admin dash
  {
    path: '/dashboard/manage-user',
    element:<AdminRoute><ManageUsers></ManageUsers></AdminRoute>
  },
  {
    path:'/dashboard/manage-task',
    element:<AdminRoute><ManageTasks></ManageTasks></AdminRoute>
  }

    ]
  },
  {
    path:'/',
    Component:Error,
  },
  {
    path:'/forbidden',
    Component:Forbidden,
  }
]);