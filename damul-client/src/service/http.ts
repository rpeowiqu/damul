import axios from "axios";

// 임시 토큰
const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6eXUyMkBuYXZlci5jb20iLCJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3MzkwMzA1OTMsImV4cCI6MTczOTAzNDE5M30.vDe5LdwLAmEjd3Ir_vxjCSKvYkkDWn3YKENU2a3qoYELejh5c0Y5lKkssg0LlICAmPwQnR7pb2ehTF_iFHvRrA";

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
