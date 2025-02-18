import apiClient from "./http";

export const getAlarms = async () => {
  return apiClient.get("notifications");
};

export const getUnreadAlarmCnt = async () => {
  return apiClient.get("notifications/count");
};
