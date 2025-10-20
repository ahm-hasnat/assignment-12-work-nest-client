import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { Router } from './Router/Router.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './Context/AuthProvider.jsx'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'



const queryClient = new QueryClient();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
  
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>
       <AuthProvider>
          <Elements stripe={stripePromise}>
          <RouterProvider router={Router}></RouterProvider>
        </Elements>
       </AuthProvider>
       
   </QueryClientProvider>
  </StrictMode>
)
