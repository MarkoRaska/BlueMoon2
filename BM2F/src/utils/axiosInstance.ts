import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", // Updated to use Vite environment variable
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url === "/api/token/refresh/") {
      localStorage.clear();
      window.location.href = "/login"; // Use window.location.href to redirect
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login"; // Redirect to login if no refresh token
        return Promise.reject(error);
      }

      return axiosInstance
        .post("/api/token/refresh/", { refresh: refreshToken })
        .then((response) => {
          localStorage.setItem("token", response.data.access);
          axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access;
          originalRequest.headers["Authorization"] = "Bearer " + response.data.access;
          return axiosInstance(originalRequest);
        })
        .catch(() => {
          localStorage.clear();
          window.location.href = "/login"; // Use window.location.href to redirect
        });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
