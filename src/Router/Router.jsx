import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/Root';
import Home from '../Pages/Home/Home/Home';
import Auth from '../Layouts/Auth';
import Register from '../Pages/Authentication/Register';
import Login from '../Pages/Authentication/Login';
import Error from '../Pages/Error/Error';

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
    path:'/',
    Component:Error,
  }
]);