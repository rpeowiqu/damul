import { apiClient, apiRequest } from "./http";

export const adminLogin = (provider: string) => {
  return apiRequest(() => apiClient.post("/auth/admin/login", provider));
};

export const logout = () => {
  return apiRequest(() => apiClient.post("/auth/logout"));
};

export const signUp = (signUpRequest: {
  nickname: string;
  selfIntroduction: string;
}) => {
  return apiRequest(() => apiClient.post("/auth/signup", signUpRequest));
};

export const consent = () => {
  return apiRequest(() => apiClient.get("/auth/consent"));
};
