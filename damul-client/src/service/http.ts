import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: "https://i12a306.p.ssafy.io/api/v1",
  withCredentials: true, // 쿠키 전송 허용
  headers: {
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
