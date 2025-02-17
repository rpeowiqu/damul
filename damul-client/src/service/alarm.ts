import apiClient from "./http";

export const getAlarms = async () => {
  return apiClient.get("notifications");
};
