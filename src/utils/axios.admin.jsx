import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: "http://localhost:3000/api/v1/admin",
  withCredentials: true
});

export default axiosAdmin;