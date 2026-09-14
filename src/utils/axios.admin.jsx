import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL_ADMIN||"http://localhost:3000/api/v1/admin",
  withCredentials: true
});

// Thêm Interceptor để chặn những lúc Admin bị Blacklist hoặc Rate Limit
axiosAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu Backend trả về 403 (Banned) hoặc 429 (Too many requests)
    if (error.response?.status === 403 || error.response?.status === 429) {
      window.location.href = '/banned'; // Chuyển hướng ép buộc sang trang Banned
    }
    return Promise.reject(error);
  }
);

export default axiosAdmin;