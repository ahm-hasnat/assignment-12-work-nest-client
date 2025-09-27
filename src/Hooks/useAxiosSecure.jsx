import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";


export const axiosSecure = axios.create({
  baseURL: `https://assignment-12-work-nest-server.onrender.com`, 
});

const useAxiosSecure = () => {
  const { user, logOut, getAccessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await getAccessToken();
          if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 403) {
          
          navigate("/forbidden", { replace: true });
        } else if (status === 401) {
          
          try {
            const token = await getAccessToken(true); 
            if (token) {
              error.config.headers.Authorization = `Bearer ${token}`;
              return axiosSecure(error.config); 
            }
          } catch {
            await logOut(); 
            navigate("/auth/login", { replace: true });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, getAccessToken, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
