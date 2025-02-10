import axios from "axios";

// 임시 토큰
const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6eXUyMkBuYXZlci5jb20iLCJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3MzkwOTA4MDIsImV4cCI6MTczOTA5NDQwMn0.T_yUJiKt83Y5my9oYsaAX4NY5AVlWRvcF2tusg-1VCDTfULhLy-2eq1Oar9O9y7AL6ipc91SgBxjVUIqDSNDVg";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 전송 허용
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

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
