import apiClient from "./http";

export const adminLogin = (provider: string) => {
  return apiClient.post("/auth/admin/login", provider);
};

export const logout = () => {
  return apiClient.post("/auth/logout");
};

export const signUp = (signUpRequest: {
  nickname: string;
  selfIntroduction: string;
}) => {
  return apiClient.post("/auth/signup", signUpRequest);
};

export const consent = () => {
  return apiClient.get("/auth/consent");
};

export const getInfo = () => {
  return apiClient.get("/auth/users");
};
