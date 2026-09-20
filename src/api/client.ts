import axios from "axios";
import { getToken, clearSession } from "../utils/session";
console.log(import.meta.env);

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

/* =========================================
   Request Interceptor
   Automatically attach JWT token
========================================= */

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================================
   Response Interceptor
   Logout if token expires
========================================= */

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
