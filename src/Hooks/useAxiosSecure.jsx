import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';


export const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error.response?.status; 

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
