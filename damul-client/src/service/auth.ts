import { removeCookie } from "@/utils/cookies";
import { apiClient, apiRequest } from "./http";

export const adminLogin = async (provider: string) => {
  return apiRequest(() => apiClient.post("/auth/admin/login", provider));
};

export const logout = async () => {
  return apiRequest(
    () => apiClient.post("/auth/admin/logout"),
    () => {
      removeCookie("accessToken");
      removeCookie("refreshToken");
    },
    (error) => {
      if (error.status === 401) {
        console.log("401에러");
      }
    },
  );
};

export const signUp = async (signUpRequest: {
  nickname: string;
  selfIntroduction: string;
}) => {
  apiClient.post("/auth/signup", signUpRequest).then;

  return apiRequest(() => apiClient.post("/auth/signup", signUpRequest));
};

export const consent = async () => {
  return apiRequest(() => apiClient.get("/auth/consent"));
};
