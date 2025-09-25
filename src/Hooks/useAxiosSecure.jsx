import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  // Request interceptor: attach token
  axiosSecure.interceptors.request.use(
    (config) => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401, 403
  axiosSecure.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error.response?.status; // ✅ corrected

      if (status === 403) {
        navigate('/forbidden');
      } else if (status === 401) {
        logOut()
          .then(() => navigate('/auth/login'))
          .catch(() => {});
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
