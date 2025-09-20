import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/Root';
import Home from '../Pages/Home/Home/Home';
import Auth from '../Layouts/Auth';
import Register from '../Pages/Authentication/Register';

export const Router = createBrowserRouter([
  {
    path: "/",
    Component : Root,
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
    }
  ]
  }
]);