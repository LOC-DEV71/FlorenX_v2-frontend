import axios from "axios";

const axiosAdmin = axios.create({
  // baseURL: "https://floren-x-v2-backend-xlj9.vercel.app/api/v1/admin",
  baseURL: import.meta.env.VITE_API_URL_ADMIN||"http://localhost:3000/api/v1/admin",
  withCredentials: true
});

export default axiosAdmin;