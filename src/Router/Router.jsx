import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/Root';
import Home from '../Pages/Home/Home/Home';

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
]);