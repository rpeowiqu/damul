import { apiClient, apiRequest } from "./http";

export const checkNicknameDuplication = (nickname: string) => {
  return apiRequest(() => apiClient.post("/users/nickname-check", nickname));
};
