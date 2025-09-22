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
        path: '/dashboard/home',
        element:<DashHome></DashHome>,

      },
      {
        path:'/dashboard/add-task',
        element:<AddTask></AddTask>,
      }
    ]
  },
  {
    path:'/',
    Component:Error,
  }
]);