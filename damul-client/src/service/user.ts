import toQueryString from "@/utils/toQueryString";
import { apiClient, apiRequest } from "./http";

export const getUserSetting = (userId: number) => {
  return apiRequest(() => apiClient.get(`/users/${userId}/settings`));
};

export const modifyUserSetting = (
  userId: number,
  settingUpdate: {
    nickname: string;
    selfIntroduction: string;
    accessRange: "PUBLIC" | "FRIENDS" | "PRIVATE";
    warningEnabled: boolean;
  },
  profileImage: File | null,
  backgroundImage: File | null,
) => {
  const formData = new FormData();
  const settingBlob = new Blob([JSON.stringify(settingUpdate)], {
    type: "application/json",
  });
  formData.append("settingJson", settingBlob);
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  if (backgroundImage) {
    formData.append("backgroundImage", backgroundImage);
  }

  return apiRequest(() => apiClient.put(`/users/${userId}/settings`, formData));
};

export const checkNicknameDuplication = (nickname: string) => {
  return apiRequest(() =>
    apiClient.post("/users/check-nickname", { nickname }),
  );
};

export const getFollowers = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiRequest(() =>
    apiClient.get(`/users/${userId}/followers?${queryString}`),
  );
};

export const getFollowings = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiRequest(() =>
    apiClient.get(`/users/${userId}/followings?${queryString}`),
  );
};

export const toggleFollow = (followRequest: {
  userId: number;
  targetId: number;
}) => {
  return apiRequest(() => apiClient.post("/users/follows", followRequest));
};

export const deleteFollower = (userId: number, followerId: number) => {
  return apiRequest(() =>
    apiClient.delete(`/users/${userId}/followers/${followerId}`),
  );
};

export const getUser = (nickname: string) => {
  return apiRequest(() => apiClient.get(`/users/${nickname}`));
};
