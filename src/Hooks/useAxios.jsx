import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://assignment-12-work-nest-server.onrender.com`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;