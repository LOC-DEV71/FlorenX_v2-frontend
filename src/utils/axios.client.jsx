import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_CLIENT || "http://localhost:3000/api/v1/client",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "";

      if (status === 403 && message.includes("Blacklist") || status === 429) {
        if (window.location.pathname !== "/banned") {
          window.location.href = "/banned";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;