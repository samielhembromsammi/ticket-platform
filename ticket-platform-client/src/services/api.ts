import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URI || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.warn("Backend server is unreachable. Please check if the server is running.");
      // Resolve with a mock empty response to stop loading skeletons.
      // We use an array that also has a 'results' property so it safely matches both 
      // 'res.data.data' (for categories) and 'res.data.data.results' (for events).
      const emptyData = Object.assign([], { results: [] });
      return Promise.resolve({ data: { data: emptyData, success: false }, status: 503 });
    }
    return Promise.reject(error);
  }
);

export default api;
