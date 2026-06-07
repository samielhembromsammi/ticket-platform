/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { message } from "antd";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

const useApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URI,
  withCredentials: true,
  validateStatus: (status) => status < 500, // Treat 4xx as resolved to avoid triggering dev error overlays
});
useApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    // console.log("Request Interceptor - Token Found:", token);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
useApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const status = response.status;
    const data = response.data;

    if (status >= 400) {
      // For 4xx errors, we treat them as "successful" requests that returned a failure result
      // This prevents Next.js from showing the error overlay
    }
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    if (status && status >= 500) {
      message.error("Internal Server Error. Please try again later.");
    } else if (!status) {
      message.error("Network Error. Please check your connection.");
      // Return a plain object to prevent Next.js error overlays if this gets logged via console.error
      return Promise.reject({ message: "Network Error", isAxiosError: true });
    }
    return Promise.reject(error);
  }
);

export default useApi;
