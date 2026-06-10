import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_CLIENT||"http://localhost:3000/api/v1/client",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default axiosClient;