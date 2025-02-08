import axios from "axios";
import { setCookie, getCookie, removeCookie } from "@/utils/cookies";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const refreshToken = getCookie("refreshToken");
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      setCookie("accessToken", newAccessToken);
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeCookie("accessToken");
      removeCookie("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export const apiRequest = async <T>(
  fn: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError: (error: any) => void = (error) => console.error(error),
): Promise<T | null> => {
  try {
    const result = await fn();
    onSuccess?.(result);
    return result;
  } catch (error) {
    onError(error);
    return null;
  }
};
