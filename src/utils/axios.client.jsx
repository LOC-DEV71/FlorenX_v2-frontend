import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1/client",
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;