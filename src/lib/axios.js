import axios from "axios";
import Cookies from "js-cookie";
import { apiEndpoints } from "./endpoints";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://veritix-backend.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
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

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;

export const unAuthenticatedApi = api;

export const handleLogout = () => {
  Cookies.remove("token");
  Cookies.remove("refresh_token");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};
