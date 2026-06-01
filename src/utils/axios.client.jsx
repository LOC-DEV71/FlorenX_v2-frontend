import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "https://floren-x-v2-backend-xlj9.vercel.app/api/v1/client",
  baseURL: "http://localhost:3000/api/v1/client",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default axiosClient;